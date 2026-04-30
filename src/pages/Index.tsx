import { useCallback, useState } from "react";
import SEOHead from "@/components/SEOHead";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import ServicesSection from "@/components/ServicesSection";
import WorkSection from "@/components/WorkSection";
import StackMarquee from "@/components/StackMarquee";
import StudioSection from "@/components/StudioSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ContactDrawer from "@/components/ContactDrawer";

const Index = () => {
  const [heroAnimate, setHeroAnimate] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const onPreloaderHandoff = useCallback(() => setHeroAnimate(true), []);
  const onPreloaderComplete = useCallback(() => setShowPreloader(false), []);

  return (
    <>
      <SEOHead
        title="Kozai — Two engineers, building software that ships."
        description="Kozai is a two-person software studio that designs and builds the internal tools, dashboards, and platforms small teams and enterprise operators rely on every day."
        path="/"
      />
      <SmoothScroll />
      <CustomCursor />
      {showPreloader && (
        <Preloader onComplete={onPreloaderComplete} onTransitionStart={onPreloaderHandoff} />
      )}
      <Navigation onContactClick={openDrawer} />
      <main>
        <HeroSection animate={heroAnimate} onContactClick={openDrawer} />
        <ManifestoSection />
        <ServicesSection />
        <WorkSection />
        <StackMarquee />
        <StudioSection />
        <ContactSection onContactClick={openDrawer} />
      </main>
      <Footer />
      <ContactDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
};

export default Index;
