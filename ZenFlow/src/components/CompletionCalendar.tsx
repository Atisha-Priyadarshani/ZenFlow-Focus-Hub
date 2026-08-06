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

interface DayButtonProps {
  day: number;
  isSelected: boolean;
  hasRecord: boolean;
  onClick: () => void;
}

const DayButton: React.FC<DayButtonProps> = ({ day, isSelected, hasRecord, onClick }) => {
  const borderVal = isSelected ? BORDER_ACTIVE : BORDER_DEFAULT;
  const bgVal = isSelected ? BG_SELECTED : hasRecord ? BG_RECORD : BG_DEFAULT;
  const colorVal = isSelected ? '#ffffff' : hasRecord ? '#34d399' : '#94a3b8';
  const weightVal = isSelected || hasRecord ? 700 : 400;

  return (
    <button
      onClick={onClick}
      style={{
        aspectRatio: '1',
        borderRadius: '8px',
        border: borderVal,
        background: bgVal,
        color: colorVal,
        fontWeight: weightVal,
        fontSize: '0.85rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Select calendar date"
    >
      {day}
    </button>
  );
};

export const CompletionCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return { day: d, dateStr };
  });

  const selectedRecord = MOCK_HISTORY[selectedDate];

  return (
    <div className="card" style={{ marginTop: '1.5rem' }} role="region" aria-label="Activity History Calendar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <CalendarIcon size={20} color="#a855f7" />
        <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc' }}>
          Completion Calendar ({today.toLocaleString('default', { month: 'long', year: 'numeric' })})
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem', marginBottom: '1.25rem' }}>
        {daysArray.map(({ day, dateStr }) => (
          <DayButton
            key={dateStr}
            day={day}
            isSelected={selectedDate === dateStr}
            hasRecord={Boolean(MOCK_HISTORY[dateStr])}
            onClick={() => setSelectedDate(dateStr)}
          />
        ))}
      </div>

      <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
            Selected Date: {selectedDate}
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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 600 }}>
              Completed Items:
            </div>
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
