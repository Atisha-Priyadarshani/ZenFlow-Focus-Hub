import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, describe, beforeEach } from 'vitest';
import { TaskManager } from '../TaskManager';

describe('TaskManager Validated Form', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('prevents empty task submission (validation)', async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const initialTasks = screen.getAllByRole('button', { name: /Delete task/i }).length;

    const input = screen.getByRole('textbox', { name: 'New task title' });
    const submitBtn = screen.getByRole('button', { name: 'Add Task' });

    // Submit with empty input
    await user.clear(input);
    await user.click(submitBtn);

    const finalTasks = screen.getAllByRole('button', { name: /Delete task/i }).length;
    // Task count should not have changed
    expect(finalTasks).toBe(initialTasks);
  });

  test('allows adding a valid task', async () => {
    render(<TaskManager />);
    
    const input = screen.getByRole('textbox', { name: 'New task title' });
    
    // Use fireEvent for synchronous state updates in testing-library
    fireEvent.change(input, { target: { value: 'Write Playwright Tests' } });
    
    const submitBtn = screen.getByRole('button', { name: 'Add Task' });
    fireEvent.click(submitBtn);

    // Verify task is added to the list (query by text)
    expect(await screen.findByText('Write Playwright Tests')).toBeInTheDocument();
  });
});
