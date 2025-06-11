
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Blog from '@/pages/Blog';
import CaseStudies from '@/pages/CaseStudies';
import Changelog from '@/pages/Changelog';
import BestPractices from '@/pages/BestPractices';
import ApiDocumentation from '@/pages/ApiDocumentation';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import CreateQRCode from '@/pages/CreateQRCode';
import CreateBulkQR from '@/pages/CreateBulkQR';
import BulkDataSelector from '@/pages/BulkDataSelector';
import TemplateManager from '@/pages/TemplateManager';
import CampaignCreator from '@/pages/CampaignCreator';
import Analytics from '@/pages/Analytics';
import DataManager from '@/pages/DataManager';
import Testing from '@/pages/Testing';
import Integrations from '@/pages/Integrations';
import Settings from '@/pages/Settings';
import QRCodes from '@/pages/QRCodes';
import Monitoring from '@/pages/Monitoring';
import Support from '@/pages/Support';
import DashboardIntegrationsPage from '@/pages/DashboardIntegrationsPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminRegister from '@/pages/admin/AdminRegister';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import { AdminProtectedRoute } from '@/components/admin/AdminProtectedRoute';

export const RouteConfig = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/case-studies" element={<CaseStudies />} />
      <Route path="/changelog" element={<Changelog />} />
      <Route path="/best-practices" element={<BestPractices />} />
      <Route path="/api-docs" element={<ApiDocumentation />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Authentication Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />

      {/* Protected User Routes */}
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
      
      <Route path="/quick-generate" element={
        <ProtectedRoute>
          <QRCodes />
        </ProtectedRoute>
      } />
      
      <Route path="/template-manager" element={
        <ProtectedRoute>
          <TemplateManager />
        </ProtectedRoute>
      } />
      
      <Route path="/data-manager" element={
        <ProtectedRoute>
          <DataManager />
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
      
      <Route path="/support" element={
        <ProtectedRoute>
          <Support />
        </ProtectedRoute>
      } />
      
      <Route path="/create" element={
        <ProtectedRoute>
          <CreateQRCode />
        </ProtectedRoute>
      } />
      
      <Route path="/create-bulk" element={
        <ProtectedRoute>
          <CreateBulkQR />
        </ProtectedRoute>
      } />
      
      <Route path="/bulk-data-selector" element={
        <ProtectedRoute>
          <BulkDataSelector />
        </ProtectedRoute>
      } />
      
      <Route path="/templates" element={
        <ProtectedRoute>
          <TemplateManager />
        </ProtectedRoute>
      } />
      
      <Route path="/campaigns" element={
        <ProtectedRoute>
          <CampaignCreator />
        </ProtectedRoute>
      } />
      
      <Route path="/data-manager" element={
        <ProtectedRoute>
          <DataManager />
        </ProtectedRoute>
      } />
      
      <Route path="/testing" element={
        <ProtectedRoute>
          <Testing />
        </ProtectedRoute>
      } />
      
      <Route path="/integrations" element={
        <ProtectedRoute>
          <Integrations />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />

      {/* Protected Admin Routes */}
      <Route path="/admin/dashboard" element={
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      } />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
