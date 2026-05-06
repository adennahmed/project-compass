import { Logo } from "./Logo";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-hairline/15 px-6 py-12 md:px-10 md:py-16">
      <div className="container-wide">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <Logo variant="compact" size={28} />
            <p className="mt-5 max-w-[36ch] text-[14px] leading-[1.55] text-mute">
              Software studio building the operational tools serious teams depend on. Toronto,
              with clients across North America.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">Site</div>
            <ul className="mt-4 flex flex-col gap-2.5 text-[14px]">
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
                    className="text-ink/80 underline-offset-4 transition-colors hover:text-signal hover:underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">Contact</div>
            <ul className="mt-4 flex flex-col gap-2.5 text-[14px]">
              <li>
                <a
                  href="mailto:hello@kozai.ca"
                  className="text-ink/80 underline-offset-4 transition-colors hover:text-signal hover:underline"
                >
                  hello@kozai.ca
                </a>
              </li>
              <li className="text-mute">Toronto, CA · Remote</li>
              <li className="text-mute">Mon–Fri · 09–18 ET</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t border-hairline/15 pt-6 md:flex-row md:items-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
            © {year} Kozai Software Studio · Built with intent.
          </div>
          <div className="flex gap-6 text-[12px]">
            <a href="/privacy" className="text-mute transition-colors hover:text-ink">
              Privacy
            </a>
            <a href="/terms" className="text-mute transition-colors hover:text-ink">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
