# EnglishMeter development and SEO audit — 11 November 2026

Scope: improve the existing platform without changing question banks, answer keys or public URL structures. No Production deployment is part of this work. The owner's approximately 5,000 monthly visits is an estimate, not a verified Analytics measurement. Search Console and GA account reports were unavailable; no rankings, search volumes or traffic gains are asserted.

> Analytics follow-up: this document records the original `83e1c64` audit. After the owner reported missing visits, live HTML inspection confirmed that Analytics was enabled but the newly introduced mandatory opt-in excluded visits without a saved grant. A subsequent correction restores automatic visit counting while respecting explicit opt-outs and browser privacy signals, avoids persisting an automatic grant, and uses the actual hostname rather than the Vercel build label. The original opt-in descriptions and measurements below are historical. See [analytics-measurement.md](analytics-measurement.md) for current behaviour, verification steps and comparison limits; Google account-side receipt has not been verified.

## 1. Technical SEO and indexing

The live homepage, robots file, sitemap and sampled category pages returned HTTP 200. The apex redirects to `www`, matching the existing canonical configuration. The live sitemap contained 9,270 unique URLs. Existing Preview and private-session noindex protections were retained.

The complete baseline audit included dynamic public test pages as well as generated HTML. It found 43 duplicate title pairs between Daily English word lists and their timed quizzes; their tasks are different, so both useful URLs remain, with explicit list-versus-quiz titles, reciprocal links and appropriate CollectionPage/Quiz markup. No redirect was added solely to remove a duplicate title.

Spanish and Arabic dictionary pages now have reciprocal, self-inclusive hreflang for 219 genuine equivalent word pairs. Matching requires the same English headword and original example plus actual translated content. Other pages are not falsely linked as translations; no invented English equivalent or x-default selector is advertised. Corresponding sitemap alternates, visible language links and dictionary/breadcrumb schema were added.

Affected files: `lib/seo.ts`, `lib/vocabulary-locales.ts`, `app/sitemap.ts`, `app/es/vocabulary/[slug]/page.tsx`, `app/ar/vocabulary/[slug]/page.tsx`, `app/daily-english/[slug]/page.tsx`, `app/tests/[slug]/page.tsx`, `lib/public-test-content.ts`, `tests/seo-locales.test.ts`, `scripts/audit-site.mjs`.

## 2. Performance and mobile use

- Homepage question banks now load only when a visitor starts a test. The server sends counts and 168 searchable titles/paths, not question data. The existing launch algorithms were extracted without changing selection, shuffling or scoring keys.
- The German vocabulary API is requested only when its section is used. The homepage no longer makes a redundant initial navigation just to append a language query parameter; explicit language choices still update the shareable URL.
- Advanced test cards receive server-computed counts instead of importing every question into the client bundle.
- Blog images use responsive image sizes, reserved dimensions and lazy loading for lists; the article hero is prioritised. Image optimization accepts only the site's reviewed local blog JPEGs, with no arbitrary remote image sources.
- The static vocabulary index is cached per server worker. Related-link filtering happens before sorting; all 6,223 dictionary records and their existing related-link outputs were checked against the baseline.
- Existing system fonts need no external font download. No new font dependency was added.
- Quiz navigation and footer links have at least 44px touch targets; radio answers support keyboard focus, long test titles wrap and mobile navigation/search is available. Identified contrast and accessible-name issues were corrected. Legacy vocabulary modes now memoize their unchanged source pools, and flashcard/mini-quiz effects track the current word correctly.

