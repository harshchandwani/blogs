import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import architectureImage from "@/assets/article-architecture.jpg";
import typescriptImage from "@/assets/article-typescript.jpg";
import designImage from "@/assets/article-design.jpg";
import { SiteHeader } from "@/components/blog/site-header";
import { api, type Article } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Field Notes — Learning in Public" },
      {
        name: "description",
        content:
          "Practical notes on software design, TypeScript, and building thoughtful interfaces.",
      },
      { property: "og:title", content: "Field Notes — Learning in Public" },
      {
        property: "og:description",
        content:
          "Practical notes on software design, TypeScript, and building thoughtful interfaces.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const fallbackArticles = [
  {
    title: "Designing systems that explain themselves",
    date: "September 8, 2026",
    topic: "Architecture",
    excerpt:
      "A practical framework for drawing better boundaries, choosing useful abstractions, and leaving a clear trail for the next person.",
    image: architectureImage,
    alt: "Software architecture diagrams and pencils on a green desk",
    href: "/articles/designing-systems",
  },
  {
    title: "Making impossible states impossible",
    date: "August 24, 2026",
    topic: "TypeScript",
    excerpt:
      "How discriminated unions turn ambiguous product logic into code that is safer to change and easier to understand.",
    image: typescriptImage,
    alt: "Laptop and printed type-system notes on a worktable",
    href: "/articles/designing-systems",
  },
  {
    title: "A design system should reduce decisions",
    date: "August 10, 2026",
    topic: "Design systems",
    excerpt:
      "Tokens become valuable when they carry intent—not when they simply rename a collection of hex values.",
    image: designImage,
    alt: "Green and orange design swatches beside typography sheets",
    href: "/articles/designing-systems",
  },
] as const;

function Index() {
  const articlesQuery = useQuery({
    queryKey: ["articles"],
    queryFn: api.listArticles,
  });
  const articles: readonly (Article | (typeof fallbackArticles)[number])[] =
    articlesQuery.data ?? fallbackArticles;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-20 lg:px-8 lg:pt-28">
        <section
          className="max-w-3xl border-l-2 border-accent pl-6 sm:pl-8"
          aria-labelledby="page-title"
        >
          <p className="mb-5 text-xs font-semibold uppercase text-accent">
            Learning in public · Issue 04
          </p>
          <h1
            id="page-title"
            className="max-w-2xl text-5xl font-semibold leading-[1.08] text-foreground sm:text-6xl"
          >
            Notes from building things carefully.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
            Essays and field notes on software, interfaces, and the decisions
            that shape both.
          </p>
        </section>

        <section className="mt-24" aria-labelledby="latest-heading">
          <div className="flex items-end justify-between border-b border-primary pb-4">
            <h2
              id="latest-heading"
              className="text-sm font-semibold uppercase text-foreground"
            >
              Latest writing
            </h2>
            <span className="text-xs text-muted-foreground">
              {articles.length.toString().padStart(2, "0")} articles
            </span>
          </div>
          <div>
            {articles.map((article, index) => {
              const href = `/articles/${article.slug}`;
              const date =
                "createdAt" in article
                  ? new Date(article.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : article.date;
              return (
                <article
                  key={article.title}
                  className="grid gap-8 border-b border-border py-10 md:grid-cols-[minmax(0,1fr)_18rem] md:items-center lg:gap-16"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-semibold text-primary">
                        {"topic" in article ? article.topic : "Field notes"}
                      </span>
                      <span aria-hidden="true">—</span>
                      <time>{date}</time>
                    </div>
                    <h3 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-foreground">
                      <Link
                        to={href}
                        className="transition-colors hover:text-accent"
                      >
                        {article.title}
                      </Link>
                    </h3>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                      {article.excerpt ?? ""}
                    </p>
                    <Link
                      to={href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-accent"
                    >
                      Read note{" "}
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                  <Link
                    to={href}
                    className="group order-first block overflow-hidden bg-secondary md:order-last"
                    aria-label={`Read ${article.title}`}
                  >
                    {"image" in article ? (
                      <img
                        src={article.image}
                        alt={article.alt}
                        width={1200}
                        height={760}
                        loading={index === 0 ? "eager" : "lazy"}
                        className="aspect-[16/10] h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
                      />
                    ) : (
                      <div className="aspect-[16/10] bg-secondary" />
                    )}
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl justify-between px-6 py-8 text-xs text-muted-foreground lg:px-8">
          <span>Field Notes</span>
          <span>Written with intent.</span>
        </div>
      </footer>
    </div>
  );
}
