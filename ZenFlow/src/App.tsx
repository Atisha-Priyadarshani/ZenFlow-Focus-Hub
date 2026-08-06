import { useState, useEffect } from 'react';
import { Flower2, Quote, RefreshCw } from 'lucide-react';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskManager } from './components/TaskManager';
import { HabitTracker } from './components/HabitTracker';
import { CompletionCalendar, ActivityHistoryRecord } from './components/CompletionCalendar';

const MOTIVATION_QUOTES = [
  "Discipline equals freedom.",
  "Focus on progress, not perfection.",
  "Small daily wins compound into greatness.",
  "Your future self will thank you for today's effort.",
  "Deep work creates extraordinary results.",
  "Bloom with consistency every single day.",
];

export default function App() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  const [completedHistory, setCompletedHistory] = useState<Record<string, ActivityHistoryRecord>>(() => {
    try {
      const saved = localStorage.getItem('zenflow_history');
      return saved ? JSON.parse(saved) : {
        [todayStr]: {
          date: todayStr,
          completedTasks: ['Complete Frontend AI Engineering Drill'],
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

  const rotateQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATION_QUOTES.length);
  };

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
    <div className="zenflow-app">
      <header className="header">
        <div className="logo-group">
          <Flower2 size={30} color="#f472b6" />
          <div>
            <h1 className="logo-title">ZenFlow</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#f472b6', fontWeight: 500 }}>
              Cherry Blossom Study &amp; Focus Workspace
            </p>
          </div>
        </div>

        {/* Short Motivational Quote Pill */}
        <div
          onClick={rotateQuote}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(244, 114, 182, 0.12)',
            border: '1px solid rgba(244, 114, 182, 0.3)',
            borderRadius: '9999px',
            padding: '0.4rem 0.95rem',
            color: '#fbcfe8',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(244, 114, 182, 0.15)',
            maxWidth: '380px',
          }}
          title="Click to rotate motivation quote"
        >
          <Quote size={14} color="#f472b6" />
          <span>&quot;{MOTIVATION_QUOTES[quoteIndex]}&quot;</span>
          <RefreshCw size={12} color="#fda4af" style={{ opacity: 0.8 }} />
        </div>
      </header>

      <div className="main-grid">
        <div>
          <PomodoroTimer onSessionComplete={handleSessionComplete} />
          <div style={{ marginTop: '1.5rem' }}>
            <HabitTracker onHabitCompleted={handleItemCompleted} />
          </div>
        </div>
        <div>
          <TaskManager onTaskCompleted={handleItemCompleted} />
          <div style={{ marginTop: '1.5rem' }}>
            <CompletionCalendar completedHistory={completedHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}
