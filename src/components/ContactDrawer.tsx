import { FormEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface ContactDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ContactDrawer = ({ open, onClose }: ContactDrawerProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (open) {
      // Prevent scroll position reset by using fixed positioning instead of body lock
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.dataset.scrollY = String(scrollY);

      gsap.set(overlay, { display: "block", autoAlpha: 0 });
      gsap.set(panel, { xPercent: 100 });
      gsap.to(overlay, { autoAlpha: 1, duration: 0.4, ease: "power3.out" });
      gsap.to(panel, { xPercent: 0, duration: 0.7, ease: "power4.inOut" });
    } else {
      // Restore scroll position
      const savedY = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, savedY);

      gsap.to(panel, { xPercent: 100, duration: 0.55, ease: "power4.inOut" });
      gsap.to(overlay, {
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.out",
        delay: 0.1,
        onComplete: () => {
          if (overlay) overlay.style.display = "none";
        },
      });
    }
  }, [open]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Project intake"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-full max-w-[640px] overflow-y-auto bg-ink-rise p-8 md:p-12"
        style={{ borderLeft: "1px solid rgb(var(--ink-edge))" }}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone-mute">
              Project intake
            </span>
            <h3
              className="display-headline mt-3 text-bone"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
            >
              Tell us what&rsquo;s broken.
            </h3>
            <p className="mt-3 max-w-[380px] text-sm leading-relaxed text-bone/65">
              No formal RFP, no pitch deck. A few sentences is enough — we&rsquo;ll come back with
              an honest answer about whether we can help.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="group inline-flex h-10 w-10 items-center justify-center border border-bone/15 text-bone hover-target"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" className="transition-transform duration-300 group-hover:rotate-90">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <Field label="Name" name="name" placeholder="Who are we talking to?" required />
          <Field label="Email" name="email" type="email" placeholder="you@company.com" required />
          <Field label="Company" name="company" placeholder="Optional — but useful" />
          <SelectField
            label="Stage"
            name="stage"
            options={[
              "Idea — exploring",
              "Spec'd — looking for a build partner",
              "Live — needs a rebuild or extension",
              "Internal tooling backlog",
            ]}
          />
          <SelectField
            label="Budget"
            name="budget"
            options={[
              "Under $25k",
              "$25k – $75k",
              "$75k – $200k",
              "$200k+",
              "Unsure — let's talk",
            ]}
          />
          <TextareaField
            label="What you'd like built"
            name="message"
            placeholder="The thing that's broken, the workaround you're using, what would make a difference."
            rows={5}
            required
          />

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitted}
              className="group inline-flex w-full items-center justify-between border border-signal bg-signal px-6 py-4 text-ink transition-colors hover-target disabled:opacity-60"
            >
              <span className="font-mono text-[12px] uppercase tracking-[0.24em]">
                {submitted ? "Sent — we'll be in touch" : "Send intake"}
              </span>
              <span className="font-mono text-[12px] uppercase tracking-[0.24em]">→</span>
            </button>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-bone-mute">
              Or email <a className="text-bone underline-offset-2 hover:underline" href="mailto:hello@kozai.ca">hello@kozai.ca</a> directly.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) => (
  <label className="block">
    <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-bone-mute">{label}</span>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      className="mt-2 block w-full border-b border-bone/15 bg-transparent py-2.5 text-bone placeholder:text-bone/30 focus:border-signal focus:outline-none"
    />
  </label>
);

const SelectField = ({ label, name, options }: { label: string; name: string; options: string[] }) => (
  <label className="block">
    <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-bone-mute">{label}</span>
    <select
      name={name}
      defaultValue=""
      className="mt-2 block w-full border-b border-bone/15 bg-transparent py-2.5 text-bone focus:border-signal focus:outline-none"
    >
      <option value="" disabled>Choose one</option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-ink-rise text-bone">{o}</option>
      ))}
    </select>
  </label>
);

const TextareaField = ({
  label,
  name,
  placeholder,
  rows = 4,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) => (
  <label className="block">
    <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-bone-mute">{label}</span>
    <textarea
      name={name}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className="mt-2 block w-full resize-none border border-bone/15 bg-bone/[0.03] px-3 py-2.5 text-bone placeholder:text-bone/30 focus:border-signal focus:outline-none"
    />
  </label>
);

export default ContactDrawer;
