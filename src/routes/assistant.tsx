import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Copy, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { runAssistant } from "@/lib/assistant.functions";
import {
  TOOLS,
  TOOL_MAP,
  TOOL_OPTIONS,
  defaultOptions,
  isToolId,
  parseTasks,
  type ToolId,
} from "@/lib/tools";


export const Route = createFileRoute("/assistant")({
  validateSearch: (search: Record<string, unknown>): { tool: ToolId } => ({
    tool: isToolId(search["tool"]) ? search["tool"] : "email",
  }),
  head: () => ({
    meta: [
      { title: "AI Assistant Workspace | Aster Assistant" },
      {
        name: "description",
        content:
          "Pick a tool, describe your task, and get results: smart emails, meeting note summaries and AI task plans.",
      },
      { property: "og:title", content: "AI Assistant Workspace | Aster Assistant" },
      {
        property: "og:description",
        content: "Smart email generator, meeting notes summarizer and AI task planner.",
      },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [options, setOptions] = useState<Record<string, string>>(() => defaultOptions(search.tool));
  const run = useServerFn(runAssistant);

  const tool = TOOL_MAP[search.tool];
  const toolOptions = TOOL_OPTIONS[search.tool];
  const isPlanner = search.tool === "planner";
  const completed = tasks.filter((_, i) => done[i]).length;

  const mutation = useMutation({
    mutationFn: (data: { tool: ToolId; prompt: string; options: Record<string, string> }) =>
      run({ data }),
    onSuccess: (data) => {
      setResult(data.text);
      setTasks(parseTasks(data.text));
      setDone({});
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  function selectTool(id: ToolId) {
    setResult("");
    setTasks([]);
    setDone({});
    setOptions(defaultOptions(id));
    void navigate({ search: { tool: id } });
  }

  function copyResult() {
    const text = isPlanner
      ? tasks.map((t, i) => `${done[i] ? "[x]" : "[ ]"} ${t}`).join("\n")
      : result;
    void navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  function submit() {
    if (!prompt.trim()) {
      toast.error("Tell the assistant what you need first.");
      return;
    }
    mutation.mutate({ tool: search.tool, prompt: prompt.trim(), options });
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Assistant workspace</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose a tool, describe your task in plain words, and get a draft you can edit.
      </p>

      <section className="mt-6" aria-label="Tools">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => {
            const active = t.id === search.tool;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTool(t.id)}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? "border-primary bg-secondary shadow-[var(--shadow-brand)]"
                    : "border-border bg-card hover:border-primary/40 hover:bg-secondary/50"
                }`}
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                    active ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                  }`}
                >
                  <Icon className="size-4.5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{t.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{t.tagline}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-sm font-semibold">{tool.name}</h2>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={tool.placeholder}
            className="mt-3 min-h-44 resize-none rounded-xl text-sm"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <button
              type="button"
              onClick={() => setPrompt(tool.example)}
              className="text-primary underline-offset-4 hover:underline"
            >
              Use an example
            </button>
            <span>{prompt.length}/8000</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {toolOptions.map((opt) => (
              <label key={opt.id} className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {opt.label}
                </span>
                <select
                  value={options[opt.id] ?? opt.choices[0]}
                  onChange={(e) => setOptions((p) => ({ ...p, [opt.id]: e.target.value }))}
                  className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm text-foreground"
                >
                  {opt.choices.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <Button
            onClick={submit}
            disabled={mutation.isPending}
            variant="brand"
            size="lg"
            className="mt-4 w-full"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Working…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Generate
              </>
            )}
          </Button>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">
              {isPlanner ? "Task checklist" : "Result"}
              {isPlanner && tasks.length > 0 && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {completed}/{tasks.length} done
                </span>
              )}
            </h2>
            {result && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={submit} disabled={mutation.isPending}>
                  <RotateCcw className="size-3.5" /> Regenerate
                </Button>
                <Button variant="ghost" size="sm" onClick={copyResult}>
                  <Copy className="size-3.5" /> Copy
                </Button>
              </div>
            )}
          </div>
          <div className="mt-3 min-h-44 rounded-xl bg-muted/60 p-4 text-sm leading-relaxed">
            {mutation.isPending ? (
              <span className="text-muted-foreground">
                {isPlanner ? "Building your task plan…" : `Drafting your ${tool.name.toLowerCase()}…`}
              </span>
            ) : isPlanner && tasks.length > 0 ? (
              <ul className="space-y-2.5">
                {tasks.map((t, i) => (
                  <li key={`${i}-${t}`} className="flex items-start gap-3">
                    <Checkbox
                      id={`task-${i}`}
                      checked={!!done[i]}
                      onCheckedChange={(v) => setDone((p) => ({ ...p, [i]: v === true }))}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor={`task-${i}`}
                      className={`cursor-pointer select-none text-sm ${
                        done[i] ? "text-muted-foreground line-through" : ""
                      }`}
                    >
                      {t}
                    </label>
                  </li>
                ))}
              </ul>
            ) : result ? (
              <span className="whitespace-pre-wrap">{result}</span>
            ) : (
              <span className="flex items-center gap-2 text-muted-foreground">
                {isPlanner ? "Your checklist will appear here" : "Your draft will appear here"}{" "}
                <ArrowRight className="size-3.5" />
              </span>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

