
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Analytics from '@/pages/Analytics';
import CreateQRCode from '@/pages/CreateQRCode';
import QuickGenerate from '@/pages/QuickGenerate';
import QRCodes from '@/pages/QRCodes';
import TemplateManager from '@/pages/TemplateManager';
import DataManager from '@/pages/DataManager';
import Projects from '@/pages/Projects';
import CampaignCreator from '@/pages/CampaignCreator';
import Integrations from '@/pages/Integrations';
import DashboardIntegrationsPage from '@/pages/DashboardIntegrationsPage';
import Monitoring from '@/pages/Monitoring';
import Settings from '@/pages/Settings';
import Support from '@/pages/Support';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminRegister from '@/pages/admin/AdminRegister';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ApiDocumentation from '@/pages/ApiDocumentation';
import Changelog from '@/pages/Changelog';
import Blog from '@/pages/Blog';
import CaseStudies from '@/pages/CaseStudies';
import BestPractices from '@/pages/BestPractices';
import HelpCenter from '@/pages/HelpCenter';
import Features from '@/pages/Features';
import Pricing from '@/pages/Pricing';
import About from '@/pages/About';
import Marketing from '@/pages/solutions/Marketing';
import Events from '@/pages/solutions/Events';
import Restaurants from '@/pages/solutions/Restaurants';
import Retail from '@/pages/solutions/Retail';
import Healthcare from '@/pages/solutions/Healthcare';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import NotFound from '@/pages/NotFound';

export const RouteConfig = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Public content pages */}
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/api-documentation" element={<ApiDocumentation />} />
      <Route path="/api-docs" element={<ApiDocumentation />} />
      <Route path="/integrations" element={<Integrations />} />
      <Route path="/changelog" element={<Changelog />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/case-studies" element={<CaseStudies />} />
      <Route path="/best-practices" element={<BestPractices />} />
      <Route path="/help-center" element={<HelpCenter />} />
      
      {/* Solutions pages */}
      <Route path="/solutions/marketing" element={<Marketing />} />
      <Route path="/solutions/events" element={<Events />} />
      <Route path="/solutions/restaurants" element={<Restaurants />} />
      <Route path="/solutions/retail" element={<Retail />} />
      <Route path="/solutions/healthcare" element={<Healthcare />} />
      
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

      <Route path="/qr-codes" element={
        <ProtectedRoute>
          <QRCodes />
        </ProtectedRoute>
      } />
      
      <Route path="/templates" element={
        <ProtectedRoute>
          <TemplateManager />
        </ProtectedRoute>
      } />

      <Route path="/template-manager" element={
        <ProtectedRoute>
          <TemplateManager />
        </ProtectedRoute>
      } />

      <Route path="/data" element={
        <ProtectedRoute>
          <DataManager />
        </ProtectedRoute>
      } />

      <Route path="/data-manager" element={
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

      <Route path="/campaign-creator" element={
        <ProtectedRoute>
          <CampaignCreator />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard/integrations" element={
        <ProtectedRoute>
          <DashboardIntegrationsPage />
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
  );
};
