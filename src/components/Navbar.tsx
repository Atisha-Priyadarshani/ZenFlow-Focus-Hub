'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Flower2,
  Quote,
  RefreshCw,
  Sun,
  Moon,
  LayoutDashboard,
  Bot,
  Code2,
  Activity,
  User,
  Menu,
  X,
} from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem('zenflow_theme') as 'dark' | 'light') || 'dark';
    setThemeMode(savedTheme);
    document.body.className = `${savedTheme}-mode`;
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
    { href: '/portfolio', label: 'Portfolio (PF-04)', icon: User },
    { href: '/chat', label: 'AI Chat', icon: Bot },
    { href: '/playground', label: 'Playground', icon: Code2 },
    { href: '/health', label: 'Health', icon: Activity },
  ];

  return (
    <header className="w-full bg-[var(--bg-app)] border-b border-[var(--border-app)] backdrop-blur-xl sticky top-0 z-50 px-4 md:px-8 py-3.5 transition-all shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Subtitle */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
            <Flower2 className="w-6 h-6 md:w-7 md:h-7 text-[#db2777] dark:text-[#ec4899]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-extrabold tracking-tight text-[#be185d] dark:text-[#fbcfe8]">
              ZenFlow
            </span>
            <span className="hidden sm:inline-flex items-center text-[10px] font-extrabold text-[#db2777] dark:text-[#ec4899] px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 leading-none">
              Focus Hub
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[var(--bg-input)] border border-[var(--border-card)] p-1.5 rounded-xl">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white shadow-md'
                    : 'text-[var(--text-main)] hover:text-[#db2777] dark:hover:text-[#ec4899] hover:bg-[var(--badge-bg)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={rotateQuote}
            className="hidden xl:flex items-center gap-2 bg-[var(--bg-input)] border border-[var(--border-card)] rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--text-main)] hover:border-[#ec4899] transition-all max-w-[240px] cursor-pointer"
            title="Click to rotate motivation quote"
          >
            <Quote className="w-3.5 h-3.5 text-[#ec4899]" />
            <span className="truncate">&quot;{MOTIVATION_QUOTES[quoteIndex]}&quot;</span>
            <RefreshCw className="w-3 h-3 text-[#ec4899] opacity-75" />
          </button>

          {mounted && (
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 flex items-center gap-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-card)] text-[var(--text-main)] hover:border-[#ec4899] transition-all cursor-pointer shadow-sm font-bold text-xs"
              aria-label="Toggle Light and Dark Mode"
              title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {themeMode === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-pink-700" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu navigation"
            className="lg:hidden p-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-card)] text-[var(--text-main)] hover:text-[#ec4899] transition-all focus:outline-none focus:ring-2 focus:ring-[#ec4899]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-[var(--border-card)] animate-fade-in">
          <nav className="flex flex-col space-y-1 bg-[var(--bg-card)] border border-[var(--border-card)] p-3 rounded-2xl shadow-2xl backdrop-blur-xl">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white font-extrabold shadow-md'
                      : 'text-[var(--text-main)] hover:bg-[var(--badge-bg)] hover:text-[#db2777]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#ec4899]" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
