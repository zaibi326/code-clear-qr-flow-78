
import React, { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Navigate } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminOverviewTab from '@/components/admin/AdminOverviewTab';
import AdminUsersTable from '@/components/admin/AdminUsersTable';
import AdminQRCodesTable from '@/components/admin/AdminQRCodesTable';
import AdminAnalyticsCharts from '@/components/admin/AdminAnalyticsCharts';
import AdminSystemTab from '@/components/admin/AdminSystemTab';
import AdminSystemSettings from '@/components/admin/AdminSystemSettings';

const AdminDashboard = () => {
  const { adminUser, adminLogout } = useAdminAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverviewTab />;
      case 'users':
        return <AdminUsersTable />;
      case 'qr-codes':
        return <AdminQRCodesTable />;
      case 'analytics':
        return <AdminAnalyticsCharts />;
      case 'reports':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Reports</h2>
            <p className="text-gray-600">Advanced reporting features coming soon...</p>
          </div>
        );
      case 'activity':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Activity Logs</h2>
            <p className="text-gray-600">Activity monitoring features coming soon...</p>
          </div>
        );
      case 'settings':
        return <AdminSystemTab />;
      case 'help':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Help & Documentation</h2>
            <p className="text-gray-600">Admin documentation coming soon...</p>
          </div>
        );
      default:
        return <AdminOverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <AdminHeader adminUser={adminUser} onLogout={adminLogout} />
        
        <main className="p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
