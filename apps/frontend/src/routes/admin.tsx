import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, FileText, Save } from "lucide-react";
import { useState } from "react";
import { ArticleContent } from "@/components/blog/article-content";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Writing Workspace — Field Notes" },
    { name: "description", content: "A focused Markdown writing and preview workspace for Field Notes." },
    { property: "og:title", content: "Writing Workspace — Field Notes" },
    { property: "og:description", content: "A focused Markdown writing and preview workspace for Field Notes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: AdminPage,
});

const initialMarkdown = `# Designing systems that explain themselves

The best software decisions rarely come from knowing more patterns. They come from seeing the system clearly enough to know which trade-offs actually matter.

## Start with the boundary

When a feature feels difficult to change, we tend to reach for another abstraction. Before doing that, draw the boundary around the behavior.

> Architecture is not the number of layers in a diagram. It is the quality of the decisions those lines preserve.

## Make the happy path obvious

Readers of code scan before they study. Put the central transformation in view.

\`\`\`ts
type Draft = { title: string; body: string };

export function publish(draft: Draft) {
  if (!draft.title.trim()) return { ok: false };
  return { ok: true };
}
\`\`\``;

function AdminPage() {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [published, setPublished] = useState(false);
  return <div className="flex min-h-screen flex-col bg-background">
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 w-full max-w-[96rem] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4"><Link to="/" className="font-semibold text-foreground">Field Notes</Link><span className="hidden h-5 w-px bg-border sm:block" /><span className="truncate text-sm text-muted-foreground">Designing systems that explain themselves</span></div>
        <div className="flex items-center gap-2"><span className="hidden text-xs text-muted-foreground sm:inline">{published ? "Published just now" : "Draft saved"}</span><Button variant="outline" size="sm" aria-label="Save draft"><Save /> <span className="hidden sm:inline">Save</span></Button><Button size="sm" onClick={() => setPublished(true)}>Publish</Button></div>
      </div>
    </header>
    {published && <div className="border-b border-primary bg-primary px-6 py-2 text-center text-xs font-semibold text-primary-foreground">Article published successfully.</div>}
    <main className="mx-auto grid w-full max-w-[96rem] flex-1 lg:grid-cols-2">
      <section className="flex min-h-[calc(100vh-4rem)] flex-col border-border lg:border-r" aria-labelledby="editor-title">
        <div className="flex h-12 items-center gap-2 border-b border-border px-5 text-xs font-semibold uppercase text-muted-foreground"><FileText className="size-4" /><h1 id="editor-title">Markdown</h1></div>
        <Textarea aria-label="Markdown editor" value={markdown} onChange={(event) => { setMarkdown(event.target.value); setPublished(false); }} spellCheck className="min-h-[calc(100vh-7rem)] flex-1 resize-none rounded-none border-0 bg-editor p-6 font-mono text-sm leading-7 shadow-none focus-visible:ring-0" />
      </section>
      <section className="min-h-[calc(100vh-4rem)]" aria-labelledby="preview-title">
        <div className="flex h-12 items-center gap-2 border-b border-border px-5 text-xs font-semibold uppercase text-muted-foreground"><Eye className="size-4" /><h2 id="preview-title">Preview</h2></div>
        <div className="mx-auto max-w-3xl px-7 py-12 lg:px-12"><p className="text-xs font-semibold text-accent">ARCHITECTURE · 8 MIN READ</p><h2 className="mt-4 text-4xl font-semibold leading-tight text-foreground">Designing systems that explain themselves</h2><div className="mt-9"><ArticleContent /></div></div>
      </section>
    </main>
  </div>;
}
