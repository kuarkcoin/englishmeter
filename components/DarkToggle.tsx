'use client';

import { useEffect, useState } from 'react';

export default function DarkToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    document.documentElement.classList.toggle('dark', nextIsDark);
    localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
    setIsDark(nextIsDark);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold border border-slate-200 bg-white text-slate-900 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
