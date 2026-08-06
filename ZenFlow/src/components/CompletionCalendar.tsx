import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Clock } from 'lucide-react';

export interface ActivityHistoryRecord {
  date: string;
  completedTasks: string[];
  focusMinutes: number;
}

const BORDER_ACTIVE = '2px solid #a855f7';
const BORDER_DEFAULT = '1px solid rgba(255,255,255,0.06)';
const BG_SELECTED = '#6366f1';
const BG_RECORD = 'rgba(16, 185, 129, 0.2)';
const BG_DEFAULT = 'rgba(15, 23, 42, 0.6)';

interface DayPillProps {
  dayName: string;
  dayNum: number;
  isToday: boolean;
  isSelected: boolean;
  hasRecord: boolean;
  onClick: () => void;
}

const DayPill: React.FC<DayPillProps> = ({ dayName, dayNum, isToday, isSelected, hasRecord, onClick }) => {
  const borderVal = isSelected ? BORDER_ACTIVE : isToday ? '2px solid #ec4899' : BORDER_DEFAULT;
  const bgVal = isToday ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : isSelected ? BG_SELECTED : hasRecord ? BG_RECORD : BG_DEFAULT;
  const colorVal = isToday || isSelected ? '#ffffff' : hasRecord ? '#34d399' : '#94a3b8';

  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '0.35rem 0.2rem',
        borderRadius: '10px',
        border: borderVal,
        background: bgVal,
        color: colorVal,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.1rem',
        boxShadow: isToday ? '0 0 10px rgba(236, 72, 153, 0.4)' : 'none',
      }}
      aria-label="Select date pill"
    >
      <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.95, fontWeight: isToday ? 800 : 500 }}>
        {isToday ? '★ TODAY' : dayName}
      </span>
      <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{dayNum}</span>
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
          <CalendarIcon size={20} color="#a855f7" />
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc' }}>Activity History</h3>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            color: '#c084fc',
            borderRadius: '8px',
            padding: '0.25rem 0.5rem',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
          aria-label="Pick date"
        />
      </div>

      {/* Sleek 7-Day Compact Strip with Highlighted Today Pill */}
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

      {/* Scrollable Selected Date Summary Panel */}
      <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', padding: '0.85rem 1rem', border: '1px solid rgba(255,255,255,0.08)', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
            Date: {selectedDate} {selectedDate === todayStr ? '(Today)' : ''}
          </span>
          {selectedRecord && (
            <span style={{ fontSize: '0.75rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}>
              <Clock size={14} /> {selectedRecord.focusMinutes} mins focused
            </span>
          )}
        </div>

        <div className="scrollable-list">
          {!selectedRecord || selectedRecord.completedTasks.length === 0 ? (
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', paddingTop: '1rem' }}>
              No completed tasks recorded for this date.
            </p>
          ) : (
            <div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.5rem', fontWeight: 600 }}>
                Completed Items ({selectedRecord.completedTasks.length}):
              </div>
              {selectedRecord.completedTasks.map((t, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#34d399', marginBottom: '0.35rem', background: 'rgba(52, 211, 153, 0.08)', padding: '0.35rem 0.6rem', borderRadius: '6px' }}>
                  <CheckCircle2 size={15} /> {t}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
