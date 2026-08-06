# Week 3 AI Assistance & Manual Refactoring Report: ZenFlow

## Overview of AI Assistance

AI served as an interactive co-developer during the construction of **ZenFlow (Focus Productivity & Study Workspace)**:
- **Component Drafting**: AI accelerated initial setup by generating modular component templates for `PomodoroTimer.tsx`, `TaskManager.tsx`, `HabitTracker.tsx`, and `CompletionCalendar.tsx`.
- **Styling**: AI generated custom CSS tokens for glassmorphism, glowing borders, and fixed scrollable container cards.
- **Testing**: AI produced initial Vitest unit test cases.

---

## Manual Corrections, Bug Fixes & Refactoring Case Studies

Reviewing AI-generated code is a mandatory engineering step. Below are three concrete manual improvements made to AI-generated code:

### Case Study 1: Pomodoro Interval Memory Leak & React State Out of Sync
* **AI Output Issue**: The AI created a `setInterval` timer inside `useEffect` without cleaning up the timer ref when switching timer mode pills (Focus vs Short Break). This resulted in multiple interval timers firing simultaneously.
* **Manual Fix**: Refactored the timer hook to return an explicit cleanup function `clearInterval(interval)` and reset `isRunning` state when mode pills change.

```typescript
// AI Code (Memory Leak Bug):
useEffect(() => {
  if (isRunning) {
    setInterval(() => setTimeLeft(t => t - 1), 1000); // ❌ Unhandled dangling interval
  }
}, [isRunning]);

// Manual Engineering Fix:
useEffect(() => {
  let interval: NodeJS.Timeout | null = null;
  if (isRunning && timeLeft > 0) {
    interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
  } else if (timeLeft === 0) {
    setIsRunning(false);
  }
  return () => {
    if (interval) clearInterval(interval); // ✅ Clean interval teardown
  };
}, [isRunning, timeLeft]);
```

---

### Case Study 2: localStorage Deserialization Error Guard
* **AI Output Issue**: The AI loaded initial task and habit states using raw `JSON.parse(localStorage.getItem('zenflow_tasks'))` without try/catch handling. If local storage contained corrupted JSON, the entire React component tree crashed on load.
* **Manual Fix**: Wrapped `localStorage` read operations in lazy state initializer functions with `try/catch` fallback blocks.

---

### Case Study 3: ARIA Tab & Alert Semantics for Accessibility
* **AI Output Issue**: The AI rendered timer mode pills using standard `<button>` elements without accessible roles, and rendered delete confirmation prompts without alert roles.
* **Manual Fix**: Added `role="tablist"`, `role="tab"`, `aria-selected`, and `role="alert"` attributes to ensure compliance with WAI-ARIA standards for screen reader users.

---

## Conclusion
AI accelerated routine UI scaffolding by ~60%, while human engineering review prevented memory leaks, handled JSON storage errors gracefully, and enforced modern web accessibility standards.
