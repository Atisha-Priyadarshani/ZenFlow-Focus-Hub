import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Clock } from 'lucide-react';

export interface ActivityHistoryRecord {
  date: string;
  completedTasks: string[];
  focusMinutes: number;
}

const MOCK_HISTORY: Record<string, ActivityHistoryRecord> = {
  [new Date().toISOString().split('T')[0]]: {
    date: new Date().toISOString().split('T')[0],
    completedTasks: ['Complete Frontend AI Engineering Drill', 'Morning Code Review'],
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

const BORDER_ACTIVE = '2px solid #a855f7';
const BORDER_DEFAULT = '1px solid rgba(255,255,255,0.06)';
const BG_SELECTED = '#6366f1';
const BG_RECORD = 'rgba(16, 185, 129, 0.2)';
const BG_DEFAULT = 'rgba(15, 23, 42, 0.6)';

interface DayPillProps {
  dayName: string;
  dayNum: number;
  isSelected: boolean;
  hasRecord: boolean;
  onClick: () => void;
}

const DayPill: React.FC<DayPillProps> = ({ dayName, dayNum, isSelected, hasRecord, onClick }) => {
  const borderVal = isSelected ? BORDER_ACTIVE : BORDER_DEFAULT;
  const bgVal = isSelected ? BG_SELECTED : hasRecord ? BG_RECORD : BG_DEFAULT;
  const colorVal = isSelected ? '#ffffff' : hasRecord ? '#34d399' : '#94a3b8';

  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '0.4rem 0.2rem',
        borderRadius: '10px',
        border: borderVal,
        background: bgVal,
        color: colorVal,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.1rem',
      }}
      aria-label="Select date pill"
    >
      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.8 }}>{dayName}</span>
      <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{dayNum}</span>
    </button>
  );
};

export const CompletionCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Generate last 7 days (Today & past 6 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    return { dateStr, dayName, dayNum };
  });

  const selectedRecord = MOCK_HISTORY[selectedDate];

  return (
    <div className="card" style={{ marginTop: '1.5rem' }} role="region" aria-label="Activity History Calendar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarIcon size={20} color="#a855f7" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc' }}>Activity History</h3>
        </div>

        {/* Compact Date Picker for older dates */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            color: '#c084fc',
            borderRadius: '8px',
            padding: '0.3rem 0.5rem',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
          aria-label="Pick date"
        />
      </div>

      {/* Sleek 7-Day Compact Strip */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {last7Days.map(({ dateStr, dayName, dayNum }) => (
          <DayPill
            key={dateStr}
            dayName={dayName}
            dayNum={dayNum}
            isSelected={selectedDate === dateStr}
            hasRecord={Boolean(MOCK_HISTORY[dateStr])}
            onClick={() => setSelectedDate(dateStr)}
          />
        ))}
      </div>

      {/* Selected Date Activity Summary */}
      <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', padding: '0.85rem 1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
            Date: {selectedDate}
          </span>
          {selectedRecord && (
            <span style={{ fontSize: '0.75rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
              <Clock size={14} /> {selectedRecord.focusMinutes} mins focused
            </span>
          )}
        </div>

        {!selectedRecord ? (
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
            No completed tasks recorded for this date.
          </p>
        ) : (
          <div>
            {selectedRecord.completedTasks.map((t, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#34d399', marginBottom: '0.25rem' }}>
                <CheckCircle2 size={14} /> {t}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
