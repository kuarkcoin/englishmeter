#!/usr/bin/env node
/**
 * Audit a completed Next production build without running browser JavaScript.
 * Usage: node scripts/audit-site.mjs [--origin http://localhost:3000]
 *        [--output /tmp/englishmeter-audit.json] [--static-only]
 * HTTP checks only GET public pages; no tests are started or submitted.
 */
import { readFile, readdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
};
const origin = new URL(option('--origin', 'http://localhost:3000')).origin;
const output = option('--output', '/tmp/englishmeter-site-audit.json');
const staticOnly = args.includes('--static-only');
const build = path.resolve('.next/server/app');
const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };
const decode = (value = '') => value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_, key) => (
  key[0] === '#' ? String.fromCodePoint(key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : Number(key.slice(1))) : entities[key.toLowerCase()]
));
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((match) => [match[1].toLowerCase(), decode(match[2] ?? match[3])]));
const normalizePath = (value) => {
  try { return decodeURIComponent(value).replace(/\/$/, '') || '/'; } catch { return value; }
};
const issues = [];
const add = (severity, code, url, detail) => issues.push({ severity, code, url, detail });
const pages = new Map();
const links = new Map();
const pageAnchors = new Map();
const fragmentLinks = new Map();
const sitemapXml = await readFile(path.join(build, 'sitemap.xml.body'), 'utf8');
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]));
const canonicalOrigin = new URL(sitemapUrls[0]).origin;
const sitemapPaths = new Set();
const sitemapLanguages = new Map();
const origins = new Set([origin, canonicalOrigin, 'https://englishmeter.net', 'https://www.englishmeter.net']);
for (const match of sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
  const location = decode(match[1].match(/<loc>([^<]+)<\/loc>/)?.[1] || '');
  const alternates = [...match[1].matchAll(/<xhtml:link\b[^>]*>/g)].map((link) => attributes(link[0]));
  if (location && alternates.length) sitemapLanguages.set(normalizePath(new URL(location).pathname), alternates);
}
for (const url of sitemapUrls) {
  const parsed = new URL(url);
  const pathname = normalizePath(parsed.pathname);
  if (sitemapPaths.has(pathname)) add('error', 'duplicate-sitemap-url', url, 'URL occurs more than once.');
  sitemapPaths.add(pathname);
  if (parsed.origin !== canonicalOrigin || parsed.search || parsed.hash) add('error', 'noncanonical-sitemap-url', url, 'Sitemap URLs must use one origin and have no query or fragment.');
}

