import { useEffect } from "react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#ffffff" }}>
      {/* Header */}
      <header className="px-6 md:px-12 py-8 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/kozai-logo-white.svg" alt="Kozai" className="h-5 w-auto" />
        </Link>
        <Link
          to="/"
          className="text-[11px] uppercase tracking-[0.12em] hover-target"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          ← Back
        </Link>
      </header>

      {/* Content */}
      <main className="px-6 md:px-12 lg:px-24 max-w-[800px] pb-24">
        <div
          className="text-[11px] uppercase tracking-[0.18em] mb-6 mt-8"
          style={{ color: "#C8A96E" }}
        >
          Legal
        </div>
        <h1
          className="text-[32px] md:text-[48px] font-bold uppercase leading-[1.1] mb-4"
          style={{ color: "#ffffff" }}
        >
          Terms &amp; Conditions
        </h1>
        <p className="text-[13px] uppercase tracking-[0.08em] mb-12" style={{ color: "rgba(255,255,255,0.35)" }}>
          Last Updated — April 6, 2026
        </p>

        <div className="space-y-10" style={{ color: "rgba(255,255,255,0.7)" }}>
          <section>
            <h2 className="text-[14px] uppercase tracking-[0.1em] font-semibold mb-4" style={{ color: "#C8A96E" }}>
              1. Acceptance of Terms
            </h2>
            <p className="text-[14px] leading-[1.8]">
              By accessing or using the Kozai website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use the website.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.1em] font-semibold mb-4" style={{ color: "#C8A96E" }}>
              2. Use of the Website
            </h2>
            <p className="text-[14px] leading-[1.8]">
              This website is provided for informational purposes and to facilitate communication between you and Kozai. You agree not to use this website for any unlawful purpose or in a way that could damage, disable, or impair the site.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.1em] font-semibold mb-4" style={{ color: "#C8A96E" }}>
              3. Intellectual Property
            </h2>
            <p className="text-[14px] leading-[1.8]">
              All content on this website — including text, graphics, logos, and design — is the property of Kozai and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.1em] font-semibold mb-4" style={{ color: "#C8A96E" }}>
              4. Contact Form Submissions
            </h2>
            <p className="text-[14px] leading-[1.8]">
              By submitting information through our contact form, you represent that the information provided is accurate and complete. You consent to us contacting you in response to your inquiry using the details provided.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.1em] font-semibold mb-4" style={{ color: "#C8A96E" }}>
              5. Limitation of Liability
            </h2>
            <p className="text-[14px] leading-[1.8]">
              Kozai shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website. The website and its content are provided "as is" without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.1em] font-semibold mb-4" style={{ color: "#C8A96E" }}>
              6. Changes to Terms
            </h2>
            <p className="text-[14px] leading-[1.8]">
              We reserve the right to modify these terms at any time. Changes will be posted on this page with a revised effective date. Continued use of the website after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.1em] font-semibold mb-4" style={{ color: "#C8A96E" }}>
              7. Contact
            </h2>
            <p className="text-[14px] leading-[1.8]">
              For questions regarding these Terms and Conditions, contact us at adenah04@outlook.com.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-[11px] uppercase tracking-[0.06em]" style={{ color: "rgba(255,255,255,0.3)" }}>
          © 2026 Kozai. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
