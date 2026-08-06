import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PomodoroTimer } from './PomodoroTimer';

describe('PomodoroTimer Component', () => {
  it('renders initial focus timer duration of 25:00', () => {
    render(<PomodoroTimer />);
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });

  it('switches duration to 05:00 when Short Break mode pill is clicked', () => {
    render(<PomodoroTimer />);
    const shortBreakBtn = screen.getByRole('tab', { name: /Short Break/i });
    fireEvent.click(shortBreakBtn);
    expect(screen.getByText('05:00')).toBeInTheDocument();
  });

  it('toggles start and pause button label when clicked', () => {
    render(<PomodoroTimer />);
    const startBtn = screen.getByRole('button', { name: /Start Timer/i });
    expect(startBtn).toHaveTextContent(/Start Focus/i);

    fireEvent.click(startBtn);
    expect(screen.getByRole('button', { name: /Pause Timer/i })).toHaveTextContent(/Pause/i);
  });
});
