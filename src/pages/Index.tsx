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
import ScrollProgress from "@/components/ScrollProgress";
import ContactDrawer from "@/components/ContactDrawer";
import Hero from "@/sections/Hero";
import ProjectAtlas from "@/sections/ProjectAtlas";
import Playground from "@/sections/Playground";
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

const PAGE_SECTIONS = ["top", "projects", "playground", "method", "kozai", "about", "console", "contact"];

const Index = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [pageVisible, setPageVisible] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const onLoaderExitStart = useCallback(() => setPageVisible(true), []);
  const onLoaderComplete = useCallback(() => setShowLoader(false), []);
  const openInquiry = useCallback(() => setInquiryOpen(true), []);
  const closeInquiry = useCallback(() => setInquiryOpen(false), []);

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
      {pageVisible && <Navigation onOpenInquiry={openInquiry} />}
      {pageVisible && <ScrollProgress sections={PAGE_SECTIONS} />}
      <div className={pageVisible ? "page-settle" : ""} style={{ opacity: pageVisible ? 1 : 0 }}>
        <main className="relative z-10">
          <Hero onOpenInquiry={openInquiry} />
          <ServiceMarquee items={SIGNALS} variant="ink" />
          <ProjectAtlas />
          <SectionTransition word="Play" index={1} total={6} />
          <Playground />
          <SectionTransition word="Method" index={2} total={6} />
          <Principles />
          <SectionTransition word="Archive" index={3} total={6} flip />
          <KozaiArchive />
          <SectionTransition word="About" index={4} total={6} />
          <AboutAden />
          <SectionTransition word="Console" index={5} total={6} flip />
          <Console onOpenInquiry={openInquiry} />
          <SectionTransition word="Contact" index={6} total={6} />
          <Contact onOpenInquiry={openInquiry} />
        </main>
        <Footer onOpenInquiry={openInquiry} />
      </div>
      <ContactDrawer open={inquiryOpen} onClose={closeInquiry} />
    </>
  );
};

export default Index;
