/** Usage events intentionally exclude answers, question text, nicknames and user IDs. */
export const GA_MEASUREMENT_ID = 'G-Z4658W17W5';
export const ANALYTICS_CONSENT_KEY = 'em_analytics_consent_v1';
export const ANALYTICS_PREFERENCES_EVENT = 'englishmeter:analytics-preferences';
const DEDUP_KEY = 'em_analytics_events_v1';

export type AnalyticsConsent = 'granted' | 'denied';
export type TestAnalyticsInput = {
  testId: string;
  category: string;
  questionCount: number;
  mode: 'exam' | 'practice';
  /** Used only for local deduplication; never included in Google Analytics parameters. */
  attemptId: string;
};
export type TestCompletionInput = TestAnalyticsInput & {
  correct: number;
  incorrect: number;
  unanswered: number;
  durationSeconds: number;
  timedOut: boolean;
};
type EventParameters = Record<string, string | number | boolean>;
type Gtag = (...args: unknown[]) => void;
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: Gtag };
let enabled = false;
let initialized = false;
let inMemoryConsent: AnalyticsConsent | null = null;
let previousPageLocation: string | null = null;
const emitted = new Set<string>();

export function isAnalyticsHost(hostname: string): boolean {
  return hostname === 'englishmeter.net' || hostname === 'www.englishmeter.net';
}

function slug(value: string) {
  return typeof value === 'string' && /^[a-z0-9][a-z0-9_-]{0,99}$/i.test(value) ? value.toLowerCase() : null;
}

export function getAnalyticsCategory(testId: string): string {
  if (testId === 'quick-placement') return 'placement';
  if (/^yds[-_]/.test(testId)) return 'yds';
  if (/^level[-_]/.test(testId)) return 'level';
  for (const category of ['cambridge-use-of-english', 'business-english', 'word-formation', 'ielts-grammar', 'toeic-reading', 'vocabulary', 'reading', 'kids']) {
    if (testId.startsWith(`practice-${category}-`)) return category;
  }
  if (/^adv[-_]|^advanced/.test(testId)) return 'advanced';
  if (/^daily[-_]/.test(testId)) return 'daily-english';
  if (/^ielts/.test(testId)) return 'ielts';
  return 'general';
}

const categoryPaths: Record<string, string> = {
  '/english-level-test': 'placement', '/grammar': 'grammar', '/vocabulary-tests': 'vocabulary',
  '/practice/vocabulary': 'vocabulary', '/ielts-grammar-tests': 'ielts-grammar', '/yds-preparation': 'yds',
  '/yds-3750': 'yds', '/yds-5000-mini': 'yds', '/practice/reading': 'reading', '/daily-english': 'daily-english',
  '/advanced-tests': 'advanced', '/practice/word-formation': 'word-formation', '/kids': 'kids',
  '/business-english-tests': 'business-english', '/toeic-reading-tests': 'toeic-reading',
  '/cambridge-english-tests': 'cambridge-use-of-english', '/challenge': 'daily-challenge',
};
export function categoryForAnalyticsPath(path: string): string | null {
  const pathname = analyticsPath(path).replace(/\/$/, '') || '/';
  return categoryPaths[pathname] ?? (/^\/levels\/[abc][12]$/.test(pathname) ? 'level' : null);
}

export function buildTestEventParameters(input: TestAnalyticsInput): EventParameters | null {
  const testId = slug(input.testId);
  const category = slug(input.category);
  if (!testId || !category || !Number.isSafeInteger(input.questionCount) || input.questionCount < 1 || input.questionCount > 1000 || !['exam', 'practice'].includes(input.mode)) return null;
  return { test_id: testId, test_category: category, question_count: input.questionCount, test_mode: input.mode };
}

export function buildCompletionParameters(input: TestCompletionInput): EventParameters | null {
  const base = buildTestEventParameters(input);
  const counts = [input.correct, input.incorrect, input.unanswered];
  if (!base || !counts.every((value) => Number.isSafeInteger(value) && value >= 0) || counts.reduce((a, b) => a + b, 0) !== input.questionCount || !Number.isFinite(input.durationSeconds) || input.durationSeconds < 0) return null;
  return { ...base, correct_count: input.correct, incorrect_count: input.incorrect, unanswered_count: input.unanswered, score_percent: Math.round(input.correct / input.questionCount * 100), duration_seconds: Math.min(86400, Math.round(input.durationSeconds)), timed_out: Boolean(input.timedOut) };
}

/** Session URLs contain random attempt IDs; queries can contain email addresses or search input. */
export function analyticsPath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0];
  if (!pathname.startsWith('/') || pathname.startsWith('//')) return '/';
  if (/^\/quiz(?:\/|$)/.test(pathname)) return '/quiz/attempt';
  if (/^\/result(?:\/|$)/.test(pathname)) return '/result';
  return pathname;
}

