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

  const handlePreloaderComplete = useCallback(() => {
    setHeroAnimate(true);
  }, []);

  return (
    <>
      <CustomCursor />
      <Preloader onComplete={handlePreloaderComplete} />
      <Navigation />
      <main>
        <HeroSection animate={heroAnimate} />
        <PositioningSection />
        <SolutionsSection />
        <IndustriesMarquee />
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
