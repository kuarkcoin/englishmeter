import Link from 'next/link';

export default function IeltsGrammarNavigation() {
  return (
    <section id="ielts-grammar-tests" aria-labelledby="ielts-grammar-heading" className="mx-auto w-full max-w-6xl scroll-mt-36 px-4 pb-10">
      <Link href="/ielts-grammar-tests" className="group flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-cyan-950 via-sky-900 to-indigo-800 p-6 text-white shadow-lg transition hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-200">Free IELTS preparation</p>
          <h2 id="ielts-grammar-heading" className="mt-2 text-3xl font-black">IELTS Grammar Tests</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-sky-100">Build accurate sentences with focused grammar practice. Explore tenses, articles, conditionals and more, with an explanation for every answer.</p>
          <p className="mt-4 text-sm font-semibold">10 tests · 15 questions each · English explanations</p>
        </div>
        <span className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3 font-bold text-sky-900 transition group-hover:bg-cyan-50">Explore IELTS grammar →</span>
      </Link>
    </section>
  );
}
