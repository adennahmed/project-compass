import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ─── Country list for phone picker ────────────────────────────────────── */
const COUNTRIES = [
  { code: "US", dial: "+1",   flag: "🇺🇸", name: "United States" },
  { code: "CA", dial: "+1",   flag: "🇨🇦", name: "Canada" },
  { code: "GB", dial: "+44",  flag: "🇬🇧", name: "United Kingdom" },
  { code: "AU", dial: "+61",  flag: "🇦🇺", name: "Australia" },
  { code: "DE", dial: "+49",  flag: "🇩🇪", name: "Germany" },
  { code: "FR", dial: "+33",  flag: "🇫🇷", name: "France" },
  { code: "IN", dial: "+91",  flag: "🇮🇳", name: "India" },
  { code: "BR", dial: "+55",  flag: "🇧🇷", name: "Brazil" },
  { code: "MX", dial: "+52",  flag: "🇲🇽", name: "Mexico" },
  { code: "JP", dial: "+81",  flag: "🇯🇵", name: "Japan" },
  { code: "SG", dial: "+65",  flag: "🇸🇬", name: "Singapore" },
  { code: "AE", dial: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "NL", dial: "+31",  flag: "🇳🇱", name: "Netherlands" },
  { code: "SE", dial: "+46",  flag: "🇸🇪", name: "Sweden" },
  { code: "CH", dial: "+41",  flag: "🇨🇭", name: "Switzerland" },
  { code: "NZ", dial: "+64",  flag: "🇳🇿", name: "New Zealand" },
  { code: "IE", dial: "+353", flag: "🇮🇪", name: "Ireland" },
  { code: "ZA", dial: "+27",  flag: "🇿🇦", name: "South Africa" },
  { code: "ES", dial: "+34",  flag: "🇪🇸", name: "Spain" },
  { code: "IT", dial: "+39",  flag: "🇮🇹", name: "Italy" },
] as const;

type Country = typeof COUNTRIES[number];

function formatPhone(digits: string, code: string): string {
  if (code === "US" || code === "CA") {
    const d = digits.slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  if (code === "GB") {
    const d = digits.slice(0, 11);
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)} ${d.slice(5)}`;
  }
  if (code === "AU") {
    const d = digits.slice(0, 10);
    if (d.length <= 4) return d;
    if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
    return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  }
  // Generic: groups of 3, max 15 digits
  const d = digits.slice(0, 15);
  return d.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

/* ─── Types ─────────────────────────────────────────────────────────────── */
type Role = "FOUNDER" | "INVESTOR" | "PARTNER" | "JOURNALIST" | "OTHER";
const ROLES: Role[] = ["FOUNDER", "INVESTOR", "PARTNER", "JOURNALIST", "OTHER"];

interface Form {
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  message: string;
  agreed: boolean;
}

const EMPTY: Form = {
  role: "FOUNDER",
  firstName: "", lastName: "", email: "", phone: "",
  businessName: "", businessType: "", message: "", agreed: false,
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
    {children}
  </div>
);

const LineInput = ({
  label, name, type = "text", required, value, onChange, placeholder,
}: {
  label?: string; name: string; type?: string; required?: boolean;
  value: string; onChange: (v: string) => void; placeholder?: string;
}) => (
  <label className="flex flex-col gap-1.5">
    {label && (
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute/60">
        {label}{required && <span className="ml-0.5 text-signal">*</span>}
      </span>
    )}
    <input
      name={name}
      type={type}
      required={required}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder ?? label}
      className="border-b border-hairline/30 bg-transparent py-2.5 text-[14px] text-ink outline-none placeholder:text-mute/40 focus:border-ink transition-colors"
    />
  </label>
);

/* ─── Phone field with country picker ──────────────────────────────────── */
const PhoneField = ({
  value, onChange,
}: { value: string; onChange: (v: string) => void }) => {
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = COUNTRIES.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search),
  );

  const handleDigits = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    onChange(formatPhone(digits, country.code));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute/60">
        Phone
      </span>
      <div className="flex items-end border-b border-hairline/30 focus-within:border-ink transition-colors">
        {/* Country picker trigger */}
        <div ref={ref} className="relative shrink-0">
          <button
            type="button"
            onClick={() => { setOpen(o => !o); setSearch(""); }}
            className="flex items-center gap-1.5 pb-2.5 pr-3 font-mono text-[12px] text-mute hover:text-ink transition-colors"
          >
            <span className="text-base leading-none">{country.flag}</span>
            <span>{country.dial}</span>
            <span className="text-[9px] opacity-50">▼</span>
          </button>

          {open && (
            <div className="absolute bottom-full left-0 z-50 mb-1 w-56 bg-paper border border-hairline/20 shadow-xl">
              <div className="border-b border-hairline/15 px-3 py-2">
                <input
                  autoFocus
                  placeholder="Search…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-transparent font-mono text-[11px] text-ink outline-none placeholder:text-mute/40"
                />
              </div>
              <ul className="max-h-48 overflow-y-auto">
                {filtered.map(c => (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => {
                        setCountry(c);
                        setOpen(false);
                        onChange(""); // reset phone on country change
                      }}
                      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left font-mono text-[11px] transition-colors hover:bg-paper-2 ${
                        c.code === country.code ? "text-signal" : "text-ink"
                      }`}
                    >
                      <span>{c.flag}</span>
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="text-mute">{c.dial}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Phone input */}
        <input
          type="tel"
          value={value}
          onChange={e => handleDigits(e.target.value)}
          placeholder="Phone number"
          className="flex-1 bg-transparent pb-2.5 text-[14px] text-ink outline-none placeholder:text-mute/40"
        />
      </div>
    </div>
  );
};

