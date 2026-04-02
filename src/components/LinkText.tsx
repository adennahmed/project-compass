interface LinkTextProps {
  children: string;
  className?: string;
}

const LinkText = ({ children, className = "" }: LinkTextProps) => (
  <span className={`link-wrap ${className}`}>
    <span>{children}</span>
    <span>{children}</span>
  </span>
);

export default LinkText;
