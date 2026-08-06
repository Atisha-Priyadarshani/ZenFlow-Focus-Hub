import { useState, useEffect } from 'react';
import { Flower2, Quote, RefreshCw, Sun, Moon } from 'lucide-react';
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
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('zenflow_theme') as 'dark' | 'light') || 'dark';
  });

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

  // Toggle theme class on body
  useEffect(() => {
    document.body.className = `${themeMode}-mode`;
    localStorage.setItem('zenflow_theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    try {
      localStorage.setItem('zenflow_history', JSON.stringify(completedHistory));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [completedHistory]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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
          <Flower2 size={30} color="#ec4899" />
          <div>
            <h1 className="logo-title">ZenFlow</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#ec4899', fontWeight: 600 }}>
              Cherry Blossom Focus Workspace
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(244, 114, 182, 0.12)',
              maxWidth: '350px',
            }}
            title="Click to rotate motivation quote"
          >
            <Quote size={14} color="#ec4899" />
            <span>&quot;{MOTIVATION_QUOTES[quoteIndex]}&quot;</span>
            <RefreshCw size={12} color="#ec4899" style={{ opacity: 0.8 }} />
          </div>

          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(244, 114, 182, 0.15)',
              border: '1px solid rgba(244, 114, 182, 0.3)',
              color: '#ec4899',
              borderRadius: '9999px',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            aria-label="Toggle Light and Dark Mode"
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {themeMode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
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