/* ─── Main drawer ────────────────────────────────────────────────────────── */
interface ContactDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ContactDrawer = ({ open, onClose }: ContactDrawerProps) => {
  const [form, setForm] = useState<Form>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) {
      const t = window.setTimeout(() => {
        setForm(EMPTY);
        setStatus("idle");
      }, 450);
      return () => window.clearTimeout(t);
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-[1000] bg-ink/40 transition-opacity duration-500"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal
        aria-label="Project intake"
        className="fixed inset-y-0 right-0 z-[1001] flex w-full max-w-[600px] flex-col bg-paper shadow-2xl transition-transform duration-500 ease-out"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-hairline/15 px-7 py-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
            Project intake · Kozai
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="font-mono text-[16px] leading-none text-mute transition-colors hover:text-ink"
          >
            ✕
          </button>
        </div>

        {status === "sent" ? (
          /* ── Success state ── */
          <div className="flex flex-1 flex-col items-start justify-center gap-5 px-8 py-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-signal">
              · Received
            </div>
            <h3
              className="display text-ink"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.035em" }}
            >
              Thanks — we'll be in touch within 48 h.
            </h3>
            <p className="text-[14px] leading-[1.6] text-mute">
              A confirmation has been sent to <span className="text-ink">{form.email}</span>.
              If it's urgent, reach us at{" "}
              <a href="mailto:hello@kozai.ca" className="text-ink underline-offset-4 hover:underline">
                hello@kozai.ca
              </a>.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 border border-hairline/20 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink"
            >
              Close
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto"
          >
            <div className="flex flex-col gap-8 px-8 py-7">

              {/* Hero headline */}
              <div className="border-b border-hairline/15 pb-7 pt-1">
                <h2
                  className="display text-ink"
                  style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", letterSpacing: "-0.04em", lineHeight: "1.05" }}
                >
                  Tell us what<br />you're building.
                </h2>
                <p className="mt-3 text-[13px] leading-[1.6] text-mute">
                  A short note is enough. We reply within 48 hours.
                </p>
              </div>

              {/* Role selector */}
              <div>
                <div className="mb-4 font-mono text-[11px] text-mute">
                  <span className="font-semibold text-ink">I'M A</span>
                  {"  "}
                  <span className="tracking-[0.18em] uppercase opacity-50">[Select one]</span>
                </div>
                <div className="flex items-stretch">
                  {ROLES.map((role, i) => (
                    <div key={role} className="flex items-stretch">
                      {i > 0 && (
                        <div className="w-px self-stretch bg-hairline/25" />
                      )}
                      <button
                        type="button"
                        onClick={() => set("role", role)}
                        className={`flex items-center gap-2 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                          form.role === role
                            ? "border border-signal/40 text-signal"
                            : "text-mute hover:text-ink"
                        }`}
                      >
                        {form.role === role && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                        )}
                        {role}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* About you */}
              <div>
                <SectionLabel>About you</SectionLabel>
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <LineInput
                    name="firstName" label="First name" required
                    value={form.firstName} onChange={v => set("firstName", v)}
                  />
                  <LineInput
                    name="lastName" label="Last name" required
                    value={form.lastName} onChange={v => set("lastName", v)}
                  />
                  <LineInput
                    name="email" type="email" label="Email" required
                    value={form.email} onChange={v => set("email", v)}
                  />
                  <PhoneField value={form.phone} onChange={v => set("phone", v)} />
                </div>
              </div>

              {/* Your business */}
              <div>
                <SectionLabel>Your business</SectionLabel>
                <div className="flex flex-col gap-5">
                  <LineInput
                    name="businessName" label="Business name" required
                    value={form.businessName} onChange={v => set("businessName", v)}
                  />
                  <LineInput
                    name="businessType" label="Type of business" required
                    value={form.businessType} onChange={v => set("businessType", v)}
                  />
                  <label className="flex flex-col gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute/60">
                      Message <span className="opacity-50">(Optional)</span>
                    </span>
                    <textarea
                      name="message"
                      rows={3}
                      value={form.message}
                      onChange={e => set("message", e.target.value)}
                      placeholder="What are you trying to build?"
                      className="resize-none border-b border-hairline/30 bg-transparent py-2.5 text-[14px] text-ink outline-none placeholder:text-mute/40 focus:border-ink transition-colors"
                    />
                  </label>
                </div>
              </div>

              {/* Privacy checkbox */}
              <label className="flex cursor-pointer items-start gap-3">
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
                    form.agreed
                      ? "border-ink bg-ink"
                      : "border-hairline/40 bg-transparent"
                  }`}
                >
                  {form.agreed && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="rgb(245,242,236)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={form.agreed}
                  onChange={e => set("agreed", e.target.checked)}
                  required
                />
                <span className="font-mono text-[10px] uppercase leading-[1.6] tracking-[0.18em] text-mute">
                  By checking this box I agree to the{" "}
                  <Link
                    to="/privacy-policy"
                    target="_blank"
                    className="text-ink underline underline-offset-4 hover:text-signal"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit — sticky to the bottom of the scroll container */}
            <div className="sticky bottom-0 bg-paper border-t border-hairline/15 px-8 py-5">
              {status === "error" && (
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
                  Something went wrong — please try again or email us directly.
                </p>
              )}
              <button
                type="submit"
                disabled={!form.agreed || status === "sending"}
                className="group flex w-full items-center justify-between bg-ink px-6 py-4 text-[13px] font-medium text-paper transition-colors hover:bg-signal disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>{status === "sending" ? "Sending…" : "Send inquiry"}</span>
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">↘</span>
              </button>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                We reply within 48 hours, every time.
              </p>
            </div>
          </form>
        )}
      </aside>
    </>
  );
};

export default ContactDrawer;
