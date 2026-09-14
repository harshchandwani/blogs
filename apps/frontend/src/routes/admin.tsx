import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, FileText, LogOut, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api, getAuthToken, setAuthToken, type Article } from "@/lib/api";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Writing Workspace — Field Notes" },
      {
        name: "description",
        content:
          "A focused Markdown writing and preview workspace for Field Notes.",
      },
      { property: "og:title", content: "Writing Workspace — Field Notes" },
      {
        property: "og:description",
        content:
          "A focused Markdown writing and preview workspace for Field Notes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
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
  const queryClient = useQueryClient();
  const [token, setToken] = useState(getAuthToken);
  const [password, setPassword] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [title, setTitle] = useState(
    "Designing systems that explain themselves",
  );
  const [excerpt, setExcerpt] = useState(
    "A practical framework for drawing better boundaries, choosing useful abstractions, and leaving a clear trail for the next person.",
  );
  const [published, setPublished] = useState(false);
  const articlesQuery = useQuery({
    queryKey: ["articles", "admin"],
    queryFn: api.listArticles,
    enabled: Boolean(token),
  });
  const loginMutation = useMutation({
    mutationFn: api.login,
    onSuccess: ({ token: nextToken }) => {
      setToken(nextToken);
      setPassword("");
    },
  });
  const saveMutation = useMutation({
    mutationFn: (nextPublished: boolean) =>
      selectedId
        ? api.updateArticle(selectedId, {
            title,
            excerpt,
            content: markdown,
            published: nextPublished,
          })
        : api.createArticle({
            title,
            excerpt,
            content: markdown,
            published: nextPublished,
          }),
    onSuccess: (article) => {
      setSelectedId(article.id);
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => api.deleteArticle(selectedId!),
    onSuccess: () => {
      setSelectedId(null);
      setTitle("");
      setExcerpt("");
      setMarkdown("");
      setPublished(false);
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  if (!token)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <form
          className="w-full max-w-sm space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            loginMutation.mutate(password);
          }}
        >
          <div>
            <p className="text-xs font-semibold uppercase text-accent">
              Field Notes
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-foreground">
              Writing workspace
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage articles.
            </p>
          </div>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Admin password"
            aria-label="Admin password"
          />
          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
          {loginMutation.error && (
            <p className="text-sm text-destructive">
              {loginMutation.error.message}
            </p>
          )}
        </form>
      </div>
    );

  const selectArticle = (article: Article) => {
    setSelectedId(article.id);
    setTitle(article.title);
    setExcerpt(article.excerpt ?? "");
    setMarkdown(article.content);
    setPublished(article.published);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 w-full max-w-[96rem] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <Link to="/" className="font-semibold text-foreground">
              Field Notes
            </Link>
            <span className="hidden h-5 w-px bg-border sm:block" />
            <span className="truncate text-sm text-muted-foreground">
              Designing systems that explain themselves
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {saveMutation.isSuccess
                ? "Saved just now"
                : published
                  ? "Ready to publish"
                  : "Draft"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setAuthToken(null);
                setToken(null);
              }}
              aria-label="Sign out"
            >
              <LogOut />
            </Button>
            <Button
              variant="outline"
              size="sm"
              aria-label="Save draft"
              onClick={() => {
                setPublished(false);
                saveMutation.mutate(false);
              }}
              disabled={saveMutation.isPending}
            >
              <Save /> <span className="hidden sm:inline">Save</span>
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setPublished(true);
                saveMutation.mutate(true);
              }}
              disabled={saveMutation.isPending}
            >
              Publish
            </Button>
          </div>
        </div>
      </header>
      {published && (
        <div className="border-b border-primary bg-primary px-6 py-2 text-center text-xs font-semibold text-primary-foreground">
          Article published successfully.
        </div>
      )}
      <main className="mx-auto grid w-full max-w-[96rem] flex-1 lg:grid-cols-2">
        <section
          className="flex min-h-[calc(100vh-4rem)] flex-col border-border lg:border-r"
          aria-labelledby="editor-title"
        >
          <div className="flex h-12 items-center gap-2 border-b border-border px-5 text-xs font-semibold uppercase text-muted-foreground">
            <FileText className="size-4" />
            <h1 id="editor-title">Markdown</h1>
            <div className="ml-auto flex items-center gap-2 normal-case">
              <select
                className="max-w-48 bg-transparent text-xs font-normal"
                value={selectedId ?? "new"}
                onChange={(event) => {
                  const article = articlesQuery.data?.find(
                    (item) => item.id === Number(event.target.value),
                  );
                  if (article) selectArticle(article);
                  else {
                    setSelectedId(null);
                    setTitle("");
                    setExcerpt("");
                    setMarkdown("");
                    setPublished(false);
                  }
                }}
              >
                <option value="new">New article</option>
                {articlesQuery.data?.map((article) => (
                  <option key={article.id} value={article.id}>
                    {article.title}
                  </option>
                ))}
              </select>
              {selectedId && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete article"
                  onClick={() => deleteMutation.mutate()}
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-3 border-b border-border p-5">
            <Input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setPublished(false);
              }}
              placeholder="Article title"
              aria-label="Article title"
            />
            <Input
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="Excerpt"
              aria-label="Article excerpt"
            />
          </div>
          <Textarea
            aria-label="Markdown editor"
            value={markdown}
            onChange={(event) => {
              setMarkdown(event.target.value);
              setPublished(false);
            }}
            spellCheck
            className="min-h-[calc(100vh-7rem)] flex-1 resize-none rounded-none border-0 bg-editor p-6 font-mono text-sm leading-7 shadow-none focus-visible:ring-0"
          />
        </section>
        <section
          className="min-h-[calc(100vh-4rem)]"
          aria-labelledby="preview-title"
        >
          <div className="flex h-12 items-center gap-2 border-b border-border px-5 text-xs font-semibold uppercase text-muted-foreground">
            <Eye className="size-4" />
            <h2 id="preview-title">Preview</h2>
          </div>
          <div className="mx-auto max-w-3xl px-7 py-12 lg:px-12">
            <p className="text-xs font-semibold text-accent">
              {published ? "PUBLISHED" : "DRAFT"}
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-foreground">
              {title || "Untitled article"}
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">{excerpt}</p>
            <div className="mt-9">
              <MarkdownContent content={markdown} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
