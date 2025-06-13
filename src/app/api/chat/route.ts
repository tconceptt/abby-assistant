import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

if (!process.env.DEEPSEEK_API_KEY) {
  throw new Error(
    'The DEEPSEEK_API_KEY environment variable is missing or empty.',
  );
}

// Create a deepseek provider instance
const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

export async function POST(req: Request) {
  console.log('POST /api/chat called');
  try {
    const { messages } = await req.json();
    console.log('Received messages:', JSON.stringify(messages, null, 2));

    console.log(
      'Is DEEPSEEK_API_KEY set?',
      process.env.DEEPSEEK_API_KEY ? 'Yes, starting with ' + process.env.DEEPSEEK_API_KEY.slice(0, 4) : 'No',
    );

    const result = await streamText({
      model: deepseek('deepseek-chat'),
      messages,
      async onFinish(result) {
        console.log('Stream finished successfully.');
      },
      onError: e => {
        console.error('Error in streamText:', e);
      },
    });

    console.log('Returning data stream response.');
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 