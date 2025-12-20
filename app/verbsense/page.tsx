'use client';

import Link from 'next/link';

export default function VerbSenseHomePage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Top bar */}
      <div className="w-full max-w-3xl mx-auto px-4 pt-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-slate-500 hover:text-slate-900 font-black flex items-center gap-2"
        >
          <span className="inline-flex w-9 h-9 rounded-2xl bg-white border border-slate-200 items-center justify-center">
            ←
          </span>
          Home
        </Link>

        <div className="px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 font-extrabold text-sm">
          🔤 Verb Sense
        </div>
      </div>

      {/* Hero */}
      <div className="w-full max-w-3xl mx-auto px-4 mt-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 text-[11px] font-black uppercase tracking-wider">
            Spoken English Game
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            Verb Sense
          </h1>

          <p className="mt-3 text-slate-600 font-semibold text-base md:text-lg leading-relaxed">
            Choose the verb that sounds natural in real spoken English.
            <br />
            <span className="text-slate-900 font-black">
              No grammar rules. Just instinct.
            </span>
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-extrabold">
              A2–C1 Levels
            </div>
            <div className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-extrabold">
              2–3 min per run
            </div>
            <div className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-extrabold">
              Daily collocations
            </div>
          </div>
        </div>
      </div>

      {/* Example card */}
      <div className="w-full max-w-3xl mx-auto px-4 mt-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="text-[11px] text-slate-500 font-black uppercase tracking-wider">
            Example
          </div>

          <div className="mt-3 text-2xl md:text-3xl font-black text-slate-900 leading-snug">
            I’ll <span className="text-indigo-600">___</span> you later.
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 font-extrabold text-slate-900">
              say
            </div>
            <div className="rounded-3xl border border-emerald-300 bg-emerald-50 px-5 py-4 font-extrabold text-emerald-800">
              call ✅
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 font-extrabold text-slate-900">
              speak
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-500 font-semibold">
            “Call you later” is the natural spoken phrase.
          </div>
        </div>
      </div>

      {/* Modes */}
      <div className="w-full max-w-3xl mx-auto px-4 mt-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
          <h2 className="text-xl font-black text-slate-900">Choose a mode</h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Classic */}
            <Link
              href="/verbsense/play"
              className="group rounded-3xl border border-slate-200 bg-white p-5 hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              <div className="text-2xl">🎯</div>
              <h3 className="mt-2 font-black text-slate-900">Classic Mode</h3>
              <p className="mt-1 text-slate-500 font-semibold text-sm">
                10 questions · Instant feedback · Learn collocations
              </p>
              <div className="mt-3 font-black text-indigo-600 group-hover:underline">
                Start →
              </div>
            </Link>

            {/* Speed (Coming Soon) */}
            <div className="relative rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 opacity-70">
              <div className="absolute top-4 right-4 text-[10px] font-black bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                Coming Soon
              </div>
              <div className="text-2xl">⚡</div>
              <h3 className="mt-2 font-black text-slate-900">Speed Mode</h3>
              <p className="mt-1 text-slate-500 font-semibold text-sm">
                Beat the clock and build combos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="w-full max-w-3xl mx-auto px-4 mt-8">
        <Link
          href="/verbsense/play"
          className="block w-full text-center rounded-3xl bg-slate-900 text-white font-black text-lg py-5 hover:bg-slate-800 active:scale-[0.98]"
        >
          ▶ Start Playing Verb Sense
        </Link>

        <p className="mt-3 text-center text-xs text-slate-400 font-semibold">
          If Start opens a blank page, create <b>app/verbsense/play/page.tsx</b>.
        </p>
      </div>
    </div>
  );
}