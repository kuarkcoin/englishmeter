'use client';

import Link from 'next/link';

export default function VerbSenseHome() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Top Bar */}
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
            A short daily game to test your instinct for
            <span className="text-slate-900 font-black"> natural verbs </span>
            used in real spoken English.
          </p>

          <p className="mt-2 text-slate-500 font-semibold text-sm">
            No grammar rules. No translation. Just native-like choices.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="w-full max-w-3xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl">🧩</div>
            <h3 className="mt-2 font-black text-slate-900">
              Fill the verb
            </h3>
            <p className="mt-1 text-slate-500 font-semibold text-sm">
              A sentence appears with a missing verb.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl">⚡</div>
            <h3 className="mt-2 font-black text-slate-900">
              Trust your instinct
            </h3>
            <p className="mt-1 text-slate-500 font-semibold text-sm">
              Choose the verb that sounds natural in daily English.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl">🏆</div>
            <h3 className="mt-2 font-black text-slate-900">
              Learn & improve
            </h3>
            <p className="mt-1 text-slate-500 font-semibold text-sm">
              Instant feedback with real spoken explanations.
            </p>
          </div>
        </div>
      </div>

      {/* Modes */}
      <div className="w-full max-w-3xl mx-auto px-4 mt-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
          <h2 className="text-xl font-black text-slate-900">
            Choose a mode
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Classic */}
            <Link
              href="/verbsense/play"
              className="group rounded-3xl border border-slate-200 bg-white p-5 hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              <div className="text-2xl">🎯</div>
              <h3 className="mt-2 font-black text-slate-900">
                Classic Mode
              </h3>
              <p className="mt-1 text-slate-500 font-semibold text-sm">
                10 questions · No time pressure · Learn as you play
              </p>
              <div className="mt-3 font-black text-indigo-600 group-hover:underline">
                Play →
              </div>
            </Link>

            {/* Speed */}
            <div className="relative rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 opacity-60">
              <div className="absolute top-4 right-4 text-[10px] font-black bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                Coming Soon
              </div>
              <div className="text-2xl">⚡</div>
              <h3 className="mt-2 font-black text-slate-900">
                Speed Mode
              </h3>
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
          A2–C1 · Daily spoken English · 2–3 minutes
        </p>
      </div>
    </div>
  );
}