
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminOverviewTab } from '@/components/admin/AdminOverviewTab';
import { AdminUsersTable } from '@/components/admin/AdminUsersTable';
import { AdminSystemTab } from '@/components/admin/AdminSystemTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverviewTab />;
      case 'users':
        return <AdminUsersTable />;
      case 'subscriptions':
        return <AdminSystemTab activeSubTab="subscriptions" />;
      case 'payments':
        return <AdminSystemTab activeSubTab="payments" />;
      case 'settings':
        return <AdminSystemTab activeSubTab="settings" />;
      default:
        return <AdminOverviewTab />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <AdminHeader />
          
          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