function inspect(html, pathname, status = 200, source = 'build') {
  const clean = html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  const metas = [...clean.matchAll(/<meta\b[^>]*>/gi)].map((match) => attributes(match[0]));
  const linkTags = [...clean.matchAll(/<link\b[^>]*>/gi)].map((match) => attributes(match[0]));
  const descriptions = metas.filter((meta) => meta.name === 'description');
  const canonicals = linkTags.filter((link) => link.rel === 'canonical');
  const robots = metas.filter((meta) => ['robots', 'googlebot'].includes(meta.name)).map((meta) => meta.content).join(',');
  const title = decode((clean.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').trim());
  const description = descriptions[0]?.content || '';
  const canonical = canonicals[0]?.href || '';
  const noindex = /\bnoindex\b/i.test(robots);
  const refresh = metas.find((meta) => meta['http-equiv']?.toLowerCase() === 'refresh');
  const redirect = Boolean(refresh || status >= 300 && status < 400);
  const page = { path: pathname, source, status, title, description, canonical, noindex, redirect, languages: linkTags.filter((link) => link.rel === 'alternate' && link.hreflang).map(({ hreflang, href }) => ({ language: hreflang, href })) };
  pages.set(pathname, page);
  pageAnchors.set(pathname, new Set([...clean.matchAll(/<[^>]+\sid=(?:"([^"]+)"|'([^']+)')[^>]*>/g)].map((match) => decode(match[1] ?? match[2]))));
  if (redirect) {
    if (sitemapPaths.has(pathname)) add('error', 'redirect-in-sitemap', pathname, refresh?.content || `HTTP ${status}`);
    return page;
  }
  if (sitemapPaths.has(pathname) && noindex) add('error', 'noindex-in-sitemap', pathname, robots);
  if (status >= 400) { add('error', 'http-error', pathname, `HTTP ${status}`); return page; }
  if (!noindex) {
    if (!title) add('error', 'missing-title', pathname, 'Indexable page has no title.');
    if (!description) add('error', 'missing-description', pathname, 'Indexable page has no description.');
    if (descriptions.length > 1) add('error', 'multiple-descriptions', pathname, descriptions.length);
    if (canonicals.length !== 1) add('error', 'canonical-count', pathname, canonicals.length);
    else {
      try {
        const url = new URL(canonical);
        if (url.origin !== canonicalOrigin || normalizePath(url.pathname) !== pathname || url.search || url.hash) add('error', 'canonical-mismatch', pathname, canonical);
      } catch { add('error', 'invalid-canonical', pathname, canonical); }
    }
  }
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (attributes(match[1]).type !== 'application/ld+json') continue;
    try {
      const data = JSON.parse(match[2]);
      if (!data || typeof data !== 'object') throw new Error('JSON-LD must be an object or array.');
      const nodes = Array.isArray(data) ? data : data['@graph'] || [data];
      for (const node of nodes) {
        if (node['@type'] !== 'BreadcrumbList') continue;
        const entries = node.itemListElement;
        if (!Array.isArray(entries) || entries.length < 2) add('warning', 'short-breadcrumb', pathname, 'Breadcrumb should contain at least two entries.');
        else entries.forEach((entry, index) => {
          if (entry.position !== index + 1 || !entry.name || (index < entries.length - 1 && !entry.item)) add('error', 'invalid-breadcrumb', pathname, `Entry ${index + 1} lacks required name/position/item.`);
        });
      }
    } catch (error) { add('error', 'invalid-jsonld', pathname, error.message); }
  }
  for (const match of clean.matchAll(/<a\b[^>]*>/gi)) {
    const href = attributes(match[0]).href;
    if (!href || /^(?:mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    try {
      const url = new URL(href, `${canonicalOrigin}${pathname}`);
      if (!origins.has(url.origin)) continue;
      const target = normalizePath(url.pathname);
      if (target.startsWith('/api/') || target.startsWith('/_next/')) continue;
      const sources = links.get(target) || new Set();
      if (sources.size < 5) sources.add(pathname);
      links.set(target, sources);
      if (url.hash && !url.hash.startsWith('#:~:text=')) {
        const key = `${target}${url.hash}`;
        if (!fragmentLinks.has(key)) fragmentLinks.set(key, { target, fragment: decodeURIComponent(url.hash.slice(1)), source: pathname });
      }
    } catch { add('error', 'invalid-link', pathname, href); }
  }
  return page;
}

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.name.endsWith('.html')) {
      const relative = path.relative(build, full).replaceAll(path.sep, '/').replace(/\.html$/, '');
      const pathname = normalizePath(relative === 'index' ? '/' : `/${relative}`);
      if (pathname.startsWith('/_')) continue;
      inspect(await readFile(full, 'utf8'), pathname);
    }
  }
}
await walk(build);
const staticPageCount = pages.size;
const httpChecked = new Set();

async function fetchPage(pathname) {
  httpChecked.add(pathname);
  try {
    const response = await fetch(`${origin}${encodeURI(pathname)}`, { redirect: 'manual', signal: AbortSignal.timeout(25000) });
    if (response.status >= 300 && response.status < 400) {
      if (sitemapPaths.has(pathname)) add('error', 'redirect-in-sitemap', pathname, `${response.status} → ${response.headers.get('location')}`);
      pages.set(pathname, { path: pathname, source: 'http', status: response.status, redirect: true });
      return;
    }
    const html = await response.text();
    if (response.headers.get('content-type')?.includes('text/html')) inspect(html, pathname, response.status, 'http');
    else if (response.status >= 400) add('error', 'http-error', pathname, `HTTP ${response.status}`);
    if (sitemapPaths.has(pathname) && /\bnoindex\b/i.test(response.headers.get('x-robots-tag') || '')) add('error', 'noindex-header-in-sitemap', pathname, response.headers.get('x-robots-tag'));
  } catch (error) { add('error', 'fetch-failed', pathname, error.message); }
}
async function batch(items, work, concurrency = 4) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length) await work(items[next++]);
  }));
}
if (!staticOnly) {
  const representative = ['/', '/english-tests', '/english-level-test', '/grammar', '/vocabulary-tests', '/ielts-grammar-tests', '/yds-preparation', '/levels/a1', '/levels/c2', '/practice/reading', '/kids', '/challenge'];
  await batch([...new Set([...sitemapPaths].filter((pathname) => !pages.has(pathname)).concat(representative.filter((pathname) => sitemapPaths.has(pathname))))], fetchPage);
}

