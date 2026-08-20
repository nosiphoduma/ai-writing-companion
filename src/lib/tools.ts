import { Mail, FileText, ListChecks, type LucideIcon } from "lucide-react";

export type ToolId = "email" | "summarize" | "planner";

export type Tool = {
  id: ToolId;
  name: string;
  tagline: string;
  icon: LucideIcon;
  placeholder: string;
  example: string;
};

export const TOOLS: Tool[] = [
  {
    id: "email",
    name: "Smart Email Generator",
    tagline: "Draft clear, ready-to-send emails in seconds",
    icon: Mail,
    placeholder: "Who is it for and what do you want to say?",
    example: "Email my team that Friday's status meeting moves to 10am.",
  },
  {
    id: "summarize",
    name: "Meeting Notes Summarizer",
    tagline: "Turn raw notes into decisions and action items",
    icon: FileText,
    placeholder: "Paste your meeting notes or transcript here…",
    example:
      "Notes: Sprint review. Ana demoed onboarding. Login bug still open, Ben to fix by Tuesday. Marketing wants launch on the 14th. Budget approved.",
  },
  {
    id: "planner",
    name: "AI Task Planner",
    tagline: "Turn a goal into a checklist you can tick off",
    icon: ListChecks,
    placeholder: "Describe the goal or project you want to plan…",
    example: "Launch a customer newsletter within the next month.",
  },
];

export const TOOL_MAP = Object.fromEntries(TOOLS.map((t) => [t.id, t])) as Record<ToolId, Tool>;

export function isToolId(value: unknown): value is ToolId {
  return typeof value === "string" && value in TOOL_MAP;
}

export type ToolOption = {
  id: string;
  label: string;
  choices: string[];
};

export const TOOL_OPTIONS: Record<ToolId, ToolOption[]> = {
  email: [
    { id: "tone", label: "Tone", choices: ["Friendly", "Professional", "Direct", "Apologetic", "Persuasive"] },
    { id: "length", label: "Length", choices: ["Short", "Medium", "Detailed"] },
  ],
  summarize: [
    {
      id: "focus",
      label: "Focus",
      choices: ["Key points and action items", "Decisions only", "Action items only", "Full recap"],
    },
    { id: "length", label: "Length", choices: ["Very short", "Medium", "Detailed"] },
  ],
  planner: [
    { id: "number of tasks", label: "Tasks", choices: ["5", "8", "12"] },
    { id: "timeframe", label: "Timeframe", choices: ["This week", "Two weeks", "One month", "One quarter"] },
    { id: "detail level", label: "Detail", choices: ["Simple steps", "With owners and deadlines"] },
  ],
};

export function defaultOptions(tool: ToolId): Record<string, string> {
  return Object.fromEntries(TOOL_OPTIONS[tool].map((o) => [o.id, o.choices[0] as string]));
}

/** Parse plain-text AI output into checklist task lines. */
export function parseTasks(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter((line) => line.length > 1 && !line.endsWith(":"));
}
