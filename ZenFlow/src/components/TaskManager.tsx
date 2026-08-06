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

export const TaskManager: React.FC<TaskManagerProps> = ({ onTaskCompleted }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('zenflow_tasks');
      return saved ? JSON.parse(saved) : [
        { id: '1', title: 'Complete Frontend AI Engineering Drill', completed: true, category: 'Study' },
        { id: '2', title: 'Review TypeScript Interfaces & Vitest Tests', completed: false, category: 'Coding' },
        { id: '3', title: 'Read Anthropic Prompting Guide', completed: false, category: 'Reading' },
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

  // Sort tasks so uncompleted items stay at the top and completed items move to the bottom
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
    <div className="card" role="region" aria-label="Study Tasks Manager">
      <h3 style={{ margin: '0 0 0.85rem 0', fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700 }}>Focus Objectives</h3>

      <form onSubmit={addTask} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          placeholder="Add a new study task..."
          style={{
            flex: 1,
            padding: '0.55rem 0.85rem',
            borderRadius: '10px',
            border: '1px solid var(--border-card)',
            background: 'var(--bg-input)',
            color: 'var(--text-main)',
            outline: 'none',
          }}
          aria-label="New task title"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: '0.55rem 0.75rem',
            borderRadius: '10px',
            border: '1px solid var(--border-card)',
            background: 'var(--bg-input)',
            color: 'var(--text-main)',
          }}
          aria-label="Task category"
        >
          <option value="Study">Study</option>
          <option value="Coding">Coding</option>
          <option value="Reading">Reading</option>
        </select>
        <button type="submit" className="btn btn-primary" style={{ padding: '0.55rem 0.85rem' }} aria-label="Add Task">
          <Plus size={18} />
        </button>
      </form>

      {taskToDelete && (
        <div className="delete-banner" role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>
            <AlertTriangle size={18} /> Delete task: {taskToDelete.title.slice(0, 20)}?
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={confirmDeleteTask}
              style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
            >
              Confirm
            </button>
            <button
              onClick={() => setTaskToDelete(null)}
              style={{ background: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border-card)', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="scrollable-list">
        {sortedTasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem', padding: '1rem 0' }}>
            No tasks added yet. Stay focused and add your first objective!
          </p>
        ) : (
          sortedTasks.map((task) => (
            <div key={task.id} className="task-item">
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flex: 1 }}
                onClick={() => toggleTask(task.id)}
              >
                {task.completed ? (
                  <CheckCircle2 size={18} color="var(--accent-color)" />
                ) : (
                  <Circle size={18} color="var(--text-dim)" />
                )}
                <span className={task.completed ? 'task-completed' : ''} style={{ fontSize: '0.9rem', color: task.completed ? 'var(--text-dim)' : 'var(--text-main)' }}>
                  {task.title}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--badge-bg)', color: 'var(--text-muted)', borderRadius: '6px', fontWeight: 700 }}>
                  {task.category}
                </span>
                <button
                  onClick={() => setTaskToDelete(task)}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                  aria-label={`Delete task ${task.title}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