const routes = JSON.parse(await readFile('.next/routes-manifest.json', 'utf8'));
const routePatterns = [...routes.staticRoutes, ...routes.dynamicRoutes, ...routes.redirects].map((route) => new RegExp(route.regex));
const unresolvedLinks = [];
for (const [target, sources] of links) {
  if (pages.has(target) && pages.get(target).status < 400) continue;
  if (httpChecked.has(target)) continue;
  let publicFile = false;
  try { await access(path.join('public', target)); publicFile = true; } catch { /* Not a public asset. */ }
  if (publicFile) continue;
  if (!routePatterns.some((regex) => regex.test(target))) add('error', 'unroutable-internal-link', target, [...sources]);
  else unresolvedLinks.push(target);
}
if (!staticOnly) await batch(unresolvedLinks, fetchPage);

for (const property of ['title', 'description']) {
  const groups = new Map();
  for (const page of pages.values()) {
    if (page.noindex || page.redirect || page.status >= 400 || !page[property]) continue;
    const group = groups.get(page[property]) || [];
    group.push(page.path);
    groups.set(page[property], group);
  }
  for (const [value, paths] of groups) if (paths.length > 1) add('warning', `duplicate-${property}`, paths, value);
}
for (const page of pages.values()) {
  if (page.noindex || page.redirect) continue;
  if (page.languages?.length && !page.languages.some((alternate) => alternate.href === page.canonical)) add('error', 'missing-self-hreflang', page.path, 'Language alternates do not include this page.');
  const codes = new Set();
  for (const alternate of page.languages || []) {
    if (codes.has(alternate.language)) add('error', 'duplicate-hreflang', page.path, alternate.language);
    codes.add(alternate.language);
    const xmlAlternate = sitemapLanguages.get(page.path)?.find((item) => item.hreflang === alternate.language);
    if (xmlAlternate && xmlAlternate.href !== alternate.href) add('error', 'sitemap-hreflang-mismatch', page.path, alternate);
    if (alternate.language === 'x-default') continue;
    let url;
    try { url = new URL(alternate.href); } catch { add('error', 'invalid-hreflang', page.path, alternate.href); continue; }
    if (url.origin !== canonicalOrigin) add('error', 'hreflang-origin', page.path, alternate.href);
    const other = pages.get(normalizePath(url.pathname));
    if (!other) { add('warning', 'unchecked-hreflang', page.path, alternate.href); continue; }
    if (other.noindex || other.redirect || other.status >= 400 || other.canonical !== alternate.href) add('error', 'noncanonical-hreflang-target', page.path, alternate.href);
    if (!(other.languages || []).some((item) => item.href === page.canonical)) add('error', 'nonreciprocal-hreflang', page.path, alternate.href);
  }
  for (const alternate of sitemapLanguages.get(page.path) || []) {
    const target = normalizePath(new URL(alternate.href).pathname);
    if (!(sitemapLanguages.get(target) || []).some((item) => item.href === page.canonical)) add('error', 'nonreciprocal-sitemap-hreflang', page.path, alternate.href);
  }
}
for (const [url, item] of fragmentLinks) {
  if (pageAnchors.has(item.target) && !pages.get(item.target)?.redirect && !pageAnchors.get(item.target).has(item.fragment)) add('warning', 'missing-static-anchor', url, `Linked from ${item.source}; verify whether client rendering supplies this anchor.`);
}

const summary = {
  sitemapUrls: sitemapUrls.length,
  staticHtmlPages: staticPageCount,
  pagesAudited: pages.size,
  httpChecks: httpChecked.size,
  uniqueInternalTargets: links.size,
  unverifiedDynamicTargets: staticOnly ? new Set([...unresolvedLinks, ...[...sitemapPaths].filter((pathname) => !pages.has(pathname))]).size : 0,
  errors: issues.filter((issue) => issue.severity === 'error').length,
  warnings: issues.filter((issue) => issue.severity === 'warning').length,
};
const report = {
  generatedAt: new Date().toISOString(), origin, canonicalOrigin, staticOnly, summary,
  scope: 'Generated production HTML, canonical sitemap, internal link routing and public HTTP responses. JSON-LD checks syntax and breadcrumb essentials, not Google rich-result eligibility. No search traffic or rankings are measured.',
  issues, pages: [...pages.values()],
};
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...summary, report: output }, null, 2));
for (const issue of issues.slice(0, 25)) console.log(`${issue.severity.toUpperCase()} ${issue.code}: ${JSON.stringify(issue.url)} — ${JSON.stringify(issue.detail)}`);
if (issues.length > 25) console.log(`See report for ${issues.length - 25} further findings.`);
process.exitCode = summary.errors ? 1 : 0;
