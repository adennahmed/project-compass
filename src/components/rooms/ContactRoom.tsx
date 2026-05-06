import { useEffect, useRef, useState } from "react";

/**
 * Contact room — terminal prompt. A simulated shell session that
 * types out the contact metadata and ends with a blinking cursor on
 * an empty prompt. Below: a CTA button that opens the existing
 * project-intake drawer.
 *
 * Per brief §5.9.
 */

interface TerminalLine {
  kind: "prompt" | "blank" | "kv" | "raw";
  /** For prompt lines: the typed command. For kv lines: "key" */
  key?: string;
  /** For kv lines: the value. For raw lines: the line content. */
  value?: string;
}

const SCRIPT: TerminalLine[] = [
  { kind: "prompt", key: "kozai.contact:~$ help" },
  { kind: "blank" },
  { kind: "kv", key: "email", value: "hello@kozai.ca" },
  { kind: "kv", key: "hours", value: "mon–fri · 09–18 et" },
  { kind: "kv", key: "reply", value: "within 48 hours" },
  { kind: "kv", key: "studio", value: "toronto, ca · remote" },
  { kind: "blank" },
  { kind: "raw", value: "tell us what you're trying to build." },
];

const CHAR_DELAY = 22;
const LINE_GAP = 140;

interface ContactRoomProps {
  active: boolean;
  onContactClick?: () => void;
}

const ContactRoom = ({ active, onContactClick }: ContactRoomProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [doneLines, setDoneLines] = useState<TerminalLine[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [activeChars, setActiveChars] = useState(0);

  useEffect(() => {
    if (active && activeIdx === -1) setActiveIdx(0);
  }, [active, activeIdx]);

  // Drive the typeout
  useEffect(() => {
    if (activeIdx < 0 || activeIdx >= SCRIPT.length) return;
    const line = SCRIPT[activeIdx];

    // Blank line — pop in immediately, advance after small gap
    if (line.kind === "blank") {
      const t = window.setTimeout(() => {
        setDoneLines((d) => [...d, line]);
        setActiveChars(0);
        setActiveIdx((i) => i + 1);
      }, 60);
      return () => window.clearTimeout(t);
    }

    const text = lineFullText(line);
    if (activeChars < text.length) {
      const t = window.setTimeout(() => setActiveChars((c) => c + 1), CHAR_DELAY);
      return () => window.clearTimeout(t);
    }

    // Line complete — push and advance
    const t = window.setTimeout(() => {
      setDoneLines((d) => [...d, line]);
      setActiveChars(0);
      setActiveIdx((i) => i + 1);
    }, LINE_GAP);
    return () => window.clearTimeout(t);
  }, [activeIdx, activeChars]);

  const allDone = activeIdx >= SCRIPT.length;

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 z-10 flex h-full w-full flex-col px-6 pt-20 pb-24 md:px-12 md:pt-24 md:pb-28"
    >
      {/* Eyebrow */}
      <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
        [ 06 / CONTACT ]
        <span className="mx-3 text-bone/30">·</span>
        kozai.contact ~ tty01
      </div>

      {/* Terminal body */}
      <div className="mt-auto grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <div
            className="font-mono text-bone/85"
            style={{
              fontSize: "clamp(0.95rem, 1.6vw, 1.25rem)",
              lineHeight: "1.55",
            }}
          >
            {doneLines.map((line, i) => (
              <RenderLine key={`done-${i}`} line={line} />
            ))}
            {activeIdx < SCRIPT.length && SCRIPT[activeIdx].kind !== "blank" && (
              <RenderLine line={SCRIPT[activeIdx]} chars={activeChars} active />
            )}
            {allDone && (
              <div className="mt-2">
                <span style={{ color: "rgb(var(--signal))" }}>&gt;&nbsp;</span>
                <span className="text-bone-mute">kozai.contact:~$ </span>
                <span className="kz-cursor">_</span>
              </div>
            )}
          </div>
        </div>

        {/* Right column — CTA + extras */}
        <div className="flex flex-col items-start md:col-span-5 md:items-stretch">
          <button
            type="button"
            onClick={onContactClick}
            className="hover-target group inline-flex w-full items-center justify-between border border-bone/15 bg-ink-rise/60 px-5 py-4 transition-colors duration-300"
            data-cursor-label="Open"
            style={{ backdropFilter: "blur(2px)" }}
          >
            <span className="flex items-center gap-3">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "rgb(var(--signal))" }}
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone">
                Open project intake
              </span>
            </span>
            <span
              className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute transition-colors duration-300 group-hover:text-bone"
            >
              return ↵
            </span>
          </button>

          <div className="mt-6 grid grid-cols-2 gap-4 font-mono text-[10px] uppercase tracking-[0.32em] text-bone-mute">
            <div>
              <div className="text-bone-mute/70">decline</div>
              <div className="mt-1.5 text-bone/65">marketing sites</div>
            </div>
            <div>
              <div className="text-bone-mute/70">decline</div>
              <div className="mt-1.5 text-bone/65">low-code rebuilds</div>
            </div>
            <div>
              <div className="text-bone-mute/70">decline</div>
              <div className="mt-1.5 text-bone/65">crm rollouts</div>
            </div>
            <div>
              <div className="text-bone-mute/70">accept</div>
              <div
                className="mt-1.5"
                style={{ color: "rgb(var(--signal))" }}
              >
                operational software
              </div>
            </div>
          </div>

          <a
            href="mailto:hello@kozai.ca"
            className="hover-target mt-6 font-mono text-[11px] uppercase tracking-[0.32em] text-bone/55 transition-colors hover:text-bone"
          >
            or — direct mail · hello@kozai.ca
          </a>
        </div>
      </div>
    </div>
  );
};

