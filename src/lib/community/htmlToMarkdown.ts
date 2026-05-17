/**
 * Minimal HTML→Markdown converter for the in-house resource editor.
 * Handles only the tags our toolbar can produce:
 *   p, br, strong/b, em/i, h2, h3, blockquote, ul/ol/li, a, img, hr, iframe
 *
 * Iframes / videos / dividers are serialized as kozai custom fences so the
 * MarkdownBody renderer can reconstruct them.
 */
const escapeMd = (s: string) => s.replace(/([\\`*_{}[\]()#+\-.!>])/g, "\\$1");

export function htmlToMarkdown(html: string): string {
  if (typeof window === "undefined") return html;
  const root = document.createElement("div");
  root.innerHTML = html;
  return walk(root).trim();
}

function walk(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? "").replace(/ /g, " ");
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  const children = Array.from(el.childNodes).map(walk).join("");

  switch (tag) {
    case "br": return "\n";
    case "p":  return `\n\n${children}\n\n`;
    case "strong":
    case "b":  return `**${children}**`;
    case "em":
    case "i":  return `*${children}*`;
    case "h2": return `\n\n## ${children}\n\n`;
    case "h3": return `\n\n### ${children}\n\n`;
    case "blockquote": return `\n\n${children.split("\n").map((l) => `> ${l}`).join("\n")}\n\n`;
    case "ul": {
      const items = Array.from(el.querySelectorAll(":scope > li"))
        .map((li) => `- ${walk(li).trim()}`)
        .join("\n");
      return `\n\n${items}\n\n`;
    }
    case "ol": {
      const items = Array.from(el.querySelectorAll(":scope > li"))
        .map((li, i) => `${i + 1}. ${walk(li).trim()}`)
        .join("\n");
      return `\n\n${items}\n\n`;
    }
    case "li": return children;
    case "a": {
      const href = el.getAttribute("href") ?? "";
      return `[${children}](${href})`;
    }
    case "img": {
      const src = el.getAttribute("src") ?? "";
      const alt = el.getAttribute("alt") ?? "";
      return `\n\n![${alt}](${src})\n\n`;
    }
    case "hr": return `\n\n::divider\n\n`;
    case "iframe": {
      const src = el.getAttribute("src") ?? "";
      return `\n\n::video[${src}]\n\n`;
    }
    case "video": {
      const src = el.getAttribute("src") ?? "";
      return `\n\n::video[${src}]\n\n`;
    }
    case "div":
    case "span": return children;
    default: return children;
  }
  void escapeMd;
}
