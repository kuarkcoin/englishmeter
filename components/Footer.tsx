// components/Footer.tsx
'use client';

import Link from 'next/link';
import { ANALYTICS_PREFERENCES_EVENT } from '@/lib/analytics';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Sol Kısım: Marka */}
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-black text-lg tracking-tight text-slate-800">
                EnglishMeter
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                Free Tests
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              Online English grammar tests, CEFR level quizzes (A1–C2) and quick
              placement exams to help you practise and track your progress.
            </p>
          </div>

          {/* Orta Kısım: Linkler (DÜZELTİLDİ) */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="/english-tests" className="hover:text-slate-900 transition-colors">All English Tests</Link>
            <Link href="/english-level-test" className="hover:text-slate-900 transition-colors">English Level Test</Link>
            <Link href="/ielts-grammar-tests" className="hover:text-slate-900 transition-colors">IELTS Grammar</Link>
            
            {/* EKLENDİ: About Sayfası */}
            <Link href="/about" className="hover:text-slate-900 transition-colors">
              About Us
            </Link>

            <Link href="/challenge" className="hover:text-slate-900 transition-colors">
              Global English Challenge
            </Link>
            
            <Link href="/levels/a1" className="hover:text-slate-900 transition-colors">
              Level Tests
            </Link>
            <Link href="/practice/reading" className="hover:text-slate-900 transition-colors">
              Reading
            </Link>
            <Link href="/kids" className="hover:text-slate-900 transition-colors">
              Kids English
            </Link>
            
            <Link href="/contact" className="hover:text-slate-900 transition-colors">
              Contact
            </Link>
            
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">
              Privacy
            </Link>
            
            {/* DÜZELTİLDİ: /cookies yerine /cookie (Dosya adınla aynı olmalı) */}
            <Link href="/cookie" className="hover:text-slate-900 transition-colors">
              Cookies
            </Link>
          </nav>

          {/* Sağ Kısım: Sosyal Medya */}
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
              Contact
            </span>
            <div className="flex items-center gap-3">
              <Link href="/contact" className="min-h-11 inline-flex items-center text-sm underline hover:text-slate-900">Contact form</Link>
              <a
                href="mailto:muratot79@gmail.com"
                aria-label="Email"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-900 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor" d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 2v.2l8 4.6 8-4.6V8l-8 4.6L4 8z" />
                </svg>
              </a>
            </div>
            <p className="text-[11px] text-slate-600">
              © {year} EnglishMeter. All rights reserved.
            </p>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-6 border-t border-slate-100 pt-4 text-[11px] text-slate-600 text-left md:text-center">
          Optional usage analytics helps us improve our tests.{' '}
          <button type="button" onClick={() => window.dispatchEvent(new Event(ANALYTICS_PREFERENCES_EVENT))} className="min-h-11 px-2 underline hover:text-slate-700">Analytics preferences</button>
          {' '}<Link href="/cookie" className="underline">Cookies and advertising details</Link>
        </div>
      </div>
    </footer>
  );
}
