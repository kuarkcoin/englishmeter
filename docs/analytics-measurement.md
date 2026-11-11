# Analytics and Search Console measurement

Audit date: November 11, 2026. No Google Analytics or Search Console account data was available to this task. The owner's approximately 5,000 monthly visits is an estimate supplied by the owner, not a verified measurement. No search volumes, rankings, traffic gains or field Core Web Vitals are asserted here.

## What changed in the code

The existing GA4 measurement ID is `G-Z4658W17W5`. The old integration loaded GA on every environment and had no custom test lifecycle events. `components/Analytics.tsx` now loads GA only when the server deployment has `VERCEL_ENV=production`, the hostname is `englishmeter.net` or `www.englishmeter.net`, **and** the visitor allows optional usage analytics. Local development, local production builds, Vercel Preview and generated Vercel deployment aliases do not load GA. The footer allows the visitor to change their choice. Analytics permission is separate from AdSense advertising preferences; this implementation is not a replacement for any advertising consent platform required by Google or applicable regional rules. AdSense retains its existing ID and loads after the browser's load event.

Page views are measured on the initial visit and Next.js pathname transitions. Query strings, fragments and unique `/quiz/…` attempt IDs are excluded from the URLs sent by this code. The route is reported as `/quiz/attempt`. The initial referrer retains only its HTTP(S) origin, such as `https://www.google.com` or `https://www.bing.com`, so search-engine referral information remains available for organic attribution without sending the referrer's path, query, fragment or credentials. Subsequent Next.js page views use the previous sanitised virtual page URL as their referrer. GA4's account-side attribution still needs verification after deployment. Query-based campaign parameters are intentionally excluded and are not preserved by this implementation.

`lib/analytics.ts` sends a small allowlist of parameters. It never sends answers, question text, nicknames, contact details or the app's attempt ID. Google Analytics itself uses its normal browser identifiers after opt-in. Test starts/completions/resumes are deduplicated within the browser tab across rerenders and reloads, with a bounded session record of the most recent 250 event keys. The IDs in that local deduplication record are not transmitted to GA. Cross-device or independently opened tabs are not treated as one attempt in analytics; server leaderboard integrity is unchanged.

| Event | When | Parameters |
| --- | --- | --- |
| `page_view` | Initial accepted visit and pathname changes | Sanitised `page_location`, `page_path`, page title, origin-only initial referrer or preceding sanitised virtual page |
| `category_click` | Category links on the homepage and same-site navigation | `test_category`, `link_placement` |
| `test_start` | A valid test starts in shared quiz, public test quiz or Daily Challenge | `test_id`, `test_category`, `question_count`, `test_mode` |
| `test_resume` | A saved quiz or active Daily Challenge is restored | Same test parameters |
| `test_complete` | A test has been scored successfully | Same test parameters plus `correct_count`, `incorrect_count`, `unanswered_count`, `score_percent`, `duration_seconds`, `timed_out` |

Only the shared quiz has a switchable untimed practice mode. Daily Challenge and public legacy quizzes are timed and reported as `exam`, including an unranked timed Challenge retry. Shared quiz duration includes time away from the page; Daily Challenge duration comes from the server, while public quiz duration is its timer's elapsed value. Do not compare duration across these modes as if they measured identical activity.

No retrospective `test_start` is fabricated when someone opts in halfway through an attempt or returns to an old result. Late opt-in, ad blockers, page exits, browser storage restrictions and period boundaries can therefore produce completions without a start in the reporting period. These are analytics limitations, not changes to test scoring.

## Account-side verification after a reviewed Production release

