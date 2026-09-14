export function ArticleContent() {
  return (
    <div className="article-body">
      <p className="article-lede">
        The best software decisions rarely come from knowing more patterns. They come from seeing the system clearly enough to know which trade-offs actually matter.
      </p>
      <h2>Start with the boundary</h2>
      <p>
        When a feature feels difficult to change, we tend to reach for another abstraction. Before doing that, draw the boundary around the behavior. Ask what enters, what leaves, and which parts are allowed to know about each other.
      </p>
      <p>
        A useful boundary has a small public surface. In TypeScript, that often means accepting a narrow input and returning a stable result rather than exposing every internal type. An inline value like <code>Result&lt;Post, DraftError&gt;</code> communicates more than a chain of thrown exceptions.
      </p>
      <blockquote>
        Architecture is not the number of layers in a diagram. It is the quality of the decisions those lines preserve.
      </blockquote>
      <h2>Make the happy path obvious</h2>
      <p>
        Readers of code scan before they study. Put the central transformation in view and move defensive details behind names that explain why they exist.
      </p>
      <pre aria-label="TypeScript example"><code>{`type Draft = { title: string; body: string };

type PublishResult =
  | { ok: true; slug: string }
  | { ok: false; reason: "empty" | "invalid" };

export function publish(draft: Draft): PublishResult {
  if (!draft.title.trim() || !draft.body.trim()) {
    return { ok: false, reason: "empty" };
  }

  return { ok: true, slug: toSlug(draft.title) };
}`}</code></pre>
      <h3>Prefer explicit states</h3>
      <p>
        Boolean combinations hide impossible situations. A discriminated union makes the state space inspectable, gives the editor useful autocomplete, and forces every caller to handle failure deliberately.
      </p>
      <h2>Leave a trail for the next reader</h2>
      <p>
        Good systems make their constraints visible. Names, types, and tests should tell the next person what must remain true. Comments are most valuable when they capture the reason a tempting alternative was rejected.
      </p>
    </div>
  );
}