/** Keep the referring site for organic attribution without copying its path or query. */
export function analyticsReferrer(referrer: string): string {
  try {
    const url = new URL(referrer);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.origin : '';
  } catch { return ''; }
}

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : inMemoryConsent;
  } catch { return inMemoryConsent; }
}

export function configureAnalytics(active: boolean) {
  enabled = active && typeof window !== 'undefined' && isAnalyticsHost(window.location.hostname);
  if (!enabled || typeof window === 'undefined') {
    previousPageLocation = null;
    return;
  }
  try {
    const previous = JSON.parse(window.sessionStorage.getItem(DEDUP_KEY) ?? '[]');
    if (Array.isArray(previous)) previous.slice(-250).forEach((key) => { if (typeof key === 'string' && key.length <= 250) emitted.add(key); });
  } catch { /* A blocked browser store never prevents a test. */ }
}

export function setAnalyticsConsent(consent: AnalyticsConsent) {
  if (typeof window === 'undefined') return;
  inMemoryConsent = consent;
  try { window.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent); } catch { /* The choice still applies to this page. */ }
  const target = window as AnalyticsWindow;
  Reflect.set(target, `ga-disable-${GA_MEASUREMENT_ID}`, consent !== 'granted');
  if (consent === 'denied') {
    target.gtag?.('consent', 'update', { analytics_storage: 'denied' });
    // Remove this site's GA cookies when someone withdraws analytics permission.
    const domains = [undefined, window.location.hostname, `.${window.location.hostname.replace(/^www\./, '')}`];
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) return;
      domains.forEach((domain) => { document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ''}; SameSite=Lax`; });
    });
  }
}

export function initializeAnalytics(): void {
  if (!enabled || typeof window === 'undefined') return;
  const target = window as AnalyticsWindow;
  Reflect.set(target, `ga-disable-${GA_MEASUREMENT_ID}`, false);
  target.dataLayer = target.dataLayer || [];
  target.gtag = target.gtag || function () { target.dataLayer!.push(arguments); };
  // This control owns Analytics only; advertising preferences are managed separately.
  target.gtag('consent', initialized ? 'update' : 'default', { analytics_storage: 'granted' });
  if (initialized) return;
  initialized = true;
  target.gtag('js', new Date());
  target.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: `${window.location.origin}${analyticsPath(window.location.pathname)}`,
    page_referrer: analyticsReferrer(document.referrer),
  });
}

function send(name: string, parameters: EventParameters, dedupKey?: string): boolean {
  if (!enabled || typeof window === 'undefined' || readAnalyticsConsent() !== 'granted') return false;
  const target = window as AnalyticsWindow;
  if (!target.gtag || Reflect.get(target, `ga-disable-${GA_MEASUREMENT_ID}`)) return false;
  if (dedupKey && emitted.has(dedupKey)) return false;
  try { target.gtag('event', name, parameters); } catch { return false; }
  if (dedupKey) {
    emitted.add(dedupKey);
    if (emitted.size > 250) emitted.delete(emitted.values().next().value!);
    try { window.sessionStorage.setItem(DEDUP_KEY, JSON.stringify([...emitted])); } catch { /* In-memory deduplication still handles React rerenders. */ }
  }
  return true;
}

export function trackTestStart(input: TestAnalyticsInput) {
  const params = buildTestEventParameters(input);
  return params ? send('test_start', params, `start:${input.attemptId}`) : false;
}
export function trackTestResume(input: TestAnalyticsInput) {
  const params = buildTestEventParameters(input);
  return params ? send('test_resume', params, `resume:${input.attemptId}`) : false;
}
export function trackTestComplete(input: TestCompletionInput) {
  const params = buildCompletionParameters(input);
  return params ? send('test_complete', params, `complete:${input.attemptId}`) : false;
}
export function trackCategoryClick(input: { categoryId: string; placement: string }) {
  const category = slug(input.categoryId);
  const placement = slug(input.placement);
  return category && placement ? send('category_click', { test_category: category, link_placement: placement }) : false;
}
export function trackPageView(path: string) {
  if (typeof window === 'undefined') return false;
  const pathname = analyticsPath(path);
  const location = `${window.location.origin}${pathname}`;
  const referrer = previousPageLocation ?? analyticsReferrer(document.referrer);
  if (enabled && readAnalyticsConsent() === 'granted') (window as AnalyticsWindow).gtag?.('set', { page_location: location, page_referrer: referrer });
  const sent = send('page_view', { page_location: location, page_path: pathname, page_title: document.title, page_referrer: referrer });
  if (sent) previousPageLocation = location;
  return sent;
}
