import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

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

  // Timer tick effect with proper interval cleanup to prevent memory leaks
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
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
      <div className="mode-pills" role="tablist" aria-label="Timer Mode Switcher">
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

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
        Completed Sessions Today: <strong style={{ color: '#a855f7' }}>{completedSessions}</strong>
      </div>
    </div>
  );
};
