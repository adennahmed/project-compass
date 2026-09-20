import { useCallback, useEffect, useState } from "react";
import SEOHead from "@/components/SEOHead";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ServiceMarquee from "@/components/ServiceMarquee";
import BackgroundDrift from "@/components/BackgroundDrift";
import SectionTransition from "@/components/SectionTransition";
import CursorGlow from "@/components/CursorGlow";
import Hero from "@/sections/Hero";
import ProjectAtlas from "@/sections/ProjectAtlas";
import Principles from "@/sections/Principles";
import KozaiArchive from "@/sections/KozaiArchive";
import AboutAden from "@/sections/AboutAden";
import Console from "@/sections/Console";
import Contact from "@/sections/Contact";

const SIGNALS = [
  "Systems engineering",
  "Product thinking",
  "Operational interfaces",
  "Evidence-first AI",
  "Offline-first software",
  "Toronto, Canada",
  "TypeScript · Go · Rust · Python",
  "Make failure legible",
  "Prototype at full fidelity",
];

const Index = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [pageVisible, setPageVisible] = useState(false);
  const onLoaderExitStart = useCallback(() => setPageVisible(true), []);
  const onLoaderComplete = useCallback(() => setShowLoader(false), []);

  useEffect(() => {
    if (pageVisible) window.scrollTo({ top: 0, behavior: "auto" });
  }, [pageVisible]);

  return (
    <>
      <SEOHead
        title="Aden Ahmed — Software Engineer & Product Builder"
        description="Portfolio of Aden Ahmed: independent systems builds, technical prototypes, operational interfaces, and the archived Kozai studio chapter."
        path="/"
      />
      {showLoader && <Loader onExitStart={onLoaderExitStart} onComplete={onLoaderComplete} />}
      <SmoothScroll />
      <CursorGlow />
      <BackgroundDrift />
      <div aria-hidden className="grain" />
      {pageVisible && <Navigation />}
      <div className={pageVisible ? "page-settle" : ""} style={{ opacity: pageVisible ? 1 : 0 }}>
        <main className="relative z-10">
          <Hero />
          <ServiceMarquee items={SIGNALS} variant="ink" />
          <ProjectAtlas />
          <SectionTransition word="Method" index={1} total={5} />
          <Principles />
          <SectionTransition word="Archive" index={2} total={5} flip />
          <KozaiArchive />
          <SectionTransition word="About" index={3} total={5} />
          <AboutAden />
          <SectionTransition word="Console" index={4} total={5} flip />
          <Console />
          <SectionTransition word="Contact" index={5} total={5} />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
