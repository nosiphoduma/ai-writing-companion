import { Mail, FileText, RefreshCw, Lightbulb, Briefcase, type LucideIcon } from "lucide-react";

export type ToolId = "email" | "summarize" | "rewrite" | "brainstorm" | "professional";

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
    name: "Write an email",
    tagline: "Draft clear, friendly emails in seconds",
    icon: Mail,
    placeholder: "Who is it for and what do you want to say?",
    example: "Email my team that Friday's status meeting moves to 10am.",
  },
  {
    id: "summarize",
    name: "Summarize text",
    tagline: "Turn long text into key points",
    icon: FileText,
    placeholder: "Paste the text you want summarized…",
    example: "Summarize these meeting notes into 5 bullet points.",
  },
  {
    id: "rewrite",
    name: "Rewrite text",
    tagline: "Polish tone, clarity and grammar",
    icon: RefreshCw,
    placeholder: "Paste the text you want rewritten…",
    example: "Rewrite this paragraph so it sounds warmer and shorter.",
  },
  {
    id: "brainstorm",
    name: "Brainstorm ideas",
    tagline: "Get fresh angles and next steps",
    icon: Lightbulb,
    placeholder: "What do you need ideas for?",
    example: "10 ideas for a customer appreciation campaign.",
  },
  {
    id: "professional",
    name: "Professional content",
    tagline: "Reports, posts and proposals",
    icon: Briefcase,
    placeholder: "Describe the document you need…",
    example: "A one-page project proposal for a new onboarding flow.",
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
    { id: "format", label: "Format", choices: ["Bullet points", "Short paragraph", "Key takeaways", "Action items"] },
    { id: "length", label: "Length", choices: ["Very short", "Medium", "Detailed"] },
  ],
  rewrite: [
    { id: "goal", label: "Goal", choices: ["Clearer", "More professional", "Friendlier", "Shorter", "More persuasive"] },
    { id: "reading level", label: "Reading level", choices: ["Simple", "Standard", "Expert"] },
  ],
  brainstorm: [
    { id: "number of ideas", label: "Ideas", choices: ["5", "10", "15"] },
    { id: "style", label: "Style", choices: ["Practical", "Creative", "Low budget", "Ambitious"] },
  ],
  professional: [
    {
      id: "document type",
      label: "Document",
      choices: ["Report", "Proposal", "LinkedIn post", "Meeting agenda", "Job description"],
    },
    { id: "length", label: "Length", choices: ["Short", "Medium", "Detailed"] },
  ],
};

export function defaultOptions(tool: ToolId): Record<string, string> {
  return Object.fromEntries(TOOL_OPTIONS[tool].map((o) => [o.id, o.choices[0] as string]));
}
