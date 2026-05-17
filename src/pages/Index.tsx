import { useCallback, useEffect, useState } from "react";
import SEOHead from "@/components/SEOHead";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactDrawer from "@/components/ContactDrawer";
import ServiceMarquee from "@/components/ServiceMarquee";
import BackgroundDrift from "@/components/BackgroundDrift";
import Hero from "@/sections/Hero";
import Services from "@/sections/Services";
import Approach from "@/sections/Approach";
import Process from "@/sections/Process";
import Work from "@/sections/Work";
import Studio from "@/sections/Studio";
import Contact from "@/sections/Contact";
import BeforeAfter from "@/sections/BeforeAfter";
import OpsFeed from "@/components/OpsFeed";
import VitalSigns from "@/components/VitalSigns";
import SectionDivider from "@/components/SectionDivider";

const MARQUEE_ITEMS = [
  "Internal tools",
  "Workflow automation",
  "Client platforms",
  "Data infrastructure",
  "Toronto, CA",
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
      {/* Navigation lives OUTSIDE page-settle so position:fixed is always
          relative to the viewport. Any transform on a parent (even the
          identity matrix left by the settle animation) breaks fixed positioning. */}
      {pageVisible && <Navigation onContactClick={openDrawer} />}
      <div className={pageVisible ? "page-settle" : ""} style={{ opacity: pageVisible ? 1 : 0 }}>
        <main className="relative z-10">
          <Hero onContactClick={openDrawer} />
          <SectionDivider index={1} total={8} />
          <div className="py-8">
            <OpsFeed />
          </div>
          <ServiceMarquee items={MARQUEE_ITEMS} variant="ink" />
          <Services onContactClick={openDrawer} />
          <SectionDivider index={2} total={8} />
          <Approach />
          <VitalSigns />
          <Process />
          <SectionDivider index={3} total={8} />
          <ServiceMarquee items={MARQUEE_ITEMS.slice().reverse()} variant="signal" />
          <Work />
          <SectionDivider index={4} total={8} />
          <BeforeAfter />
          <Studio />
          <SectionDivider index={5} total={8} />
          <Contact onContactClick={openDrawer} />
        </main>
        <Footer />
      </div>
      <ContactDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
};

export default Index;
