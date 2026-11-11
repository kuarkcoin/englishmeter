import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: November 11, 2026</p>

        <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
          <p>
            Welcome to <strong>EnglishMeter.net</strong>. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.
          </p>

          <h3 className="text-xl font-bold text-slate-900">1. Information We Collect</h3>
          <p>
            We currently do not require users to create an account to use our tests. However, we may collect:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Log Data:</strong> Hosting services may process technical request information, including the IP address, browser type and requested page, to operate the website.</li>
            <li><strong>Cookies:</strong> We use cookies to improve your experience and to analyze our traffic.</li>
            <li><strong>Study progress:</strong> Practice attempts, saved answers, study goals and progress may be stored in your browser so you can continue later. Clearing browser storage removes these local records.</li>
            <li><strong>Daily challenge:</strong> Challenge attempts and results are saved on the server. A first-party cookie identifies your browser. If you choose to publish a nickname, that nickname and the associated score and rank appear publicly on the daily leaderboard.</li>
            <li><strong>Contact form:</strong> Your name, email address and message are sent through our email provider, Resend, so we can respond. A copy may also be saved in our administrative inbox.</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900">2. Google AdSense & Analytics</h3>
          <p>
            We use third-party services such as <strong>Google Analytics</strong> and <strong>Google AdSense</strong>.
          </p>
          <p>
            Google Analytics loads only after you allow usage analytics. You can decline or change this choice using “Analytics preferences” in the footer. Our test events contain the test category, question count, aggregate result and time used; they do not contain your answers, question text, nickname or email address. Page measurements omit query strings and unique quiz attempt IDs. Local test progress and the daily challenge work independently of this optional analytics choice. Advertising preferences are separate; the analytics control does not manage AdSense settings.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Google AdSense uses cookies to serve ads based on a user&apos;s prior visits to this website or other websites.</li>
            <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads based on visits to this site and other sites on the Internet.</li>
            <li>Users may opt-out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="nofollow" className="text-blue-600 hover:underline">Google Ads Settings</a>.</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900">3. Links to Other Sites</h3>
          <p>
            Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party’s site. We strongly advise you to review the Privacy Policy of every site you visit.
          </p>

          <h3 className="text-xl font-bold text-slate-900">4. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us via our contact page.
          </p>
        </div>
      </div>
    </div>
  );
}
