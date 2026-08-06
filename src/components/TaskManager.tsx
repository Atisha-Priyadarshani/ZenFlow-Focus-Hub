'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, Circle, Trash2, Plus, AlertTriangle } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
}

interface TaskManagerProps {
  onTaskCompleted?: (title: string) => void;
}

export function TaskManager({ onTaskCompleted }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('zenflow_tasks');
      return saved ? JSON.parse(saved) : [
        { id: '1', title: 'Complete Next.js App Router Capstone Drill', completed: true, category: 'Study' },
        { id: '2', title: 'Review Server & Client Components Spec', completed: false, category: 'Coding' },
        { id: '3', title: 'Read Vercel Deployment Documentation', completed: false, category: 'Reading' },
      ];
    } catch {
      return [];
    }
  });

  const [inputTitle, setInputTitle] = useState('');
  const [category, setCategory] = useState('Study');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('zenflow_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: inputTitle.trim(),
      completed: false,
      category,
    };

    setTasks((prev) => [...prev, newTask]);
    setInputTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newCompleted = !t.completed;
          if (newCompleted && onTaskCompleted) {
            onTaskCompleted(t.title);
          }
          return { ...t, completed: newCompleted };
        }
        return t;
      })
    );
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
    }
  };

  return (
    <div className="zenflow-card h-[480px] flex flex-col" role="region" aria-label="Study Tasks Manager">
      <h3 className="text-lg font-extrabold text-[var(--text-main)] mb-3">Focus Objectives</h3>

      <form onSubmit={addTask} className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          placeholder="Add a new study task..."
          className="flex-1 px-3 py-2 text-xs md:text-sm rounded-xl bg-[var(--bg-input)] border border-[var(--border-card)] text-[var(--text-main)] outline-none"
          aria-label="New task title"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 text-xs md:text-sm rounded-xl bg-[var(--bg-input)] border border-[var(--border-card)] text-[var(--text-main)] cursor-pointer"
          aria-label="Task category"
        >
          <option value="Study">Study</option>
          <option value="Coding">Coding</option>
          <option value="Reading">Reading</option>
        </select>
        <button type="submit" className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white shadow-md cursor-pointer" aria-label="Add Task">
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {taskToDelete && (
        <div className="p-3 mb-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between animate-fade-in" role="alert">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-500">
            <AlertTriangle className="w-4 h-4" /> Delete task: {taskToDelete.title.slice(0, 20)}?
          </div>
          <div className="flex gap-2">
            <button
              onClick={confirmDeleteTask}
              className="px-2.5 py-1 text-xs font-bold bg-red-500 text-white rounded-lg cursor-pointer"
            >
              Confirm
            </button>
            <button
              onClick={() => setTaskToDelete(null)}
              className="px-2.5 py-1 text-xs font-semibold bg-[var(--bg-input)] text-[var(--text-main)] border border-[var(--border-card)] rounded-lg cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="scrollable-list flex-1 mt-1">
        {sortedTasks.length === 0 ? (
          <p className="text-center text-xs text-[var(--text-dim)] py-6">
            No tasks added yet. Stay focused and add your first objective!
          </p>
        ) : (
          sortedTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 mb-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-card)] hover:border-[var(--accent-color)] transition-all">
              <div
                className="flex items-center gap-3 cursor-pointer flex-1"
                onClick={() => toggleTask(task.id)}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#ec4899]" />
                ) : (
                  <Circle className="w-4 h-4 text-[var(--text-dim)]" />
                )}
                <span className={`text-xs md:text-sm font-medium ${task.completed ? 'line-through text-[var(--text-dim)]' : 'text-[var(--text-main)]'}`}>
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[var(--badge-bg)] text-[#f472b6]">
                  {task.category}
                </span>
                <button
                  onClick={() => setTaskToDelete(task)}
                  className="text-red-500 hover:text-red-600 p-1 cursor-pointer"
                  aria-label={`Delete task ${task.title}`}
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
