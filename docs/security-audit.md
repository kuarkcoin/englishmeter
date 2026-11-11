# Dependency security review — 11 November 2026

## Finding and scope

The production dependency audit reports **critical advisories against the installed
Next.js 14.2.35 package**, together with high-severity transitive dependency
findings. They remain a priority follow-up. Successful lint, TypeScript, build,
SEO and browser checks do not resolve dependency advisories.

Evidence was collected with `npm audit --omit=dev --json`, `npm ls --omit=dev`,
the committed/current lockfiles and a source review. An audit finding means that
an installed version matches a published affected-version range. It does **not**
establish that every reported exploit path is reachable in this application, or
that the site has been compromised. No exploit was run against production; no
production deployment was performed.

The **latest audit, at 06:14:05 UTC, reports 13 affected package entries:
1 critical, 8 high and 4 low**, with no DOMPurify entry. Its evidence is
`/tmp/englishmeter-dependency-audit-after-sanitizer.json`. These are package-chain
counts, not 13 independently demonstrated exploits. Versions in the table below
were read from the current `package-lock.json` and checked against `npm ls`.

For provenance, the initial audit reported 12 entries (1 critical, 7 high, 4 low)
in `/tmp/englishmeter-dependency-audit.json`. An earlier post-sanitizer snapshot
at 06:13 UTC reported 11 entries (1 critical, 6 high, 4 low) in
`/tmp/englishmeter-dependency-audit-final.json`. The latest run additionally lists
the parent packages `@prisma/client` and `docx` through the already-listed Prisma
and Nano ID chains. Both post-update snapshots confirm the sanitizer entry is
gone and the critical Next.js finding remains. Preserve the audit JSON with a
release rather than treating a changing aggregate count as a security guarantee;
repeat the audit when reviewing the next release.

## Narrow changes applied in this work

