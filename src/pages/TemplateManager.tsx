
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { TemplateManagerTabs } from '@/components/template/TemplateManagerTabs';
import { TemplateUploadTab } from '@/components/template/TemplateUploadTab';
import { TemplateManageTab } from '@/components/template/TemplateManageTab';
import { TemplateLibraryTab } from '@/components/template/TemplateLibraryTab';

const TemplateManager = () => {
  const [activeTab, setActiveTab] = useState('manage');
  
  const mockTemplates = [
    {
      id: 1,
      name: 'Marketing Flyer Template',
      type: 'image',
      uploadDate: '2024-01-15',
      status: 'active',
      usageCount: 25
    },
    {
      id: 2,
      name: 'Business Card Template',
      type: 'pdf',
      uploadDate: '2024-01-10',
      status: 'active',
      usageCount: 12
    },
    {
      id: 3,
      name: 'Event Poster Template',
      type: 'image',
      uploadDate: '2024-01-08',
      status: 'draft',
      usageCount: 8
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Manager</h1>
                <p className="text-gray-600">Upload, manage, and organize your marketing templates</p>
              </div>

              <TemplateManagerTabs activeTab={activeTab} setActiveTab={setActiveTab} />

              {activeTab === 'upload' && <TemplateUploadTab />}
              {activeTab === 'manage' && <TemplateManageTab mockTemplates={mockTemplates} />}
              {activeTab === 'library' && <TemplateLibraryTab />}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default TemplateManager;
