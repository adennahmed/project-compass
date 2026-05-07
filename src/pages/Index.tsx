import { useCallback, useEffect, useState } from "react";
import SEOHead from "@/components/SEOHead";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactDrawer from "@/components/ContactDrawer";
import ServiceMarquee from "@/components/ServiceMarquee";
import ScrollProgress from "@/components/ScrollProgress";
import BackgroundDrift from "@/components/BackgroundDrift";
import Hero from "@/sections/Hero";
import Services from "@/sections/Services";
import Approach from "@/sections/Approach";
import Work from "@/sections/Work";
import Studio from "@/sections/Studio";
import Contact from "@/sections/Contact";

const MARQUEE_ITEMS = [
  "Internal tools",
  "Workflow automation",
  "Client platforms",
  "Data infrastructure",
  "Toronto · Remote",
  "TypeScript · Go · Rust · SQL",
  "Operational software, only",
  "Reply within 48 hours",
];

const Index = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  // Loader signals "I'm starting my exit" before unmounting — that's when we
  // bring the page into view with the settle animation.
  const onLoaderExitStart = useCallback(() => setPageVisible(true), []);
  const onLoaderComplete = useCallback(() => setShowLoader(false), []);

  // Once page becomes visible, scroll to top instantly so the settle reads.
  useEffect(() => {
    if (pageVisible) window.scrollTo({ top: 0, behavior: "auto" });
  }, [pageVisible]);

  return (
    <>
      <SEOHead
        title="Kozai — Software studio building the operational software serious teams depend on."
        description="Kozai is a software studio designing and building the internal tools, dashboards, and platforms that operations teams use every day. Toronto, Canada."
        path="/"
      />
      {showLoader && (
        <Loader onExitStart={onLoaderExitStart} onComplete={onLoaderComplete} />
      )}
      <SmoothScroll />
      <BackgroundDrift />
      <div aria-hidden className="grain" />
      <ScrollProgress
        sections={["top", "services", "approach", "work", "studio", "contact"]}
      />
      <div className={pageVisible ? "page-settle" : ""} style={{ opacity: pageVisible ? 1 : 0 }}>
        <Navigation onContactClick={openDrawer} />
        <main className="relative z-10">
          <Hero onContactClick={openDrawer} />
          <ServiceMarquee items={MARQUEE_ITEMS} variant="ink" />
          <Services />
          <Approach />
          <ServiceMarquee items={MARQUEE_ITEMS.slice().reverse()} variant="signal" />
          <Work />
          <Studio />
          <Contact onContactClick={openDrawer} />
        </main>
        <Footer />
      </div>
      <ContactDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
};

export default Index;
