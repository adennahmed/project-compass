import { createContext, useContext, useMemo } from "react";
import { Profile } from "./types";

/**
 * Stub auth provider — design-only mode.
 *
 * The full Supabase-backed auth implementation has been removed so the
 * community section can ship purely as a visual surface. When the backend
 * is reintroduced in the future, this file will be replaced with the real
 * provider; every consumer already imports `useAuth` from here, so the
 * swap is a one-file change.
 *
 * Today: every visitor is signed-out, mock-mode, and every action is a
 * no-op. The UI surfaces this state via the "Preview · Mock" pill in
 * the community header and a friendly notice on the sign-in page.
 */
interface AuthState {
  session: null;
  profile: Profile | null;
  loading: false;
  isMock: true;
  signInWithEmail: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthState | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo<AuthState>(
    () => ({
      session: null,
      profile: null,
      loading: false,
      isMock: true,
      signInWithEmail: async () => ({
        error:
          "Sign-in is paused while we wire up the backend. You can still browse the whole community without an account.",
      }),
      signOut: async () => {},
    }),
    [],
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => {
  const v = useContext(AuthCtx);
  if (!v) throw new Error("useAuth must be used inside <AuthProvider>");
  return v;
};
