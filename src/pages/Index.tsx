import { useCallback, useState } from "react";
import SEOHead from "@/components/SEOHead";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import MagneticCursor from "@/components/MagneticCursor";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactDrawer from "@/components/ContactDrawer";
import ServiceMarquee from "@/components/ServiceMarquee";
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

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const onLoaderComplete = useCallback(() => setShowLoader(false), []);

  return (
    <>
      <SEOHead
        title="Kozai — Software studio building the operational software serious teams depend on."
        description="Kozai is a software studio designing and building the internal tools, dashboards, and platforms that operations teams use every day. Toronto, Canada."
        path="/"
      />
      {showLoader && <Loader onComplete={onLoaderComplete} />}
      <SmoothScroll />
      <MagneticCursor />
      <Navigation onContactClick={openDrawer} />
      <main className="bg-paper text-ink">
        <Hero onContactClick={openDrawer} />
        <ServiceMarquee items={MARQUEE_ITEMS} variant="ink" />
        <Services />
        <Approach />
        <ServiceMarquee items={MARQUEE_ITEMS.slice().reverse()} variant="paper" />
        <Work />
        <Studio />
        <Contact onContactClick={openDrawer} />
      </main>
      <Footer />
      <ContactDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
};

export default Index;
