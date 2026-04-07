import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const clients = [
  {
    name: "Meridian Partners",
    tagline: "STRATEGIC GROWTH ADVISORY, REDEFINED.",
    logo: "/partners/meridian-partners.png",
  },
  {
    name: "Northbridge Group",
    tagline: "OPERATIONAL EXCELLENCE, DELIVERED.",
    logo: "/partners/northbridge-group.png",
  },
  {
    name: "Vantage Retail Co.",
    tagline: "COMMERCE INFRASTRUCTURE, REIMAGINED.",
    logo: "/partners/vantage-retail.png",
  },
  {
    name: "Harlow Industries",
    tagline: "INDUSTRIAL SYSTEMS, MODERNIZED.",
    logo: "/partners/harlow-industries.png",
  },
  {
    name: "Clearview Health",
    tagline: "PATIENT ENGAGEMENT, TRANSFORMED.",
    logo: "/partners/clearview-health.png",
  },
  {
    name: "Stratum Capital",
    tagline: "PRIVATE ASSET ANALYSIS, REIMAGINED.",
    logo: "/partners/stratum-capital.png",
  },
];

const ClientsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimating = useRef(false);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const navigateTo = useCallback((index: number) => {
    if (isAnimating.current || index === activeIndex || index < 0 || index >= clients.length) return;
    isAnimating.current = true;
    const direction = index > activeIndex ? 1 : -1;

    const card = document.querySelector(".client-main-card");
    if (card) {
      gsap.to(card, {
        opacity: 0,
        x: direction * -60,
        scale: 0.96,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setActiveIndex(index);
          gsap.fromTo(
            card,
            { opacity: 0, x: direction * 60, scale: 0.96 },
            { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: "power3.out", onComplete: () => { isAnimating.current = false; } }
          );
        },
      });
    } else {
      setActiveIndex(index);
      isAnimating.current = false;
    }
  }, [activeIndex]);

  const goNext = useCallback(() => {
    if (activeIndex < clients.length - 1) navigateTo(activeIndex + 1);
  }, [activeIndex, navigateTo]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) navigateTo(activeIndex - 1);
  }, [activeIndex, navigateTo]);

  // Touch / swipe handling
  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    touchStartX.current = clientX;
    touchDeltaX.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    touchDeltaX.current = clientX - touchStartX.current;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const threshold = 50;
    if (touchDeltaX.current < -threshold) {
      goNext();
    } else if (touchDeltaX.current > threshold) {
      goPrev();
    }
    touchDeltaX.current = 0;
  }, [goNext, goPrev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  useEffect(() => {
    gsap.from(".clients-headline", {
      y: 45, opacity: 0, duration: 0.85, ease: "power3.out",
      scrollTrigger: { trigger: ".clients-headline", start: "top 82%" },
    });
  }, []);

  const client = clients[activeIndex];

  const getSideClients = (direction: "left" | "right") => {
    const result: { client: typeof clients[0]; index: number; offset: number }[] = [];
    const count = 2;
    for (let o = 1; o <= count; o++) {
      const idx = direction === "right" ? activeIndex + o : activeIndex - o;
      if (idx >= 0 && idx < clients.length) {
        result.push({ client: clients[idx], index: idx, offset: o });
      }
    }
    return result;
  };

  const leftSide = getSideClients("left");
  const rightSide = getSideClients("right");

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="py-32 md:py-40"
      style={{ background: "#EEEAE4" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-4">
          <div
            className="text-[11px] uppercase tracking-[0.18em] mb-6"
            style={{ color: "#444444" }}
          >
            OUR PORTFOLIO
          </div>
          <h2
            className="clients-headline text-[28px] md:text-[38px] font-bold uppercase tracking-[0.02em] leading-[1.15] mb-6 max-w-[700px] mx-auto"
            style={{ color: "#1a1a1a" }}
          >
            Our Companies Don't Just Enter Markets. They Define Them.
          </h2>
        </div>

        {/* CTA bracket */}
        <div className="flex justify-center mb-16">
          <a href="#contact" className="relative inline-block px-6 py-3 hover-target group">
            <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
            <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" style={{ borderColor: "rgba(30,30,30,0.3)" }} />
            <span className="text-[12px] uppercase tracking-[0.12em]" style={{ color: "#1a1a1a" }}>
              Explore Our Portfolio
            </span>
          </a>
        </div>

        {/* Cards carousel — swipeable */}
        <div
          ref={carouselRef}
          className="relative flex items-center justify-center gap-6 md:gap-8 min-h-[520px] select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
        >
          {/* Left side ghosts */}
          <div className="hidden md:flex items-center gap-6 absolute left-0">
            {leftSide.reverse().map(({ client: c, index, offset }) => (
              <button
                key={index}
                onClick={() => navigateTo(index)}
                className="flex flex-col items-center justify-center cursor-pointer hover-target transition-all duration-300 hover:opacity-60"
                style={{
                  width: "180px",
                  height: "240px",
                  opacity: 0.25 - offset * 0.08,
                }}
              >
                <img
                  src={c.logo}
                  alt={c.name}
                  loading="lazy"
                  width={80}
                  height={80}
                  className="mb-3 grayscale"
                  style={{ opacity: 0.3 }}
                />
                <div
                  className="text-[12px] uppercase tracking-[0.1em] font-semibold"
                  style={{ color: "rgba(30,30,30,0.25)" }}
                >
                  {c.name}
                </div>
              </button>
            ))}
          </div>

          {/* Main card */}
          <div
            className="client-main-card relative flex flex-col items-center text-center px-10 md:px-16 py-12 md:py-16 w-full max-w-[420px]"
            style={{
              background: "#f5f2ed",
              borderRadius: "16px",
              minHeight: "460px",
            }}
          >
            <span className="absolute top-5 left-5 w-4 h-4 border-t border-l" style={{ borderColor: "rgba(30,30,30,0.15)" }} />
            <span className="absolute top-5 right-5 w-4 h-4 border-t border-r" style={{ borderColor: "rgba(30,30,30,0.15)" }} />
            <span className="absolute bottom-5 left-5 w-4 h-4 border-b border-l" style={{ borderColor: "rgba(30,30,30,0.15)" }} />
            <span className="absolute bottom-5 right-5 w-4 h-4 border-b border-r" style={{ borderColor: "rgba(30,30,30,0.15)" }} />

            <h3
              className="text-[20px] md:text-[24px] font-bold uppercase tracking-[0.06em] mb-10 mt-4"
              style={{ color: "#1a1a1a" }}
            >
              {client.name}
            </h3>

            {/* Logo image */}
            <div className="flex items-center justify-center mb-8" style={{ minHeight: "100px" }}>
              <img
                src={client.logo}
                alt={`${client.name} logo`}
                loading="lazy"
                width={120}
                height={120}
                className="object-contain"
                style={{ maxHeight: "120px", opacity: 0.7 }}
              />
            </div>

            <p
              className="text-[11px] uppercase tracking-[0.14em] leading-[1.6] max-w-[260px]"
              style={{ color: "rgba(30,30,30,0.45)" }}
            >
              {client.tagline}
            </p>
          </div>

          {/* Right side ghosts */}
          <div className="hidden md:flex items-center gap-6 absolute right-0">
            {rightSide.map(({ client: c, index, offset }) => (
              <button
                key={index}
                onClick={() => navigateTo(index)}
                className="flex flex-col items-center justify-center cursor-pointer hover-target transition-all duration-300 hover:opacity-60"
                style={{
                  width: "180px",
                  height: "240px",
                  opacity: 0.25 - offset * 0.08,
                }}
              >
                <img
                  src={c.logo}
                  alt={c.name}
                  loading="lazy"
                  width={80}
                  height={80}
                  className="mb-3 grayscale"
                  style={{ opacity: 0.3 }}
                />
                <div
                  className="text-[12px] uppercase tracking-[0.1em] font-semibold"
                  style={{ color: "rgba(30,30,30,0.25)" }}
                >
                  {c.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation: arrows + dots */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="hover-target p-1.5 rounded-full transition-all duration-200"
            style={{
              opacity: activeIndex === 0 ? 0.2 : 0.6,
              color: "#1a1a1a",
            }}
            aria-label="Previous company"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-3">
            {clients.map((_, i) => (
              <button
                key={i}
                onClick={() => navigateTo(i)}
                className="w-2 h-2 rounded-full transition-all duration-300 hover-target"
                style={{
                  background: i === activeIndex ? "#1a1a1a" : "rgba(30,30,30,0.2)",
                  transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
                }}
                aria-label={`Go to ${clients[i].name}`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={activeIndex === clients.length - 1}
            className="hover-target p-1.5 rounded-full transition-all duration-200"
            style={{
              opacity: activeIndex === clients.length - 1 ? 0.2 : 0.6,
              color: "#1a1a1a",
            }}
            aria-label="Next company"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
