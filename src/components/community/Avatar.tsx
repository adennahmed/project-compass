import { Profile } from "@/lib/community/types";
import { initials } from "@/lib/community/format";

interface AvatarProps {
  profile: Pick<Profile, "display_name" | "avatar_url" | "role">;
  size?: number;
  className?: string;
}

/**
 * Square (intentionally not round) editorial avatar — image when available,
 * monogram fallback in mono with hairline frame. Staff/admin get a thin
 * signal-orange frame to differentiate at glance.
 */
const Avatar = ({ profile, size = 36, className = "" }: AvatarProps) => {
  const isStaff = profile.role === "staff" || profile.role === "admin";
  const frame = isStaff ? "border-signal/70" : "border-paper/20";
  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden border ${frame} bg-ink ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {profile.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt=""
          className="h-full w-full object-cover"
          style={{ maxWidth: "none" }}
        />
      ) : (
        <span
          className="font-mono text-paper/85"
          style={{
            fontSize: Math.max(10, Math.round(size * 0.34)),
            letterSpacing: "0.04em",
          }}
        >
          {initials(profile.display_name)}
        </span>
      )}
    </div>
  );
};

export default Avatar;
