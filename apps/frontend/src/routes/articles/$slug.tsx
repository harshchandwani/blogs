import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/blog/site-header";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { api } from "@/lib/api";

export const Route = createFileRoute("/articles/$slug")({
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const articleQuery = useQuery({
    queryKey: ["article", slug],
    queryFn: () => api.getArticle(slug),
  });
  const article = articleQuery.data;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <header className="mx-auto w-full max-w-4xl px-6 pb-14 pt-16 lg:px-8 lg:pt-24">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> All writing
          </Link>
          <div className="mt-12 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="font-semibold text-accent">Field notes</span>
            <span>—</span>
            <time>
              {article
                ? new Date(article.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : ""}
            </time>
          </div>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.08] text-foreground sm:text-6xl">
            {article?.title ?? "Loading article..."}
          </h1>
          <p className="mt-7 max-w-3xl text-xl leading-8 text-muted-foreground">
            {article?.excerpt ?? ""}
          </p>
        </header>
        <article className="mx-auto w-full max-w-3xl px-6 pb-28 pt-8 lg:px-8">
          {article ? (
            <MarkdownContent content={article.content} />
          ) : (
            <p>Loading article...</p>
          )}
        </article>
      </main>
    </div>
  );
}
