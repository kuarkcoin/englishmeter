import { buildSeoMetadata } from '@/lib/seo';
// app/cookie/page.tsx
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = buildSeoMetadata({
  "title": "Cookie Policy",
  "description": "Learn how EnglishMeter uses cookies for website preferences, analytics and advertising.",
  "path": "/cookie"
});

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm p-8 sm:p-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
             {/* Cookie Icon */}
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
          <p className="text-gray-500 mt-2">Last updated: November 11, 2026</p>
        </div>
        
        <div className="prose prose-blue max-w-none text-gray-600">
          <p>
            This Cookie Policy explains how EnglishMeter uses cookies and similar technologies to recognize you when you visit our website.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">What are cookies?</h3>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">How can I control cookies?</h3>
          <p>
            Google Analytics measures visits by default. You can turn it off or on using “Analytics preferences” in the footer. Choosing “No thanks” stops analytics and does not prevent you from taking tests. Explicit choices are saved in this browser. If you have not saved a choice, a Do Not Track or Global Privacy Control signal from your browser keeps analytics off.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">What is measured?</h3>
          <p>
            When analytics is enabled, we measure page visits, category clicks, test starts, resumed tests and completions, including aggregate scores and time used. We do not send your answers, question text, nickname or email address in these test events. Page measurements exclude URL query strings and random quiz attempt IDs.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Test progress and advertising</h3>
          <p>
            Test progress, settings and unfinished practice attempts may be stored locally so you can continue in this browser. The daily challenge also uses a first-party cookie to recognise your attempt. These features work separately from optional usage analytics. Advertising is provided by Google AdSense; the analytics preference controls Google Analytics and does not manage advertising preferences. See our <a href="/privacy" className="text-blue-700 underline">privacy policy</a> for advertising information. You can also manage cookies using your browser controls.
          </p>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
             <p className="text-sm text-blue-800 font-medium">Contact us</p>
             <a href="/contact" className="text-sm text-blue-600 underline">Contact EnglishMeter</a>
          </div>
        </div>
      </div>
    </div>
  );
}
