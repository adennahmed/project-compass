import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";

type Tone = "ink" | "mute" | "signal";
type Line = { text: string; tone?: Tone };
type Block = { id: number; command?: string; lines: Line[] };

const commands = ["help", "about", "projects", "playground", "kozai", "method", "stack", "contact", "clear"];
const responses: Record<string, Line[]> = {
  help: [
    { text: "available commands", tone: "mute" },
    { text: "  about       who Aden is" },
    { text: "  projects    inspect the project slate" },
    { text: "  playground  run the small experiments", tone: "signal" },
    { text: "  kozai       open the studio archive" },
    { text: "  method      how the work gets shaped" },
    { text: "  stack       tools in rotation" },
    { text: "  contact     start a conversation", tone: "signal" },
    { text: "  clear       wipe the screen" },
    { text: "↑/↓ recall history · tab autocompletes", tone: "mute" },
  ],
  about: [
    { text: "Aden Ahmed — software engineer + product builder · Toronto.", tone: "signal" },
    { text: "Interested in systems where architecture and interface agree:" },
    { text: "operations software, evidence tooling, offline-first products," },
    { text: "and resilient data-heavy systems." },
  ],
  projects: [
    { text: "01  meridian      operations control plane" },
    { text: "02  aegis graph   evidence-first AI research" },
    { text: "03  relay          offline-first field operations" },
    { text: "04  kozai          studio archive · 2025—26" },
    { text: "scroll to the project atlas for interfaces + architecture →", tone: "signal" },
  ],
  playground: [
    { text: "LAB-01  route / a*      editable heuristic search" },
    { text: "LAB-02  orbital field   live n-body gravity sandbox" },
    { text: "LAB-03  swarm / hash    spatially indexed flocking field" },
    { text: "LAB-04  signal / 16     browser audio sequencer" },
    { text: "LAB-05  packet run      routing arcade process" },
    { text: "every experiment is executable in the playground above ↑", tone: "signal" },
  ],
  kozai: [
    { text: "Kozai · archived studio initiative · 2025—2026", tone: "signal" },
    { text: "  → operational product prototypes" },
    { text: "  → community platform + moderation system" },
    { text: "  → dark technical interface language" },
    { text: "  → a sharper point of view on systems + product" },
  ],
  method: [
    { text: "P-01  model the work first", tone: "signal" },
    { text: "P-02  interface is part of the system" },
    { text: "P-03  novelty must earn its place" },
    { text: "P-04  prototype at full fidelity" },
    { text: "P-05  make failure legible" },
  ],
  stack: [
    { text: "lang      typescript · go · rust · python · sql" },
    { text: "data      postgres · pgvector · clickhouse · sqlite" },
    { text: "systems   nats · websockets · crdts · event logs" },
    { text: "surface   react · tailwind · motion · product design" },
  ],
};

const toneClass: Record<Tone, string> = { ink: "text-ink/85", mute: "text-mute", signal: "text-signal" };

