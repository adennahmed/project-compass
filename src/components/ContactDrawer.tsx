import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const INQUIRY_TYPES = ["BUILD", "ROLE", "COLLAB", "SPEAKING", "OTHER"] as const;
type InquiryType = (typeof INQUIRY_TYPES)[number];

interface InquiryForm {
  inquiryType: InquiryType;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  message: string;
  website: string;
  agreed: boolean;
}

const EMPTY_FORM: InquiryForm = {
  inquiryType: "BUILD",
  firstName: "",
  lastName: "",
  email: "",
  organization: "",
  message: "",
  website: "",
  agreed: false,
};

type SendStatus = "idle" | "sending" | "sent" | "error";

const Field = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  inputRef,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}) => (
  <label htmlFor={id} className="kz-inquiry-field">
    <span>
      {label}
      {required && <b aria-hidden>*</b>}
    </span>
    <input
      ref={inputRef}
      id={id}
      name={id}
      type={type}
      required={required}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      autoComplete={id === "email" ? "email" : id === "firstName" ? "given-name" : id === "lastName" ? "family-name" : "organization"}
    />
  </label>
);

const SuccessState = ({ firstName, email, onClose }: { firstName: string; email: string; onClose: () => void }) => (
  <div className="kz-inquiry-success" aria-live="polite">
    <div className="kz-inquiry-success__orbit" aria-hidden>
      <span /><span /><span />
      <i>✓</i>
    </div>
    <div className="kz-inquiry-kicker"><span /> MESSAGE DELIVERED · 200 OK</div>
    <h2 id="inquiry-title">
      <span className="success-word"><span style={{ animationDelay: "180ms" }}>Received,</span></span>{" "}
      <span className="success-word"><span style={{ animationDelay: "280ms" }}>{firstName || "friend"}.</span></span>
    </h2>
    <span className="success-rule" style={{ animationDelay: "720ms" }} />
    <p className="success-stagger" style={{ animationDelay: "820ms" }}>
      Your message is now in my inbox at <strong>hello@kozai.ca</strong>. A receipt is headed to <strong>{email}</strong>, and I’ll reply directly after I’ve read the details.
    </p>
    <button type="button" onClick={onClose} className="kz-inquiry-close-action success-stagger" style={{ animationDelay: "980ms" }}>
      <span aria-hidden /> Close transmission
    </button>
  </div>
);

interface ContactDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ContactDrawer = ({ open, onClose }: ContactDrawerProps) => {
  const [form, setForm] = useState<InquiryForm>(EMPTY_FORM);
  const [status, setStatus] = useState<SendStatus>("idle");
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof InquiryForm>(key: K, value: InquiryForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (status === "error") setStatus("idle");
  };

