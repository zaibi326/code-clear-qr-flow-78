
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useSupabaseAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import QuickGenerate from "./pages/QuickGenerate";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import CampaignCreator from "./pages/CampaignCreator";
import DataManager from "./pages/DataManager";
import TemplateManager from "./pages/TemplateManager";
import Testing from "./pages/Testing";
import Monitoring from "./pages/Monitoring";
import Integrations from "./pages/Integrations";
import ApiDocumentation from "./pages/ApiDocumentation";
import BulkDataSelector from "./pages/BulkDataSelector";
import DashboardIntegrationsPage from "./pages/DashboardIntegrationsPage";
import Blog from "./pages/Blog";
import HelpCenter from "./pages/HelpCenter";
import Marketing from "./pages/solutions/Marketing";
import Restaurants from "./pages/solutions/Restaurants";
import About from "./pages/company/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Blog and Resources */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/api-documentation" element={<ApiDocumentation />} />
            <Route path="/integrations" element={<Integrations />} />
            
            {/* Solutions */}
            <Route path="/solutions/marketing" element={<Marketing />} />
            <Route path="/solutions/restaurants" element={<Restaurants />} />
            
            {/* Company */}
            <Route path="/company/about" element={<About />} />
            
            {/* Protected Dashboard Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quick-generate" 
              element={
                <ProtectedRoute>
                  <QuickGenerate />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/support" 
              element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/campaign-creator" 
              element={
                <ProtectedRoute>
                  <CampaignCreator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/data-manager" 
              element={
                <ProtectedRoute>
                  <DataManager />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/template-manager" 
              element={
                <ProtectedRoute>
                  <TemplateManager />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/testing" 
              element={
                <ProtectedRoute>
                  <Testing />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/monitoring" 
              element={
                <ProtectedRoute>
                  <Monitoring />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bulk-data-selector" 
              element={
                <ProtectedRoute>
                  <BulkDataSelector />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/integrations" 
              element={
                <ProtectedRoute>
                  <DashboardIntegrationsPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
