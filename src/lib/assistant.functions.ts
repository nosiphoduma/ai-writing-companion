import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const SYSTEM_PROMPTS: Record<string, string> = {
  email:
    "You write clear, professional emails. Return a subject line then the email body. Keep it concise and ready to send.",
  summarize:
    "You summarize text accurately. Return a one-line takeaway followed by short bullet points. Never invent facts.",
  rewrite:
    "You rewrite text for clarity, correct grammar and a polished professional tone, keeping the original meaning.",
  brainstorm:
    "You are a practical brainstorming partner. Return a numbered list of concrete, varied ideas with a one-line note each.",
  professional:
    "You write polished professional business content with clear headings and tight, useful prose.",
};

const Input = z.object({
  tool: z.string().min(1),
  prompt: z.string().min(1).max(8000),
});

export const runAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured yet.");

    const gateway = createLovableAiGatewayProvider(key);
    const system =
      SYSTEM_PROMPTS[data.tool] ??
      "You are a helpful productivity assistant. Answer clearly and concisely in plain text.";

    const result = streamText({
      model: gateway("google/gemini-2.5-flash"),
      system: `${system} Use plain text with simple line breaks; avoid markdown symbols like ** or #.`,
      prompt: data.prompt,
    });

    return { text: await result.text };
  });