Affected files: `app/HomeClient.tsx`, `app/page.tsx`, `lib/home-test-{launcher,summary,types}.ts`, `lib/test-discovery.ts`, `components/TestDiscovery.tsx`, `app/advanced-tests/page.tsx`, `components/AdvancedTestsClient.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `lib/vocabulary.ts`, `next.config.mjs`, `app/quiz/[id]/page.tsx`, `components/Footer.tsx`, `app/flashcards/page.tsx`, `app/vocab-es/page.tsx`, `app/vocab-finish/page.tsx`, `app/vocab-finish-ar/page.tsx`, `components/VocabularyQuiz.tsx`.

Lighthouse measurements and final build figures are recorded in the validation section below. Lighthouse measures laboratory performance; its Total Blocking Time is not field INP. Real-user LCP, INP and CLS must be assessed in Search Console/CrUX after a reviewed release. Third-party advertising, visitor devices and networks can change live results.

## 3. Categories, internal links and useful content

The homepage and directory prioritise English Level Test, Grammar, Vocabulary, IELTS and YDS. New `/yds-preparation` gathers the 32 existing mock exams and six skill/vocabulary destinations; no YDS questions were added or edited. Generic test pages now explain what the test practises, how to review it and where to continue. Worked examples use existing questions and explanations; answers remain collapsed until requested. Three previously thin grammar guides have useful worked examples.

Affected files: `app/english-tests/page.tsx`, `app/yds-preparation/page.tsx`, `app/grammar/page.tsx`, `app/vocabulary-tests/page.tsx`, `app/daily-english/page.tsx`, `app/test-{conditionals,perfect-tenses,relatives}/page.tsx`, `components/GrammarTopicGuide.tsx`, `components/WorkedQuestionExamples.tsx`, `components/StudyHubStructuredData.tsx`, plus the technical/content helpers listed above.

Intent decisions, cannibalization risks and prioritised editorial opportunities for all ten requested areas: [content-opportunities.md](content-opportunities.md). New keyword pages were not created simply to repeat existing tests.

## 4. Returning learners and test results

The shared `/quiz/[id]` engine saves answers, option order, exact Practice locks, navigation and timer deadlines. Reloading or leaving a timed attempt does not restart its clock. Saved attempts can be reopened from the homepage in the same browser, including a new tab. Completed results restore without a second progress entry. Stale-tab writes cannot reactivate a finished attempt; unchanged mounts do not trigger cross-tab reload loops.

Local progress retains up to eight recent attempts for 30 days and 100 results. Learners can choose a daily answered-question goal and weekly completed-test goal. Calendar boundaries use the device's local date, with weeks starting Monday. Empty submissions do not count as completed tests toward a weekly goal. Goal updates preserve current history. Storage failures show a notice and do not stop the current test. No account or new database service was introduced; existing user-data keys and server records remain intact.

Results recommend related existing topics and cautious study next steps. Existing answer explanations and mistake review remain. Public quiz and Daily Challenge completions also contribute to local goals. Saved-attempt continuation applies to the shared quiz; the separate Challenge keeps its existing server-backed continuation. Other legacy games have their existing behaviour.

Affected files: `app/quiz/[id]/page.tsx`, `lib/quiz-session.ts`, `lib/study-progress.ts`, `lib/study-recommendations.ts`, `components/StudyProgress.tsx`, `components/StudyRecommendations.tsx`, `components/RaceQuiz.tsx`, `components/ChallengeClient.tsx`, `tests/study-retention.test.ts`.

The old `/race` game has simulated opponents and ranks. Its UI now states this explicitly, and primary/footer navigation points to the real `/challenge` ranking. The old game's URL and questions remain. Its timer callback now reads current state instead of a stale closure.

## 5. Measurement

The existing GA4 property now receives allowlisted test start/resume/completion and category-click events, with duplicate suppression and sanitised page URLs. Initial external referrers retain only their origin so Google/Bing organic attribution is not discarded; later page views use the preceding sanitised virtual URL. This code does not send answers, question text, nicknames, email addresses or attempt IDs. Analytics runs only on the real Production hostname after the visitor's optional analytics choice. Local and Preview validation does not send GA events. The footer permits changing that choice; cookie/privacy copy describes the actual behaviour.

Affected files: `app/layout.tsx`, `lib/analytics.ts`, `components/Analytics.tsx`, `components/Footer.tsx`, quiz components listed above, `app/cookie/page.tsx`, `app/privacy/page.tsx`, `tests/analytics.test.ts`.

[analytics-measurement.md](analytics-measurement.md) provides the GA event definitions, completion-funnel setup, Search Console export template and required account-side checks. Local mocked events do not establish delivery to Google. GA Enhanced Measurement settings and live event receipt still need checking after a reviewed publication. Opt-in changes the measured population, so old/new totals must not be presented as a traffic-growth comparison without adjustment.

## 6. Security and dependency limits

ESLint and the matching Next.js lint configuration are development-only additions needed for repeatable `npm run lint`. Lighthouse was installed outside the application as a temporary audit tool. DOMPurify was updated within its existing major version to 3.4.17 after dependency scanning identified security advisories. No new runtime service was added.

The latest dependency audit still reports 13 affected package entries: one critical, eight high and four low. The security report preserves the timestamps and variation in transitive dependency counts between audit responses. Next.js 14.2.35 is the critical entry; its patched upgrade path requires a major framework migration. Restricting image sources is defense in depth, not a claim that Next.js advisories are fixed. The remaining findings and a controlled upgrade plan are in [security-audit.md](security-audit.md). This branch must not be treated as a fully security-cleared release.

## Validation record

- `npm run lint`: passed, no warnings or errors.
- `npm run typecheck`: passed.
- `npm test`: 145 tests, 144 passed, one isolated-database integration test skipped because its test database was not configured. No live database was substituted.
- `npm run build`: passed; 9,134 static outputs. The local missing-Supabase-configuration notice and existing Edge-route static-generation notice remain environmental/build limitations, not a successful live database test.
- Full compiled SEO crawl: 9,271 sitemap URLs; 9,120 public generated HTML pages; 9,398 pages audited including 290 HTTP checks; 9,307 unique internal targets; zero errors or warnings.
- Mobile/browser checks passed at 320, 375 and 768px: search, explicit language switching, no initial language redirect/German-data fetch, placement launch, YDS80-question launch, Cambridge16-question scoring and explanation review, optimized images and disabled local GA.
- Nine retention/security browser scenarios passed, including exact answer/order/deadline restoration, closed-tab continuation, Practice locks, goal/result deduplication, expired exams, two-tab conflicts, wrong-attempt isolation and safe HTML rendering. No JavaScript page errors or horizontal overflow were observed.
- All 101 files under `data/` are byte-for-byte unchanged. Thirty representative homepage launch payloads match pre-change hashes. The 138 existing YDS/legacy IELTS question outputs and all 6,223 dictionary/related-link outputs match their baselines.
- `git diff --check`: passed.

No Production deployment, push or external user-data mutation was performed. Local browser tests use isolated browser storage; these tests do not certify live email delivery or database availability.

### Lighthouse laboratory measurements

Lighthouse 12.8.2, local production server, mobile 412×823, simulated Slow 4G and 4× CPU slowdown. Each version was measured three times in fresh Chromium sessions. Shared-host variation is visible in the individual scores; report the median rather than selecting the best run.

| Metric | Before | Final |
| --- | ---: | ---: |
| Mobile Performance, median | 68 | 95 |
| Individual Performance runs | 47, 75, 68 | 97, 81, 95 |
| SEO | 100 | 100 |
| Accessibility, measured full audits | 96 | 100 |
| LCP, median | 2.67 s | 2.07 s |
| Total Blocking Time, median | 1,675 ms | 214 ms |
| CLS, median | 0 | 0 |

The final median meets the 90+ laboratory target; one final run scored 81, so 90+ is not guaranteed for every measurement or visitor. These are **not live field Core Web Vitals**. Third-party requests encountered certificate errors in this environment; Best Practices remained 96. GA is deliberately disabled on localhost; live consented analytics and advertising may change loading behaviour. Actual INP and account-side delivery were not measured.

Artifacts are available in `/workspace/englishmeter-audit/`: `lighthouse-summary.json`, all six JSON runs, `lighthouse-before-median.html`, `lighthouse-after-3.report.html`, `seo-audit.json`, `dependency-audit.json`, build/lint/typecheck/unit-test logs and mobile screenshots.

Home First Load JS fell from **1.08 MB to 121 kB** (approximately 89%); Advanced hub First Load JS fell from **148 kB to 98.2 kB**. The separate `/start` route still loads approximately 987 kB when a test is launched; splitting banks per selected test is a remaining optimisation opportunity that needs the same question-preservation checks.

Repeatable commands:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run start
npm run audit:seo -- --origin http://localhost:3000 --output /tmp/englishmeter-site-audit.json
```

The SEO script checks generated HTML plus sitemap-only dynamic public routes, internal targets, duplicate metadata, canonical/indexing consistency, hreflang reciprocity and JSON-LD/breadcrumb structure. It is not Google's Rich Results Test and does not certify rich-result eligibility.
