# EnglishMeter SEO

Canonical site origin defaults to `https://englishmeter.net`. If `NEXT_PUBLIC_SITE_URL`
is configured, set it to the public production origin, not a Vercel preview URL.
`lib/seo.ts` keeps canonicals and social URLs consistent. Preview deployments have
both noindex response headers and a restrictive robots policy. Use a fresh Production
build for the live site; promoting a build created with Preview settings retains
its build-time noindex directives.

## Changes

- Next.js configuration uses the supported `next.config.mjs` filename, so its
  redirects, resource limits and response headers are actually applied.

- Public hubs have their own title, description, canonical and social preview.
  Account, personal-result and session pages have noindex metadata.
- Homepage content is rendered in the initial HTML. Only URL query synchronization
  is inside a client-side Suspense boundary. The FAQ markup and JSON-LD use the same
  source; unsupported search-action schema and duplicate hidden headings were removed.
- The sitemap follows actual vocabulary, topic, article and quiz catalogues. It
  excludes noindex pages and duplicate quiz aliases, and does not invent modification dates.
- `/daily-english/test-N` resolves valid sets, including the final partial set.
  `/es/vocabulary` exists and links to Spanish entries. Locale word slugs match
  between indexes, detail pages and the sitemap.
- Invalid public quiz, level and vocabulary paths return not-found responses.
  Legacy/case aliases redirect to canonical forms.
- Five blog articles contain explained exercises. BlogPosting and BreadcrumbList
  describe the actual articles. Vocabulary pages use real examples when supplied;
  missing examples are labelled writing practice, not manufactured sample sentences.
- Social metadata uses the page's content. Language preference query strings are
  not advertised as translated-page hreflang alternatives.

## Checks

Run `npx tsx --test tests/*.test.ts`, then `npm run build` from the repository root.
Stop the development server before building because both use `.next`. The suite
covers contact regressions as well as sitemap/catalogue, metadata, structured-data
escaping, locale routing and content behavior.

After deployment, check:

1. Production `/robots.txt` returns the production sitemap, and `/sitemap.xml`
   lists the public canonical URLs. Preview must remain noindex.
2. `/`, a blog article, a vocabulary entry and a daily test return their own
   canonical links and accurate titles. The homepage heading is present with
   JavaScript disabled. Invalid test/word URLs return 404.
3. Submit `https://englishmeter.net/sitemap.xml` in Google Search Console for the
   verified property. Inspect representative canonical URLs and request indexing
   after the production deployment is live. Repository changes cannot establish
   Search Console ownership or guarantee that Google will index or rank a page.
4. Use Search Console indexing/Core Web Vitals reports and real-user performance
   data for follow-up. Local functional checks are not live ranking or field-performance measurements.

For future content, add useful explanations and examples rather than repeating
keyword templates. Update article dates only when there is an actual publication
or substantive revision; do not generate new timestamps on every deployment.
