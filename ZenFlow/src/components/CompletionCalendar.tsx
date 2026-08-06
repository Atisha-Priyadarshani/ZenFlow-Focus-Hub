import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Clock } from 'lucide-react';

export interface ActivityHistoryRecord {
  date: string;
  completedTasks: string[];
  focusMinutes: number;
}

const BORDER_ACTIVE = '1px solid #818cf8';
const BORDER_DEFAULT = '1px solid rgba(255,255,255,0.06)';
const BG_SELECTED = '#6366f1';
const BG_RECORD = 'rgba(16, 185, 129, 0.18)';
const BG_DEFAULT = 'rgba(15, 23, 42, 0.5)';

interface DayPillProps {
  dayName: string;
  dayNum: number;
  isToday: boolean;
  isSelected: boolean;
  hasRecord: boolean;
  onClick: () => void;
}

const DayPill: React.FC<DayPillProps> = ({ dayName, dayNum, isToday, isSelected, hasRecord, onClick }) => {
  const borderVal = isToday ? '1px solid #818cf8' : isSelected ? BORDER_ACTIVE : BORDER_DEFAULT;
  const bgVal = isToday ? '#6366f1' : isSelected ? BG_SELECTED : hasRecord ? BG_RECORD : BG_DEFAULT;
  const colorVal = isToday || isSelected ? '#ffffff' : hasRecord ? '#34d399' : '#94a3b8';

  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '0.35rem 0.2rem',
        borderRadius: '8px',
        border: borderVal,
        background: bgVal,
        color: colorVal,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.1rem',
        boxShadow: isToday ? '0 0 10px rgba(99, 102, 241, 0.35)' : 'none',
        transition: 'all 0.15s ease',
      }}
      aria-label="Select date pill"
    >
      <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.9, fontWeight: isToday ? 700 : 500 }}>
        {isToday ? 'TODAY' : dayName}
      </span>
      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{dayNum}</span>
    </button>
  );
};

interface CompletionCalendarProps {
  completedHistory: Record<string, ActivityHistoryRecord>;
}

export const CompletionCalendar: React.FC<CompletionCalendarProps> = ({ completedHistory }) => {
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
    <div className="card" role="region" aria-label="Activity History Calendar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarIcon size={18} color="#6366f1" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 700 }}>Activity History</h3>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#cbd5e1',
            borderRadius: '6px',
            padding: '0.25rem 0.5rem',
            fontSize: '0.78rem',
            cursor: 'pointer',
            outline: 'none',
          }}
          aria-label="Pick date"
        />
      </div>

      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.75rem' }}>
        {last7Days.map(({ dateStr, dayName, dayNum }) => (
          <DayPill
            key={dateStr}
            dayName={dayName}
            dayNum={dayNum}
            isToday={dateStr === todayStr}
            isSelected={selectedDate === dateStr}
            hasRecord={Boolean(completedHistory[dateStr])}
            onClick={() => setSelectedDate(dateStr)}
          />
        ))}
      </div>

      <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '10px', padding: '0.85rem 1rem', border: '1px solid rgba(255,255,255,0.05)', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
            Date: {selectedDate} {selectedDate === todayStr ? '(Today)' : ''}
          </span>
          {selectedRecord && (
            <span style={{ fontSize: '0.75rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
              <Clock size={13} /> {selectedRecord.focusMinutes} mins focused
            </span>
          )}
        </div>

        <div className="scrollable-list">
          {!selectedRecord || selectedRecord.completedTasks.length === 0 ? (
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center', paddingTop: '1rem' }}>
              No completed tasks recorded for this date.
            </p>
          ) : (
            <div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.45rem', fontWeight: 600 }}>
                Completed Items ({selectedRecord.completedTasks.length}):
              </div>
              {selectedRecord.completedTasks.map((t, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#34d399', marginBottom: '0.35rem', background: 'rgba(16, 185, 129, 0.08)', padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                  <CheckCircle2 size={14} /> {t}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
