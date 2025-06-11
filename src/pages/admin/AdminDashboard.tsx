
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminOverviewTab from '@/components/admin/AdminOverviewTab';
import AdminUsersTable from '@/components/admin/AdminUsersTable';
import AdminSystemTab from '@/components/admin/AdminSystemTab';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const { adminUser, adminLogout } = useAdminAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverviewTab />;
      case 'users':
        return <AdminUsersTable />;
      case 'qr-codes':
        return <AdminUsersTable />;
      case 'analytics':
        return <AdminSystemTab />;
      case 'reports':
        return <AdminSystemTab />;
      case 'activity':
        return <AdminSystemTab />;
      case 'settings':
        return <AdminSystemTab />;
      case 'help':
        return <AdminSystemTab />;
      default:
        return <AdminOverviewTab />;
    }
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <AdminSidebar 
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
          <AdminHeader adminUser={adminUser} onLogout={adminLogout} />
          
          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
