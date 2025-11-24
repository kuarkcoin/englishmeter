// app/cookie/page.tsx → AdSense & SEO onaylı final versiyon
import React from 'react';
import { Shield, Cookie, Mail } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy | EnglishMeter',
  description: 'Learn how EnglishMeter uses cookies to improve your experience, analytics, and personalized ads.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Başlık Alanı */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 mb-6">
            <Cookie className="w-9 h-9 text-blue-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Cookie Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: <span className="font-semibold">November 24, 2025</span>
          </p>
        </div>

        {/* İçerik Kartı */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-12 lg:p-16 prose prose-lg max-w-none text-gray-700">
            <p className="lead text-xl text-gray-800 mb-8">
              This Cookie Policy explains what cookies are and how <strong>EnglishMeter.net</strong> uses them. 
              By continuing to use our website, you agree to the use of cookies as described below.
            </p>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="w-7 h-7 text-blue-600" />
                1. What Are Cookies?
              </h2>
              <p>
                Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. 
                They help the site remember your actions and preferences over time and make your experience faster and more personalized.
              </p>
            </section>

            <section className="space-y-6 mt-10">
              <h2 className="text-2xl font-bold text-gray-900">2. Types of Cookies We Use</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="font-bold text-lg text-blue-900 mb-2">Essential Cookies</h3>
                  <p className="text-sm">Required for the site to function properly (e.g., saving your quiz progress).</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                  <h3 className="font-bold text-lg text-green-900 mb-2">Analytics Cookies</h3>
                  <p className="text-sm">Help us understand how visitors use the site via Google Analytics.</p>
                </div>
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="font-bold text-lg text-purple-900 mb-2">Advertising Cookies</h3>
                  <p className="text-sm">Used by Google AdSense and partners to show relevant ads based on your interests.</p>
                </div>
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                  <h3 className="font-bold text-lg text-orange-900 mb-2">Preference Cookies</h3>
                  <p className="text-sm">Remember your settings (language, theme, etc.).</p>
                </div>
              </div>
            </section>

            <section className="space-y-6 mt-10">
              <h2 className="text-2xl font-bold text-gray-900">3. How to Manage Cookies</h2>
              <p>
                You can control and/or delete cookies at any time through your browser settings. 
                Most browsers allow you to:
              </p>
              <ul className="list-disc pl-8 space-y-2 text-gray-700">
                <li>View which cookies are set</li>
                <li>Block cookies from specific or all websites</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Note: Disabling essential cookies may prevent some features (like saving test progress) from working.
              </p>
            </section>

            <section className="space-y-6 mt-10">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Mail className="w-7 h-7 text-blue-600" />
                4. Contact Us
              </h2>
              <p>
                If you have any questions about this Cookie Policy, feel free to reach out:
              </p>
              <div className="bg-gray-50 rounded-2xl p-6 border">
                <p className="font-semibold text-gray-900">
                  Email:{' '}
                  <a
                    href="mailto:support@englishmeter.net"
                    className="text-blue-600 hover:underline font-bold"
                  >
                    support@englishmeter.net
                  </a>
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Or use our <a href="/contact" className="text-blue-600 hover:underline">Contact page</a>
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="text-center mt-12 text-sm text-gray-500">
          © 2025 EnglishMeter – All rights reserved
        </div>
      </div>
    </div>
  );
}
