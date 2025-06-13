import { type UseChatHelpers } from "ai/react"

export const handleDecide = (
  append: UseChatHelpers["append"],
  options: string[],
  context: string,
) => {
  const userFacingMessage = `Help me decide: ${options.join(" or ")}?`
  const systemPrompt =
    "You are a decisive assistant. You must pick one clear winner without commenting on the difficulty of the choice. Choosing neither is not an option. State your decision clearly, then provide a brief explanation for your choice."

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