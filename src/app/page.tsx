'use client';

import { useState, useEffect } from 'react';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { TaskManager } from '@/components/TaskManager';
import { HabitTracker } from '@/components/HabitTracker';
import { CompletionCalendar, ActivityHistoryRecord } from '@/components/CompletionCalendar';

export default function DashboardPage() {
  const todayStr = new Date().toISOString().split('T')[0];

  const [completedHistory, setCompletedHistory] = useState<Record<string, ActivityHistoryRecord>>(() => {
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
        '2026-08-04': {
          date: '2026-08-04',
          completedTasks: ['Study Anthropic Prompting Docs', 'Read React 18 Specs'],
          focusMinutes: 100,
        },
      };
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('zenflow_history', JSON.stringify(completedHistory));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [completedHistory]);

  const handleItemCompleted = (itemTitle: string) => {
    setCompletedHistory((prev) => {
      const currentToday = prev[todayStr] || {
        date: todayStr,
        completedTasks: [],
        focusMinutes: 25,
      };

      if (currentToday.completedTasks.includes(itemTitle)) {
        return prev;
      }

      return {
        ...prev,
        [todayStr]: {
          ...currentToday,
          completedTasks: [...currentToday.completedTasks, itemTitle],
        },
      };
    });
  };

  const handleSessionComplete = () => {
    setCompletedHistory((prev) => {
      const currentToday = prev[todayStr] || {
        date: todayStr,
        completedTasks: [],
        focusMinutes: 0,
      };

      return {
        ...prev,
        [todayStr]: {
          ...currentToday,
          focusMinutes: currentToday.focusMinutes + 25,
        },
      };
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      <div className="space-y-6">
        <PomodoroTimer onSessionComplete={handleSessionComplete} />
        <HabitTracker onHabitCompleted={handleItemCompleted} />
      </div>
      <div className="space-y-6">
        <TaskManager onTaskCompleted={handleItemCompleted} />
        <CompletionCalendar completedHistory={completedHistory} />
      </div>
    </div>
  );
}
