import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { useChat } from '@ai-sdk/react';

function TestComponent() {
  const { append } = useChat({ api: '/api/chat' });
  const [error, setError] = React.useState(null);

  return React.createElement(
    'div',
    null,
    React.createElement(
      'button',
      {
        onClick: () => {
          try {
            append({ role: 'user', content: 'test' });
          } catch (e) {
            setError(e.message);
          }
        },
        'data-testid': 'btn'
      },
      'Test'
    ),
    React.createElement('div', { 'data-testid': 'error' }, error)
  );
}

const { container } = render(React.createElement(TestComponent));
fireEvent.click(screen.getByTestId('btn'));

console.log('Error caught:', screen.getByTestId('error').textContent);
