'use client';

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

export function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
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
    <div className="zenflow-card h-[480px] flex flex-col justify-between" role="region" aria-label="Pomodoro Focus Timer">
      {/* Mode Pills */}
      <div className="flex justify-center gap-1.5 bg-[var(--bg-input)] p-1.5 rounded-xl border border-[var(--border-card)]" role="tablist">
        <button
          role="tab"
          aria-selected={mode === 'focus'}
          className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
            mode === 'focus' ? 'bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white shadow-md' : 'text-[var(--text-muted)]'
          }`}
          onClick={() => handleModeChange('focus')}
        >
          Focus (25m)
        </button>
        <button
          role="tab"
          aria-selected={mode === 'shortBreak'}
          className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
            mode === 'shortBreak' ? 'bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white shadow-md' : 'text-[var(--text-muted)]'
          }`}
          onClick={() => handleModeChange('shortBreak')}
        >
          Short Break (5m)
        </button>
        <button
          role="tab"
          aria-selected={mode === 'longBreak'}
          className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
            mode === 'longBreak' ? 'bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white shadow-md' : 'text-[var(--text-muted)]'
          }`}
          onClick={() => handleModeChange('longBreak')}
        >
          Long Break (15m)
        </button>
      </div>

      {/* Quick Presets + Custom Mins Input */}
      <div className="flex items-center justify-center gap-2 flex-wrap my-2">
        <span className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#f472b6]" /> Quick:
        </span>
        {[10, 25, 45, 60].map((m) => (
          <button
            key={m}
            onClick={() => handleQuickPreset(m)}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[var(--badge-bg)] border border-[var(--border-card)] text-[var(--text-main)] hover:border-[var(--accent-color)] transition-all cursor-pointer"
          >
            {m}m
          </button>
        ))}

        <form onSubmit={handleCustomSubmit} className="flex items-center gap-1">
          <input
            type="number"
            min="1"
            max="180"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            placeholder="Custom m"
            className="w-20 px-2 py-1 text-xs font-semibold rounded-lg bg-[var(--bg-input)] border border-[var(--border-card)] text-[var(--text-main)] outline-none"
            aria-label="Custom duration in minutes"
          />
          <button
            type="submit"
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white shadow-sm hover:opacity-90 cursor-pointer"
          >
            Set
          </button>
        </form>
      </div>

      {/* Timer Display */}
      <div className="text-6xl md:text-7xl font-extrabold tracking-tighter text-center my-4 font-mono text-[var(--text-main)] drop-shadow-md">
        {formatTime(timeLeft)}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={toggleTimer}
          className="px-6 py-2.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
          aria-label={isRunning ? 'Pause Timer' : 'Start Timer'}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : 'Start Focus'}
        </button>
        <button
          onClick={resetTimer}
          className="px-5 py-2.5 rounded-xl font-bold text-sm bg-[var(--badge-bg)] border border-[var(--border-card)] text-[var(--text-main)] hover:bg-opacity-80 transition-all flex items-center gap-2 cursor-pointer"
          aria-label="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Counter Footer */}
      <div className="mt-4 text-center text-xs font-semibold text-[var(--text-muted)] flex items-center justify-center gap-1.5">
        <Bell className="w-3.5 h-3.5 text-[#f472b6]" /> Completed Sessions Today: <strong className="text-[#ec4899] font-bold">{completedSessions}</strong>
      </div>
    </div>
  );
}
