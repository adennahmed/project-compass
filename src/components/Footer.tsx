import LinkText from "./LinkText";

const footerLinks = [
  { label: "Why Kozai", href: "#why-kozai" },
  { label: "Solutions", href: "#solutions" },
  { label: "Clients", href: "#clients" },
  { label: "Team", href: "#team" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

const Footer = () => {
  return (
    <footer
      className="py-20 px-6 md:px-12"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Col 1 - Logo & tagline */}
          <div>
            <img
              src="/kozai-logo-white.svg"
              alt="Kozai"
              className="h-6 mb-6"
            />
            <p className="text-[15px] leading-[1.75]" style={{ color: "#888888" }}>
              Technology built to drive business growth.
            </p>
          </div>

          {/* Col 2 - Nav links */}
          <div className="flex flex-col gap-3">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[14px] hover-target"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                <LinkText>{link.label}</LinkText>
              </a>
            ))}
          </div>

          {/* Col 3 - Social */}
          <div className="flex flex-col gap-3">
            <a
              href="#"
              className="text-[14px] hover-target"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              <LinkText>LinkedIn</LinkText>
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[12px] hover-target"
                style={{ color: "#444444" }}
              >
                <LinkText>{link.label}</LinkText>
              </a>
            ))}
          </div>
          <p className="text-[12px]" style={{ color: "#444444" }}>
            © 2026 Kozai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
