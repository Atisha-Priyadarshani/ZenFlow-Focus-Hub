import { NextRequest } from 'next/server';
import { ZENFLOW_AI_SYSTEM_PROMPT } from '@/lib/aiConfig';

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

    const lastMessage = messages[messages.length - 1]?.content || 'Hello';
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY;

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        if (apiKey && process.env.GEMINI_API_KEY) {
          try {
            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [
                    { role: 'user', parts: [{ text: `${ZENFLOW_AI_SYSTEM_PROMPT}\n\nUser Question: ${lastMessage}` }] },
                  ],
                }),
              }
            );

            if (response.body) {
              const reader = response.body.getReader();
              const decoder = new TextDecoder();
              let buffer = '';

              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    try {
                      const parsed = JSON.parse(line.replace('data: ', ''));
                      const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                      if (text) {
                        controller.enqueue(encoder.encode(text));
                      }
                    } catch (e) {
                      // Skip invalid chunk JSON
                    }
                  }
                }
              }
            }
          } catch (err) {
            controller.enqueue(encoder.encode(`[ZenFlow AI Stream Error]: ${String(err)}`));
          }
        } else {
          const simulatedResponse = `Welcome to ZenFlow AI Mindfulness & Task Coach.

Regarding your query ("${lastMessage}"):

• **Mindful Focus Action**: Take a 2-minute deep breathing break before starting your next task.
• **Task Breakdown Strategy**: Split your goal into three 25-minute Pomodoro focus sprints.
• **Productivity Tip**: Keep your workspace clear of notifications to protect your flow state.

Would you like me to generate a 25-minute focus schedule for your top priority task?`;

          const chunks = simulatedResponse.split(' ');
          for (let i = 0; i < chunks.length; i++) {
            const token = (i === 0 ? '' : ' ') + chunks[i];
            controller.enqueue(encoder.encode(token));
            await new Promise((resolve) => setTimeout(resolve, 40));
          }
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to process streaming chat' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
