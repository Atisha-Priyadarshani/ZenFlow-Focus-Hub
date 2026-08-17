'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Plus, Check, Trash2 } from 'lucide-react';

export interface Habit {
  id: string;
  name: string;
  info: string;
  streak: number;
  completedToday: boolean;
  lastCompletedDate?: string;
}

interface HabitTrackerProps {
  onHabitCompleted?: (name: string) => void;
}

export function HabitTracker({ onHabitCompleted }: HabitTrackerProps) {
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('zenflow_habits', JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits to localStorage', e);
    }
  }, [habits]);

  const sortedHabits = useMemo(() => {
    return [...habits].sort((a, b) => {
      if (a.completedToday === b.completedToday) return 0;
      return a.completedToday ? 1 : -1;
    });
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
    <div className="zenflow-card h-[480px] flex flex-col" role="region" aria-label="Daily Habit Tracker">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-extrabold text-[var(--text-main)] m-0">Daily Habits &amp; Streaks</h3>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[var(--badge-bg)] border border-[var(--border-card)] text-[var(--text-main)] flex items-center gap-1 cursor-pointer"
          aria-label="Add Habit"
        >
          <Plus className="w-3.5 h-3.5" /> {isAdding ? 'Close' : 'Add Habit'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddHabit} className="p-3 mb-3 bg-[var(--bg-input)] border border-[var(--border-card)] rounded-xl animate-fade-in">
          <input
            type="text"
            placeholder="Habit Name (e.g. Daily LeetCode Problem)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-main)] mb-2 outline-none"
            aria-label="Habit Name"
          />
          <input
            type="text"
            placeholder="Extra Info / Target (e.g. 30 mins / 1 problem)"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-main)] mb-2.5 outline-none"
            aria-label="Habit Info"
          />
          <button type="submit" className="w-full py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white shadow-sm cursor-pointer">
            Save Habit
          </button>
        </form>
      )}

      <div className="scrollable-list flex-1 mt-1">
        {!isMounted ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-[var(--text-dim)] animate-pulse">Loading habits...</span>
          </div>
        ) : sortedHabits.length === 0 ? (
          <p className="text-center text-xs text-[var(--text-dim)] py-6">
            No habits added yet. Click &quot;Add Habit&quot; to build your daily streak!
          </p>
        ) : (
          sortedHabits.map((h) => (
            <div key={h.id} className="flex items-center justify-between p-3 mb-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-card)] hover:border-[var(--accent-color)] transition-all">
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => toggleHabit(h.id)}
                  className={`w-7 h-7 rounded-lg border-none flex items-center justify-center cursor-pointer transition-all ${
                    h.completedToday ? 'bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white shadow-sm' : 'bg-[var(--badge-bg)] text-[var(--text-dim)]'
                  }`}
                  aria-label="Toggle habit"
                >
                  {h.completedToday ? <Check className="w-4 h-4" /> : null}
                </button>
                <div>
                  <div className={`text-xs md:text-sm font-bold ${h.completedToday ? 'line-through text-[var(--text-dim)]' : 'text-[var(--text-main)]'}`}>
                    {h.name}
                  </div>
                  <div className="text-[11px] text-[var(--text-dim)]">{h.info}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-amber-500 bg-amber-500/15 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> {h.streak}d streak
                </span>
                <button
                  onClick={() => deleteHabit(h.id)}
                  className="text-red-500 hover:text-red-600 p-1 cursor-pointer"
                  aria-label="Delete habit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
