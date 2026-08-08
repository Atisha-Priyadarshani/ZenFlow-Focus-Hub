import { z } from 'zod';

/**
 * FE-07 Tool Contract: Task Priority & Pomodoro Focus Plan Tool
 * Defined with Zod schema and server-side execution function.
 */

export const TaskPriorityInputSchema = z.object({
  taskTitle: z.string().describe('The primary task or goal to schedule (e.g. Deep Code Audit, Exam Prep)'),
  difficultyLevel: z.enum(['low', 'medium', 'high', 'critical']).default('medium').describe('Task difficulty rating'),
  estimatedMinutes: z.number().min(5).max(480).describe('Estimated task duration in minutes'),
  userEnergyLevel: z.enum(['low', 'medium', 'high']).default('high').describe('Current cognitive energy level'),
});

export type TaskPriorityInput = z.infer<typeof TaskPriorityInputSchema>;

export interface PomodoroBlock {
  sprintNumber: number;
  durationMinutes: number;
  type: 'focus' | 'short-break' | 'long-break';
  description: string;
}

export interface TaskPriorityResult {
  taskTitle: string;
  difficultyLevel: string;
  totalDurationMinutes: number;
  priorityScore: number;
  recommendedFocusBlocks: PomodoroBlock[];
  mindfulnessAdvice: string;
}

export function executeTaskPriorityAnalysis(input: TaskPriorityInput): TaskPriorityResult {
  const numSprintBlocks = Math.ceil(input.estimatedMinutes / 25);
  const blocks: PomodoroBlock[] = [];

  for (let i = 1; i <= numSprintBlocks; i++) {
    blocks.push({
      sprintNumber: i,
      durationMinutes: 25,
      type: 'focus',
      description: `Pomodoro Focus Sprint #${i}: Deep Work on ${input.taskTitle}`,
    });

    if (i < numSprintBlocks) {
      if (i % 4 === 0) {
        blocks.push({
          sprintNumber: i,
          durationMinutes: 15,
          type: 'long-break',
          description: 'Long Recovery Break: Walk outside or hydrate',
        });
      } else {
        blocks.push({
          sprintNumber: i,
          durationMinutes: 5,
          type: 'short-break',
          description: 'Short Break: Deep breathing exercise',
        });
      }
    }
  }

  let priorityScore = 75;
  if (input.difficultyLevel === 'critical') priorityScore = 95;
  else if (input.difficultyLevel === 'high') priorityScore = 88;
  else if (input.difficultyLevel === 'low') priorityScore = 60;

  let mindfulnessAdvice = 'Maintain steady focus with regular 5-minute break intervals.';
  if (input.userEnergyLevel === 'low') {
    mindfulnessAdvice = 'Low energy detected: Start with a 10-minute lightweight warming task before entering deep work.';
  } else if (input.difficultyLevel === 'critical') {
    mindfulnessAdvice = 'Critical priority task: Eliminate all phone notifications during 25-minute sprints.';
  }

  return {
    taskTitle: input.taskTitle,
    difficultyLevel: input.difficultyLevel,
    totalDurationMinutes: input.estimatedMinutes,
    priorityScore,
    recommendedFocusBlocks: blocks,
    mindfulnessAdvice,
  };
}
