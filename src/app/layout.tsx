import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'ZenFlow | Next.js Focus & Study Workspace Capstone',
  description: 'Cherry Blossom aesthetic Pomodoro Timer, Focus Objectives, Habit Tracker, and Activity History in Next.js App Router',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark-mode min-h-screen flex flex-col font-sans antialiased">
        <Navbar />
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
          {children}
        </main>
        <footer className="w-full border-t border-[var(--border-app)] py-4 px-4 text-center text-xs font-semibold text-[var(--text-dim)] flex flex-col sm:flex-row items-center justify-between gap-2 max-w-6xl mx-auto">
          <div>
            ZenFlow Capstone &copy; {new Date().getFullYear()} — Built with Next.js 15 App Router &amp; Tailwind CSS
          </div>
          <div className="flex items-center gap-4 text-[var(--text-muted)]">
            <Link href="/identity-kit" className="hover:underline">Identity Kit</Link>
            <span>&bull;</span>
            <Link href="/curation" className="hover:underline">Curation Report</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
