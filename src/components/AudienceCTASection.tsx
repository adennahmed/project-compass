import LinkText from "./LinkText";

const AudienceCTASection = () => {
  return (
    <section className="py-32 md:py-40 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-0">
        {/* Panel 01 */}
        <div
          className="p-10 md:p-16 flex flex-col justify-between min-h-[400px]"
          style={{
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "3px 0 0 3px",
          }}
        >
          <div>
            <div
              className="text-[11px] uppercase tracking-[0.18em] mb-6"
              style={{ color: "#C8A96E" }}
            >
              FOR BUSINESSES
            </div>
            <h3 className="text-[28px] md:text-[36px] font-light leading-[1.1] mb-6">
              Build the Systems That Make Growth Inevitable.
            </h3>
            <p
              className="text-[15px] leading-[1.75] mb-8"
              style={{ color: "#888888" }}
            >
              Stop losing revenue to fragmented tools and technology that can't
              support your pace. Let's build the infrastructure your ambition
              requires.
            </p>
          </div>
          <a
            href="#contact"
            className="text-[14px] hover-target inline-block"
            style={{ color: "#C8A96E" }}
          >
            <LinkText>Start the Conversation →</LinkText>
          </a>
        </div>

        {/* Panel 02 */}
        <div
          className="p-10 md:p-16 flex flex-col justify-between min-h-[400px]"
          style={{
            background: "#0E0E0E",
            border: "1px solid rgba(255,255,255,0.07)",
            borderLeft: "none",
            borderRadius: "0 3px 3px 0",
          }}
        >
          <div>
            <div
              className="text-[11px] uppercase tracking-[0.18em] mb-6"
              style={{ color: "#C8A96E" }}
            >
              FOR PARTNERS
            </div>
            <h3 className="text-[28px] md:text-[36px] font-light leading-[1.1] mb-6">
              Extend What's Possible For Your Clients.
            </h3>
            <p
              className="text-[15px] leading-[1.75] mb-8"
              style={{ color: "#888888" }}
            >
              If you work with businesses that need stronger technology
              execution, we should talk. Kozai operates as a trusted delivery
              partner for agencies, advisors, and consultants.
            </p>
          </div>
          <a
            href="#contact"
            className="text-[14px] hover-target inline-block"
            style={{ color: "#C8A96E" }}
          >
            <LinkText>Explore a Partnership →</LinkText>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AudienceCTASection;
