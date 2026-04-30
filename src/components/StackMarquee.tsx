const stack = [
  "TypeScript",
  "Postgres",
  "Next.js",
  "Go",
  "Rust",
  "Three.js",
  "GSAP",
  "Tailwind",
  "Supabase",
  "Inngest",
  "Mapbox",
  "OpenAI",
  "Stripe",
  "WebSockets",
  "GraphQL",
  "DuckDB",
  "Redis",
  "Cloudflare",
  "Whisper",
  "GLSL",
];

const StackMarquee = () => {
  const row = [...stack, ...stack];
  return (
    <section
      aria-label="Tech we build with"
      className="relative w-full overflow-hidden border-y border-bone/8 bg-ink py-10"
    >
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
      <div className="flex animate-marquee gap-16 whitespace-nowrap will-change-transform">
        {row.map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 font-mono text-[14px] uppercase tracking-[0.16em] text-bone/65"
          >
            <span className="text-signal">●</span>
            {s}
          </span>
        ))}
      </div>
    </section>
  );
};

export default StackMarquee;
