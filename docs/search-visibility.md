# English test coverage and search visibility

## What the audit established

The live apex domain redirects to `www.englishmeter.net`, but page canonical tags,
robots sitemap references and all 9,256 URLs in the previous sitemap used the apex
host. `lib/seo.ts` now normalizes both known brand hosts to the final HTTPS www
origin. This aligns canonical, social, structured-data and sitemap URLs without
requiring a Vercel environment-variable change. Valid custom origins remain supported.

The site already had a 30-question placement test, grammar by level, vocabulary,
reading, Kids English and IELTS grammar. The placement entry was a thin generic
test page reached mainly through JavaScript buttons on the homepage.
`/english-level-test` now explains the existing assessment, its scoring and its
limits, with a direct start link. `/tests/quick-placement` permanently redirects
there; the `quick-placement` selector and question set are unchanged.

`/english-tests` is a crawlable directory of existing and new categories. Homepage
cards and footer links make these pages reachable through normal HTML links.

## New original practice content

| Section | Tests | Questions | Canonical hub |
| --- | ---: | ---: | --- |
| Business English: workplace vocabulary, meetings/email language, professional grammar | 3 | 60 | `/business-english-tests` |
| TOEIC Reading: incomplete sentences, text completion, reading comprehension | 3 | 60 | `/toeic-reading-tests` |
| B2 First / C1 Advanced Use of English Part 1 | 4 | 64 | `/cambridge-english-tests` |
| **Total** | **10** | **184** | |

TOEIC text completion uses five original texts with four questions each, including
sentence insertion. Reading comprehension uses four original workplace texts with
five questions each. Each Cambridge test contains two original texts, eight gaps
per text and four choices per gap. These are focused practice sets, not full
official exams or predictors of official scaled scores.

All tests use the existing Exam/Practice interface, English explanations, answer
review and retry. No new API key, database schema, Writing or Listening service is
required. YDS questions, test settings and scoring are unchanged.

## Why these search topics

The opportunities were selected by comparing the actual catalogue with recognised
learning needs and current official task formats:

- [British Council Business English](https://learnenglish.britishcouncil.org/free-resources/business)
  supports workplace communication, email and recruitment language.
- [ETS TOEIC Listening and Reading format](https://www.ets.org/toeic/about/listening-reading.html)
  identifies Reading Parts 5, 6 and 7; the official full Reading section is 100
  questions in 75 minutes. The new sets do not claim to reproduce that complete section.
- [Cambridge B2 First format](https://www.cambridgeenglish.org/exams-and-tests/qualifications/first/format/)
  and [C1 Advanced format](https://www.cambridgeenglish.org/exams-and-tests/qualifications/advanced/format/)
  specify eight-gap, four-option Part 1 cloze tasks.
- [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
  explains consistent canonical signals and sitemap use.

Relevant intents include “business English test online”, “TOEIC reading practice”,
“B2 First Use of English”, “FCE practice”, “C1 Advanced Use of English” and “CAE practice”.
Older and current Cambridge names share one set of canonical pages instead of
duplicating the same material under different keywords.

No keyword-planning account, Search Console metrics or reliable monthly search
volumes were available. Public search requests did not yield useful results;
a Google Trends request returned HTTP 429, so no Trends measurements were used.
These are documented coverage opportunities, not a verified ranking of the
world's most-searched English tests. No ranking or traffic uplift is guaranteed.

## SEO implementation

The 15 new pages comprise three hubs, ten tests, the directory and the level-test
landing page. They provide unique metadata, server-rendered explanations, examples,
breadcrumbs and relevant CollectionPage/Quiz structured data. Individual tests link
to their category, related tests and suitable level pages. The sitemap adds the new
canonical URLs and removes the redirected placement URL; session pages remain noindex.

Source data is in `data/practice/`; shared exam landings are in
`components/ExamPracticePages.tsx`. Question-count validation follows the category
definition, and passage-backed tests additionally validate their required layouts.

## Publishing and measuring results

1. Publish a fresh **Production** build of the new commit. A Preview build retains
   its noindex policy and is not evidence of a live release.
2. Confirm representative pages return 200, have a www canonical and are indexable.
   The old placement URL should return 308 to `/english-level-test`.
3. In the verified Search Console property, submit or monitor
   `https://www.englishmeter.net/sitemap.xml`. Check Google's selected canonical on
   a sample page after recrawling. Avoid submitting duplicate session/query URLs.
4. Filter Search Console Performance by the new paths and compare impressions,
   clicks, queries and CTR over complete reporting periods. Review country and
   device breakdowns before choosing the next content expansion.
5. Use real-user Core Web Vitals to prioritise performance work. A local build's
   JavaScript-size report is not a field-performance measurement.

The preceding build reported 1.05 MB homepage first-load JavaScript; this release
reports 1.08 MB after adding the new banks. New landing pages report 96.5 kB.
Large legacy homepage banks remain a separate optimisation opportunity; this
release does not claim to have resolved real-user performance or all SEO issues.

## Verification

- 124 automated tests passed; the separate Challenge database integration test
  was skipped without an isolated test database. The final content edits also
  passed all 18 focused practice regression tests.
- TypeScript and the Production build passed, generating 9,133 static pages.
- Browser checks covered all 15 new pages without JavaScript, all ten test
  starts, three-category scoring, retry, Practice mode and the complete existing
  30-question placement flow at a 375 px mobile viewport.
- Compiled Production checks confirmed www canonicals, indexability and a real
  16-question Cambridge attempt with correct/wrong/blank results and explanations.
- The compiled sitemap contains 9,270 unique www URLs and excludes the redirected
  placement URL. The 138 existing YDS and legacy IELTS test outputs match baseline.

These are local verification results. Publication and Google indexing must be
checked separately after the new commit is deployed.
