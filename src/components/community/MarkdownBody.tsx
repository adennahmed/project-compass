import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownBodyProps {
  source: string;
  /** Display variant — affects spacing + base size. */
  size?: "compact" | "default" | "article";
}

/**
 * Safe, scoped markdown renderer. react-markdown disables raw HTML by default,
 * so we don't need DOMPurify in this path. Custom components map every
 * element to the Kozai type system (mono inline code, hairline-bordered
 * blockquote, signal-orange links with link-wipe).
 */
const MarkdownBody = ({ source, size = "default" }: MarkdownBodyProps) => {
  const wrap =
    size === "article"
      ? "kz-markdown kz-markdown--article"
      : size === "compact"
        ? "kz-markdown kz-markdown--compact"
        : "kz-markdown";
  return (
    <div className={wrap}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="link-wipe text-signal hover:text-signal"
            >
              {children}
            </a>
          ),
          code: ({ className, children, ...rest }) => {
            const isBlock = (rest as any).inline === false || /language-/.test(className || "");
            if (isBlock) {
              return (
                <pre className="my-4 overflow-x-auto border border-paper/12 bg-ink/60 p-4 font-mono text-[12.5px] leading-[1.55] text-paper/85">
                  <code>{children}</code>
                </pre>
              );
            }
            return (
              <code className="border border-paper/12 bg-ink/60 px-1.5 py-0.5 font-mono text-[0.92em] text-paper/85">
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-signal/70 pl-4 italic text-paper/80">
              {children}
            </blockquote>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownBody;
