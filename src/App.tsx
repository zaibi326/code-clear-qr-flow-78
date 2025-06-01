
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import QuickGenerate from "./pages/QuickGenerate";
import CreateQRCode from "./pages/CreateQRCode";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import HelpCenter from "./pages/HelpCenter";
import CampaignCreator from "./pages/CampaignCreator";
import TemplateManager from "./pages/TemplateManager";
import DataManager from "./pages/DataManager";
import Integrations from "./pages/Integrations";
import DashboardIntegrationsPage from "./pages/DashboardIntegrationsPage";
import ApiDocumentation from "./pages/ApiDocumentation";
import Monitoring from "./pages/Monitoring";
import Testing from "./pages/Testing";
import BulkDataSelector from "./pages/BulkDataSelector";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import CaseStudies from "./pages/CaseStudies";
import BestPractices from "./pages/BestPractices";
import Changelog from "./pages/Changelog";

// Solutions pages
import Marketing from "./pages/solutions/Marketing";
import Events from "./pages/solutions/Events";
import Restaurants from "./pages/solutions/Restaurants";
import Retail from "./pages/solutions/Retail";
import Healthcare from "./pages/solutions/Healthcare";

// Company pages
import About from "./pages/company/About";
import Careers from "./pages/company/Careers";
import Contact from "./pages/company/Contact";
import Privacy from "./pages/company/Privacy";
import Terms from "./pages/company/Terms";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quick-generate" element={<QuickGenerate />} />
              <Route path="/create-qr-code" element={<CreateQRCode />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/support" element={<Support />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/campaign-creator" element={<CampaignCreator />} />
              <Route path="/template-manager" element={<TemplateManager />} />
              <Route path="/data-manager" element={<DataManager />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/dashboard-integrations" element={<DashboardIntegrationsPage />} />
              <Route path="/dashboard/integrations" element={<DashboardIntegrationsPage />} />
              <Route path="/api-documentation" element={<ApiDocumentation />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/testing" element={<Testing />} />
              <Route path="/bulk-data-selector" element={<BulkDataSelector />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/best-practices" element={<BestPractices />} />
              <Route path="/changelog" element={<Changelog />} />
              
              {/* Solutions Routes */}
              <Route path="/solutions/marketing" element={<Marketing />} />
              <Route path="/solutions/events" element={<Events />} />
              <Route path="/solutions/restaurants" element={<Restaurants />} />
              <Route path="/solutions/retail" element={<Retail />} />
              <Route path="/solutions/healthcare" element={<Healthcare />} />
              
              {/* Company Routes */}
              <Route path="/company/about" element={<About />} />
              <Route path="/company/careers" element={<Careers />} />
              <Route path="/company/contact" element={<Contact />} />
              <Route path="/company/privacy" element={<Privacy />} />
              <Route path="/company/terms" element={<Terms />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
