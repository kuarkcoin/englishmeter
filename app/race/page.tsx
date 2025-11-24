"use client";

import Link from "next/link";

const RACES = [
  { id: 1, title: "English Race #1", desc: "Mixed Grammar • 50Q / 50min" },
  { id: 2, title: "English Race #2", desc: "Tenses Focus • 50Q / 50min" },
  { id: 3, title: "English Race #3", desc: "Conditionals • 50Q / 50min" },
  { id: 4, title: "English Race #4", desc: "Phrasal Verbs • 50Q / 50min" },
  { id: 5, title: "English Race #5", desc: "Advanced Mixed • 50Q / 50min" },
];

export default function RaceMenuPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-black text-blue-600 mb-2 text-center">
          English Races
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Select a race and start testing your English skills.
        </p>

        <div className="grid gap-4">
          {RACES.map((race) => (
            <Link
              key={race.id}
              href={`/race/${race.id}`}
              className="block border-2 border-gray-100 rounded-xl p-4 md:p-5 hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-blue-500 mb-1">
                    RACE #{race.id}
                  </div>
                  <div className="text-lg md:text-xl font-bold text-gray-800">
                    {race.title}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{race.desc}</div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700">
                  START
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}