const Console = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [typing, setTyping] = useState<Line[] | null>(null);
  const [revealCount, setRevealCount] = useState(0);
  const idRef = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const typeLines = useCallback((lines: Line[]) => {
    setTyping(lines);
    setRevealCount(0);
  }, []);

  useEffect(() => {
    if (!typing) return;
    const total = typing.reduce((n, line) => n + line.text.length, 0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setRevealCount(total); return; }
    const id = window.setInterval(() => setRevealCount((n) => Math.min(total, n + 5)), 15);
    return () => window.clearInterval(id);
  }, [typing]);

  useEffect(() => {
    if (!typing) return;
    const total = typing.reduce((n, line) => n + line.text.length, 0);
    if (revealCount < total) return;
    setBlocks((prev) => [...prev, { id: idRef.current++, lines: typing }]);
    setTyping(null);
    setRevealCount(0);
  }, [revealCount, typing]);

  useEffect(() => { if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight; }, [blocks, revealCount]);

  useEffect(() => {
    const el = outputRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !startedRef.current) {
        startedRef.current = true;
        typeLines([{ text: "aden console — v1.0  (guest session)", tone: "mute" }, { text: "type 'help' to inspect the portfolio." }]);
      }
    }, { threshold: 0.35 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [typeLines]);

  const submit = useCallback((raw: string) => {
    if (typing) return;
    const command = raw.trim().toLowerCase();
    if (!command) return;
    if (command === "clear") { setBlocks([]); setInput(""); return; }
    if (command === "contact") {
      setBlocks((prev) => [...prev, { id: idRef.current++, command, lines: [] }]);
      typeLines([{ text: "routing to contact…", tone: "signal" }, { text: "or email hello@kozai.ca" }]);
      window.setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 650);
    } else if (command === "whoami") {
      setBlocks((prev) => [...prev, { id: idRef.current++, command, lines: [] }]);
      typeLines([{ text: "guest@aden — curious enough to open the terminal." }]);
    } else if (command === "sudo") {
      setBlocks((prev) => [...prev, { id: idRef.current++, command, lines: [] }]);
      typeLines([{ text: "no root here. the interesting permissions are conceptual.", tone: "signal" }]);
    } else {
      setBlocks((prev) => [...prev, { id: idRef.current++, command, lines: [] }]);
      typeLines(responses[command] ?? [{ text: `command not found: ${command} — type 'help'.`, tone: "signal" }]);
    }
    setHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);
    setInput("");
  }, [typeLines, typing]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") { event.preventDefault(); submit(input); }
    if (event.key === "Tab") {
      event.preventDefault();
      const match = commands.find((command) => command.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      const next = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next); setInput(history[next]);
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = historyIndex + 1;
      if (next >= history.length) { setHistoryIndex(-1); setInput(""); } else { setHistoryIndex(next); setInput(history[next]); }
    }
  };

  const renderTyping = () => {
    if (!typing) return null;
    let cursor = 0;
    return typing.map((line, i) => {
      const start = cursor; cursor += line.text.length;
      const take = Math.max(0, Math.min(line.text.length, revealCount - start));
      if (take <= 0 && i > 0) return null;
      return <div key={i} className={`whitespace-pre-wrap ${toneClass[line.tone ?? "ink"]}`}>{line.text.slice(0, take)}{take < line.text.length && <span className="kz-term-caret">▍</span>}</div>;
    });
  };

  return (
    <section id="console" data-snap className="relative px-6 py-24 md:px-10 md:py-28">
      <div className="container-wide">
        <Reveal><div className="mb-10 grid grid-cols-1 gap-6 md:mb-14 md:grid-cols-12 md:items-end"><div className="md:col-span-4"><div className="label"><ScrambleText text="[ 06 — Interactive console ]" /></div></div><div className="md:col-span-8"><h2 className="display text-ink" style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}>Poke around.<span className="text-mute"> It talks back.</span></h2><p className="mt-5 max-w-[52ch] text-[15px] leading-[1.6] text-mute md:text-[16px]">Type a command—or tap one below—to inspect the projects, archive, method, and tools. Try <span className="text-signal">help</span>.</p></div></div></Reveal>
        <Reveal delay={120}>
          <div className="kz-panel cursor-target mx-auto max-w-[820px]" onClick={() => inputRef.current?.focus()}>
            <header className="flex items-center justify-between border-b border-hairline/15 px-4 py-2.5"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 border border-hairline/30" /><span className="h-2.5 w-2.5 border border-hairline/30" /><span className="h-2.5 w-2.5 bg-signal" /><span className="ml-3 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">aden://portfolio — guest@aden</span></div><span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-mute md:block">tty/01 · live</span></header>
            <div ref={outputRef} className="h-[300px] overflow-y-auto px-4 py-4 font-mono text-[12px] leading-[1.75] md:h-[340px]">
              {blocks.map((block) => <div key={block.id}>{block.command && <div className="flex gap-2 pt-1 text-ink/90"><span className="text-signal">aden:~$</span><span>{block.command}</span></div>}{block.lines.map((line, i) => <div key={i} className={`whitespace-pre-wrap ${toneClass[line.tone ?? "ink"]}`}>{line.text}</div>)}</div>)}
              {renderTyping()}
            </div>
            <div className="flex items-center gap-2 border-t border-hairline/15 px-4 py-3 font-mono text-[12px]"><span className="shrink-0 text-signal">aden:~$</span><input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} spellCheck={false} autoComplete="off" aria-label="Console input" placeholder={typing ? "printing…" : "type a command — try 'help'"} className="kz-term-input w-full bg-transparent text-ink placeholder:text-mute/50 focus:outline-none" /></div>
          </div>
        </Reveal>
        <Reveal delay={190}><div className="mx-auto mt-5 flex max-w-[820px] flex-wrap items-center gap-2"><span className="mr-1 font-mono text-[9px] uppercase tracking-[0.2em] text-mute">try:</span>{["help", "projects", "playground", "kozai", "method", "stack", "contact"].map((command) => <button key={command} type="button" onClick={() => submit(command)} className="border border-hairline/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-mute transition-colors hover:border-signal hover:text-signal">{command}</button>)}</div></Reveal>
      </div>
    </section>
  );
};

export default Console;
