import Link from 'next/link';

export default function ChallengeNavigation() {
  return (
    <section aria-labelledby="daily-challenge-heading" className="mx-auto w-full max-w-6xl px-4 pb-10">
      <Link href="/challenge" className="flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-700 p-6 text-white shadow-lg transition hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">Daily 50 · A new challenge every day</p>
          <h2 id="daily-challenge-heading" className="mt-2 text-3xl font-black">Global English Challenge</h2>
          <p className="mt-3 max-w-2xl text-indigo-100">Test your grammar, vocabulary and reading. Finish 50 questions, choose a nickname and see your place on the daily leaderboard.</p>
          <p className="mt-3 text-sm font-semibold">50 questions · 40 minutes · Daily ranking</p>
        </div>
        <span className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3 font-bold text-indigo-900">Take today’s challenge →</span>
      </Link>
    </section>
  );
}
