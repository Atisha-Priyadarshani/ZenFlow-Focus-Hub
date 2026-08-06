# Week 3 AI Development Prompts Log: ZenFlow Study Hub

## Target Application
**ZenFlow — Focus Productivity & Study Workspace** (React + TypeScript + Vite)

---

## Chronological Prompts Log

### Phase 1: Architecture Scaffolding
> **Prompt 1**:  
> *"Act as a Senior React Engineer. Design a modern focus productivity application called ZenFlow using React 18, TypeScript, and Vite. The application requires: 1) A Pomodoro Timer with Focus (25m), Short Break (5m), and Long Break (15m) modes, 2) A Task Manager with category tagging and local storage persistence, and 3) An Ambient Soundscape Player. Provide modular components and glassmorphic styling rules."*

---

### Phase 2: Core Components Development

> **Prompt 2 (Pomodoro Timer)**:  
> *"Write a React 18 TypeScript component `PomodoroTimer.tsx`. Use `setInterval` to handle count-down logic. Support play/pause/reset controls, session counter state, and accessibility attributes for screen readers."*

> **Prompt 3 (Task Manager)**:  
> *"Build `TaskManager.tsx` using React state and `localStorage` to save, complete, and delete study objectives with category badges ('Study', 'Coding', 'Reading')."*

> **Prompt 4 (Soundscape Player)**:  
> *"Create `SoundscapePlayer.tsx` rendering interactive sound cards (Rain, Forest, Cafe, Lofi) with active toggle states and volume sliders."*

---

### Phase 3: Verification & Test Suite

> **Prompt 5 (Vitest Suite)**:  
> *"Write co-located Vitest unit tests in `PomodoroTimer.test.tsx` asserting initial rendering (25:00), mode switching (05:00), and button label toggles."*
