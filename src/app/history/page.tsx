'use client';

import { useState } from 'react';
import { CompletionCalendar, ActivityHistoryRecord } from '@/components/CompletionCalendar';

export default function HistoryPage() {
  const todayStr = new Date().toISOString().split('T')[0];

  const [completedHistory] = useState<Record<string, ActivityHistoryRecord>>(() => {
    try {
      const saved = localStorage.getItem('zenflow_history');
      return saved ? JSON.parse(saved) : {
        [todayStr]: {
          date: todayStr,
          completedTasks: ['Complete Next.js App Router Drill'],
          focusMinutes: 50,
        },
        '2026-08-05': {
          date: '2026-08-05',
          completedTasks: ['Setup Vitest Config', 'Refactor TypeScript Interfaces'],
          focusMinutes: 75,
        },
      };
    } catch {
      return {};
    }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-extrabold text-[var(--text-main)]">Activity History Calendar</h1>
        <p className="text-xs text-[var(--text-muted)]">Review focus time and completed objectives by date</p>
      </div>
      <CompletionCalendar completedHistory={completedHistory} />
    </div>
  );
}
