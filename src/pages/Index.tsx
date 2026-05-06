import { useCallback, useState } from "react";
import SEOHead from "@/components/SEOHead";
import Loader from "@/components/Loader";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactDrawer from "@/components/ContactDrawer";
import Hero from "@/sections/Hero";
import Services from "@/sections/Services";
import Approach from "@/sections/Approach";
import Work from "@/sections/Work";
import Studio from "@/sections/Studio";
import Contact from "@/sections/Contact";

const Index = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const onLoaderComplete = useCallback(() => setShowLoader(false), []);

  return (
    <>
      <SEOHead
        title="Kozai — Software studio building the tools serious teams depend on."
        description="Kozai is a software studio designing and building the internal tools, dashboards, and platforms that operations teams use every day. Toronto, Canada."
        path="/"
      />
      {showLoader && <Loader onComplete={onLoaderComplete} />}
      <Navigation onContactClick={openDrawer} />
      <main className="bg-paper text-ink">
        <Hero onContactClick={openDrawer} />
        <Services />
        <Approach />
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
