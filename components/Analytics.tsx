'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import {
  ANALYTICS_PREFERENCES_EVENT, GA_MEASUREMENT_ID, configureAnalytics,
  initializeAnalytics, readAnalyticsConsent, setAnalyticsConsent, isAnalyticsHost,
  trackCategoryClick, trackPageView, categoryForAnalyticsPath, type AnalyticsConsent,
} from '@/lib/analytics';

/** No Google Analytics requests are made by this component in local or Preview builds. */
export default function Analytics({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const lastPage = useRef<string | null>(null);

  useEffect(() => {
    const active = enabled && isAnalyticsHost(window.location.hostname);
    configureAnalytics(active);
    setTrackingEnabled(active);
    const stored = readAnalyticsConsent();
    const preference = stored ?? ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl || navigator.doNotTrack === '1' ? 'denied' : null);
    if (preference) setAnalyticsConsent(preference);
    if (active && preference === 'granted') initializeAnalytics();
    setConsent(preference);
    setShowPreferences(active && preference === null);
    const open = () => setShowPreferences(true);
    window.addEventListener(ANALYTICS_PREFERENCES_EVENT, open);
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const tracked = event.target.closest<HTMLElement>('[data-analytics-category]');
      if (tracked?.dataset.analyticsCategory) {
        trackCategoryClick({ categoryId: tracked.dataset.analyticsCategory, placement: tracked.dataset.analyticsPlacement || 'navigation' });
        return;
      }
      const link = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.origin !== window.location.origin) return;
      const category = categoryForAnalyticsPath(link.pathname);
      if (category) trackCategoryClick({ categoryId: category, placement: link.closest('footer') ? 'footer' : link.closest('nav') ? 'navigation' : 'content' });
    };
    document.addEventListener('click', onClick);
    return () => { window.removeEventListener(ANALYTICS_PREFERENCES_EVENT, open); document.removeEventListener('click', onClick); };
  }, [enabled]);

  useEffect(() => {
    if (!trackingEnabled || consent !== 'granted' || !pathname || lastPage.current === pathname) return;
    if (trackPageView(pathname)) lastPage.current = pathname;
  }, [trackingEnabled, consent, pathname]);

  function choose(value: AnalyticsConsent) {
    setAnalyticsConsent(value);
    if (trackingEnabled && value === 'granted') initializeAnalytics();
    if (value === 'denied') lastPage.current = null;
    setConsent(value);
    setShowPreferences(false);
  }

  return <>
    {trackingEnabled && consent === 'granted' && <Script id="google-analytics-loader" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="lazyOnload" />}
    {showPreferences && <section aria-labelledby="analytics-preference-title" className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <h2 id="analytics-preference-title" className="font-bold">Usage analytics</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Allow Google Analytics to help us understand which tests are useful? Your answers and nickname are not included. Tests work with either choice. <Link href="/cookie" className="underline">Cookie details</Link></p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => choose('granted')} className="min-h-11 rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Allow analytics</button>
        <button type="button" onClick={() => choose('denied')} className="min-h-11 rounded-lg border border-slate-400 px-4 py-2 font-semibold hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-slate-800">No thanks</button>
      </div>
    </section>}
  </>;
}
