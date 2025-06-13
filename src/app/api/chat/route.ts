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
  try {
    const { messages, data } = await req.json();

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
    } else if (data?.isOotd === "true") {
      const { systemPrompt, weather, settings, context, isWalking } = data;
      const parsedSettings = JSON.parse(settings);

      system = systemPrompt;

      const walkingInfo = isWalking
        ? "The user will be walking to a place called Ropack, so the outfit must be comfortable for walking."
        : ""

      const fullUserPrompt = `I need an outfit for a 22-year-old girl. The weather is ${weather}. The setting is ${parsedSettings.join(
        ", ",
      )}. ${walkingInfo} Other context: ${context || "N/A"}`;

      finalMessages = [
        ...messages.slice(0, -1),
        { role: "user", content: fullUserPrompt },
      ];
    } else if (data?.isPottery === "true") {
      const { systemPrompt } = data;
      system = systemPrompt;
    }

    const result = await streamText({
      model: deepseek('deepseek-chat'),
      system,
      messages: finalMessages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 