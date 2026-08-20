import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Sparkles, Clock, ShieldCheck, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TOOLS } from "@/lib/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aster Assistant — AI Productivity Assistant" },
      {
        name: "description",
        content:
          "A simple AI productivity assistant for writing emails, summarizing text, rewriting drafts, brainstorming ideas and creating professional content.",
      },
      { property: "og:title", content: "Aster Assistant — AI Productivity Assistant" },
      {
        property: "og:description",
        content: "Write emails, summarize, rewrite, brainstorm and draft professional content in seconds.",
      },
    ],
  }),
  component: Home,
});

const STATS = [
  { icon: Clock, label: "Minutes saved per draft", value: "~12" },
  { icon: Zap, label: "Tools ready to use", value: "5" },
  { icon: ShieldCheck, label: "Your text stays yours", value: "Private" },
];

function Home() {
  return (
    <main>
      <section className="border-b border-border bg-[var(--gradient-hero)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" /> Your everyday writing partner
          </span>
          <h1 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Get everyday work written, summarized and organized.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            Describe what you need in plain words. Aster turns it into a clean draft you can send,
            share or build on.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="brand" size="lg">
              <Link to="/assistant" search={{ tool: "email" }}>
                <Mail className="size-4" /> Start with an email
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/assistant" search={{ tool: "summarize" }}>
                Explore all tools
              </Link>
            </Button>
          </div>

          <dl className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-card/80 p-4 shadow-[var(--shadow-soft)]"
              >
                <s.icon className="size-4.5 text-primary" />
                <dt className="mt-3 text-xs text-muted-foreground">{s.label}</dt>
                <dd className="text-lg font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Pick a tool to begin</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Five focused tools — no setup, no learning curve.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.id}
              to="/assistant"
              search={{ tool: t.id }}
              className="group rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-brand)]"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <t.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold">{t.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 text-xs text-muted-foreground sm:px-6">
          Aster Assistant — a simple AI productivity workspace.
        </div>
      </footer>
    </main>
  );
}