  useEffect(() => {
    if (!open) {
      setReady(false);
      const reset = window.setTimeout(() => {
        setForm(EMPTY_FORM);
        setStatus("idle");
        setCopied(false);
      }, 520);
      return () => window.clearTimeout(reset);
    }

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const reveal = window.setTimeout(() => setReady(true), 170);
    const focus = window.setTimeout(() => firstNameRef.current?.focus(), 520);

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), a[href]',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(focus);
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, onClose]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.agreed || status === "sending") return;
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
      if (!response.ok || !result?.ok) throw new Error("Message was not accepted");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText("hello@kozai.ca");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const complete = Boolean(
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.message.trim().length >= 12 &&
    form.agreed,
  );

  return (
    <div className={`kz-inquiry ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <button type="button" className="kz-inquiry__scrim" onClick={onClose} tabIndex={open ? 0 : -1} aria-label="Close inquiry" />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-title"
        className="kz-inquiry__panel"
      >
        <header className="kz-inquiry__header">
          <div>
            <span className="kz-inquiry__pulse" aria-hidden />
            <span>INQUIRY UPLINK · AA/07</span>
          </div>
          <div className="kz-inquiry__route"><span>WEB</span><i>→</i><strong>hello@kozai.ca</strong></div>
          <button type="button" onClick={onClose} aria-label="Close inquiry panel">×</button>
        </header>

        {status === "sent" ? (
          <SuccessState firstName={form.firstName} email={form.email} onClose={onClose} />
        ) : (
          <form onSubmit={handleSubmit} data-lenis-prevent className="kz-inquiry__form">
            <div className={`kz-inquiry-intro drawer-stagger ${ready ? "is-in" : ""}`}>
              <div className="kz-inquiry-kicker"><span /> DIRECT CHANNEL · ENCRYPTED IN TRANSIT</div>
              <h2 id="inquiry-title">Put the interesting problem on the table.</h2>
              <p>A short brief is enough. This form delivers directly to my inbox—no email app, no handoff.</p>
            </div>

            <fieldset className={`kz-inquiry-types drawer-stagger ${ready ? "is-in" : ""}`} style={{ transitionDelay: "70ms" }}>
              <legend>WHAT ARE WE TALKING ABOUT?</legend>
              <div>
                {INQUIRY_TYPES.map((type, index) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => set("inquiryType", type)}
                    className={form.inquiryType === type ? "is-active" : ""}
                    aria-pressed={form.inquiryType === type}
                  >
                    <span>0{index + 1}</span>{type}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className={`kz-inquiry-grid drawer-stagger ${ready ? "is-in" : ""}`} style={{ transitionDelay: "140ms" }}>
              <Field id="firstName" label="First name" required value={form.firstName} onChange={(value) => set("firstName", value)} placeholder="Aden" inputRef={firstNameRef} />
              <Field id="lastName" label="Last name" required value={form.lastName} onChange={(value) => set("lastName", value)} placeholder="Ahmed" />
              <Field id="email" label="Email" type="email" required value={form.email} onChange={(value) => set("email", value)} placeholder="you@company.com" />
              <Field id="organization" label="Organization" value={form.organization} onChange={(value) => set("organization", value)} placeholder="Optional" />
            </div>

            <label htmlFor="inquiry-message" className={`kz-inquiry-message drawer-stagger ${ready ? "is-in" : ""}`} style={{ transitionDelay: "210ms" }}>
              <span>THE BRIEF <b aria-hidden>*</b><i>{String(form.message.length).padStart(4, "0")} / 2000</i></span>
              <textarea
                id="inquiry-message"
                name="message"
                required
                minLength={12}
                maxLength={2000}
                rows={6}
                value={form.message}
                onChange={(event) => set("message", event.target.value)}
                placeholder="What are you building, fixing, or trying to understand?"
              />
            </label>

            <div className="sr-only" aria-hidden>
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => set("website", event.target.value)} />
            </div>

            <label className={`kz-inquiry-consent drawer-stagger ${ready ? "is-in" : ""}`} style={{ transitionDelay: "280ms" }}>
              <input type="checkbox" checked={form.agreed} onChange={(event) => set("agreed", event.target.checked)} required />
              <span aria-hidden>{form.agreed ? "✓" : ""}</span>
              <p>I agree to the <Link to="/privacy-policy" target="_blank">privacy policy</Link> and consent to Aden replying to this inquiry.</p>
            </label>

            <div className={`kz-inquiry-submit drawer-stagger ${ready ? "is-in" : ""}`} style={{ transitionDelay: "350ms" }}>
              {status === "error" && (
                <div className="kz-inquiry-error" role="alert">
                  <span>TRANSMISSION INTERRUPTED</span>
                  <p>Please try again, or copy the address and send the note manually.</p>
                  <button type="button" onClick={copyAddress}>{copied ? "COPIED ✓" : "COPY HELLO@KOZAI.CA"}</button>
                </div>
              )}
              <button type="submit" disabled={!complete || status === "sending"} className="kz-inquiry-transmit">
                <span>{status === "sending" ? "TRANSMITTING" : "SEND INQUIRY"}</span>
                <span className="kz-inquiry-transmit__track" aria-hidden><i /></span>
                <b aria-hidden>{status === "sending" ? "•••" : "↗"}</b>
              </button>
              <div className="kz-inquiry-submit__meta"><span>DELIVERY / RESEND API</span><span>REPLY / DIRECT</span><span>STATUS / {status.toUpperCase()}</span></div>
            </div>
          </form>
        )}
      </aside>
    </div>
  );
};

export default ContactDrawer;
