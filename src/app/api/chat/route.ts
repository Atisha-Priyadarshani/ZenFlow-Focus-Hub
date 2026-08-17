import { NextRequest } from 'next/server';
import { streamText, tool } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { ZENFLOW_AI_SYSTEM_PROMPT } from '@/lib/aiConfig';
import { TaskPriorityInputSchema, executeTaskPriorityAnalysis } from '@/lib/tools';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || '';

    // Initialize Google AI provider with custom header for AQ.Ab8 keys
    const google = createGoogleGenerativeAI({
      apiKey,
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        headers.set('x-goog-api-key', apiKey);
        return fetch(input, { ...init, headers });
      },
    });

    const result = streamText({
      model: google('gemini-3.5-flash-lite'),
      system: ZENFLOW_AI_SYSTEM_PROMPT,
      messages,
      tools: {
        generatePomodoroFocusPlan: tool({
          description: 'Analyzes user focus sessions, current distraction level, and returns a focus health score and actionable recommendation.',
          // @ts-expect-error - Zod version type mismatch with AI SDK
          parameters: TaskPriorityInputSchema,
          execute: async (input) => {
            // Add an artificial delay so the user can see the "input-available" execution state
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return executeTaskPriorityAnalysis(input);
          },
        }),
      },
      onError: ({ error }) => {
        console.error('[DEBUG] Internal streamText error:', error);
      }
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('[DEBUG] streamText error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process streaming chat' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
