
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateQRCode from "./pages/CreateQRCode";
import CreateSingleQR from "./pages/CreateSingleQR";
import CreateBulkQR from "./pages/CreateBulkQR";
import QuickGenerate from "./pages/QuickGenerate";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import QRCodes from "./pages/QRCodes";
import BulkDataSelector from "./pages/BulkDataSelector";
import CampaignCreator from "./pages/CampaignCreator";
import TemplateManager from "./pages/TemplateManager";
import DataManager from "./pages/DataManager";
import Support from "./pages/Support";
import HelpCenter from "./pages/HelpCenter";
import Testing from "./pages/Testing";
import Monitoring from "./pages/Monitoring";
import DashboardIntegrationsPage from "./pages/DashboardIntegrationsPage";
import Projects from "./pages/Projects";
import Integrations from "./pages/Integrations";
import ApiDocumentation from "./pages/ApiDocumentation";
import BestPractices from "./pages/BestPractices";
import Blog from "./pages/Blog";
import CaseStudies from "./pages/CaseStudies";
import Changelog from "./pages/Changelog";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// Company pages
import CompanyAbout from "./pages/company/About";
import Careers from "./pages/company/Careers";
import Contact from "./pages/company/Contact";
import Privacy from "./pages/company/Privacy";
import Terms from "./pages/company/Terms";

// Solutions pages
import MarketingSolutions from "./pages/solutions/Marketing";
import RetailSolutions from "./pages/solutions/Retail";
import RestaurantSolutions from "./pages/solutions/Restaurants";
import EventSolutions from "./pages/solutions/Events";
import HealthcareSolutions from "./pages/solutions/Healthcare";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateQRCode />} />
            <Route path="/create-single" element={<CreateSingleQR />} />
            <Route path="/create-bulk" element={<CreateBulkQR />} />
            <Route path="/quick-generate" element={<QuickGenerate />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/qr-codes" element={<QRCodes />} />
            <Route path="/bulk-data-selector" element={<BulkDataSelector />} />
            <Route path="/campaign-creator" element={<CampaignCreator />} />
            <Route path="/template-manager" element={<TemplateManager />} />
            <Route path="/data-manager" element={<DataManager />} />
            <Route path="/support" element={<Support />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/testing" element={<Testing />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/integrations-dashboard" element={<DashboardIntegrationsPage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/api-docs" element={<ApiDocumentation />} />
            <Route path="/best-practices" element={<BestPractices />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/changelog" element={<Changelog />} />
            
            {/* Company routes */}
            <Route path="/company/about" element={<CompanyAbout />} />
            <Route path="/company/careers" element={<Careers />} />
            <Route path="/company/contact" element={<Contact />} />
            <Route path="/company/privacy" element={<Privacy />} />
            <Route path="/company/terms" element={<Terms />} />
            
            {/* Solutions routes */}
            <Route path="/solutions/marketing" element={<MarketingSolutions />} />
            <Route path="/solutions/retail" element={<RetailSolutions />} />
            <Route path="/solutions/restaurants" element={<RestaurantSolutions />} />
            <Route path="/solutions/events" element={<EventSolutions />} />
            <Route path="/solutions/healthcare" element={<HealthcareSolutions />} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
