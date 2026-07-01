import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";

interface ConsoleProps {
  onContactClick?: () => void;
}

type Tone = "ink" | "mute" | "signal" | "dim";
interface Line {
  text: string;
  tone?: Tone;
}
interface Block {
  id: number;
  kind: "cmd" | "out";
  lines: Line[];
}

const toneClass: Record<Tone, string> = {
  ink: "text-ink/85",
  mute: "text-mute",
  signal: "text-signal",
  dim: "text-mute/55",
};

const COMMAND_NAMES = [
  "help",
  "about",
  "services",
  "work",
  "principles",
  "stack",
  "contact",
  "whoami",
  "kozai",
  "clear",
];

const CHIPS = ["help", "services", "work", "principles", "contact", "clear"];

/** Command → response. `clear` and `contact` carry side effects. */
function respond(raw: string, onContact?: () => void): { lines: Line[]; clear?: boolean } {
  const parts = raw.trim().split(/\s+/);
  const cmd = (parts[0] || "").toLowerCase();
  const L = (text: string, tone?: Tone): Line => ({ text, tone });

  switch (cmd) {
    case "":
      return { lines: [] };
    case "help":
      return {
        lines: [
          L("available commands", "mute"),
          L("  help        this list"),
          L("  about       who kozai is"),
          L("  services    what we build"),
          L("  work        the kind of things we make"),
          L("  principles  how we operate"),
          L("  stack       what we build with"),
          L("  contact     reach a human — opens intake", "signal"),
          L("  clear       wipe the screen"),
          L("↑/↓ recall history · tab autocompletes", "dim"),
        ],
      };
    case "about":
      return {
        lines: [
          L("Kozai — operational software studio · Toronto.", "ink"),
          L("We embed with the teams who actually run the business,"),
          L("find the work software should be doing, and ship the"),
          L("smallest system that makes a shift shorter — then hand"),
          L("it back, documented, so your people can run it without us."),
          L("Senior hands only. No bench. No offshore relay.", "mute"),
        ],
      };
    case "services":
    case "ls":
      return {
        lines: [
          L("01  internal tools & dashboards"),
          L("02  workflow automation"),
          L("03  client-facing platforms"),
          L("04  data & decision support"),
          L("run 'contact' to scope one →", "signal"),
        ],
      };
    case "work":
    case "builds":
      return {
        lines: [
          L("things we've shipped — and would ship for you:", "mute"),
          L("  → dispatch + route consoles for logistics ops"),
          L("  → billing & reconciliation pipelines"),
          L("  → multi-tenant SaaS platforms, launch-ready"),
          L("  → warehouse + BI stacks operators actually trust"),
        ],
      };
    case "principles":
      return {
        lines: [
          L("P-01  operators before features", "signal"),
          L("P-02  senior hands, start to finish"),
          L("P-03  boring on purpose"),
          L("P-04  shipped beats perfect"),
          L("P-05  we leave the lights on"),
        ],
      };
    case "stack":
      return {
        lines: [
          L("lang      typescript · go · rust · sql"),
          L("data      postgres · pgvector · clickhouse"),
          L("infra     fly.io · cloudflare · aws"),
          L("frontend  react · tailwind · lenis"),
        ],
      };
    case "contact":
    case "hire":
      if (onContact) window.setTimeout(() => onContact(), 650);
      return {
        lines: [
          L("opening project intake…", "signal"),
          L("or email hello@kozai.ca — we reply within 48h."),
        ],
      };
    case "whoami":
      return { lines: [L("guest@kozai — a visitor with good taste.")] };
    case "sudo":
      return { lines: [L("no root here. just senior engineers. try 'contact'.", "signal")] };
    case "kozai":
    case "logo":
    case "ascii":
      return {
        lines: [
          L("┌─┐ ┌─┐ ┌─┐ ┌─┐ ┬", "signal"),
          L("├┴┐ │ │ │ │ ├─┤ │", "signal"),
          L("┴ ┴ └─┘ └─┘ ┴ ┴ ┴", "signal"),
          L("operational software · toronto", "dim"),
        ],
      };
    case "clear":
      return { lines: [], clear: true };
    default:
      return { lines: [L(`command not found: ${cmd} — type 'help'.`, "signal")] };
  }
}

const WELCOME: Line[] = [
  { text: "kozai console — v2.5  (guest session)", tone: "mute" },
  { text: "type 'help' to list commands, or 'contact' to reach a human.", tone: "ink" },
];

