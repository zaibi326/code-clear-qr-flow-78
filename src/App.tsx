
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useSupabaseAuth';
import { AdminAuthProvider } from './hooks/useAdminAuth';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import CreateQRCode from './pages/CreateQRCode';
import QuickGenerate from './pages/QuickGenerate';
import TemplateManager from './pages/TemplateManager';
import DataManager from './pages/DataManager';
import Projects from './pages/Projects';
import CampaignCreator from './pages/CampaignCreator';
import Integrations from './pages/Integrations';
import Monitoring from './pages/Monitoring';
import Settings from './pages/Settings';
import Support from './pages/Support';
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';
import AdminDashboard from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AdminAuthProvider>
          <AuthProvider>
            <div className="min-h-screen">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegister />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                
                {/* Protected user routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } />
                
                <Route path="/create" element={
                  <ProtectedRoute>
                    <CreateQRCode />
                  </ProtectedRoute>
                } />

                <Route path="/quick-generate" element={
                  <ProtectedRoute>
                    <QuickGenerate />
                  </ProtectedRoute>
                } />
                
                <Route path="/templates" element={
                  <ProtectedRoute>
                    <TemplateManager />
                  </ProtectedRoute>
                } />

                <Route path="/data" element={
                  <ProtectedRoute>
                    <DataManager />
                  </ProtectedRoute>
                } />

                <Route path="/projects" element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                } />
                
                <Route path="/campaigns" element={
                  <ProtectedRoute>
                    <CampaignCreator />
                  </ProtectedRoute>
                } />
                
                <Route path="/integrations" element={
                  <ProtectedRoute>
                    <Integrations />
                  </ProtectedRoute>
                } />

                <Route path="/monitoring" element={
                  <ProtectedRoute>
                    <Monitoring />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                
                <Route path="/support" element={
                  <ProtectedRoute>
                    <Support />
                  </ProtectedRoute>
                } />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </AuthProvider>
        </AdminAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
