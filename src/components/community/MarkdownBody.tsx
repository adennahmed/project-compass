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
/**
 * Pre-process kozai custom fences:
 *   ::video[https://...]  → embedded iframe (youtube/vimeo) or <video>
 *   ::divider             → hairline rule
 *
 * We inject raw HTML through a sentinel that we render as a passthrough
 * component. Since react-markdown is configured without raw-HTML support,
 * we instead split the source on these fences and render the pieces in
 * sequence.
 */
type Block =
  | { kind: "md"; value: string }
  | { kind: "video"; url: string }
  | { kind: "divider" };

const parseBlocks = (src: string): Block[] => {
  const blocks: Block[] = [];
  const lines = src.split(/\r?\n/);
  let buf: string[] = [];
  const flush = () => {
    if (buf.length) {
      blocks.push({ kind: "md", value: buf.join("\n") });
      buf = [];
    }
  };
  for (const line of lines) {
    const trimmed = line.trim();
    const vm = trimmed.match(/^::video\[(.+)\]$/);
    if (vm) {
      flush();
      blocks.push({ kind: "video", url: vm[1].trim() });
      continue;
    }
    if (trimmed === "::divider") {
      flush();
      blocks.push({ kind: "divider" });
      continue;
    }
    buf.push(line);
  }
  flush();
  return blocks;
};

const isIframeUrl = (url: string) =>
  /youtube\.com\/embed\//.test(url) ||
  /youtu\.be\//.test(url) ||
  /player\.vimeo\.com\/video\//.test(url) ||
  /vimeo\.com\/\d+/.test(url);

const toIframeUrl = (url: string) => {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const v = url.match(/vimeo\.com\/(\d+)/);
  if (v) return `https://player.vimeo.com/video/${v[1]}`;
  return url;
};

const VideoBlock = ({ url }: { url: string }) => {
  if (isIframeUrl(url) || /youtube|vimeo/.test(url)) {
    return (
      <div className="my-6 aspect-video w-full border border-paper/12 bg-ink/60">
        <iframe
          src={toIframeUrl(url)}
          title="Embedded video"
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <video src={url} controls className="my-6 w-full border border-paper/12 bg-ink/60" />
  );
};

const MarkdownBody = ({ source, size = "default" }: MarkdownBodyProps) => {
  const wrap =
    size === "article"
      ? "kz-markdown kz-markdown--article"
      : size === "compact"
        ? "kz-markdown kz-markdown--compact"
        : "kz-markdown";
  const blocks = parseBlocks(source);
  return (
    <div className={wrap}>
      {blocks.map((b, i) => {
        if (b.kind === "video") return <VideoBlock key={i} url={b.url} />;
        if (b.kind === "divider")
          return <hr key={i} className="my-8 border-0 border-t border-paper/15" />;
        return (
      <ReactMarkdown
        key={i}
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
        {b.value}
      </ReactMarkdown>
        );
      })}
    </div>
  );
};

export default MarkdownBody;
