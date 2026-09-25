import { useEffect, useState } from "react";

const PHRASES = [
  "> systems should explain themselves",
  "> interface is part of the architecture",
  "> build the hard part clearly",
  "> toronto, ontario",
  "> curiosity compounds",
];

const AmbientTerminal = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % PHRASES.length), 3800);
    return () => window.clearInterval(id);
  }, []);
  return <div className="border-t border-paper/10 px-1 py-2.5"><div key={idx} className="font-mono text-[10px] tracking-[0.04em] text-paper/40" style={{ animation: "kz-term-fade 3.8s ease-in-out" }}>{PHRASES[idx]}</div></div>;
};

const links = [
  ["Projects", "#projects"],
  ["Playground", "#playground"],
  ["Method", "#method"],
  ["Kozai archive", "#kozai"],
  ["About", "#about"],
  ["Console", "#console"],
  ["Contact", "#contact"],
];

const Footer = () => (
  <footer className="theme-invert relative bg-ink text-paper">
    <div className="container-wide pb-0 pt-24 md:pt-32">
      <div className="grid grid-cols-1 gap-10 border-b border-paper/10 pb-12 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50">Aden Ahmed · Software engineer</div>
          <p className="mt-5 max-w-[42ch] text-[15px] leading-[1.65] text-paper/70">Independent builds, technical prototypes, and systems thinking from Toronto. Interested in difficult software that becomes calm in the hands of the person using it.</p>
          <a href="mailto:hello@kozai.ca?subject=Hello%20Aden" className="mt-7 inline-block text-[16px] text-paper underline-offset-4 transition-colors hover:text-signal hover:underline">hello@kozai.ca</a>
        </div>
        <div className="md:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50">Index</div>
          <ul className="mt-5 flex flex-col gap-2.5 text-[14px]">{links.map(([label, href]) => <li key={href}><a href={href} className="text-paper/75 transition-colors hover:text-signal">{label}</a></li>)}</ul>
        </div>
        <div className="md:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50">Elsewhere</div>
          <ul className="mt-5 flex flex-col gap-2.5 text-[14px]"><li><a href="https://www.linkedin.com/in/adenahmed/" target="_blank" rel="noreferrer" className="text-paper/75 hover:text-signal">LinkedIn ↗</a></li><li className="text-paper/55">Toronto, Canada</li><li className="text-paper/55">43.6532° N · 79.3832° W</li></ul>
        </div>
      </div>

      <div className="overflow-hidden py-12 md:py-16">
        <div className="display whitespace-nowrap text-paper" style={{ fontSize: "clamp(4rem, 15vw, 13rem)", letterSpacing: "-0.075em", lineHeight: 0.78 }}>ADEN <span className="text-signal">/</span> AHMED</div>
      </div>
      <AmbientTerminal />
      <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-paper/10 py-7 md:flex-row md:items-center"><div className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/40">© {new Date().getFullYear()} Aden Ahmed · Built with intent.</div><div className="flex gap-6 text-[12px]"><a href="/privacy-policy" className="text-paper/50 hover:text-paper">Privacy</a><a href="/terms-and-conditions" className="text-paper/50 hover:text-paper">Terms</a></div></div>
    </div>
  </footer>
);

export default Footer;
