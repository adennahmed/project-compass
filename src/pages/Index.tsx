import { useState, useCallback } from "react";
import SEOHead from "@/components/SEOHead";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import PositioningSection from "@/components/PositioningSection";
import SolutionsSection from "@/components/SolutionsSection";
import OurFocusSection from "@/components/OurFocusSection";
import DotBackground from "@/components/DotBackground";
import IndustriesMarquee from "@/components/IndustriesMarquee";
import WhoWeServeSection from "@/components/WhoWeServeSection";
import ClientsSection from "@/components/ClientsSection";
import WhyKozaiSection from "@/components/WhyKozaiSection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import ContactSidebar from "@/components/ContactSidebar";

const Index = () => {
  const [heroAnimate, setHeroAnimate] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const handlePreloaderTransition = useCallback(() => {
    setHeroAnimate(true);
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} onTransitionStart={handlePreloaderTransition} />}
      <Navigation />
      <main>
        <HeroSection animate={heroAnimate} onOpenSidebar={openSidebar} />
        <PositioningSection />
        <SolutionsSection onOpenSidebar={openSidebar} />

        {/* Shared dot background wrapper for Our Focus + Industries */}
        <div className="relative" style={{ background: "#EEEAE4" }}>
          <DotBackground />
          {/* Top fade */}
          <div
            className="absolute top-0 left-0 right-0 h-32 z-20 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, #EEEAE4, transparent)" }}
          />
          <OurFocusSection />
          <IndustriesMarquee />
          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none"
            style={{ background: "linear-gradient(to top, #EEEAE4, transparent)" }}
          />
        </div>

        {/* Gradient transition from light to dark */}
        <div className="relative">
          <div
            className="h-32 w-full"
            style={{
              background: "linear-gradient(to bottom, #EEEAE4, #080808)",
            }}
          />
        </div>
        <WhoWeServeSection />
        <ClientsSection />
        <WhyKozaiSection />
        <TeamSection onOpenSidebar={openSidebar} />

        {/* Spacer + subtle gold line transition between Team and Contact */}
        <div className="relative" style={{ background: "#080808" }}>
          <div className="h-24 md:h-32" />
          <div className="flex items-center justify-center">
            <div
              className="h-px w-[60px] opacity-0"
              style={{ background: "#C8A96E" }}
              ref={(el) => {
                if (!el) return;
                const obs = new IntersectionObserver(([entry]) => {
                  if (entry.isIntersecting) {
                    el.style.transition = "width 1s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.6s ease";
                    el.style.width = "120px";
                    el.style.opacity = "0.3";
                    obs.disconnect();
                  }
                }, { threshold: 0.5 });
                obs.observe(el);
              }}
            />
          </div>
          <div className="h-24 md:h-32" />
        </div>

        <ContactSection onOpenSidebar={openSidebar} />
      </main>
      <Footer onOpenSidebar={openSidebar} />
      <ContactSidebar open={sidebarOpen} onClose={closeSidebar} />
    </>
  );
};

export default Index;
