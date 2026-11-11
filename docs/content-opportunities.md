# Content and search-intent audit — 11 November 2026

This report is based on repository content and route behaviour, not Search Console query data or paid keyword volumes. The approximately 5,000 monthly visits are the owner's estimate. No ranking or traffic increase is guaranteed. Existing question banks, answer keys, test durations and scoring have not been edited for this content work.

## Category decisions and implemented improvements

| Area | Main existing search intent and preferred entry | What changed / what to measure next |
| --- | --- | --- |
| English Grammar Tests | `/grammar`: find a grammar topic or level; `/levels/{level}/{topic}`: learn and practise that specific point | Added clear mixed-versus-focused guidance, exam links and collection/breadcrumb markup. Three previously thin grammar guides now contain worked examples taken unchanged from their existing tests. |
| English Vocabulary Tests | `/vocabulary-tests`: choose a practice format; `/vocabulary`: look up English words with Turkish meanings | Explicitly separated sentence context, word formation and translated recall. Added B1–C1 challenge and phrasal-verb links; replaced the misleading “3750 Pack” label/link with the existing accessible mini-test hub. |
| English Level Tests A1–C2 | `/levels/{level}`: level-specific topic practice; `/tests/level-{level}`: mixed practice at one known level | Mixed-set titles now say “English Practice Test” and explain that a single-level score is not a complete placement assessment. Existing A1–C1 20-question and C2 10-question topic formats stay unchanged. |
| English Placement Test | `/english-level-test`: estimate a starting level from the existing A1–C2 mixed placement test | Added links from grammar and single-level tests. Keep this page as the primary placement entry; do not create a second near-identical “free placement test” page. |
| YDS Preparation | New `/yds-preparation`: choose a mock exam or a skill | One substantive hub now links all 32 existing mock tests, grammar, reading, connectors, synonyms, phrasal verbs and vocabulary. Public mock-test titles distinguish independent practice from official ÖSYM papers. No YDS question or answer was changed. |
| IELTS Preparation | `/ielts-grammar-tests`: short focused grammar sets; `/tests/ielts-grammar`: existing longer mixed set | Kept both useful formats and their cross-link. Guidance states that IELTS has no separate grammar paper and these practice scores are not IELTS band scores. No AI writing/listening feature was added. |
| Phrasal Verbs | `/levels/b1/common-phrasal-verbs`: meaning in English contexts; `/tests/yds-phrasal-verbs`: English-to-Turkish recall | Added the B1 context route to the directory and vocabulary/daily links. Existing YDS phrasal test guidance explicitly identifies Turkish meanings. A new duplicate phrasal keyword page is unnecessary. |
| Daily English | `/daily-english`: choose a word list; `/daily-english/test-N`: bilingual study list; `/tests/daily-english-N`: timed recall quiz | Resolved 43 duplicate title pairs: lists now say “Daily English Word List N – Turkish Meanings”; quizzes say “Daily English Vocabulary Quiz N”. Both retain their URLs/self canonicals because their visible content and tasks differ. Word-list markup is CollectionPage, not Quiz, with reciprocal list/quiz links. |
| Reading Comprehension | `/practice/reading`: A1–C1 passage practice; YDS and TOEIC routes: exam-oriented formats | Directory and YDS/grammar guidance connect general-level reading with relevant exam practice. Existing passage examples already provide the necessary context. Do not market grammar-only IELTS practice as a complete IELTS reading section. |
| Advanced English | `/advanced-tests`: ten longer mixed B2–C1 sets; `/levels/c1` and `/levels/c2`: focused higher-level topics | Added a short revision plan and level/word-formation links. Removed bank imports from the advanced hub's client component; the server passes only IDs, counts and durations. Existing local best/latest results remain. |

## Cross-site content changes

