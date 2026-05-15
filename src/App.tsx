import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/community/auth";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsAndConditions from "./pages/TermsAndConditions.tsx";
import Unsubscribe from "./pages/Unsubscribe.tsx";

import CommunityLayout from "./pages/community/Layout.tsx";
import CommunityHome from "./pages/community/Home.tsx";
import AnnouncementsPage from "./pages/community/Announcements.tsx";
import SocialPage from "./pages/community/Social.tsx";
import ResourcesPage from "./pages/community/Resources.tsx";
import MembersPage from "./pages/community/Members.tsx";
import ProfilePage from "./pages/community/Profile.tsx";
import AuthPage from "./pages/community/Auth.tsx";
import AdminPage from "./pages/community/Admin.tsx";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />

            <Route path="/community" element={<CommunityLayout />}>
              <Route index element={<CommunityHome />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="social" element={<SocialPage />} />
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="members" element={<MembersPage />} />
              <Route path="u/:handle" element={<ProfilePage />} />
              <Route path="auth" element={<AuthPage />} />
              <Route path="admin" element={<AdminPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
