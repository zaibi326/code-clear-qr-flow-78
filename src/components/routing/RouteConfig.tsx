
import Home from "@/pages/Index";
import Pricing from "@/pages/Pricing";
import Auth from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Create from "@/pages/CreateQRCode";
import QuickGenerate from "@/pages/QuickGenerate";
import Settings from "@/pages/Settings";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
    path: "/login",
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
    path: "/qr-database",
    element: (
      <ProtectedRoute>
        <QRCodeDatabase />
      </ProtectedRoute>
    ),
  },
];
