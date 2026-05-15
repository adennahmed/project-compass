import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsAndConditions from "./pages/TermsAndConditions.tsx";
import Unsubscribe from "./pages/Unsubscribe.tsx";

// Community is fully lazy-loaded. This guarantees:
//   1. The home/landing bundle is smaller and ships zero community code.
//   2. Any module-load error in community/* can NEVER affect the marketing
//      site — the import only fires when the user actually visits /community.
//   3. The Supabase client + AuthProvider only mount under /community.
const CommunityRoot = lazy(() => import("./pages/community/Root.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />

            <Route
              path="/community/*"
              element={
                <Suspense fallback={<CommunityFallback />}>
                  <CommunityRoot />
                </Suspense>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

// Minimal dark splash shown while the community chunk loads.
const CommunityFallback = () => (
  <div
    style={{
      minHeight: "100vh",
      background: "#0E0E10",
      color: "rgba(245,242,236,0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily:
        "ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, monospace",
      fontSize: 11,
      letterSpacing: "0.32em",
      textTransform: "uppercase",
    }}
  >
    ↘ Loading community…
  </div>
);

export default App;
