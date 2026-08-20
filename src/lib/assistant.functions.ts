import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const SYSTEM_PROMPTS: Record<string, string> = {
  email:
    "You write clear, professional emails. Return a subject line then the email body. Keep it concise and ready to send.",
  summarize:
    "You summarize meeting notes accurately. Return a one-line takeaway, then a short 'Key points' list, then 'Decisions', then 'Action items' with an owner when one is mentioned. Never invent facts.",
  planner:
    "You are a practical project planner. Turn the user's goal into an ordered checklist of concrete tasks. Return ONLY the task lines, one task per line, each starting with '- '. No intro, no headings, no closing text. Each task is a short actionable sentence.",
};

const Input = z.object({
  tool: z.string().min(1),
  prompt: z.string().min(1).max(8000),
  options: z.record(z.string(), z.string()).optional(),
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

    const opts = Object.entries(data.options ?? {})
      .filter(([, v]) => v.trim().length > 0)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join("\n");

    const result = streamText({
      model: gateway("google/gemini-2.5-flash"),
      system: `${system} Use plain text with simple line breaks; avoid markdown symbols like ** or #.`,
      prompt: opts ? `${data.prompt}\n\nFollow these preferences:\n${opts}` : data.prompt,
    });

    return { text: await result.text };
  });

