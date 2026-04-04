import { useState, useCallback } from "react";
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

const Index = () => {
  const [heroAnimate, setHeroAnimate] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

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
        <HeroSection animate={heroAnimate} />
        <PositioningSection />
        <SolutionsSection />

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
        {/* Black spacer before team */}
        <div className="h-[30vh]" />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
