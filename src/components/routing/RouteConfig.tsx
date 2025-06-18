import { Home } from "@/pages/Home";
import { Pricing } from "@/pages/Pricing";
import { Auth } from "@/pages/Auth";
import { Dashboard } from "@/pages/Dashboard";
import { Create } from "@/pages/Create";
import { QuickGenerate } from "@/pages/QuickGenerate";
import { Settings } from "@/pages/Settings";
import { CampaignDetails } from "@/pages/CampaignDetails";
import { ProjectDetails } from "@/pages/ProjectDetails";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdminCampaigns } from "@/pages/admin/AdminCampaigns";
import { AdminTemplates } from "@/pages/admin/AdminTemplates";
import { AdminSettings } from "@/pages/admin/AdminSettings";
import { Support } from "@/pages/Support";
import { Legal } from "@/pages/Legal";
import { ProtectedRoute } from "./ProtectedRoute";
import QRCodeDatabase from '@/pages/QRCodeDatabase';

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
    path: "/campaigns/:campaignId",
    element: (
      <ProtectedRoute>
        <CampaignDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/:projectId",
    element: (
      <ProtectedRoute>
        <ProjectDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute>
        <AdminUsers />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/campaigns",
    element: (
      <ProtectedRoute>
        <AdminCampaigns />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/templates",
    element: (
      <ProtectedRoute>
        <AdminTemplates />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <ProtectedRoute>
        <AdminSettings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/support",
    element: <Support />,
  },
  {
    path: "/legal",
    element: <Legal />,
  },
];

// Add this route to the existing routes array:
const additionalRoute = {
  path: "/qr-database",
  element: <ProtectedRoute><QRCodeDatabase /></ProtectedRoute>,
};

export const allRoutes = [...routes, additionalRoute];
