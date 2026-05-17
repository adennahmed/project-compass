import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Reveal from "@/components/Reveal";
import CharReveal from "@/components/CharReveal";
import Avatar from "@/components/community/Avatar";
import { useAuth } from "@/lib/community/auth";
import { supabase } from "@/integrations/supabase/client";

/**
 * First-time profile setup. Lets the user pick a unique handle, set their
 * display name + bio, and optionally upload an avatar. Once saved we stamp
 * profiles.onboarded_at so AuthProvider stops sending the user here.
 *
 * The handle is validated client-side (regex + length) and server-side
 * (db check during save). Live availability check debounces to keep load
 * on the DB minimal.
 */
const HANDLE_RE = /^[a-z0-9_]{2,32}$/;

const Onboarding = () => {
  const navigate = useNavigate();
  const { session, profile, loading, refreshProfile } = useAuth();

  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [handleStatus, setHandleStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCheckTimer = useRef<number | null>(null);

  // Seed form with whatever the trigger-generated profile has.
  useEffect(() => {
    if (profile) {
      setHandle(profile.handle);
      setDisplayName(profile.display_name);
      setBio(profile.bio ?? "");
    }
  }, [profile]);

  // Debounced handle availability check
  useEffect(() => {
    if (!supabase) return;
    if (handleCheckTimer.current) window.clearTimeout(handleCheckTimer.current);
    setHandleStatus("idle");

    if (!handle) return;
    if (!HANDLE_RE.test(handle)) {
      setHandleStatus("invalid");
      return;
    }
    // Same as current handle? Always considered available for this user.
    if (profile && handle === profile.handle) {
      setHandleStatus("available");
      return;
    }

    setHandleStatus("checking");
    handleCheckTimer.current = window.setTimeout(async () => {
      const { data, error } = await supabase!
        .from("profiles")
        .select("id")
        .eq("handle", handle)
        .maybeSingle();
      if (error) {
        console.error(error);
        setHandleStatus("idle");
        return;
      }
      setHandleStatus(data ? "taken" : "available");
    }, 380);

    return () => {
      if (handleCheckTimer.current) window.clearTimeout(handleCheckTimer.current);
    };
  }, [handle, profile]);

  // Local preview for avatar upload
  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-6 md:px-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">↘ Loading…</div>
      </section>
    );
  }

  if (!session) return <Navigate to="/community/auth" replace />;
  if (profile?.onboarded_at) return <Navigate to="/community" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!HANDLE_RE.test(handle)) {
      setError("Handle must be 2–32 chars: a–z, 0–9, _.");
      return;
    }
    if (handleStatus === "taken") {
      setError("That handle is taken. Try another.");
      return;
    }
    if (!displayName.trim()) {
      setError("Display name is required.");
      return;
    }
    if (!supabase || !session) return;

    setSubmitting(true);

    try {
      // 1. Upload avatar (if a new file was chosen)
      let avatarUrl: string | null = profile?.avatar_url ?? null;
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const filename = `${Date.now()}.${ext}`;
        const path = `${session.user.id}/${filename}`;
        const { error: uploadErr } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { cacheControl: "3600", upsert: false });
        if (uploadErr) throw uploadErr;
        const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
        avatarUrl = pub.publicUrl;
      }

      // 2. Update the profile row, stamp onboarded_at
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({
          handle,
          display_name: displayName.trim(),
          bio: bio.trim() || null,
          avatar_url: avatarUrl,
          onboarded_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);
      if (updateErr) throw updateErr;

      await refreshProfile();
      navigate("/community", { replace: true });
    } catch (err) {
      console.error("[onboarding] save failed:", err);
      setError(err instanceof Error ? err.message : "Save failed");
      setSubmitting(false);
    }
  };

  const previewProfile = {
    display_name: displayName || profile?.display_name || "you",
    avatar_url: avatarPreview ?? profile?.avatar_url ?? null,
    role: profile?.role ?? "member",
  };

  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="container-wide grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-7">
          <Reveal replay={false}>
            <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
              [ — Setup your profile ]
            </div>
          </Reveal>
          <h1
            className="mt-5 text-paper"
            style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 0.98 }}
          >
            <CharReveal replay={false} stagger={26}>{"PICK A"}</CharReveal>{" "}
            <span className="italic-editorial text-signal">
              <CharReveal replay={false} stagger={26} delay={200}>{"HANDLE."}</CharReveal>
            </span>
          </h1>
          <Reveal replay={false} delay={500}>
            <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.65] text-paper/65 md:text-[16px]">
              This is how others will know you in the community. You can change
              everything except your handle later from Settings.
            </p>
          </Reveal>

          <form onSubmit={submit} className="mt-10 flex flex-col gap-6 border border-paper/15 bg-ink/40 p-7 md:p-9">
            {/* Avatar */}
            <div className="flex items-start gap-5">
              <Avatar profile={previewProfile as any} size={72} />
              <div className="flex-1">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">Avatar</div>
                <label className="mt-2 inline-block cursor-pointer border border-paper/25 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85 transition-colors hover:border-paper/55 hover:text-paper">
                  Choose image
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                {avatarFile && (
                  <button
                    type="button"
                    onClick={() => setAvatarFile(null)}
                    className="ml-2 link-wipe font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55 hover:text-signal"
                  >
                    Remove
                  </button>
                )}
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/35">
                  Square jpg/png/webp · 2MB max
                </p>
              </div>
            </div>

            {/* Handle */}
            <label className="kz-input kz-input--dark block">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">Handle</span>
                {handleStatus === "checking" && <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">checking…</span>}
                {handleStatus === "available" && <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal">available ✓</span>}
                {handleStatus === "taken" && <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal">taken ✗</span>}
                {handleStatus === "invalid" && <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal">a–z, 0–9, _ only</span>}
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="font-mono text-[15px] text-paper/45">@</span>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase())}
                  maxLength={32}
                  className="w-full bg-transparent py-2.5 text-[15px] text-paper placeholder:text-paper/30 focus:outline-none"
                  placeholder="alice"
                  autoComplete="off"
                />
              </div>
            </label>

            {/* Display Name */}
            <label className="kz-input kz-input--dark block">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">Display name</span>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={64}
                placeholder="Your name"
                className="mt-1.5 w-full bg-transparent py-2.5 text-[15px] text-paper placeholder:text-paper/30 focus:outline-none"
              />
            </label>

            {/* Bio */}
            <label className="block">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">Bio</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/35">{bio.length} / 280</span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 280))}
                rows={3}
                placeholder="One sentence about what you're working on (optional)"
                className="mt-1.5 w-full resize-none border-b border-paper/20 bg-transparent py-2.5 text-[15px] text-paper placeholder:text-paper/30 focus:border-signal focus:outline-none"
              />
            </label>

            {error && (
              <div className="border-l-2 border-signal pl-3 font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || handleStatus === "taken" || handleStatus === "checking"}
              className="self-start border border-paper bg-paper px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Finish setup ↘"}
            </button>
          </form>
        </div>

        {/* Live preview */}
        <div className="md:col-span-5">
          <Reveal replay={false} delay={300}>
            <div className="sticky top-24 flex flex-col gap-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/45">↘ Live preview</div>
              <div className="flex items-start gap-4 border border-paper/15 bg-ink/40 p-5">
                <Avatar profile={previewProfile as any} size={56} />
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] font-semibold text-paper">{displayName || "Display name"}</div>
                  <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
                    @{handle || "handle"}
                  </div>
                  {bio && (
                    <p className="mt-3 text-[13.5px] leading-[1.55] text-paper/65">{bio}</p>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Onboarding;
