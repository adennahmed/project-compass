interface EmptyStateProps {
  label?: string;
  title: string;
  body?: string;
  action?: React.ReactNode;
}

const EmptyState = ({ label = "Nothing here yet", title, body, action }: EmptyStateProps) => (
  <div className="flex flex-col items-start gap-3 border border-dashed border-paper/15 p-8 md:p-10">
    <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/45">
      ↘ {label}
    </div>
    <h3 className="font-mono text-[18px] uppercase tracking-[-0.01em] text-paper md:text-[22px]">
      {title}
    </h3>
    {body && (
      <p className="max-w-[48ch] text-[14px] leading-[1.6] text-paper/65">{body}</p>
    )}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;
