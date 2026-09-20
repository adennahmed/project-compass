import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

const NotFound = () => (
  <main className="relative flex min-h-screen overflow-hidden bg-paper px-6 py-8 text-ink md:px-10">
    <SEOHead
      title="Page Not Found — Aden Ahmed"
      description="The requested page does not exist in the Aden Ahmed portfolio."
      path="/404"
      noindex
    />

    <div aria-hidden className="grain" />
    <div className="container-wide relative z-10 flex min-h-[calc(100vh-4rem)] flex-col">
      <header className="flex items-center justify-between border-b border-hairline/15 pb-5">
        <Link to="/" aria-label="Aden Ahmed — home" className="font-mono text-[11px] font-semibold tracking-[0.18em]">
          A/A
        </Link>
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-mute">Error / 404</span>
      </header>

      <section className="grid flex-1 content-center gap-8 py-20 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <div className="label mb-6">[ Route unresolved ]</div>
          <h1 className="display max-w-[10ch] text-ink" style={{ fontSize: "clamp(4.5rem, 15vw, 12rem)", lineHeight: 0.82 }}>
            Wrong<br /><span className="text-signal">turn.</span>
          </h1>
        </div>
        <div className="border-t border-hairline/15 pt-6 md:col-span-4">
          <p className="max-w-[34ch] text-[15px] leading-[1.65] text-mute">
            This route does not resolve to anything in the portfolio. The useful systems are one step back.
          </p>
          <Link to="/" className="btn-slot mt-8 inline-flex bg-ink px-6 py-4 text-[13px] font-medium text-paper">
            <span className="btn-slot__label">Return to portfolio ↘</span>
            <span className="btn-slot__label--hover bg-signal">Back to the index ↘</span>
          </Link>
        </div>
      </section>

      <footer className="flex items-center justify-between border-t border-hairline/15 pt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
        <span>Aden Ahmed · Toronto</span>
        <span>404 / not found</span>
      </footer>
    </div>
  </main>
);

export default NotFound;
