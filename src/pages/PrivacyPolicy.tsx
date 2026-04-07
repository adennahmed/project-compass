import { useEffect } from "react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#ffffff" }}>
      <SEOHead
        title="Privacy Policy — Kozai"
        description="Kozai's privacy policy outlines how we collect, use, and protect your personal information."
        path="/privacy-policy"
      />
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
          Privacy Policy
        </h1>
        <p className="text-[13px] uppercase tracking-[0.08em] mb-12" style={{ color: "rgba(255,255,255,0.35)" }}>
          Last Updated — April 6, 2026
        </p>

        <div className="space-y-10" style={{ color: "rgba(255,255,255,0.7)" }}>
          <section>
            <h2 className="text-[14px] uppercase tracking-[0.1em] font-semibold mb-4" style={{ color: "#C8A96E" }}>
              1. Information We Collect
            </h2>
            <p className="text-[14px] leading-[1.8] mb-3">
              When you submit an inquiry through our contact form, we collect the following information:
            </p>
            <ul className="list-none space-y-2 ml-4">
              {["First and last name", "Email address", "Phone number (optional)", "Business name and type (optional)", "Your role", "Message content (optional)"].map((item) => (
                <li key={item} className="text-[14px] leading-[1.8] flex items-start gap-3">
                  <span style={{ color: "#C8A96E", fontSize: "8px", marginTop: "8px" }}>■</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.1em] font-semibold mb-4" style={{ color: "#C8A96E" }}>
              2. How We Use Your Information
            </h2>
            <p className="text-[14px] leading-[1.8]">
              We use the information you provide solely to respond to your inquiry, communicate with you about potential partnerships or services, and improve our offerings. We do not use your data for marketing purposes without your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.1em] font-semibold mb-4" style={{ color: "#C8A96E" }}>
              3. Data Storage & Security
            </h2>
            <p className="text-[14px] leading-[1.8]">
              Your data is stored securely using industry-standard encryption and access controls. We retain your information only as long as necessary to fulfill the purpose for which it was collected or as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.1em] font-semibold mb-4" style={{ color: "#C8A96E" }}>
              4. Data Sharing
            </h2>
            <p className="text-[14px] leading-[1.8]">
              We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep this information confidential.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.1em] font-semibold mb-4" style={{ color: "#C8A96E" }}>
              5. Your Rights
            </h2>
            <p className="text-[14px] leading-[1.8]">
              You have the right to access, correct, or delete the personal information we hold about you. To exercise these rights, please contact us at adenah04@outlook.com.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.1em] font-semibold mb-4" style={{ color: "#C8A96E" }}>
              6. Cookies
            </h2>
            <p className="text-[14px] leading-[1.8]">
              Our website does not use cookies for tracking or advertising purposes. Essential cookies may be used to ensure the basic functionality of the site.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.1em] font-semibold mb-4" style={{ color: "#C8A96E" }}>
              7. Changes to This Policy
            </h2>
            <p className="text-[14px] leading-[1.8]">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.1em] font-semibold mb-4" style={{ color: "#C8A96E" }}>
              8. Contact
            </h2>
            <p className="text-[14px] leading-[1.8]">
              If you have any questions about this Privacy Policy, please reach out to us at adenah04@outlook.com.
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

export default PrivacyPolicy;
