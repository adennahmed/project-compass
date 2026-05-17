import CountUp from "@/components/CountUp";

/**
 * VitalSigns — single-line factual strip used between Approach and Process.
 * Mono, uppercase, hairline borders top and bottom. Counts up on first
 * intersection only (CountUp handles its own visibility).
 */
const VitalSigns = () => {
  const Item = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
      <span className="text-ink/55">{label}:</span>
      <span className="text-ink/90">{value}</span>
    </span>
  );

  return (
    <section
      aria-label="Studio vital signs"
      className="border-y border-hairline/15 bg-paper"
    >
      <div className="container-wide">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-mute md:gap-x-7">
          <Item label="Active engagements" value={<CountUp to={3} duration={1400} replay={false} />} />
          <span aria-hidden className="text-ink/30">·</span>
          <Item
            label="In operation"
            value={<><CountUp to={12} duration={1500} replay={false} /> months</>}
          />
          <span aria-hidden className="text-ink/30">·</span>
          <Item label="Industries shipped" value={<CountUp to={6} duration={1300} replay={false} />} />
          <span aria-hidden className="text-ink/30">·</span>
          <Item label="Reply window" value={<span className="tabular-nums">&lt;48h</span>} />
          <span aria-hidden className="text-ink/30">·</span>
          <Item label="Studio" value="Toronto, CA" />
        </div>
      </div>
    </section>
  );
};

export default VitalSigns;
