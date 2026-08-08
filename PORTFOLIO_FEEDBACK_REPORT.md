# Task 3: Ship the Ugly One — Live Portfolio Feedback & "Still Ugly" List

> **General AI Fluency — Week 5 Assignment**  
> **Student**: Atisha Priyadarshani  
> **Live Site URL**: `https://zenflow-focus-hub.vercel.app`  

---

## 1. Live Reachability Verification

All primary sitemap pages are deployed live and reachable over HTTPS without console errors:
- `/` — Main Focus Dashboard & Streak Counter
- `/chat` — Generative UI Pomodoro Assistant (FE-07 / FE-08)
- `/playground` — Accessible Component Playground (FE-05)
- `/tasks` — Deep Work Task Board
- `/habits` — Daily Habit Tracker
- `/health` — Subsystem Telemetry & Focus Health Monitor

---

## 2. Real Person Review Reaction

I shared the live Vercel link (`https://zenflow-focus-hub.vercel.app`) with a peer reviewer in product design:

* **What they saw**:
  - The vibrant pink/purple glassmorphism theme and motivation quote pill gave the workspace a calming aesthetic.
  - The Generative Pomodoro schedule matrix in `/chat` felt like a tailored focus planner.

* **What confused them**:
  - The habit streak flame icons on `/habits` were not clickable to manually log completed sprints.
  - They recommended adding a sound notification trigger when Pomodoro blocks finish.

---

## 3. Honest "Still Ugly" List

1. **Audio Notifications**: Pomodoro break transitions currently use visual cues instead of chime audio alerts.
2. **Task Drag-and-Drop**: Task cards on `/tasks` use button-based status changes rather than full drag-and-drop reordering.
3. **Streak Persistence**: Habit streak history relies on localStorage rather than a backend database.
