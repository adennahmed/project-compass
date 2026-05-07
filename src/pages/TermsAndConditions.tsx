import { useEffect } from "react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Logo from "@/components/Logo";

const SECTIONS = [
  {
    n: "01",
    title: "Acceptance of Terms",
    body: "By accessing or using the Kozai website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use the website.",
  },
  {
    n: "02",
    title: "Use of the Website",
    body: "This website is provided for informational purposes and to facilitate communication between you and Kozai. You agree not to use this website for any unlawful purpose or in a way that could damage, disable, or impair the site or its availability to others.",
  },
  {
    n: "03",
    title: "Intellectual Property",
    body: "All content on this website — including text, graphics, logos, and design — is the property of Kozai and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.",
  },
  {
    n: "04",
    title: "Contact Form Submissions",
    body: "By submitting information through our contact form, you represent that the information provided is accurate and complete. You consent to us contacting you in response to your inquiry using the details provided.",
  },
  {
    n: "05",
    title: "No Warranties",
    body: "The website and its content are provided \"as is\" without warranties of any kind, express or implied. Kozai does not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components.",
  },
  {
    n: "06",
    title: "Limitation of Liability",
    body: "Kozai shall not be liable for any indirect, incidental, special, or consequential damages arising from or in connection with your use of, or inability to use, this website or its content.",
  },
  {
    n: "07",
    title: "Governing Law",
    body: "These Terms and Conditions are governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict-of-law principles.",
  },
  {
    n: "08",
    title: "Changes to Terms",
    body: "We reserve the right to modify these terms at any time. Changes will be posted on this page with a revised effective date. Continued use of the website after changes constitutes acceptance of the updated terms.",
  },
  {
    n: "09",
    title: "Contact",
    body: "For questions regarding these Terms and Conditions, contact us at hello@kozai.ca.",
  },
];

const TermsAndConditions = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SEOHead
        title="Terms & Conditions — Kozai"
        description="Read Kozai's terms and conditions governing the use of our services and website."
        path="/terms-and-conditions"
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
        <div className="label mb-8">[ Legal · Terms ]</div>

        {/* Title */}
        <h1
          className="display text-ink"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.75rem)", letterSpacing: "-0.04em" }}
        >
          Terms &amp; Conditions
        </h1>

        <div className="mt-4 flex items-center gap-4">
          <div className="h-px flex-1 bg-hairline/15" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            Last updated — May 2026
          </span>
        </div>

        {/* Intro */}
        <p className="mt-10 max-w-[52ch] text-[15px] leading-[1.65] text-ink/70">
          These terms govern your use of the Kozai website and any communications
          initiated through it. Please read them carefully before using the site.
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
            to="/privacy-policy"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute transition-colors hover:text-ink"
          >
            Privacy →
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
