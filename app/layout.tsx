// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'EnglishMeter — CEFR English Test',
  description: 'Find your real English level in minutes. CEFR-based online test.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en">
      <body>

        {/* ============ GOOGLE ANALYTICS ============ */}
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
        {/* ========================================= */}

        <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
          <div className="container flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand text-white font-bold flex items-center justify-center">EM</div>
              <div className="font-semibold">EnglishMeter</div>
            </div>
            <nav className="hidden sm:flex gap-6 text-sm">
              <a href="/" className="hover:text-brand">Home</a>
              <a href="/start" className="hover:text-brand">Start Test</a>
              <a href="/result" className="hover:text-brand">Result</a>
              <a href="/contact" className="hover:text-brand">Contact</a>
            </nav>
          </div>
        </header>

        <main className="container py-8">{children}</main>

        <footer className="border-t mt-16">
          <div className="container py-8 text-sm text-slate-500 flex items-center justify-between">
            <div>© 2025 EnglishMeter</div>
            <div className="flex gap-4">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
