import Logo from "./Logo";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-ink text-paper">
      {/* Supersize KOZAI wordmark — fills viewport width */}
      <div className="container-wide pb-0 pt-24 md:pt-32">
        <div className="grid grid-cols-1 gap-10 border-b border-paper/10 pb-12 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/50">
              Kozai · est. 2025
            </div>
            <p className="mt-5 max-w-[36ch] text-[15px] leading-[1.55] text-paper/75">
              Software studio building the operational tools serious teams depend on. Toronto, with
              clients across North America.
            </p>
            <a

              href="mailto:hello@kozai.ca"
              className="mt-7 inline-block text-[16px] text-paper underline-offset-4 transition-colors hover:text-signal hover:underline"
            >
              hello@kozai.ca
            </a>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/50">Site</div>
            <ul className="mt-5 flex flex-col gap-2.5 text-[14px]">
              {[
                ["Services", "#services"],
                ["Approach", "#approach"],
                ["Work", "#work"],
                ["Studio", "#studio"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a

                    href={href}
                    className="text-paper/85 underline-offset-4 transition-colors hover:text-signal hover:underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/50">
              Studio
            </div>
            <ul className="mt-5 flex flex-col gap-2.5 text-[14px] text-paper/75">
              <li>Toronto, CA</li>
              <li>Mon–Fri · 09–18 ET</li>
              <li>Reply within 48 h</li>
              <li>43.6532° N · 79.3832° W</li>
            </ul>
          </div>
        </div>

        {/* Wordmark supersize — scales to container width via SVG natural width */}
        <div className="-mx-1 overflow-hidden py-12 md:py-16">
          <Logo
            variant="white"
            className="block w-full"
            style={{ height: "auto", width: "100%" }}
            size={220}
          />
        </div>

        <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-paper/10 py-7 md:flex-row md:items-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/45">
            © {year} Kozai Software Studio · Built with intent.
          </div>
          <div className="flex gap-6 text-[12px]">
            <a href="/privacy-policy" className="text-paper/55 transition-colors hover:text-paper">
              Privacy
            </a>
            <a href="/terms-and-conditions" className="text-paper/55 transition-colors hover:text-paper">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
