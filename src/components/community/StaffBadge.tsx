import { UserRole } from "@/lib/community/types";

interface StaffBadgeProps {
  role: UserRole;
  size?: "sm" | "md";
}

/**
 * Compact orange "KOZAI" chip distinguishing staff/admin from regular members.
 * Renders nothing for members (callers can still pass the role without
 * needing to branch in the parent).
 */
const StaffBadge = ({ role, size = "sm" }: StaffBadgeProps) => {
  if (role === "member") return null;
  const label = role === "admin" ? "KOZAI · ADMIN" : "KOZAI";
  const dims =
    size === "md" ? "px-2.5 py-1 text-[10px]" : "px-2 py-[3px] text-[9px]";
  return (
    <span
      className={`inline-flex items-center border border-signal/60 bg-signal/12 font-mono uppercase tracking-[0.22em] text-signal ${dims}`}
    >
      {label}
    </span>
  );
};

export default StaffBadge;
