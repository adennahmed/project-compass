import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/lib/community/auth";
import ErrorBoundary from "@/components/ErrorBoundary";
import CommunityLayout from "./Layout";
import CommunityHome from "./Home";
import AnnouncementsPage from "./Announcements";
import SocialPage from "./Social";
import ResourcesPage from "./Resources";
import MembersPage from "./Members";
import ProfilePage from "./Profile";
import AuthPage from "./Auth";
import AdminPage from "./Admin";

/**
 * CommunityRoot — single entrypoint for the entire /community/* subtree.
 *
 * Lives in its own lazy-loaded chunk so:
 *   • The marketing site can render without importing any community code.
 *   • A failure inside Supabase init / AuthProvider can't propagate to /.
 * Wrapped in its own ErrorBoundary so a render error in any community page
 * shows the recovery screen confined to /community, leaving the rest of
 * the app untouched.
 */
const CommunityRoot = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route element={<CommunityLayout />}>
            <Route index element={<CommunityHome />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="social" element={<SocialPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="u/:handle" element={<ProfilePage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default CommunityRoot;
