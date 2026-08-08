'use client';

import React from 'react';
import Link from 'next/link';
import { User, Code2, FileText, Calendar, ExternalLink, Sparkles, Bot, Layers } from 'lucide-react';

export default function PortfolioPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 font-sans animate-fade-in">
      {/* Hero Section */}
      <div className="zenflow-card p-8 space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-[#db2777] dark:text-[#ec4899] text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5" /> Frontend AI Engineer & Portfolio (PF-04)
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
              Atisha Priyadarshani
            </h1>
            <p className="text-sm md:text-base text-[var(--text-muted)] max-w-2xl font-medium leading-relaxed">
              Building mindful, high-performance focus workspaces with Next.js 16, React 19, TypeScript, and Generative UI Zod tool integrations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <a
              href="https://github.com/Atisha-Priyadarshani/ZenFlow-Focus-Hub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-card)] text-[var(--text-main)] font-bold text-xs hover:border-[#ec4899] transition-all shadow-sm"
            >
              <svg className="w-4 h-4 text-[#ec4899] fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub Repo
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.762-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="pt-4 border-t border-[var(--border-card)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href="https://github.com/Atisha-Priyadarshani/ZenFlow-Focus-Hub/raw/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-[var(--sub-panel-bg)] border border-[var(--border-card)] flex items-center justify-between text-xs font-bold text-[var(--text-main)] hover:border-[#ec4899] transition-all"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#ec4899]" /> Download CV
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </a>

          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-[var(--sub-panel-bg)] border border-[var(--border-card)] flex items-center justify-between text-xs font-bold text-[var(--text-main)] hover:border-[#ec4899] transition-all"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#ec4899]" /> Schedule Intro Call
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </a>

          <Link
            href="/chat"
            className="p-3 rounded-xl bg-[var(--sub-panel-bg)] border border-[var(--border-card)] flex items-center justify-between text-xs font-bold text-[var(--text-main)] hover:border-[#ec4899] transition-all"
          >
            <span className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#ec4899]" /> Live AI Agent (FE-07)
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </Link>

          <Link
            href="/playground"
            className="p-3 rounded-xl bg-[var(--sub-panel-bg)] border border-[var(--border-card)] flex items-center justify-between text-xs font-bold text-[var(--text-main)] hover:border-[#ec4899] transition-all"
          >
            <span className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#ec4899]" /> Component Lab (FE-05)
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </Link>
        </div>
      </div>

      {/* Capstone Projects Showcase */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-[var(--text-main)] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#ec4899]" /> Capstone Projects & Subsystem Showcase
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="zenflow-card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[var(--text-main)]">ZenFlow Focus Hub</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 text-[#ec4899] border border-pink-500/20 text-[10px] font-extrabold">
                LIVE PRODUCTION
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">
              Next.js 16 focus workspace featuring Zod-schema Pomodoro tools, Generative UI focus schedule matrices, SSE token streaming, and resilient Next.js error boundaries.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-[var(--text-muted)]">
              <span className="px-2 py-0.5 rounded bg-[var(--bg-input)] border border-[var(--border-card)]">Next.js 16</span>
              <span className="px-2 py-0.5 rounded bg-[var(--bg-input)] border border-[var(--border-card)]">React 19</span>
              <span className="px-2 py-0.5 rounded bg-[var(--bg-input)] border border-[var(--border-card)]">Zod Tools</span>
            </div>
          </div>

          <div className="zenflow-card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[var(--text-main)]">W3C ARIA Component Lab</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 text-[#ec4899] border border-pink-500/20 text-[10px] font-extrabold">
                FE-05 COMPLETED
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">
              Hand-built accessible React components (Modal Focus Traps, Keyboard Arrow Navigation Tabs, Disclosure triggers) evaluated against shadcn/ui.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-[var(--text-muted)]">
              <span className="px-2 py-0.5 rounded bg-[var(--bg-input)] border border-[var(--border-card)]">W3C ARIA</span>
              <span className="px-2 py-0.5 rounded bg-[var(--bg-input)] border border-[var(--border-card)]">Accessibility</span>
              <span className="px-2 py-0.5 rounded bg-[var(--bg-input)] border border-[var(--border-card)]">TypeScript</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
