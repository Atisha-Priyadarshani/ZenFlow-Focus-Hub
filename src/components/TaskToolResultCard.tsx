'use client';

import React from 'react';
import { TaskPriorityInput, TaskPriorityResult } from '@/lib/tools';
import { Sparkles, Clock, CheckCircle2, AlertTriangle, Loader2, RefreshCw, Flame } from 'lucide-react';

export type ToolState = 'input-streaming' | 'input-available' | 'output-available' | 'output-error';

export interface TaskToolResultCardProps {
  state: ToolState;
  input?: Partial<TaskPriorityInput>;
  result?: TaskPriorityResult;
  error?: string;
  onRetry?: () => void;
}

export function TaskToolResultCard({
  state,
  input,
  result,
  error,
  onRetry,
}: TaskToolResultCardProps) {
  if (state === 'input-streaming') {
    return (
      <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/40 animate-pulse text-xs space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 font-bold">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>[Tool Streaming]: Generating ZenFlow Pomodoro Focus Schedule...</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Streaming Input Parameters: {JSON.stringify(input || {})}
        </div>
      </div>
    );
  }

  if (state === 'input-available') {
    return (
      <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/50 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-indigo-300 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-indigo-400 animate-bounce" />
            Tool Executing: generatePomodoroFocusPlan
          </span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold border border-indigo-500/30">
            EXECUTING
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-300">
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            Task: {input?.taskTitle || 'General'}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            Est. Minutes: {input?.estimatedMinutes || 25}m
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            Difficulty: {input?.difficultyLevel || 'medium'}
          </span>
        </div>
      </div>
    );
  }

  if (state === 'output-error') {
    return (
      <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-xs space-y-3 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-400 font-extrabold">
            <AlertTriangle className="w-4 h-4" />
            <span>Tool Execution Failed</span>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-lg font-bold text-[11px] transition-all"
            >
              <RefreshCw className="w-3 h-3" /> Retry Tool Call
            </button>
          )}
        </div>
        <p className="text-[11px] text-red-200/90 font-medium">
          {error || 'An unexpected error occurred while generating the Pomodoro focus plan.'}
        </p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-500/40 shadow-xl space-y-4 text-xs font-sans animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-indigo-300">
              ZenFlow Generative Focus Plan
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold">
              Goal: <span className="text-white font-bold">{result.taskTitle}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold text-xs">
          <span>Priority Score: {result.priorityScore}/100</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 font-semibold">Difficulty Level</div>
          <div className="text-sm font-extrabold text-indigo-400 uppercase">{result.difficultyLevel}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 font-semibold">Total Target Duration</div>
          <div className="text-sm font-extrabold text-white flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> {result.totalDurationMinutes} mins
          </div>
        </div>
      </div>

      {/* Recommended Sprint Blocks Schedule */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-indigo-300">
          Recommended Pomodoro Sprint Schedule ({result.recommendedFocusBlocks.length} Blocks):
        </div>
        <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-900 pr-1">
          {result.recommendedFocusBlocks.map((block, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-lg border text-[11px] flex justify-between items-center ${
                block.type === 'focus'
                  ? 'bg-indigo-950/60 border-indigo-500/30 text-indigo-100'
                  : 'bg-purple-950/40 border-purple-500/30 text-purple-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 ${block.type === 'focus' ? 'text-indigo-400' : 'text-purple-400'}`} />
                <span className="font-semibold">{block.description}</span>
              </div>
              <span className="font-mono font-bold shrink-0">{block.durationMinutes}m</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 font-medium">
        <span className="font-bold text-indigo-300">Mindfulness Advice: </span>
        {result.mindfulnessAdvice}
      </div>
    </div>
  );
}
