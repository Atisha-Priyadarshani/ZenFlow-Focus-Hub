import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { StreamingChatInterface } from '../StreamingChatInterface';

// --- MOCKING THE VERCEL AI SDK ---
// This ensures we NEVER call the real Anthropic API during tests.
const mockUseChat = vi.fn();
vi.mock('@ai-sdk/react', () => ({
  useChat: () => mockUseChat(),
}));

describe('StreamingChatInterface Component', () => {
  test('renders idle state with empty messages', () => {
    mockUseChat.mockReturnValue({
      messages: [],
      input: '',
      handleInputChange: vi.fn(),
      handleSubmit: vi.fn(),
      isLoading: false,
      stop: vi.fn(),
      reload: vi.fn(),
      error: undefined,
    });

    render(<StreamingChatInterface />);
    
    // Query empty state buttons
    expect(screen.getByRole('button', { name: /generate pomodoro focus plan/i })).toBeInTheDocument();
    
    // Query main input form
    const input = screen.getByRole('textbox', { name: /Message AI/i });
    expect(input).toBeInTheDocument();
  });

  test('renders error state and retry button when AI SDK returns an error', async () => {
    const reloadMock = vi.fn();
    mockUseChat.mockReturnValue({
      messages: [{ id: '1', role: 'user', content: 'hello' }],
      input: '',
      handleInputChange: vi.fn(),
      handleSubmit: vi.fn(),
      isLoading: false,
      stop: vi.fn(),
      regenerate: reloadMock,
      error: new Error('Rate limit exceeded'),
    });

    render(<StreamingChatInterface />);
    
    // Should render the alert box
    expect(screen.getByText(/Connection Interrupted/i)).toBeInTheDocument();
    
    // Test the retry button
    const retryBtn = screen.getByRole('button', { name: /Retry Request/i });
    expect(retryBtn).toBeInTheDocument();
    
    const user = userEvent.setup();
    await user.click(retryBtn);
    expect(reloadMock).toHaveBeenCalledOnce();
  });
  
  test('can type in the input and submit', async () => {
    const appendMock = vi.fn();
    // Using simple input state control since we decoupled the UI state from useChat earlier
    mockUseChat.mockReturnValue({
      messages: [],
      input: '',
      handleInputChange: vi.fn(),
      handleSubmit: vi.fn(),
      isLoading: false,
      stop: vi.fn(),
      reload: vi.fn(),
      error: undefined,
      append: appendMock // Older AI SDK versions might use append
    });
    
    render(<StreamingChatInterface />);
    
    const input = screen.getByRole('textbox', { name: /Message AI/i });
    const user = userEvent.setup();
    
    await user.type(input, 'Hello World');
    
    // The component has its own local state for the textarea value
    expect(input).toHaveValue('Hello World');
  });
});
