# EnglishMeter SEO

Canonical site origin defaults to `https://www.englishmeter.net`, matching the live
apex-to-www redirect. Both known EnglishMeter hosts normalize to this final HTTPS
origin, including older `NEXT_PUBLIC_SITE_URL` settings that use the apex host.
For other configured domains, use the public production origin, not a Vercel preview URL.
`lib/seo.ts` keeps canonicals and social URLs consistent. Preview deployments have
both noindex response headers and a restrictive robots policy. Use a fresh Production
build for the live site; promoting a build created with Preview settings retains
its build-time noindex directives.

See [the search coverage expansion](search-visibility.md) for the Business English,
TOEIC and Cambridge practice sets, the English level landing page, keyword evidence
limits and post-publication checks.

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
- All six level hubs and 70 topic pages have deliberate search titles, concise
  descriptions and matching canonical/social URLs. Hubs use CollectionPage and
  ItemList; topic pages describe the actual free practice Quiz. BreadcrumbList
  uses the same source as the visible navigation. This markup describes content;
  it does not promise a Google rich result.
- Topic pages provide a distinct study guide, three learning goals, a tip and
  three complete examples with answer explanations in native HTML details.
  The guides, examples and topic navigation are usable without JavaScript;
  interactive tests use the shared JavaScript quiz flow.
  The grammar hub links directly to all A1–C1 hubs using canonical lowercase paths.
- Curriculum sitemap entries record the actual editorial update in
  `LEVEL_CONTENT_UPDATED_AT`; advance it only after a substantive curriculum-page
  change. Other entries still omit unknown modification dates.

## Checks

Run `npx tsx --test tests/*.test.ts`, then `npm run build` from the repository root.
Stop the development server before building because both use `.next`. The suite
covers contact regressions as well as sitemap/catalogue, metadata, structured-data
escaping, locale routing and content behavior.

Local verification on 2026-11-03: all 79 automated tests passed, followed by a
Production-mode build of 9,082 static pages. A browser checked all six level hubs
and 70 topic pages with JavaScript disabled at 375 px width: distinct metadata,
canonical/social parity, crawl directives, schema/visible-content agreement,
study guides, answer examples, sibling links and sitemap editorial dates passed.
The standard 20-question quiz still starts correctly. These checks used the local
Production build; they do not establish live Google indexing or deployment status.

After deployment, check:

1. Production `/robots.txt` returns the production sitemap, and `/sitemap.xml`
   lists the public canonical URLs. Preview must remain noindex.
2. `/`, a blog article, a vocabulary entry and a daily test return their own
   canonical links and accurate titles. The homepage heading is present with
   JavaScript disabled. Invalid test/word URLs return 404.
3. Submit `https://www.englishmeter.net/sitemap.xml` in Google Search Console for the
   verified property. Inspect representative canonical URLs and request indexing
   after the production deployment is live. Repository changes cannot establish
   Search Console ownership or guarantee that Google will index or rank a page.
4. Use Search Console indexing/Core Web Vitals reports and real-user performance
   data for follow-up. Local functional checks are not live ranking or field-performance measurements.

For future content, add useful explanations and examples rather than repeating
keyword templates. Update article dates only when there is an actual publication
or substantive revision; do not generate new timestamps on every deployment.

## Yeni seviye testlerini Google'a bildirme

1. Bu değişiklikleri içeren commit'i Vercel'de **Production** ortamında yeniden
   derleyip yayımlayın. Preview derlemesini doğrudan taşımak, derleme sırasında
   üretilen `noindex` ayarlarını koruyabilir.
2. [Google Search Console](https://search.google.com/search-console) içinde
   `englishmeter.net` için doğrulanmış mülkü açın. **Site Haritaları** bölümüne
   `https://www.englishmeter.net/sitemap.xml` gönderin. Aynı site haritası zaten
   kayıtlıysa yeniden kaydetmek gerekmez; güncel dosyanın okunmasını takip edin.
3. **URL Denetimi** bölümünde önce `https://www.englishmeter.net/levels/a1`, ardından
   A2, B1, B2 ve C1 seviye adreslerini kontrol edin. **Canlı URL'yi test et**
   sonucunda dizine eklemeye uygun görünüyorlarsa **Dizine eklenmesini iste** seçeneğini
   kullanın. Birkaç yeni konu adresini de kontrol edin; örneğin
   `https://www.englishmeter.net/levels/b2/causatives` ve
   `https://www.englishmeter.net/levels/c1/subjunctive`.
4. **Dizine ekleme → Sayfalar** raporunda Google'ın seçtiği canonical adresi ve
   hariç bırakma nedenlerini izleyin. **Performans → Arama sonuçları** raporunda
   `/levels/` sayfa filtresiyle gösterim ve tıklamaları takip edin.

Search Console mülkiyeti veya dizine ekleme isteği kod değişikliğiyle oluşturulmaz.
Google'ın bir sayfayı ne zaman dizine ekleyeceği ve hangi sırada göstereceği garanti
edilemez. Bu kontroller canlı Production sürümü yayımlandıktan sonra yapılmalıdır.
