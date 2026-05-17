import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Reveal from "@/components/Reveal";
import Avatar from "@/components/community/Avatar";
import { useAuth } from "@/lib/community/auth";
import { supabase } from "@/integrations/supabase/client";

type Tab = "profile" | "account" | "danger";

const Settings = () => {
  const { session, profile, loading, refreshProfile, signOut, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");

  // Profile editor state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Delete-account confirmation state
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name);
      setBio(profile.bio ?? "");
    }
  }, [profile]);

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
  if (!session || !profile) return <Navigate to="/community/auth" replace />;

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !session) return;
    setProfileError(null);
    setProfileSaved(false);

    if (!displayName.trim()) {
      setProfileError("Display name is required.");
      return;
    }

    setProfileSubmitting(true);
    try {
      let avatarUrl: string | null = profile.avatar_url ?? null;
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

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim(),
          bio: bio.trim() || null,
          avatar_url: avatarUrl,
        })
        .eq("id", session.user.id);
      if (error) throw error;

      await refreshProfile();
      setProfileSaved(true);
      setAvatarFile(null);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err) {
      console.error("[settings] save failed:", err);
      setProfileError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setProfileSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (confirmText !== "DELETE") return;
    setDeleting(true);
    setDeleteError(null);
    const { error } = await deleteAccount();
    if (error) {
      setDeleteError(error);
      setDeleting(false);
      return;
    }
    navigate("/community", { replace: true });
  };

  const previewProfile = {
    display_name: displayName || profile.display_name,
    avatar_url: avatarPreview ?? profile.avatar_url,
    role: profile.role,
  };

  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="container-wide">
        <Reveal replay={false}>
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/55">
            [ — Settings ]
          </div>
        </Reveal>

        <h1
          className="mt-5 text-paper"
          style={{ fontSize: "clamp(1.8rem, 4.4vw, 3rem)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.05 }}
        >
          Your account.
        </h1>

        {/* Tabs */}
        <div className="mt-10 flex gap-1.5 border-b border-paper/10">
          {([
            ["profile", "Profile"],
            ["account", "Account"],
            ["danger",  "Danger zone"],
          ] as [Tab, string][]).map(([k, label]) => {
            const active = tab === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={`relative px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors ${
                  active ? "text-paper" : "text-paper/55 hover:text-paper/85"
                }`}
              >
                {label}
                {active && <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-signal" />}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          {/* Left column — editor */}
          <div className="md:col-span-8">
            {tab === "profile" && (
              <form onSubmit={saveProfile} className="flex flex-col gap-6 border border-paper/15 bg-ink/40 p-7 md:p-9">
                {/* Avatar */}
                <div className="flex items-start gap-5">
                  <Avatar profile={previewProfile as any} size={72} />
                  <div className="flex-1">
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">Avatar</div>
                    <label className="mt-2 inline-block cursor-pointer border border-paper/25 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85 transition-colors hover:border-paper/55 hover:text-paper">
                      Replace image
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
                        Revert
                      </button>
                    )}
                  </div>
                </div>

                {/* Handle (read-only here) */}
                <div className="kz-input kz-input--dark block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">Handle (cannot be changed)</span>
                  <div className="mt-1.5 py-2.5 text-[15px] text-paper/85">@{profile.handle}</div>
                </div>

                <label className="kz-input kz-input--dark block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">Display name</span>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={64}
                    className="mt-1.5 w-full bg-transparent py-2.5 text-[15px] text-paper placeholder:text-paper/30 focus:outline-none"
                  />
                </label>

                <label className="block">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">Bio</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/35">{bio.length} / 280</span>
                  </div>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 280))}
                    rows={3}
                    className="mt-1.5 w-full resize-none border-b border-paper/20 bg-transparent py-2.5 text-[15px] text-paper placeholder:text-paper/30 focus:border-signal focus:outline-none"
                  />
                </label>

                {profileError && (
                  <div className="border-l-2 border-signal pl-3 font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                    {profileError}
                  </div>
                )}
                {profileSaved && (
                  <div className="border-l-2 border-signal pl-3 font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                    Saved ✓
                  </div>
                )}

                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="self-start border border-paper bg-paper px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-signal hover:border-signal hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {profileSubmitting ? "Saving…" : "Save changes ↘"}
                </button>
              </form>
            )}

            {tab === "account" && (
              <div className="flex flex-col gap-6 border border-paper/15 bg-ink/40 p-7 md:p-9">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">Email</div>
                  <div className="mt-1.5 text-[15px] text-paper">{session.user.email ?? "—"}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">Role</div>
                  <div className="mt-1.5 text-[15px] text-paper/85">{profile.role}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">Joined</div>
                  <div className="mt-1.5 text-[15px] text-paper/85">
                    {new Date(profile.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => { await signOut(); navigate("/community", { replace: true }); }}
                  className="self-start border border-paper/30 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/85 transition-colors hover:border-paper hover:text-paper"
                >
                  Sign out ↗
                </button>
              </div>
            )}

            {tab === "danger" && (
              <div className="flex flex-col gap-5 border border-signal/40 bg-signal/5 p-7 md:p-9">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-signal">↯ Danger zone</div>
                <h2 className="text-[20px] font-semibold text-paper">Delete your account</h2>
                <p className="max-w-[60ch] text-[14px] leading-[1.6] text-paper/65">
                  This permanently deletes your account and every post, comment, and reaction
                  attached to it. We cannot recover any of it afterward. Type{" "}
                  <code className="border border-paper/15 bg-ink/60 px-1.5 py-0.5 font-mono text-[12px] text-paper">DELETE</code>{" "}
                  below to confirm.
                </p>

                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full max-w-xs border-b border-signal/40 bg-transparent py-2.5 text-[15px] text-paper placeholder:text-paper/30 focus:border-signal focus:outline-none"
                />

                {deleteError && (
                  <div className="border-l-2 border-signal pl-3 font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                    {deleteError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={confirmText !== "DELETE" || deleting}
                  className="self-start border border-signal bg-signal px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {deleting ? "Deleting…" : "Permanently delete account ↘"}
                </button>
              </div>
            )}
          </div>

          {/* Right column — live preview */}
          <div className="md:col-span-4">
            <div className="sticky top-24 flex flex-col gap-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/45">↘ Preview</div>
              <div className="flex items-start gap-4 border border-paper/15 bg-ink/40 p-5">
                <Avatar profile={previewProfile as any} size={56} />
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] font-semibold text-paper">{previewProfile.display_name}</div>
                  <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
                    @{profile.handle}
                  </div>
                  {bio && <p className="mt-3 text-[13.5px] leading-[1.55] text-paper/65">{bio}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
