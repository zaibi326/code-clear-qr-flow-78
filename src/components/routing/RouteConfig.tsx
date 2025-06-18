import { Routes, Route } from 'react-router-dom';
import Home from "@/pages/Index";
import Pricing from "@/pages/Pricing";
import Auth from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Create from "@/pages/CreateQRCode";
import QuickGenerate from "@/pages/QuickGenerate";
import Settings from "@/pages/Settings";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import QRCodeDatabase from '@/pages/QRCodeDatabase';
import TagsManagement from '@/pages/TagsManagement';

export const RouteConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Auth />} />
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
  {
    path: "/tags",
    element: (
      <ProtectedRoute>
        <TagsManagement />
      </ProtectedRoute>
    ),
  },
];
