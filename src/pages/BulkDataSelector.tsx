
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { BulkDataSelector as BulkDataSelectorComponent } from '@/components/data/BulkDataSelector';
import { Template } from '@/types/template';
import { toast } from '@/hooks/use-toast';

interface DataRow {
  id: string;
  name: string;
  email: string;
  url: string;
  company?: string;
  phone?: string;
  customField?: string;
}

const BulkDataSelector = () => {
  // Mock data - in real app this would come from uploaded CSV
  const mockDataRows: DataRow[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@company.com',
      url: 'https://example.com/john',
      company: 'Tech Corp',
      phone: '+1-555-0123'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@startup.com',
      url: 'https://example.com/sarah',
      company: 'Startup Inc',
      phone: '+1-555-0124'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike@agency.com',
      url: 'https://example.com/mike',
      company: 'Creative Agency',
      phone: '+1-555-0125'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@consulting.com',
      url: 'https://example.com/emily',
      company: 'Davis Consulting',
      phone: '+1-555-0126'
    },
    {
      id: '5',
      name: 'Alex Chen',
      email: 'alex@tech.com',
      url: 'https://example.com/alex',
      company: 'Tech Solutions',
      phone: '+1-555-0127'
    }
  ];

  // Mock templates - in real app this would come from template manager
  const mockTemplates: Template[] = [
    {
      id: 'template-1',
      name: 'Business Card Template',
      file: null,
      preview: '/placeholder.svg',
      qrPosition: { x: 75, y: 25, width: 80, height: 80 },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'template-2',
      name: 'Flyer Template',
      file: null,
      preview: '/placeholder.svg',
      qrPosition: { x: 50, y: 80, width: 100, height: 100 },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'template-3',
      name: 'Poster Template',
      file: null,
      preview: '/placeholder.svg',
      qrPosition: { x: 20, y: 20, width: 120, height: 120 },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const handleCreateCampaign = (selectedRows: DataRow[], template: Template) => {
    console.log('Creating campaign with:', { selectedRows, template });
    
    toast({
      title: "Campaign Created Successfully!",
      description: `Created QR campaign for ${selectedRows.length} recipients using ${template.name}`,
    });

    // In real app, this would:
    // 1. Generate unique QR codes for each selected row
    // 2. Position QR codes on the template
    // 3. Generate individual PDFs
    // 4. Start tracking campaign
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Data Selection</h1>
                <p className="text-gray-600">Select data rows and choose a template to create QR code campaigns</p>
              </div>

              <BulkDataSelectorComponent
                dataRows={mockDataRows}
                templates={mockTemplates}
                onCreateCampaign={handleCreateCampaign}
              />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default BulkDataSelector;
