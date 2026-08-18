import { test, expect } from '@playwright/test';

test.describe('ZenFlow AI Chat Primary Flow', () => {
  test('User can submit a message and interact with empty states', async ({ page }) => {
    // Navigate to the chat page
    await page.goto('http://localhost:3000/chat');

    // Wait for the chat interface to load
    await expect(page.getByRole('textbox', { name: /Message AI/i })).toBeVisible();

    // Verify empty state onboarding buttons are present
    const planButton = page.getByRole('button', { name: /generate pomodoro focus plan/i });
    await expect(planButton).toBeVisible();

    // Type a message and submit
    const input = page.getByRole('textbox', { name: /Message AI/i });
    await input.fill('I need to study math for 2 hours');
    await input.press('Enter');

    // Verify the user message appears in the chat log
    await expect(page.getByText('I need to study math for 2 hours')).toBeVisible();
    
    // We expect the AI to either stream a response or trigger a tool
    // Since this is an E2E test running against a mock or live API depending on env,
    // we just ensure the app doesn't crash and the input clears
    await expect(input).toHaveValue('');
  });
});
