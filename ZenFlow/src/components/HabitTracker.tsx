import React, { useState, useEffect } from 'react';
import { Flame, Plus, Check, Trash2 } from 'lucide-react';

export interface Habit {
  id: string;
  name: string;
  info: string;
  streak: number;
  completedToday: boolean;
  lastCompletedDate?: string;
}

const BORDER_COMPLETED = '1px solid rgba(16, 185, 129, 0.3)';
const BORDER_DEFAULT = '1px solid rgba(255, 255, 255, 0.05)';
const COLOR_COMPLETED = '#64748b';
const COLOR_DEFAULT = '#f8fafc';
const BG_COMPLETED = '#10b981';
const BG_DEFAULT = 'rgba(255, 255, 255, 0.1)';

interface HabitRowProps {
  habit: Habit;
  onToggle: () => void;
  onDelete: () => void;
}

const HabitRow: React.FC<HabitRowProps> = ({ habit, onToggle, onDelete }) => {
  const borderStyle = habit.completedToday ? BORDER_COMPLETED : BORDER_DEFAULT;
  const titleColor = habit.completedToday ? COLOR_COMPLETED : COLOR_DEFAULT;
  const titleDecoration = habit.completedToday ? 'line-through' : 'none';
  const btnBg = habit.completedToday ? BG_COMPLETED : BG_DEFAULT;

  return (
    <div className="task-item" style={{ border: borderStyle }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
        <button
          onClick={onToggle}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            border: 'none',
            background: btnBg,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Toggle habit"
        >
          {habit.completedToday ? <Check size={18} /> : null}
        </button>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: titleColor, textDecoration: titleDecoration }}>
            {habit.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{habit.info}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Flame size={14} /> {habit.streak}d streak
        </span>
        <button
          onClick={onDelete}
          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
          aria-label="Delete habit"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

interface HabitTrackerProps {
  onHabitCompleted?: (name: string) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ onHabitCompleted }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem('zenflow_habits');
      return saved ? JSON.parse(saved) : [
        { id: '1', name: 'Morning Code Review', info: '30 mins of GitHub PR audits', streak: 5, completedToday: true, lastCompletedDate: new Date().toISOString().split('T')[0] },
        { id: '2', name: 'Read Documentation', info: '15 pages of React / TS docs', streak: 3, completedToday: false },
      ];
    } catch {
      return [];
    }
  });

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('zenflow_habits', JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits to localStorage', e);
    }
  }, [habits]);

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: name.trim(),
      info: info.trim() || 'Daily habit',
      streak: 0,
      completedToday: false,
    };

    setHabits((prev) => [...prev, newHabit]);
    setName('');
    setInfo('');
    setIsAdding(false);
  };

  const toggleHabit = (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const isNowCompleted = !h.completedToday;
          const newStreak = isNowCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
          if (isNowCompleted && onHabitCompleted) {
            onHabitCompleted(h.name);
          }
          return {
            ...h,
            completedToday: isNowCompleted,
            streak: newStreak,
            lastCompletedDate: isNowCompleted ? todayStr : h.lastCompletedDate,
          };
        }
        return h;
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="card" role="region" aria-label="Daily Habit Tracker">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Flame size={20} color="#f59e0b" />
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc' }}>Daily Habits &amp; Streaks</h3>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          style={{ background: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(168, 85, 247, 0.4)', color: '#c084fc', borderRadius: '8px', padding: '0.35rem 0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, fontSize: '0.8rem' }}
          aria-label="Add Habit"
        >
          <Plus size={15} /> {isAdding ? 'Close' : 'Add Habit'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddHabit} style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', padding: '0.85rem', marginBottom: '0.75rem' }}>
          <input
            type="text"
            placeholder="Habit Name (e.g. Daily LeetCode Problem)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', marginBottom: '0.5rem', boxSizing: 'border-box' }}
            aria-label="Habit Name"
          />
          <input
            type="text"
            placeholder="Extra Info / Target (e.g. 30 mins / 1 problem)"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', marginBottom: '0.65rem', boxSizing: 'border-box' }}
            aria-label="Habit Info"
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.45rem', justifyContent: 'center' }}>
            Save Habit
          </button>
        </form>
      )}

      <div className="scrollable-list">
        {habits.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', padding: '1rem 0' }}>
            No habits added yet. Click &quot;Add Habit&quot; to build your daily streak!
          </p>
        ) : (
          habits.map((h) => (
            <HabitRow
              key={h.id}
              habit={h}
              onToggle={() => toggleHabit(h.id)}
              onDelete={() => deleteHabit(h.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
