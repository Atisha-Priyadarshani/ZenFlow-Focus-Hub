'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Clock } from 'lucide-react';

export interface ActivityHistoryRecord {
  date: string;
  completedTasks: string[];
  focusMinutes: number;
}

interface CompletionCalendarProps {
  completedHistory: Record<string, ActivityHistoryRecord>;
}

export function CompletionCalendar({ completedHistory }: CompletionCalendarProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    return { dateStr, dayName, dayNum };
  });

  const selectedRecord = completedHistory[selectedDate];

  return (
    <div className="zenflow-card h-[480px] flex flex-col" role="region" aria-label="Activity History Calendar">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-[#f472b6]" />
          <h3 className="text-lg font-extrabold text-[var(--text-main)] m-0">Activity History</h3>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-[var(--bg-input)] border border-[var(--border-card)] text-[var(--text-main)] rounded-lg px-2 py-1 text-xs outline-none cursor-pointer"
          aria-label="Pick date"
        />
      </div>

      {/* 7-Day Compact Strip */}
      <div className="flex gap-1.5 mb-3">
        {last7Days.map(({ dateStr, dayName, dayNum }) => {
          const isToday = dateStr === todayStr;
          const isSelected = selectedDate === dateStr;
          const hasRecord = Boolean(completedHistory[dateStr]);

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`flex-1 py-1.5 px-1 rounded-xl border flex flex-col items-center gap-0.5 text-xs font-bold transition-all cursor-pointer ${
                isToday || isSelected
                  ? 'bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white border-[#fbcfe8] shadow-md'
                  : hasRecord
                  ? 'bg-[var(--badge-bg)] text-[var(--text-muted)] border-[var(--border-card)]'
                  : 'bg-[var(--bg-input)] text-[var(--text-dim)] border-[var(--border-card)]'
              }`}
              aria-label="Select date pill"
            >
              <span className="text-[9px] uppercase tracking-wider opacity-90">
                {isToday ? 'TODAY' : dayName}
              </span>
              <span className="text-sm font-extrabold">{dayNum}</span>
            </button>
          );
        })}
      </div>

      {/* Detail Panel */}
      <div className="bg-[var(--sub-panel-bg)] rounded-xl p-3 border border-[var(--border-card)] flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-2 pb-2 border-b border-[var(--border-card)]">
          <span className="text-xs font-bold text-[var(--text-main)]">
            Date: {selectedDate} {selectedDate === todayStr ? '(Today)' : ''}
          </span>
          {selectedRecord && (
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 font-bold">
              <Clock className="w-3.5 h-3.5 text-[#ec4899]" /> {selectedRecord.focusMinutes} mins focused
            </span>
          )}
        </div>

        <div className="scrollable-list flex-1">
          {!selectedRecord || selectedRecord.completedTasks.length === 0 ? (
            <p className="text-center text-xs text-[var(--text-dim)] pt-6">
              No completed tasks recorded for this date.
            </p>
          ) : (
            <div>
              <div className="text-xs font-bold text-[var(--text-muted)] mb-2">
                Completed Items ({selectedRecord.completedTasks.length}):
              </div>
              {selectedRecord.completedTasks.map((t, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-[var(--text-main)] mb-1.5 bg-[var(--badge-bg)] p-2 rounded-lg border border-[var(--border-card)]">
                  <CheckCircle2 className="w-4 h-4 text-[#ec4899]" /> {t}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
