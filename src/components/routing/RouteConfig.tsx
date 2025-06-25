
import { Routes, Route } from 'react-router-dom';
import Home from "@/pages/Index";
import Pricing from "@/pages/Pricing";
import Auth from "@/pages/Login";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Create from "@/pages/CreateQRCode";
import QuickGenerate from "@/pages/QuickGenerate";
import Settings from "@/pages/Settings";
import TemplateManager from "@/pages/TemplateManager";
import Support from "@/pages/Support";
import DashboardIntegrationsPage from "@/pages/DashboardIntegrationsPage";
import HelpCenter from "@/pages/HelpCenter";
import Integrations from "@/pages/Integrations";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import QRCodeDatabase from '@/pages/QRCodeDatabase';
import TagsManagement from '@/pages/TagsManagement';
import LeadsManagement from '@/pages/LeadsManagement';
import ListManagement from '@/pages/ListManagement';

export const RouteConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Login />} />
      <Route path="/template-manager" element={<TemplateManager />} />
      <Route path="/support" element={<Support />} />
      <Route path="/dashboard/integrations" element={<DashboardIntegrationsPage />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/integrations" element={<Integrations />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create" 
        element={
          <ProtectedRoute>
            <Create />
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
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/qr-database" 
        element={
          <ProtectedRoute>
            <QRCodeDatabase />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tags" 
        element={
          <ProtectedRoute>
            <TagsManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/leads" 
        element={
          <ProtectedRoute>
            <LeadsManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/list-management" 
        element={
          <ProtectedRoute>
            <ListManagement />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/template-manager",
    element: <TemplateManager />,
  },
  {
    path: "/support",
    element: <Support />,
  },
  {
    path: "/dashboard/integrations",
    element: <DashboardIntegrationsPage />,
  },
  {
    path: "/help-center",
    element: <HelpCenter />,
  },
  {
    path: "/integrations",
    element: <Integrations />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/create",
    element: (
      <ProtectedRoute>
        <Create />
      </ProtectedRoute>
    ),
  },
  {
    path: "/quick-generate",
    element: (
      <ProtectedRoute>
        <QuickGenerate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/qr-database",
    element: (
      <ProtectedRoute>
        <QRCodeDatabase />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tags",
    element: (
      <ProtectedRoute>
        <TagsManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/leads",
    element: (
      <ProtectedRoute>
        <LeadsManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/list-management",
    element: (
      <ProtectedRoute>
        <ListManagement />
      </ProtectedRoute>
    ),
  },
];