- `/english-tests` now exposes the priority level, grammar, vocabulary, IELTS and YDS entries, followed by reading and other existing categories. It also exposes Daily English, common phrasal verbs and Advanced English.
- Public `/tests/{slug}` pages now contain a meaningful topic-specific purpose, study approach, worked questions using existing explanations, related practice and visible breadcrumbs. The running quiz is still above the extended study material. Worked answers stay collapsed until requested.
- `/test-conditionals`, `/test-perfect-tenses` and `/test-relatives` are now identifiable study guides with examples. `/tests/test-*` remains the timed-quiz entry. Both keep their existing paths and link to one another.
- Collection, WebPage, Quiz and BreadcrumbList data describe visible content. No fake review, rating, course certificate, official exam affiliation or FAQ rich-result promise was added.

## Search-intent overlap to monitor

| Potential overlap | Current decision | When to reconsider |
| --- | --- | --- |
| Homepage vs `/english-tests` | Homepage introduces the platform and prioritises actions; directory compares the full catalogue. Titles and visible purpose differ. | In Search Console, if both repeatedly swap positions for the same catalogue query without helping clicks, strengthen the directory's internal anchor text and homepage summary before considering consolidation. |
| Placement page vs six level hubs | Placement estimates a starting point; hubs teach specific-level topics. | Check whether “English level test” queries land on a single-level practice page and underperform; improve intent labels/links, not the underlying questions. |
| Grammar guides vs timed quizzes | Guides teach with worked examples; quizzes offer an immediate timed attempt. | Compare query groups for “rules/examples” versus “test/quiz”. Consolidate only if the content becomes functionally identical, using a deliberate redirect and sitemap update. |
| Daily word lists vs quizzes | Same vocabulary, different learning task; unique titles, visible list-versus-quiz intent and reciprocal links. | Compare study-list and quiz query impressions. Do not merge solely because a shared vocabulary set appears on both pages. |
| `/yds-3750` vs `/yds-5000-mini` | Existing legacy URLs remain; new navigation favours `/yds-5000-mini`. | The older hub has a demo premium gate and different start logic. Product ownership must decide the supported access model before any redirect or retirement. Its question flow is deliberately unchanged here. |
| General advanced vs Cambridge/IELTS | General sets mix grammar/vocabulary; exam sections name the limited practice task honestly. | Avoid publishing another generic “advanced grammar test” landing with the same text/tests. Use GSC demand to improve the strongest existing route. |

## Prioritised editorial opportunities after measurement

1. **Use real query/page exports first.** Review the last 28 and 90 days by query, page, country and device. Prioritise pages with relevant impressions, positions approximately 4–20 and below-baseline click-through rates. Compare within the same intent/device group; there is no reliable universal CTR target.
2. **Improve explanations where the existing bank lacks them.** Some legacy questions have an answer key but no detailed rationale. This task preserves those records. A separately approved editorial pass should identify missing explanations, fact-check them and retain the original keys. Do not auto-generate an explanation that might contradict the key.
3. **Strengthen high-impression narrow guides.** If actual queries show confusion about a contrast such as present perfect versus past simple or defining versus non-defining clauses, expand the matching existing guide with a short contrasting example and common error. Avoid word-count padding and avoid new routes that repeat a current topic page.
4. **Validate C2 expectations.** Existing C2 topics are short practice sets. Present their scope accurately; assess demand before commissioning longer C2 reading or mixed practice content. No new questions were commissioned in this task.
5. **Review bilingual vocabulary usefulness before scaling.** Translate complete, useful entries and maintain language-equivalent mapping; do not generate thousands of near-identical pages merely for keyword variants. Check index coverage, impressions and actual engagement by locale.
6. **Improve trust information through real editorial facts.** Add author/editor credentials and a review process only when the owner can supply verifiable information. Do not invent expertise, review dates or affiliations.

## Remaining product observations

- Advanced tests still start through the existing `/?restart=adv-test-N` workflow. The hub is crawlable and lighter; adding individual indexed advanced landing pages would need an explicit purpose and unique useful content, not a route for each keyword.
- Timed public quizzes and the shared `/start` quiz flow are different existing components. A study guide links to both where useful, and the UI identifies timed versus untimed behaviour.
- Indexing and search snippets remain Google's decisions. Sitemap inclusion and valid structured data make content easier to discover and understand; neither guarantees indexing or an enhanced result.
