
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quick-generate" element={<QuickGenerate />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/campaign-creator" element={<CampaignCreator />} />
          <Route path="/data-manager" element={<DataManager />} />
          <Route path="/template-manager" element={<TemplateManager />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/api-documentation" element={<ApiDocumentation />} />
          <Route path="/bulk-data-selector" element={<BulkDataSelector />} />
          <Route path="/dashboard/integrations" element={<DashboardIntegrationsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
