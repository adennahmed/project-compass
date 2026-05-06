import { useEffect, useState } from "react";

interface ContactDrawerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Contact drawer — slides in from the right with a single short note form.
 * Pure CSS transitions, no GSAP. Body scroll is locked while open.
 */
const ContactDrawer = ({ open, onClose }: ContactDrawerProps) => {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // tiny defer so the success flash isn't visible during exit
      const t = window.setTimeout(() => setSubmitted(false), 400);
      return () => window.clearTimeout(t);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder — wire to backend / form provider when ready.
    setSubmitted(true);
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        aria-hidden
        className="fixed inset-0 z-[1000] bg-ink/40 transition-opacity duration-500"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Project intake"
        className="fixed inset-y-0 right-0 z-[1001] flex w-full max-w-[480px] flex-col bg-paper shadow-2xl transition-transform duration-500 ease-out"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center justify-between border-b border-hairline/15 px-7 py-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
            Project intake
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[20px] leading-none text-mute transition-colors hover:text-ink"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6 overflow-y-auto px-7 py-8">
            <div>
              <h2
                className="display text-ink"
                style={{ fontSize: "clamp(1.65rem, 3vw, 2.1rem)", letterSpacing: "-0.03em" }}
              >
                Tell us what you're trying to build.
              </h2>
              <p className="mt-3 text-[14px] leading-[1.55] text-mute">
                A short note is enough. We reply within 48 hours.
              </p>
            </div>

            <Field label="Your name" name="name" type="text" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Company / team" name="company" type="text" />

            <label className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                What you're trying to build
              </span>
              <textarea
                name="brief"
                rows={5}
                required
                className="resize-none border border-hairline/20 bg-paper-2/40 px-3 py-3 text-[15px] text-ink outline-none transition-colors focus:border-signal"
              />
            </label>

            <button
              type="submit"
              className="group mt-2 inline-flex items-center justify-center gap-3 bg-ink px-6 py-4 text-[14px] font-medium text-paper transition-colors hover:bg-signal"
            >
              <span>Send brief</span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                ↘
              </span>
            </button>

            <p className="mt-2 text-[12px] leading-[1.55] text-mute">
              Or email us directly at{" "}
              <a
                href="mailto:hello@kozai.ca"
                className="text-ink underline-offset-4 hover:underline"
              >
                hello@kozai.ca
              </a>
              .
            </p>
          </form>
        ) : (
          <div className="flex flex-1 flex-col items-start justify-center gap-5 px-7 py-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
              Sent
            </div>
            <h3 className="display text-ink" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              Thanks — we'll be in touch within 48 h.
            </h3>
            <p className="text-[15px] text-mute">
              In the meantime, if it's urgent, email us at hello@kozai.ca.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 border border-hairline/20 px-5 py-3 text-[13px] font-medium text-ink transition-colors hover:border-ink"
            >
              Close
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

interface FieldProps {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}

const Field = ({ label, name, type, required }: FieldProps) => (
  <label className="flex flex-col gap-2">
    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
      {label}
      {required && <span className="ml-1 text-signal">*</span>}
    </span>
    <input
      name={name}
      type={type}
      required={required}
      className="border border-hairline/20 bg-paper-2/40 px-3 py-3 text-[15px] text-ink outline-none transition-colors focus:border-signal"
    />
  </label>
);

export default ContactDrawer;
