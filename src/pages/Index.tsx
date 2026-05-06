import { useCallback, useState } from "react";
import SEOHead from "@/components/SEOHead";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import RoomScene from "@/components/RoomScene";
import MobileScene from "@/components/MobileScene";
import ContactDrawer from "@/components/ContactDrawer";
import { useIsMobile } from "@/hooks/useIsMobile";

const Index = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile(768);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Preloader handoff is unused for now — retained for the future
  // step-10 glitch transition between loader-exit and room-engine reveal.
  const onPreloaderHandoff = useCallback(() => {}, []);
  const onPreloaderComplete = useCallback(() => setShowPreloader(false), []);

  return (
    <>
      <SEOHead
        title="Kozai — Software studio. Tools that ship."
        description="Kozai is a software studio designing and building the internal tools, dashboards, and platforms that small teams and enterprise operators rely on every day."
        path="/"
      />
      <SmoothScroll />
      <CustomCursor />
      {showPreloader && (
        <Preloader onComplete={onPreloaderComplete} onTransitionStart={onPreloaderHandoff} />
      )}
      <main>
        {isMobile ? (
          <MobileScene onContactClick={openDrawer} />
        ) : (
          <RoomScene onContactClick={openDrawer} />
        )}
      </main>
      <ContactDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
};

export default Index;
