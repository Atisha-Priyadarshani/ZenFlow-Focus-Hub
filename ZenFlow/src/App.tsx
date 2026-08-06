import { Sparkles } from 'lucide-react';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskManager } from './components/TaskManager';
import { HabitTracker } from './components/HabitTracker';
import { CompletionCalendar } from './components/CompletionCalendar';

export default function App() {
  return (
    <div className="zenflow-app">
      <header className="header">
        <div className="logo-group">
          <Sparkles size={28} color="#a855f7" />
          <div>
            <h1 className="logo-title">ZenFlow</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
              Focus Productivity & Study Workspace
            </p>
          </div>
        </div>
        <span style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '9999px', fontWeight: 600 }}>
          Week 3 AI React Build
        </span>
      </header>

      <div className="main-grid">
        <div>
          <PomodoroTimer />
          <HabitTracker />
        </div>
        <div>
          <TaskManager />
          <CompletionCalendar />
        </div>
      </div>
    </div>
  );
}
