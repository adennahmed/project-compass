interface TagProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  as?: "button" | "span";
  className?: string;
}

const Tag = ({ children, active, onClick, as = "span", className = "" }: TagProps) => {
  const base =
    "inline-flex items-center border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors";
  const stateLight =
    "border-paper/20 text-paper/70 hover:border-paper/45 hover:text-paper";
  const stateActive = "border-signal bg-signal/12 text-signal";
  const klass = `${base} ${active ? stateActive : stateLight} ${className}`;
  if (as === "button" || onClick) {
    return (
      <button type="button" onClick={onClick} className={klass}>
        {children}
      </button>
    );
  }
  return <span className={klass}>{children}</span>;
};

export default Tag;
