import { useState, useCallback } from "react";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import PositioningSection from "@/components/PositioningSection";
import SolutionsSection from "@/components/SolutionsSection";
import IndustriesMarquee from "@/components/IndustriesMarquee";
import WhoWeServeSection from "@/components/WhoWeServeSection";
import ClientsSection from "@/components/ClientsSection";
import WhyKozaiSection from "@/components/WhyKozaiSection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

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
      <CustomCursor />
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} onTransitionStart={handlePreloaderTransition} />}
      <Navigation />
      <main>
        <HeroSection animate={heroAnimate} />
        <PositioningSection />
        <SolutionsSection />
        <IndustriesMarquee />
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
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
