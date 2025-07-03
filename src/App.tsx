
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useSupabaseAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import CreateQRCode from "./pages/CreateQRCode";
import Dashboard from "./pages/Dashboard";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import QuickGenerate from "./pages/QuickGenerate";
import QRCodeDatabase from "./pages/QRCodeDatabase";
import TagsManagement from "./pages/TagsManagement";
import LeadsManagement from "./pages/LeadsManagement";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import TemplateManager from "./pages/TemplateManager";
import Support from "./pages/Support";
import DashboardIntegrationsPage from "./pages/DashboardIntegrationsPage";
import HelpCenter from "./pages/HelpCenter";
import Integrations from "./pages/Integrations";
import ListManagement from "./pages/ListManagement";
import EntryDetail from "./pages/EntryDetail";

const Auth = lazy(() => import("./pages/Login"));
const Login = lazy(() => import("./pages/Login"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Contact = lazy(() => import("./pages/company/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const LoadingFallback = ({ message = "Loading..." }: { message?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

const App = () => {
  console.log('App: Rendering application');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/create" element={<CreateQRCode />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/enhanced-dashboard" element={<EnhancedDashboard />} />
                  <Route path="/quick-generate" element={<QuickGenerate />} />
                  <Route path="/qr-database" element={<QRCodeDatabase />} />
                  <Route path="/tags" element={<TagsManagement />} />
                  <Route path="/leads" element={<LeadsManagement />} />
                  <Route path="/list-management" element={<ListManagement />} />
                  <Route path="/entry/:entryPath" element={<EntryDetail />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/template-manager" element={<TemplateManager />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/dashboard/integrations" element={<DashboardIntegrationsPage />} />
                  <Route path="/help-center" element={<HelpCenter />} />
                  <Route path="/integrations" element={<Integrations />} />
                  <Route
                    path="/auth"
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading authentication..." />}>
                        <Auth />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading login page..." />}>
                        <Login />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/pricing"
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading pricing..." />}>
                        <Pricing />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading contact page..." />}>
                        <Contact />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/blog"
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading blog..." />}>
                        <Blog />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading admin dashboard..." />}>
                        <AdminDashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin/login"
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading admin login..." />}>
                        <AdminLogin />
                      </Suspense>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading page..." />}>
                        <NotFound />
                      </Suspense>
                    }
                  />
                </Routes>
              </ErrorBoundary>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
