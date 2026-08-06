'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flower2, Quote, RefreshCw, Sun, Moon, LayoutDashboard, CheckSquare, Flame, Calendar, Activity, Palette, Sliders } from 'lucide-react';

const MOTIVATION_QUOTES = [
  "Discipline equals freedom.",
  "Focus on progress, not perfection.",
  "Small daily wins compound into greatness.",
  "Your future self will thank you for today's effort.",
  "Deep work creates extraordinary results.",
  "Bloom with consistency every single day.",
];

export function Navbar() {
  const pathname = usePathname();
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem('zenflow_theme') as 'dark' | 'light') || 'dark';
    setThemeMode(savedTheme);
    document.body.className = `${savedTheme}-mode`;
  }, []);

  const toggleTheme = () => {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextTheme);
    document.body.className = `${nextTheme}-mode`;
    localStorage.setItem('zenflow_theme', nextTheme);
  };

  const rotateQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATION_QUOTES.length);
  };

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare },
    { href: '/habits', label: 'Habits', icon: Flame },
    { href: '/history', label: 'History', icon: Calendar },
    { href: '/health', label: 'Health', icon: Activity },
    { href: '/identity-kit', label: 'Identity Kit', icon: Palette },
    { href: '/curation', label: 'Curation', icon: Sliders },
  ];

  return (
    <header className="w-full bg-[var(--bg-app)] border-b border-[var(--border-app)] backdrop-blur-xl sticky top-0 z-50 px-4 md:px-8 py-4 transition-all">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Subtitle */}
        <div className="flex items-center gap-3">
          <Flower2 className="w-8 h-8 text-[#ec4899] animate-pulse" />
          <div>
            <Link href="/" className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#fbcfe8] via-[#f472b6] to-[#ec4899] bg-clip-text text-transparent">
              ZenFlow
            </Link>
            <p className="text-xs font-semibold text-[#ec4899] m-0">
              Next.js Capstone Focus Hub
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[var(--bg-input)] border border-[var(--border-card)] p-1.5 rounded-xl overflow-x-auto max-w-full">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--badge-bg)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Quote Pill & Theme Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={rotateQuote}
            className="hidden lg:flex items-center gap-2 bg-[var(--badge-bg)] border border-[var(--border-card)] rounded-full px-3.5 py-1.5 text-xs font-semibold text-[var(--text-main)] hover:border-[var(--accent-color)] transition-all max-w-[280px] cursor-pointer"
            title="Click to rotate motivation quote"
          >
            <Quote className="w-3.5 h-3.5 text-[#ec4899]" />
            <span className="truncate">&quot;{MOTIVATION_QUOTES[quoteIndex]}&quot;</span>
            <RefreshCw className="w-3 h-3 text-[#ec4899] opacity-75" />
          </button>

          {mounted && (
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--badge-bg)] border border-[var(--border-card)] text-[#ec4899] hover:border-[var(--accent-color)] transition-all cursor-pointer"
              aria-label="Toggle Light and Dark Mode"
              title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
