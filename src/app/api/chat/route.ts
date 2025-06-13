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
    const { messages, data } = await req.json();
    console.log('Received data:', JSON.stringify(data, null, 2));

    let system: string | undefined = undefined;
    let finalMessages = messages;

    if (data?.isDecision === "true") {
      const { systemPrompt, options, context } = data;
      const parsedOptions = JSON.parse(options);

      system = systemPrompt;

      const fullUserPrompt = `Help me decide between the following options:\n${parsedOptions
        .map((opt: string) => `- ${opt}`)
        .join(
          "\n",
        )}\n\nContext: ${context || "No context provided."}`;

      // Replace the last, user-facing message with the full prompt for the AI
      finalMessages = [
        ...messages.slice(0, -1),
        { role: "user", content: fullUserPrompt },
      ];

      console.log(
        'This is a decision request. Using system prompt and modified user prompt.',
      );
    } else if (data?.isOotd === "true") {
      const { systemPrompt, weather, settings, context } = data;
      const parsedSettings = JSON.parse(settings);

      system = systemPrompt;

      const fullUserPrompt = `I need an outfit for a 22-year-old girl. The weather is ${weather}. The setting is ${parsedSettings.join(
        ", ",
      )}. Other context: ${context || "N/A"}`;

      finalMessages = [
        ...messages.slice(0, -1),
        { role: "user", content: fullUserPrompt },
      ];
      console.log(
        'This is an OOTD request. Using system prompt and modified user prompt.',
      );
    } else if (data?.isPottery === "true") {
      const { systemPrompt } = data;
      system = systemPrompt;
      console.log('This is a Pottery request. Using system prompt.');
    }

    const result = await streamText({
      model: deepseek('deepseek-chat'),
      system,
      messages: finalMessages,
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