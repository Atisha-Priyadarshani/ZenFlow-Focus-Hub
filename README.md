# ZenFlow — Mindfulness & Task Flow Workspace

## Track: Frontend AI Engineering (Week 5 Assignment: FE-07 & FE-08)

ZenFlow is a modern productivity and focus workspace built with **React 19**, **Next.js 15 App Router**, **TypeScript**, and **Tailwind CSS**.

---

## FE-07 Generative UI Server Tool Contract

### Tool Name: `generatePomodoroFocusPlan`
- **Purpose**: Server-side tool that generates customized Pomodoro focus block schedules and mindfulness break recommendations based on task difficulty.

### Zod Schema Definition:
```typescript
import { z } from 'zod';

export const TaskPriorityInputSchema = z.object({
  taskTitle: z.string().describe('The primary task or goal to schedule'),
  difficultyLevel: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  estimatedMinutes: z.number().min(5).max(480).describe('Duration in minutes'),
  userEnergyLevel: z.enum(['low', 'medium', 'high']).default('high'),
});
```

### Return Shape:
```typescript
export interface TaskPriorityResult {
  taskTitle: string;
  difficultyLevel: string;
  totalDurationMinutes: number;
  priorityScore: number;
  recommendedFocusBlocks: PomodoroBlock[];
  mindfulnessAdvice: string;
}
```

---

## FE-08 Error & Sabotage Testing (Checkpoint 1)
- **Next.js Error Boundary**: Defined in `src/app/error.tsx`.
- **Mid-Stream Error Recovery**: Working Retry action button for failed messages.
- **Onboarding Empty State**: Interactive click-to-fill sample prompt cards.
- **Sabotage Selector**: Live header toggle testing 429 rate limits and stream breaks.

---

## Run Locally
```bash
npm install
npm run dev
```

## Run Production Build
```bash
npm run build
```
