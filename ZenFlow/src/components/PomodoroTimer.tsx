import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, Sparkles } from 'lucide-react';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const MODE_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

interface PomodoroTimerProps {
  onSessionComplete?: () => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [customMinutes, setCustomMinutes] = useState<string>('');

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playAlarmChime = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.log('Audio chime error:', e);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      playAlarmChime();
      if (mode === 'focus') {
        setCompletedSessions((prev) => prev + 1);
        if (onSessionComplete) onSessionComplete();
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, onSessionComplete]);

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
    setIsRunning(false);
  };

  const handleQuickPreset = (mins: number) => {
    setTimeLeft(mins * 60);
    setIsRunning(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(customMinutes, 10);
    if (!isNaN(mins) && mins > 0 && mins <= 180) {
      setTimeLeft(mins * 60);
      setIsRunning(false);
      setCustomMinutes('');
    }
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_DURATIONS[mode]);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card" role="region" aria-label="Pomodoro Focus Timer">
      <div className="mode-pills" role="tablist" aria-label="Timer Mode Switcher" style={{ marginBottom: '1rem' }}>
        <button
          role="tab"
          aria-selected={mode === 'focus'}
          className={`mode-pill ${mode === 'focus' ? 'active' : ''}`}
          onClick={() => handleModeChange('focus')}
        >
          Focus (25m)
        </button>
        <button
          role="tab"
          aria-selected={mode === 'shortBreak'}
          className={`mode-pill ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => handleModeChange('shortBreak')}
        >
          Short Break (5m)
        </button>
        <button
          role="tab"
          aria-selected={mode === 'longBreak'}
          className={`mode-pill ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => handleModeChange('longBreak')}
        >
          Long Break (15m)
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Sparkles size={14} color="var(--accent-color)" /> Quick:
        </span>

        {[10, 25, 45, 60].map((m) => (
          <button
            key={m}
            onClick={() => handleQuickPreset(m)}
            style={{
              background: 'var(--badge-bg)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-main)',
              borderRadius: '8px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontWeight: 700,
              transition: 'all 0.2s ease',
            }}
          >
            {m}m
          </button>
        ))}

        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <input
            type="number"
            min="1"
            max="180"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            placeholder="Custom m"
            style={{
              width: '85px',
              padding: '0.35rem 0.6rem',
              borderRadius: '8px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 600,
              outline: 'none',
            }}
            aria-label="Custom duration in minutes"
          />
          <button
            type="submit"
            style={{
              background: 'var(--pill-active-bg)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.35rem 0.65rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Set
          </button>
        </form>
      </div>

      <div className="timer-display" aria-live="off" aria-label={`Time remaining: ${formatTime(timeLeft)}`}>
        {formatTime(timeLeft)}
      </div>

      <div className="timer-controls">
        <button
          className="btn btn-primary"
          onClick={toggleTimer}
          aria-label={isRunning ? 'Pause Timer' : 'Start Timer'}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          {isRunning ? 'Pause' : 'Start Focus'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={resetTimer}
          aria-label="Reset Timer"
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </div>

      <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', paddingTop: '0.75rem' }}>
        <Bell size={14} color="var(--accent-color)" /> Completed Sessions Today: <strong style={{ color: 'var(--accent-color)' }}>{completedSessions}</strong>
      </div>
    </div>
  );
};
