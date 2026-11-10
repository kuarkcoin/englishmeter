# IELTS Grammar Tests

`/ielts-grammar-tests` contains ten free English grammar tests, each with 15
original questions, four answer choices and an English explanation. They use
the existing quiz engine: 15-minute Exam mode, untimed Practice mode, answer
review, saved mistakes and retry. No new database, account or AI API is needed.

| Test | Topic | Practice level |
| --- | --- | --- |
| 1 | Tenses and aspect | B1 |
| 2 | Articles and countability | B1 |
| 3 | Subject–verb agreement | B2 |
| 4 | Modals and hedging | B2 |
| 5 | Conditionals | B2 |
| 6 | Relative clauses | B2 |
| 7 | Passive voice | B2 |
| 8 | Comparisons and quantifiers | B2 |
| 9 | Complex sentences and linkers | B2 |
| 10 | Mixed grammar review | C1 |

IELTS does not have a separate grammar paper. These are independent preparation
exercises; their percentages and CEFR practice labels are not IELTS band scores.
The existing 50-question IELTS test remains available at `/tests/ielts-grammar`.

## Content and quiz integration

The banks live in `data/ielts/`. Each test includes learning goals and three
short lessons with examples. `lib/practice-catalog.ts` integrates the tests with
the existing practice catalogue. The quiz selector is
`practice-ielts-grammar-{slug}`, and the public page is
`/ielts-grammar-tests/{slug}`. Validation requires exactly 15 complete questions
for this category and preserves the answer keys while shuffling choices.

The new IELTS flow uses English finish confirmation and result copy. Results
show correct, incorrect and unanswered totals, percentage, explanations and a
link to the other IELTS tests. Retry starts the same test with fresh answers.
Changes to the shared quiz UI are conditional on the new IELTS selector.

## SEO and discovery

- One collection page and ten individual test pages have unique titles,
  descriptions, canonical URLs and social metadata.
- Grammar guides, goals, three worked questions per test, FAQs and navigation
  are rendered in HTML, so they can be read without JavaScript.
- CollectionPage, ItemList, WebPage, Quiz and BreadcrumbList structured data
  describe the visible content. They do not promise a Google rich result.
- The catalogue automatically adds all 11 canonical URLs to `/sitemap.xml`.
  The `/practice/ielts-grammar` aliases redirect to the dedicated URLs and are
  excluded from the sitemap. Quiz sessions retain their noindex settings.
- A homepage card, the existing IELTS test and related practice pages link to
  the collection. Individual IELTS pages link to each other and level practice.

Publish a fresh **Production** build so the pages use production crawl settings.
After deployment, check the hub and a test URL in Google Search Console. If
`https://www.englishmeter.net/sitemap.xml` is already submitted, monitor its updated
processing; a separate sitemap is unnecessary. Use a page filter containing
`/ielts-grammar-tests` to track indexing, queries, impressions and clicks.
Repository checks do not establish Google indexing or traffic growth.

## Validation

```sh
npx tsx --test tests/*.test.ts
npx tsc --noEmit --incremental false
npm run build
```

The IELTS tests verify all 150 question records, answer preservation and scoring,
metadata, canonical routes, redirects and sitemap coverage. Existing practice
tests cover the other categories and the shared quiz adapter.

Initial release verification: 114 automated tests passed; the separate Challenge
database integration suite was skipped because no isolated test database was
configured. TypeScript and the Production build passed (9,118 static pages).
Mobile browser checks covered all ten test starts, correct/wrong/blank scoring,
retry, Practice feedback and all 11 pages without JavaScript. A compiled
Production smoke test completed a full 15-question attempt with English results
and explanations. The 138 existing YDS and legacy IELTS test outputs matched
the pre-change baseline. These are local checks, not a claim of live deployment
or Google indexing.