- `dompurify` was updated from **3.3.1 to 3.4.17**, within the existing major
  version. The shared quiz sanitizes HTML using `USE_PROFILES: { html: true }` in
  `app/quiz/[id]/page.tsx`. The original audit included a high advisory affecting
  versions through 3.4.16
  ([GHSA-mrv2-3pqr-j5jr](https://github.com/advisories/GHSA-mrv2-3pqr-j5jr)) and
  multiple other sanitizer advisories. Upgrading the package does not by itself
  audit every HTML rendering path in the application.
- `next.config.mjs` now allows image optimization only for local
  `/images/blog/*.jpg` paths without source query strings, with
  `remotePatterns: []`. The five currently referenced files were inspected with
  `file` and are JPEG images. Only the blog index/article components import
  `next/image`. This removes the previous unrestricted HTTPS-host pattern and
  reduces the accepted image-source surface. **It is not a framework security
  patch and does not close the Next.js audit finding.**

No blanket dependency overrides, `npm audit fix --force`, framework-major upgrade
or database schema change was applied as part of these changes.

## Remaining dependency priorities

| Dependency chain and installed versions | Audit severity | Evidence and follow-up |
| --- | --- | --- |
| `next@14.2.35` | Critical | Includes critical image-optimization advisories for SVG ([GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw)) and AVIF ([GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4)), plus Windows-hosted execution ([GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36)). Also includes RSC/Server Action denial-of-service and cache-related findings. Plan a tested upgrade to a maintained patched release. |
| `next → postcss@8.4.31` | High | Source-map loading/path-traversal and CSS-output advisories, including [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q). Resolve through a compatible framework/toolchain update; do not assume the separately pinned root development PostCSS version replaces Next's nested copy. |
| `next → postcss → source-map-js@1.2.1` | High | Indexed source-map denial of service, [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q). Review with the CSS toolchain update. |
| `next → postcss → nanoid@3.3.11`; `docx → nanoid@5.1.6` | High | Invalid-size generator findings, including [GHSA-28wg-ghj8-5hjv](https://github.com/advisories/GHSA-28wg-ghj8-5hjv) and [GHSA-xwg4-73v4-xw9w](https://github.com/advisories/GHSA-xwg4-73v4-xw9w). Application source does not directly call Nano ID or import `docx`; inspect package usage and update/remove unnecessary dependencies in a focused change. |
| `@prisma/client → prisma@6.19.3 → @prisma/config@6.19.3 → deepmerge-ts@7.1.5` | High | Recursive object graph stack exhaustion, [GHSA-ggr8-5vv4-36mx](https://github.com/advisories/GHSA-ggr8-5vv4-36mx). These entries appear in the production audit despite the root Prisma CLI declaration being a development dependency. Review generator/config usage and upgrade client/CLI together with isolated database tests. |
| `resend@4.8.0 → @react-email/render@1.1.2 → html-to-text@9.0.5 → deepmerge@4.3.1` | Low | Prototype poisoning, [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4). The contact handler supplies plain text rather than a React email template. This lowers the relevance of that particular application path, but the affected package chain remains installed. Test a supported Resend upgrade separately. |

The initial audit's proposed Next.js fix was **16.4.6**, marked as a semver-major
change. This is an audit snapshot, not a permanent recommendation to pin that
specific version. Select and audit the current patched release at implementation
time; a candidate on a maintained 15.x line must also clear the complete current
advisory set and its transitive dependencies.

## Application feature exposure reviewed

| Feature | Repository evidence | Interpretation |
| --- | --- | --- |
| App Router and React Server Components | Server-rendered `app/` pages, dynamic test routes and route handlers are present. | RSC/framework advisories require attention; having mostly static learning pages does not remove the framework's request-processing surface. |
| Image optimization | `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, restricted `images` configuration. | The image endpoint is used. Approved inputs are local JPEGs; arbitrary remote URLs, API paths and SVG/AVIF source files are not deliberately enabled. Confirm allowed/denied requests against the built application. |
| Open Graph images | `app/opengraph-image.tsx` and `app/flashcards/opengraph-image.tsx` use `ImageResponse` with fixed JSX and PNG output. | These are separate generated image routes; no user-supplied image source is passed by this code. |
| Middleware | `middleware.ts` refreshes Supabase cookies, verifies `auth.getUser()`, and redirects unauthenticated `/dashboard/:path*` and `/api/private/:path*` requests to login. | Middleware exists and must be regression-tested during migration. `/dashboard` also verifies the user server-side. Do not describe the site as having no middleware. |
| Server Actions | No explicit `use server` action modules/functions were found in application source. Mutations use route handlers. | No application-authored action was identified; this is not proof that framework-level RSC/Server Action advisories are irrelevant. |
| Rewrites/custom servers/WebSocket upgrades | No `rewrites()` configuration, custom server entry point or WebSocket upgrade handler was found. | Advisory prerequisites involving those specific application configurations were not found. Hosting behavior was not independently audited. |
| Pages Router internationalization | No `pages/` tree or Next `i18n` configuration; Spanish/Arabic pages use App Router paths. | The Pages Router + i18n middleware-bypass configuration was not identified. |
| CSP nonce / untrusted `beforeInteractive` script | No nonce handling or `beforeInteractive` script use was found. The theme script is a fixed literal. | Those advisory-specific input patterns were not identified in reviewed source. |
| Contact/admin/challenge APIs | `app/api/contact/route.ts` sends bounded, validated plain-text fields; admin handlers require `x-admin-key`; challenge handlers use participant cookies, bounded JSON bodies and server-side scoring. | These controls belong to the application and do not compensate for an affected framework version. Authorization/body-limit/cache behavior must remain intact through upgrades. |

The local executor is Linux and the project targets Vercel. This review did not
inspect every production hosting configuration or determine the reachability of
the Windows-specific advisory. No infrastructure-specific exemption is assumed.

## Separate Next.js 15/16 migration plan

A framework-major migration touches routing, request APIs, React compatibility,
bundling, linting and authenticated server rendering. Combining it silently with
the SEO/retention work would conflict with the requirement to avoid an unnecessary
large rewrite and preserve working tests. The remaining critical finding should
therefore be handled promptly as a focused, reviewable follow-up, not considered
resolved by this report.

1. **Choose a patched target and runtime.** Verify release notes, support status,
   engine requirements and current audit results for the selected Next.js 15/16
   version. Align React/React DOM, their types, ESLint configuration and Vercel's
   Node runtime. The existing `engines.node` range starts at 18 and must not claim
   support for a runtime the target framework no longer supports.
2. **Migrate request APIs deliberately.** Current route components and metadata
   functions synchronously read `params`/`searchParams`; the Supabase server helper
   synchronously calls `cookies()`. Apply the target version's async request API
   requirements and verify client component parameter access. Review the
   middleware/proxy conventions for the target release and preserve Supabase
   cookie refresh and independent server-side authorization.
3. **Review tooling and cache behavior.** If targeting Next.js 16, replace the
   current `next lint` command with a compatible ESLint CLI setup. Validate the
   chosen bundler and existing static-generation settings rather than assuming
   all Next.js 14 options carry over. Keep private APIs, results and personalized
   pages out of shared caches; check public metadata/static-page output.
4. **Preserve application data and public URLs.** Keep question/answer hashes,
   selectors, aliases, canonical URLs and sitemap behavior unchanged. No database
   migration is implied by upgrading Next.js. Any Prisma update needs its own
   compatibility checks and an isolated database, not a production migration used
   as a test.
5. **Validate before release.** Run lint, typecheck, complete unit tests, production
   build, static/dynamic SEO audit and the critical browser suite. Specifically
   exercise exam timers, answer/choice-order resume, stale tabs, Practice mode,
   placement scoring, all-language vocabulary, contact error handling,
   authenticated redirects and Challenge API ownership/scoring/cache protection.
   Check valid JPEG optimization and rejection of arbitrary remote/API/SVG sources.
   Re-run `npm audit --omit=dev --json` and record remaining findings explicitly.
6. **Prepare a reviewable deployment and rollback.** Use an isolated preview and
   verify settings without exposing credentials. Production publication remains
   a separate user-controlled step; this task does not authorize automatic
   production deployment.

## Reproduction

```sh
npm audit --omit=dev --json > dependency-audit.json
npm ls next dompurify prisma @prisma/client postcss nanoid source-map-js resend deepmerge-ts --all --omit=dev
```

`npm audit` normally exits nonzero while vulnerabilities remain. Keep dependency
audit findings separate from functional test outcomes. This review is not a full
penetration test or a claim that all security issues have been found.