const lineFullText = (line: TerminalLine): string => {
  if (line.kind === "prompt") return line.key ?? "";
  if (line.kind === "kv") return `${line.key ?? ""} ${line.value ?? ""}`;
  return line.value ?? "";
};

const RenderLine = ({
  line,
  chars,
  active = false,
}: {
  line: TerminalLine;
  chars?: number;
  active?: boolean;
}) => {
  if (line.kind === "blank") {
    return <div>&nbsp;</div>;
  }
  const full = lineFullText(line);
  const shown = chars !== undefined ? full.slice(0, chars) : full;

  if (line.kind === "prompt") {
    const promptCmd = line.key ?? "";
    const visible = chars !== undefined ? promptCmd.slice(0, chars) : promptCmd;
    return (
      <div>
        <span style={{ color: "rgb(var(--signal))" }}>&gt;&nbsp;</span>
        <span className="text-bone-mute">kozai.contact:~$&nbsp;</span>
        <span className="text-bone">{visible}</span>
        {active && <span className="kz-cursor">_</span>}
      </div>
    );
  }

  if (line.kind === "kv") {
    // Show whole "key value" while typing, with key+padding aligned
    const key = line.key ?? "";
    const value = line.value ?? "";
    const keyPart = shown.slice(0, Math.min(chars ?? key.length, key.length));
    const valPart =
      chars !== undefined && chars > key.length + 1
        ? value.slice(0, chars - key.length - 1)
        : "";
    return (
      <div className="grid grid-cols-[auto_1fr] gap-x-6">
        <span
          className="font-mono uppercase tracking-[0.18em] text-bone-mute"
          style={{ fontSize: "0.78em" }}
        >
          {keyPart}
        </span>
        <span className="text-bone">
          {valPart}
          {active && (chars ?? 0) >= key.length + 1 && (
            <span className="kz-cursor">_</span>
          )}
        </span>
      </div>
    );
  }

  // raw
  return (
    <div className="text-bone/65">
      <span style={{ color: "rgb(var(--signal))" }}>// </span>
      {shown}
      {active && <span className="kz-cursor">_</span>}
    </div>
  );
};

export default ContactRoom;