const Console = ({ onContactClick }: ConsoleProps) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [typing, setTyping] = useState<{ lines: Line[]; total: number } | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [input, setInput] = useState("");
  const [cmdHist, setCmdHist] = useState<string[]>([]);
  const [histPtr, setHistPtr] = useState(-1);

  const idRef = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const startTyping = useCallback((lines: Line[]) => {
    if (!lines.length) return;
    setTyping({ lines, total: lines.reduce((s, l) => s + l.text.length, 0) });
    setRevealed(0);
  }, []);

  // Typewriter — advance the reveal count while a block is printing.
  useEffect(() => {
    if (!typing) return;
    if (reduced) {
      setRevealed(typing.total);
      return;
    }
    let r = 0;
    const id = window.setInterval(() => {
      r += 4;
      setRevealed(Math.min(typing.total, r));
      if (r >= typing.total) window.clearInterval(id);
    }, 15);
    return () => window.clearInterval(id);
  }, [typing, reduced]);

  // Commit the finished block once fully revealed.
  useEffect(() => {
    if (typing && revealed >= typing.total) {
      const lines = typing.lines;
      setBlocks((b) => [...b, { id: idRef.current++, kind: "out", lines }]);
      setTyping(null);
      setRevealed(0);
    }
  }, [revealed, typing]);

  // Auto-scroll output to the bottom as it grows.
  useEffect(() => {
    const el = outRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [blocks, revealed, typing]);

  // Print the welcome message the first time the console scrolls into view.
  useEffect(() => {
    const el = outRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            startTyping(WELCOME);
            io.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [startTyping]);

  const submit = useCallback(
    (raw: string) => {
      if (typing) return;
      const cmd = raw.trim();
      const echo: Block = { id: idRef.current++, kind: "cmd", lines: [{ text: cmd }] };
      const res = respond(cmd, onContactClick);
      if (res.clear) {
        setBlocks([]);
      } else {
        setBlocks((b) => [...b, echo]);
        startTyping(res.lines);
      }
      if (cmd) setCmdHist((h) => [...h, cmd]);
      setHistPtr(-1);
      setInput("");
    },
    [typing, onContactClick, startTyping],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (typing) {
        setRevealed(typing.total); // skip to the end
        return;
      }
      submit(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!cmdHist.length) return;
      const ptr = histPtr < 0 ? cmdHist.length - 1 : Math.max(0, histPtr - 1);
      setHistPtr(ptr);
      setInput(cmdHist[ptr]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histPtr < 0) return;
      const ptr = histPtr + 1;
      if (ptr >= cmdHist.length) {
        setHistPtr(-1);
        setInput("");
      } else {
        setHistPtr(ptr);
        setInput(cmdHist[ptr]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const val = input.trim().toLowerCase();
      if (!val) return;
      const matches = COMMAND_NAMES.filter((c) => c.startsWith(val));
      if (matches.length === 1) setInput(matches[0]);
      else if (matches.length > 1) startTyping(matches.map((m) => ({ text: m, tone: "dim" as Tone })));
    }
  };

  // Partial render of the block currently typing.
  const renderTyping = () => {
    if (!typing) return null;
    let acc = 0;
    return typing.lines.map((ln, i) => {
      const start = acc;
      acc += ln.text.length;
      if (revealed <= start && i > 0) return null;
      const take = Math.max(0, Math.min(ln.text.length, revealed - start));
      const isCursorLine = revealed >= start && revealed < acc;
      return (
        <div key={i} className={`whitespace-pre-wrap ${toneClass[ln.tone ?? "ink"]}`}>
          {ln.text.slice(0, take)}
          {isCursorLine && <span className="kz-term-caret">▍</span>}
        </div>
      );
    });
  };

  return (
    <section
      id="console"
      data-snap
      className="relative px-6 py-24 md:px-10 md:py-28"
    >
      <div className="container-wide">
        <Reveal>
          <div className="mb-10 grid grid-cols-1 gap-6 md:mb-14 md:grid-cols-12 md:items-end md:gap-12">
            <div className="md:col-span-4">
              <div className="label">
                <ScrambleText text="[ ✦ — Interactive · console ]" />
              </div>
            </div>
            <div className="md:col-span-8">
              <h2 className="display text-ink" style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}>
                Poke around.
                <span className="text-mute"> It talks back.</span>
              </h2>
              <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.6] text-mute md:text-[16px]">
                A real terminal, not a video. Type a command — or tap one below — and the studio
                answers. Try <span className="text-signal">help</span>.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div
            className="kz-panel cursor-target mx-auto max-w-[820px]"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Title bar */}
            <header className="flex items-center justify-between border-b border-hairline/15 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 border border-hairline/30" aria-hidden />
                <span className="h-2.5 w-2.5 border border-hairline/30" aria-hidden />
                <span className="h-2.5 w-2.5 bg-signal" aria-hidden />
                <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                  kozai://console — guest@kozai
                </span>
              </div>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-mute md:block">
                tty/01 · live
              </span>
            </header>

            {/* Output */}
            <div
              ref={outRef}
              className="h-[300px] overflow-y-auto px-4 py-4 font-mono text-[13px] leading-[1.7] md:h-[340px]"
            >
              {blocks.map((b) =>
                b.kind === "cmd" ? (
                  <div key={b.id} className="flex gap-2 pt-1 text-ink/90">
                    <span className="text-signal">kozai:~$</span>
                    <span className="whitespace-pre-wrap">{b.lines[0].text}</span>
                  </div>
                ) : (
                  <div key={b.id} className="pb-1">
                    {b.lines.map((ln, i) => (
                      <div key={i} className={`whitespace-pre-wrap ${toneClass[ln.tone ?? "ink"]}`}>
                        {ln.text || " "}
                      </div>
                    ))}
                  </div>
                ),
              )}
              {renderTyping()}
            </div>

            {/* Prompt */}
            <div className="flex items-center gap-2 border-t border-hairline/15 px-4 py-3 font-mono text-[13px]">
              <span className="shrink-0 text-signal">kozai:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Console input"
                placeholder={typing ? "printing…" : "type a command — try 'help'"}
                className="kz-term-input w-full bg-transparent text-ink placeholder:text-mute/50 focus:outline-none"
              />
            </div>
          </div>
        </Reveal>

        {/* Command chips */}
        <Reveal delay={200}>
          <div className="mx-auto mt-5 flex max-w-[820px] flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">try:</span>
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  submit(c);
                  inputRef.current?.focus();
                }}
                className="border border-hairline/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-mute transition-colors hover:border-signal hover:text-signal"
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Console;
