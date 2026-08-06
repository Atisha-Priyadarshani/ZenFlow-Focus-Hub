import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trash2, Plus, AlertTriangle } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
}

export const TaskManager: React.FC = () => {
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

  // Persist tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zenflow_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
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
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
    }
  };

  return (
    <div className="card card-scrollable" role="region" aria-label="Study Tasks Manager">
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#f8fafc' }}>Focus Objectives</h3>

      <form onSubmit={addTask} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <input
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          placeholder="Add a new study task..."
          style={{
            flex: 1,
            padding: '0.6rem 1rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(15, 23, 42, 0.6)',
            color: 'white',
            outline: 'none',
          }}
          aria-label="New task title"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: '0.6rem 0.8rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(15, 23, 42, 0.6)',
            color: 'white',
          }}
          aria-label="Task category"
        >
          <option value="Study">Study</option>
          <option value="Coding">Coding</option>
          <option value="Reading">Reading</option>
        </select>
        <button type="submit" className="btn btn-primary" aria-label="Add Task">
          <Plus size={18} />
        </button>
      </form>

      {/* Delete Confirmation Banner */}
      {taskToDelete && (
        <div className="delete-banner" role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#f87171' }}>
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
              style={{ background: 'rgba(255,255,255,0.1)', color: '#cbd5e1', border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Fixed Container Height + Internal Scrollable Task List */}
      <div className="scrollable-list">
        {tasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', padding: '1rem 0' }}>
            No tasks added yet. Stay focused and add your first objective!
          </p>
        ) : (
          <div>
            {tasks.map((task) => (
              <div key={task.id} className="task-item">
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flex: 1 }}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed ? (
                    <CheckCircle2 size={18} color="#10b981" />
                  ) : (
                    <Circle size={18} color="#94a3b8" />
                  )}
                  <span className={task.completed ? 'task-completed' : ''} style={{ fontSize: '0.9rem' }}>
                    {task.title}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', borderRadius: '6px' }}>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
