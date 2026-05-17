import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Reveal from "@/components/Reveal";
import { useAuth } from "@/lib/community/auth";
import { supabase } from "@/integrations/supabase/client";
import { fetchResourceBySlug } from "@/lib/community/queries";
import { htmlToMarkdown } from "@/lib/community/htmlToMarkdown";
import { ResourceKind, RESOURCE_KIND_LABEL } from "@/lib/community/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (supabase as unknown as any);

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/['"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const markdownToInitialHtml = (md: string) => {
  // Light, lossy back-conversion so editing existing resources roughly works.
  // We escape and then upgrade a tiny set of patterns.
  const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
  return md
    .split(/\n\n+/)
    .map((para) => {
      const t = para.trim();
      if (!t) return "";
      if (t === "::divider") return "<hr/>";
      const vm = t.match(/^::video\[(.+)\]$/);
      if (vm) return `<iframe src="${esc(vm[1])}" allowfullscreen></iframe>`;
      if (t.startsWith("## ")) return `<h2>${esc(t.slice(3))}</h2>`;
      if (t.startsWith("### ")) return `<h3>${esc(t.slice(4))}</h3>`;
      if (t.startsWith("> ")) return `<blockquote>${esc(t.replace(/^> /gm, ""))}</blockquote>`;
      if (/^![[]/.test(t)) {
        const m = t.match(/^!\[(.*?)\]\((.+)\)$/);
        if (m) return `<p><img src="${esc(m[2])}" alt="${esc(m[1])}"/></p>`;
      }
      if (t.startsWith("- ")) {
        return `<ul>${t.split("\n").map((l) => `<li>${esc(l.replace(/^- /, ""))}</li>`).join("")}</ul>`;
      }
      if (/^\d+\.\s/.test(t)) {
        return `<ol>${t.split("\n").map((l) => `<li>${esc(l.replace(/^\d+\.\s/, ""))}</li>`).join("")}</ol>`;
      }
      let html = esc(t)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
      return `<p>${html}</p>`;
    })
    .join("");
};

const ResourceEditor = () => {
  const { slug: editSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { session, profile, loading: authLoading } = useAuth();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugDirty, setSlugDirty] = useState(false);
  const [summary, setSummary] = useState("");
  const [kind, setKind] = useState<ResourceKind>("guide");
  const [tags, setTags] = useState("");
  const [hero, setHero] = useState("");
  const [publish, setPublish] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStaff = profile?.role === "staff" || profile?.role === "admin";

  // Gate
  useEffect(() => {
    if (authLoading) return;
    if (!session) navigate("/community/auth", { replace: true });
    else if (!isStaff) navigate("/community/resources", { replace: true });
  }, [authLoading, session, isStaff, navigate]);

  // Load existing if editing
  const loadExisting = useCallback(async () => {
    if (!editSlug) return;
    const r = await fetchResourceBySlug(editSlug);
    if (!r) return;
    setSavedId(r.id);
    setTitle(r.title);
    setSlug(r.slug);
    setSlugDirty(true);
    setSummary(r.summary);
    setKind(r.kind);
    setTags(r.tags.join(", "));
    setHero(r.hero_image_url ?? "");
    setPublish(!!r.published_at);
    if (editorRef.current) editorRef.current.innerHTML = markdownToInitialHtml(r.body_md);
  }, [editSlug]);

  useEffect(() => { void loadExisting(); }, [loadExisting]);

  // Auto-slug from title
  useEffect(() => {
    if (!slugDirty) setSlug(slugify(title));
  }, [title, slugDirty]);

  // ─── Toolbar actions (document.execCommand — deprecated but reliable) ──
  const exec = (cmd: string, arg?: string) => {
    // eslint-disable-next-line deprecation/deprecation
    document.execCommand(cmd, false, arg);
    editorRef.current?.focus();
  };

  const wrapBlock = (tag: "h2" | "h3" | "blockquote" | "p") => exec("formatBlock", tag);

  const addLink = () => {
    const url = window.prompt("Link URL:");
    if (url) exec("createLink", url);
  };

  const addImageUrl = () => {
    const url = window.prompt("Image URL:");
    if (url) exec("insertImage", url);
  };

  const addVideoUrl = () => {
    const url = window.prompt("Video URL (YouTube / Vimeo / .mp4):");
    if (!url) return;
    // Insert as iframe via insertHTML
    let src = url;
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (yt) src = `https://www.youtube.com/embed/${yt[1]}`;
    const v = url.match(/vimeo\.com\/(\d+)/);
    if (v) src = `https://player.vimeo.com/video/${v[1]}`;
    exec("insertHTML", `<p><iframe src="${src}" allowfullscreen></iframe></p>`);
  };

  const addDivider = () => exec("insertHTML", "<hr/>");

  const uploadImage = async (file: File) => {
    if (!supabase || !session) return;
    const path = `${session.user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error: upErr } = await db().storage.from("resource-media").upload(path, file, { upsert: false });
    if (upErr) { setError(upErr.message); return; }
    const { data } = db().storage.from("resource-media").getPublicUrl(path);
    if (data?.publicUrl) exec("insertImage", data.publicUrl);
  };

  const save = async () => {
    if (!supabase || !session) return;
    setError(null);
    if (!title.trim() || !slug.trim() || !summary.trim()) {
      setError("Title, slug, and summary are required.");
      return;
    }
    if (summary.length > 280) { setError("Summary must be ≤ 280 chars."); return; }
    if (!editorRef.current) return;
    setBusy(true);
    const bodyMd = htmlToMarkdown(editorRef.current.innerHTML);
    const tagArr = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const row = {
      slug: slug.trim(),
      title: title.trim(),
      summary: summary.trim(),
      body_md: bodyMd,
      hero_image_url: hero.trim() || null,
      tags: tagArr,
      kind,
      author_id: session.user.id,
      published_at: publish ? new Date().toISOString() : null,
    };
    let err;
    if (savedId) {
      ({ error: err } = await db().from("resources").update(row).eq("id", savedId));
    } else {
      ({ error: err } = await db().from("resources").insert(row));
    }
    setBusy(false);
    if (err) {
      if (/duplicate|unique/i.test(err.message)) setError("Slug already taken — pick another.");
      else setError(err.message);
      return;
    }
    navigate(`/community/resources/${slug.trim()}`);
  };

  const tbBtn = "border border-paper/15 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/85 hover:border-paper/35 hover:text-paper";

  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="container-wide max-w-[920px]">
        <Reveal>
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
            [ {savedId ? "Edit resource" : "New resource"} ]
          </div>
        </Reveal>

        <div className="mt-6 flex flex-col gap-5">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 w-full bg-transparent text-[24px] font-semibold text-paper placeholder:text-paper/35 focus:outline-none"
              placeholder="Untitled"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">Slug</label>
              <input
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugDirty(true); }}
                className="mt-1.5 w-full border border-paper/15 bg-ink/40 px-2 py-1.5 font-mono text-[13px] text-paper focus:border-paper/35 focus:outline-none"
                placeholder="kebab-case-here"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">Kind</label>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as ResourceKind)}
                className="mt-1.5 w-full border border-paper/15 bg-ink/40 px-2 py-1.5 text-[13px] text-paper focus:border-paper/35 focus:outline-none"
              >
                {(Object.keys(RESOURCE_KIND_LABEL) as ResourceKind[]).map((k) => (
                  <option key={k} value={k}>{RESOURCE_KIND_LABEL[k]}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
              Summary <span className="text-paper/35">({summary.length}/280)</span>
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value.slice(0, 320))}
              rows={2}
              className="mt-1.5 w-full resize-y border border-paper/15 bg-ink/40 p-2 text-[14px] text-paper focus:border-paper/35 focus:outline-none"
              placeholder="One sentence that makes someone want to read it."
            />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">Tags (comma-separated)</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1.5 w-full border border-paper/15 bg-ink/40 px-2 py-1.5 text-[13px] text-paper focus:border-paper/35 focus:outline-none"
                placeholder="internal-tools, ops"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">Hero image URL</label>
              <input
                value={hero}
                onChange={(e) => setHero(e.target.value)}
                className="mt-1.5 w-full border border-paper/15 bg-ink/40 px-2 py-1.5 text-[13px] text-paper focus:border-paper/35 focus:outline-none"
                placeholder="https://…"
              />
            </div>
          </div>

          {/* Editor */}
          <div className="mt-2">
            <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">Body</label>
            <div className="mt-1.5 border border-paper/15 bg-paper text-ink">
              {/* Toolbar (uses document.execCommand — deprecated but widely supported,
                  chosen here to avoid heavy editor dependencies). */}
              <div className="flex flex-wrap items-center gap-1.5 border-b border-ink/10 bg-paper p-2">
                <button type="button" onClick={() => exec("bold")} className="border border-ink/15 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink hover:border-ink/40"><b>B</b></button>
                <button type="button" onClick={() => exec("italic")} className="border border-ink/15 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink hover:border-ink/40"><i>I</i></button>
                <button type="button" onClick={() => wrapBlock("h2")} className="border border-ink/15 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink hover:border-ink/40">H2</button>
                <button type="button" onClick={() => wrapBlock("h3")} className="border border-ink/15 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink hover:border-ink/40">H3</button>
                <button type="button" onClick={() => wrapBlock("blockquote")} className="border border-ink/15 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink hover:border-ink/40">“ Quote</button>
                <button type="button" onClick={() => exec("insertUnorderedList")} className="border border-ink/15 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink hover:border-ink/40">• List</button>
                <button type="button" onClick={() => exec("insertOrderedList")} className="border border-ink/15 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink hover:border-ink/40">1. List</button>
                <button type="button" onClick={addLink} className="border border-ink/15 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink hover:border-ink/40">Link</button>
                <button type="button" onClick={addImageUrl} className="border border-ink/15 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink hover:border-ink/40">Image URL</button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="border border-ink/15 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink hover:border-ink/40">Upload</button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadImage(f); e.target.value = ""; }}
                />
                <button type="button" onClick={addVideoUrl} className="border border-ink/15 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink hover:border-ink/40">Video</button>
                <button type="button" onClick={addDivider} className="border border-ink/15 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink hover:border-ink/40">— Divider</button>
              </div>
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="kz-editor min-h-[320px] p-5 text-[15px] leading-[1.7] text-ink focus:outline-none"
                style={{ fontFamily: "Geist, system-ui, sans-serif" }}
              />
            </div>
            {/* hide unused */}
            <span className="hidden">{tbBtn}</span>
          </div>

          <label className="mt-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/75">
            <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
            Publish on save
          </label>

          {error && (
            <div className="border border-signal/60 bg-ink/40 p-3 font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
              ↘ {error}
            </div>
          )}

          <div className="mt-2 flex items-center justify-end gap-3 border-t border-paper/10 pt-4">
            <button
              type="button"
              onClick={() => navigate("/community/resources")}
              className="link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-paper"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={save}
              className="border border-paper bg-paper px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper disabled:opacity-50"
            >
              {busy ? "Saving…" : savedId ? "Save changes ↘" : "Create resource ↘"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceEditor;
