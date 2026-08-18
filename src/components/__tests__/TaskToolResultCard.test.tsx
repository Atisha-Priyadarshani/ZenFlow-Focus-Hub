import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TaskToolResultCard } from '../TaskToolResultCard';
import type { TaskPriorityResult } from '@/lib/tools';

describe('TaskToolResultCard Component', () => {
  test('renders streaming state correctly', () => {
    render(<TaskToolResultCard state="input-streaming" />);
    // Querying by text since there's no interactive role for streaming text
    expect(screen.getByText(/Generating ZenFlow Pomodoro Focus Schedule/i)).toBeInTheDocument();
  });

  test('renders error state with retry button', async () => {
    const onRetryMock = vi.fn();
    render(<TaskToolResultCard state="output-error" onRetry={onRetryMock} error="Simulated failure" />);
    
    // Query by Role
    const retryBtn = screen.getByRole('button', { name: /Retry Tool Call/i });
    expect(retryBtn).toBeInTheDocument();
    
    const user = userEvent.setup();
    await user.click(retryBtn);
    expect(onRetryMock).toHaveBeenCalledOnce();
  });

  test('renders completed tool result correctly', () => {
    const mockResult: TaskPriorityResult = {
      taskTitle: 'Learn Vitest',
      priorityScore: 95,
      difficultyLevel: 'hard',
      estimatedMinutes: 60,
      totalDurationMinutes: 60,
      mindfulnessAdvice: 'Breathe deeply before starting.',
      recommendedFocusBlocks: [
        { type: 'focus', durationMinutes: 25, description: 'Read docs' },
        { type: 'break', durationMinutes: 5, description: 'Stretch' }
      ]
    };

    render(<TaskToolResultCard state="output-available" result={mockResult} />);
    
    // Check if difficulty and title are rendered
    expect(screen.getByText('Learn Vitest')).toBeInTheDocument();
    expect(screen.getByText(/hard/i)).toBeInTheDocument();
    expect(screen.getByText('Breathe deeply before starting.')).toBeInTheDocument();
    expect(screen.getByText('Read docs')).toBeInTheDocument();
  });
});
