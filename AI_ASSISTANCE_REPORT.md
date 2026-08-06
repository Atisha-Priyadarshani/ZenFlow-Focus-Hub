# Week 3 AI Assistance & Manual Refactoring Report: ZenFlow

## Overview of AI Assistance

AI was utilized as an interactive co-developer throughout the implementation of **ZenFlow (Focus Productivity & Study Workspace)**:
- **Architecture Scaffolding**: AI accelerated setup by drafting modular React component structures (`PomodoroTimer.tsx`, `TaskManager.tsx`, `SoundscapePlayer.tsx`).
- **Styling**: AI generated glassmorphic CSS rules with custom color variables for the dark productivity theme.
- **Testing**: AI produced initial Vitest unit test templates.

---

## Manual Corrections, Bug Fixes & Refactoring Case Studies

Reviewing AI-generated code is a mandatory engineering step. Below are three concrete manual improvements made to AI-generated code:

### Case Study 1: Timer Interval Memory Leak & Cleanup Fix
* **AI Output Issue**: The AI initially generated a `useEffect` hook for the Pomodoro timer that started a `setInterval` without returning a cleanup function. Every time `timeLeft` or `isRunning` updated, multiple parallel timers were spawned, causing the timer to tick down multiple seconds per second.
* **Manual Fix**: Refactored the `useEffect` hook to store `interval` references and explicitly return a cleanup function (`return () => clearInterval(interval)`).

```typescript
// AI Code (Buggy):
useEffect(() => {
  if (isRunning) {
    setInterval(() => setTimeLeft(prev => prev - 1), 1000); // ❌ Memory leak
  }
}, [isRunning]);

// Manual Engineering Fix:
useEffect(() => {
  let interval: NodeJS.Timeout | null = null;
  if (isRunning && timeLeft > 0) {
    interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
  }
  return () => {
    if (interval) clearInterval(interval); // ✅ Clean unmount
  };
}, [isRunning, timeLeft]);
```

---

### Case Study 2: LocalStorage Deserialization Guard
* **AI Output Issue**: The AI initialized `tasks` state with `JSON.parse(localStorage.getItem('zenflow_tasks'))` without error handling. If a user had invalid JSON or disabled cookies, the application crashed with a white-screen `SyntaxError`.
* **Manual Fix**: Wrapped the state initializer and `setItem` sync calls in `try / catch` blocks with fallback initial state defaults.

```typescript
// Manual Engineering Fix:
const [tasks, setTasks] = useState<Task[]>(() => {
  try {
    const saved = localStorage.getItem('zenflow_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  } catch {
    return DEFAULT_TASKS; // ✅ Graceful fallback
  }
});
```

---

### Case Study 3: Accessibility & ARIA Semantics Refactoring
* **AI Output Issue**: The AI generated mode controls using non-semantic `<div>` tags with `onClick` listeners, making the timer unusable for keyboard navigation and screen readers.
* **Manual Fix**: Refactored `<div>` controls to semantic `<button>` elements with `role="tab"`, `aria-selected`, `aria-label`, and `role="tablist"` containers.

---

## Conclusion
AI reduced routine boilerplate writing by ~60%, while human engineering review ensured code correctness, zero memory leaks, robust error handling, and web accessibility compliance.