1. In GA4 **Admin → Data streams**, open the web stream for EnglishMeter and confirm its ID is `G-Z4658W17W5`.
2. Inspect **Enhanced measurement**. This code owns page views on client-side navigation. Disable the automatic page-view measurement for browser history changes to avoid a second event for each navigation. Disable automatic site-search and form-interaction measurement if it would collect free-form text or contact form activity; the custom test events do not need them. Account settings cannot be verified from source code.
3. Create event-scoped custom dimensions for `test_id`, `test_category`, `test_mode` and `link_placement`. Create custom metrics for the count/score/duration fields only if the reports require them. Do not register attempt IDs, nicknames or answers as dimensions.
4. Check the site's cookie preferences: declining analytics should produce no GA requests; allowing it should load the configured tag; changing back should stop custom events and expire this site's GA cookies. Tests should work in every case.
5. With a deliberate test visit after deployment, use Google Tag Assistant/GA Realtime or a controlled DebugView session. Check one `test_start`, one `test_complete`, category clicks and one page view per actual navigation. Repeat finish actions and refresh the result to check deduplication. Do not enable global `debug_mode` for all visitors.
6. Mark `test_complete` as a key event if completion is the chosen product goal. Receiving an event in a local mock is not proof that Google received it; verify account-side delivery after publication.

## Report structure

Use the same reporting timezone and date ranges for comparisons. Keep the first deployment date as an annotation because opt-in tracking changes the measured population. Compare like-for-like 28-day periods and include year-over-year views where useful; do not compare newly consented measurements directly with the old unconditional collection as a traffic-growth claim.

### GA4: useful tests and completion

- **Category discovery:** `category_click` count by `test_category` and `link_placement`, with device category and source/medium.
- **Completion funnel:** use a closed funnel `test_start → test_complete`, filtered to the **same `test_id` in both steps**. Segment by `test_mode`, mobile/desktop and organic traffic. The resulting rate is the share of measured starters who complete within the chosen funnel window; it is not a unique server-attempt audit.
- **Event-level comparison:** show starts, resumes and completions side by side by test/category. A simple `completions ÷ starts` ratio is directional and can exceed 100% across date boundaries or returning attempts; label it clearly instead of presenting it as an exact cohort completion rate.
- **Return use:** compare returning measured users, resumed attempts and repeated completions over time. Local study goals and saved answers are not uploaded.
- **Friction:** investigate tests with many starts and few completions, especially on mobile, together with loading/interaction evidence. Do not infer a bad question from the completion rate alone.

### Search Console: prioritisation sheet

Export **Performance → Search results** for Web search, then keep one row per page/query/country/device combination. Compare the latest 28 days with the previous 28 days. Include only real exported values.

| Field | Source / use |
| --- | --- |
| Page URL, query, country, device | Search Console dimensions |
| Clicks, impressions, CTR, average position | Actual Search Console export |
| Previous-period values and differences | Same filters/date length |
| Canonical URL / indexing status | URL Inspection and Pages report |
| Search intent and destination | Placement, grammar, vocabulary, exam practice or reading |
| Issue and evidence | For example duplicate intent, low CTR with relevant impressions, or broken indexing |
| Proposed action and owner | One specific title/content/link/performance change |
| Change date and follow-up date | Recheck after sufficient recrawling and comparable impressions |

Prioritise relevant pages already gaining impressions around positions 8–20; high impressions with unusually low CTR relative to comparable queries; overlapping URLs competing for the same intent; and mobile pages with meaningful test traffic but weak completion. These are triage rules, not evidence that any current URL fits those groups.

In **Sitemaps**, submit `https://www.englishmeter.net/sitemap.xml` and inspect its fetch status and discovered URLs. Use URL Inspection for representative landing pages, not to judge whether the XML file itself should appear in search results. Review the **Core Web Vitals** report for field LCP/INP/CLS; Lighthouse lab measurements do not supply real-user INP. If the property lacks enough field samples, record that limitation instead of replacing it with lab numbers.

## Validation performed in this workspace

`tests/analytics.test.ts` verifies parameter allowlists, valid score totals, URL sanitisation, category mapping, deployment/consent gating, duplicate-event suppression and absence of private attempt IDs in emitted events. Browser validation and whole-project lint/typecheck/build results are recorded in the main implementation report. No live GA/GSC delivery or traffic measurement has been claimed.
