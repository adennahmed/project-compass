import { useEffect } from "react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Logo from "@/components/Logo";

const SECTIONS = [
  {
    n: "01",
    title: "Information We Collect",
    body: "When you submit an inquiry through our contact form, we collect your name, email address, phone number (optional), business name and type (optional), your role, and message content (optional). We only collect what you voluntarily provide.",
  },
  {
    n: "02",
    title: "How We Use Your Information",
    body: "We use the information you provide solely to respond to your inquiry, communicate with you about potential engagements, and improve our service. We do not use your data for marketing purposes without your explicit consent.",
  },
  {
    n: "03",
    title: "Data Storage & Security",
    body: "Your data is stored securely using industry-standard encryption and access controls. We retain your information only as long as necessary to fulfil the purpose for which it was collected, or as required by applicable law.",
  },
  {
    n: "04",
    title: "Data Sharing",
    body: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep this information confidential.",
  },
  {
    n: "05",
    title: "Your Rights",
    body: "You have the right to access, correct, or delete the personal information we hold about you. To exercise these rights, please contact us at hello@kozai.ca.",
  },
  {
    n: "06",
    title: "Cookies",
    body: "Our website does not use cookies for tracking or advertising purposes. Essential cookies may be used to ensure the basic functionality of the site.",
  },
  {
    n: "07",
    title: "Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised last-updated date.",
  },
  {
    n: "08",
    title: "Contact",
    body: "If you have any questions about this Privacy Policy, please reach out at hello@kozai.ca.",
  },
];

const PrivacyPolicy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SEOHead
        title="Privacy Policy — Kozai"
        description="Kozai's privacy policy outlines how we collect, use, and protect your personal information."
        path="/privacy-policy"
      />

      {/* Nav */}
      <header className="flex items-center justify-between border-b border-hairline/15 px-6 py-5 md:px-10">
        <Link to="/" aria-label="Kozai — home">
          <Logo size={22} variant="black" />
        </Link>
        <Link
          to="/"
          className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute transition-colors hover:text-ink"
        >
          ← Back to site
        </Link>
      </header>

      <main className="mx-auto max-w-[760px] px-6 pb-32 pt-16 md:px-10">
        {/* Label */}
        <div className="label mb-8">[ Legal · Privacy ]</div>

        {/* Title */}
        <h1
          className="display text-ink"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.75rem)", letterSpacing: "-0.04em" }}
        >
          Privacy Policy
        </h1>

        <div className="mt-4 flex items-center gap-4">
          <div className="h-px flex-1 bg-hairline/15" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            Last updated — May 2026
          </span>
        </div>

        {/* Intro */}
        <p className="mt-10 max-w-[52ch] text-[15px] leading-[1.65] text-ink/70">
          Kozai is a software studio based in Toronto, Canada. This policy explains what
          personal information we collect when you contact us, how we use it, and the
          choices you have.
        </p>

        {/* Sections */}
        <div className="mt-16 flex flex-col">
          {SECTIONS.map((s, i) => (
            <div
              key={s.n}
              className={`grid grid-cols-1 gap-4 py-8 md:grid-cols-12 md:gap-10 ${
                i > 0 ? "border-t border-hairline/12" : ""
              }`}
            >
              <div className="md:col-span-4">
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                  {s.n}
                  <span aria-hidden className="h-px w-8 bg-hairline/30" />
                </div>
                <h2 className="mt-2 text-[15px] font-semibold text-ink">{s.title}</h2>
              </div>
              <p className="text-[14px] leading-[1.7] text-ink/70 md:col-span-8">{s.body}</p>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-16 border border-hairline/15 px-6 py-6">
          <div className="label mb-2">Questions?</div>
          <p className="text-[14px] text-ink/70">
            Reach us any time at{" "}
            <a
              href="mailto:hello@kozai.ca"
              className="text-ink underline-offset-4 hover:underline"
            >
              hello@kozai.ca
            </a>
            . We reply within 48 hours.
          </p>
        </div>
      </main>

      <footer className="border-t border-hairline/12 px-6 py-8 md:px-10">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            © {new Date().getFullYear()} Kozai Software Studio
          </span>
          <Link
            to="/terms-and-conditions"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute transition-colors hover:text-ink"
          >
            Terms →
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
