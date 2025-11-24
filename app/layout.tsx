// app/layout.tsx → Footer'ı mükemmel hâle getirilmiş versiyon
import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Mail, Globe, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export const metadata: Metadata = {
  title: 'EnglishMeter — CEFR English Test',
  description: 'Find your real English level in minutes. CEFR-based online test.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-between py-4 px-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-lg">
                EM
              </div>
              <div className="text-xl font-bold text-gray-900">EnglishMeter</div>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="/" className="text-gray-700 hover:text-blue-600 transition">Home</a>
              <a href="/start" className="text-gray-700 hover:text-blue-600 transition">Start Test</a>
              <a href="/result" className="text-gray-700 hover:text-blue-600 transition">My Result</a>
              <a href="/contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto py-10 px-4">{children}</main>

        {/* YENİ PREMİUM FOOTER */}
        <footer className="bg-gray-900 text-gray-300 mt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              {/* Logo & Açıklama */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xl shadow-xl">
                    EM
                  </div>
                  <h3 className="text-2xl font-bold text-white">EnglishMeter</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-400">
                  Accurate CEFR-based English level test. Discover your real level in just minutes.
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <a href="mailto:support@englishmeter.net" className="text-blue-400 hover:text-blue-300 transition">
                    support@englishmeter.net
                  </a>
                </div>
              </div>

              {/* Hızlı Linkler */}
              <div>
                <h4 className="text-white font-semibold mb-5 text-lg">Quick Links</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="/" className="hover:text-white transition">Home</a></li>
                  <li><a href="/start" className="hover:text-white transition">Start Test</a></li>
                  <li><a href="/levels/A1" className="hover:text-white transition">Level Tests</a></li>
                  <li><a href="/race/1" className="hover:text-white transition">Speed Races</a></li>
                </ul>
              </div>

              {/* Yasal */}
              <div>
                <h4 className="text-white font-semibold mb-5 text-lg">Legal</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-white transition">Terms of Service</a></li>
                  <li><a href="/cookie" className="hover:text-white transition">Cookie Policy</a></li>
                </ul>
              </div>

              {/* Sosyal Medya */}
              <div>
                <h4 className="text-white font-semibold mb-5 text-lg">Follow Us</h4>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-sky-500 transition">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-red-600 transition">
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span>Available in English</span>
                </div>
              </div>
            </div>

            {/* Alt Kısım */}
            <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500">
              <p>
                © 2025 <span className="text-white font-semibold">EnglishMeter</span>. All rights reserved.
                <span className="mx-4">•</span>
                Made with <span className="text-red-500">♥</span> for English learners
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
