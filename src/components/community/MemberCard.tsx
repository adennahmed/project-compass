import { Link } from "react-router-dom";
import { Profile } from "@/lib/community/types";
import { dateStamp } from "@/lib/community/format";
import Avatar from "./Avatar";
import StaffBadge from "./StaffBadge";

interface MemberCardProps {
  profile: Profile;
}

const MemberCard = ({ profile }: MemberCardProps) => (
  <Link
    to={`/community/u/${profile.handle}`}
    className="group flex items-start gap-4 border border-paper/10 bg-ink/40 p-5 transition-colors hover:border-paper/30"
  >
    <Avatar profile={profile} size={48} />
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-[15px] font-semibold text-paper">{profile.display_name}</span>
        <StaffBadge role={profile.role} />
      </div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
        @{profile.handle}
      </div>
      {profile.bio && (
        <p className="mt-2 line-clamp-2 text-[13px] leading-[1.55] text-paper/60">
          {profile.bio}
        </p>
      )}
      <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/40">
        Joined · {dateStamp(profile.created_at)}
      </div>
    </div>
  </Link>
);

export default MemberCard;
