import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useSupabaseAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";

// Lazy load heavy components
const CreateQRCode = lazy(() => import("./pages/CreateQRCode"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const EnhancedDashboard = lazy(() => import("./pages/EnhancedDashboard"));
const QuickGenerate = lazy(() => import("./pages/QuickGenerate"));
const QRCodeDatabase = lazy(() => import("./pages/QRCodeDatabase"));
const TagsManagement = lazy(() => import("./pages/TagsManagement"));
const LeadsManagement = lazy(() => import("./pages/LeadsManagement"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));
const TemplateManager = lazy(() => import("./pages/TemplateManager"));
const Support = lazy(() => import("./pages/Support"));
const DashboardIntegrationsPage = lazy(() => import("./pages/DashboardIntegrationsPage"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const Integrations = lazy(() => import("./pages/Integrations"));
const ListManagement = lazy(() => import("./pages/ListManagement"));
const EntryDetail = lazy(() => import("./pages/EntryDetail"));
const Auth = lazy(() => import("./pages/Auth"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Contact = lazy(() => import("./pages/company/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const NotFound = lazy(() => import("./pages/NotFound"));

import { TemplateManagerErrorBoundary } from "@/components/template/TemplateManagerErrorBoundary";

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
                  <Route 
                    path="/create" 
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading QR creator..." />}>
                        <CreateQRCode />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading dashboard..." />}>
                        <Dashboard />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/enhanced-dashboard" 
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading enhanced dashboard..." />}>
                        <EnhancedDashboard />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/quick-generate" 
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading quick generator..." />}>
                        <QuickGenerate />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/qr-database" 
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading QR database..." />}>
                        <QRCodeDatabase />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/tags" 
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading tags..." />}>
                        <TagsManagement />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/leads" 
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading leads..." />}>
                        <LeadsManagement />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/list-management" 
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading list management..." />}>
                        <ListManagement />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/entry/:entryPath" 
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading entry details..." />}>
                        <EntryDetail />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/analytics" 
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading analytics..." />}>
                        <Analytics />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading settings..." />}>
                        <Settings />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/template-manager" 
                    element={
                      <TemplateManagerErrorBoundary>
                        <Suspense fallback={<LoadingFallback message="Loading template manager..." />}>
                          <TemplateManager />
                        </Suspense>
                      </TemplateManagerErrorBoundary>
                    } 
                  />
                  <Route 
                    path="/support" 
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading support..." />}>
                        <Support />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/dashboard/integrations" 
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading integrations..." />}>
                        <DashboardIntegrationsPage />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/help-center" 
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading help center..." />}>
                        <HelpCenter />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/integrations" 
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading integrations..." />}>
                        <Integrations />
                      </Suspense>
                    } 
                  />
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
                    path="/register"
                    element={
                      <Suspense fallback={<LoadingFallback message="Loading registration..." />}>
                        <Register />
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
