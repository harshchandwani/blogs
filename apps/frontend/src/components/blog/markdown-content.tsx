import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const parts = text.split(
    /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]*\))/g,
  );

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={index} href={link[2]} target="_blank" rel="noreferrer">
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

export function MarkdownContent({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let quote: string[] = [];
  let code: string[] = [];
  let codeLanguage = "";
  let inCodeBlock = false;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(
        <p key={`paragraph-${blocks.length}`}>
          {renderInline(paragraph.join(" "))}
        </p>,
      );
      paragraph = [];
    }
  };

  const flushQuote = () => {
    if (quote.length) {
      blocks.push(
        <blockquote key={`quote-${blocks.length}`}>
          {renderInline(quote.join(" "))}
        </blockquote>,
      );
      quote = [];
    }
  };

  lines.forEach((line) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        blocks.push(
          <pre key={`code-${blocks.length}`}>
            <code
              className={codeLanguage ? `language-${codeLanguage}` : undefined}
            >
              {code.join("\n")}
            </code>
          </pre>,
        );
        code = [];
        codeLanguage = "";
        inCodeBlock = false;
      } else {
        flushParagraph();
        flushQuote();
        codeLanguage = line.slice(3).trim();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      code.push(line);
      return;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushQuote();
      const Heading = `h${heading[1].length}` as "h1" | "h2" | "h3";
      blocks.push(
        <Heading key={`heading-${blocks.length}`}>
          {renderInline(heading[2])}
        </Heading>,
      );
      return;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      quote.push(line.slice(2));
      return;
    }

    const unorderedItem = line.match(/^[-*+]\s+(.+)$/);
    if (unorderedItem) {
      flushParagraph();
      flushQuote();
      blocks.push(
        <ul key={`list-${blocks.length}`}>
          <li>{renderInline(unorderedItem[1])}</li>
        </ul>,
      );
      return;
    }

    if (!line.trim()) {
      flushParagraph();
      flushQuote();
      return;
    }

    flushQuote();
    paragraph.push(line.trim());
  });

  flushParagraph();
  flushQuote();
  if (inCodeBlock) {
    blocks.push(
      <pre key={`code-${blocks.length}`}>
        <code>{code.join("\n")}</code>
      </pre>,
    );
  }

  return <div className="article-body">{blocks}</div>;
}
