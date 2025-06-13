import { type UseChatHelpers } from "ai/react"

export const handleDecide = (
  append: UseChatHelpers["append"],
  options: string[],
  context: string,
) => {
  const userFacingMessage = `Help me decide: ${options.join(" or ")}?`
  const systemPrompt =
    "You are a decisive assistant helping a user make a choice. You must pick one clear winner. Do not comment on the difficulty of the choice or suggest choosing neither. Announce your decision in a natural, conversational way. For example, start with 'I'd go with...', 'My pick is...', or 'Definitely...'. Avoid repetitive openings. After stating your choice clearly, provide a brief explanation."

  append(
    {
      role: "user",
      content: userFacingMessage,
    },
    {
      data: {
        isDecision: "true",
        systemPrompt,
        options: JSON.stringify(options),
        context,
      },
    },
  )
}

export const handleOotd = (
  append: UseChatHelpers["append"],
  weather: string,
  settings: string[],
  context: string,
) => {
  const userFacingMessage = `Give me an outfit suggestion for a ${weather.toLowerCase()} day for a ${settings.join(
    ", ",
  )} setting.`
  const systemPrompt =
    "You are a fashion stylist for a 22-year-old girl. Your goal is to provide three distinct and stylish outfit options based on the user's request. After presenting the three options, you must choose one as your top recommendation and explain why."

  append(
    {
      role: "user",
      content: userFacingMessage,
    },
    {
      data: {
        isOotd: "true",
        systemPrompt,
        weather,
        settings: JSON.stringify(settings),
        context,
      },
    },
  )
}

export const handlePottery = (
  append: UseChatHelpers["append"],
  question: string,
) => {
  const userFacingMessage = question
  const systemPrompt =
    "You are a helpful pottery assistant for a girl named Abby. You are an expert in pottery and are specifically tailored to her setup. You know that she uses air-dry clay, has a manually rotated (non-motorized) pottery wheel, and owns a lot of tools. Your advice should always take these constraints and resources into account. Be encouraging and provide clear, actionable steps."

  append(
    {
      role: "user",
      content: userFacingMessage,
    },
    {
      data: {
        isPottery: "true",
        systemPrompt,
      },
    },
  )
} 