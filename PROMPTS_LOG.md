# Week 3 AI Development Prompts Log: ZenFlow Study Hub

## Target Application
**ZenFlow — Focus Productivity & Study Workspace** (React 18 + TypeScript + Vite)

---

## Chronological Prompts Log

### Phase 1: Architecture Scaffolding
> **Prompt 1**:  
> *"Act as a Senior React Engineer. Build ZenFlow—a focus productivity study hub for students using React 18, TypeScript, and Vite. Requirements: 1) Pomodoro Focus Timer with preset mode pills (25m Focus, 5m Short Break, 15m Long Break), 2) Focus Objectives Task Manager with category pills, fixed card container height, internal scrollbar, and task delete confirmation banner."*

---

### Phase 2: Daily Habit Tracker & Activity Calendar

> **Prompt 2 (Daily Habit & Streak Tracker)**:  
> *"Create `HabitTracker.tsx` with a `+ Add Habit` modal trigger allowing users to input Habit Name and Target Info. Display a daily streak counter (🔥 5d streak), habit completion toggle buttons, and localStorage persistence."*

> **Prompt 3 (Completion History Calendar)**:  
> *"Create `CompletionCalendar.tsx` rendering a current month date picker grid. Clicking any date displays the completed focus objectives and total focus minutes recorded on that date."*

---

### Phase 3: Verification & Test Suite

> **Prompt 4 (Vitest Suite)**:  
> *"Write co-located Vitest unit tests in `PomodoroTimer.test.tsx` testing focus duration initialization (25:00), mode switching (05:00 short break), and start/pause toggle labels."*
