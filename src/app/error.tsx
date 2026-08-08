'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Route Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-red-500/40 shadow-2xl text-center space-y-6 animate-scale-up">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-red-400">
            Route Error Boundary Triggered (FE-08)
          </h2>
          <p className="text-xs text-slate-300 mt-2 font-medium">
            {error.message || 'An unexpected runtime error occurred while processing this route.'}
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-lg hover:bg-indigo-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-all"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
