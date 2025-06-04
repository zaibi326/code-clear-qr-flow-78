
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { DataManagerTabs } from '@/components/data/DataManagerTabs';
import { DataUploadTab } from '@/components/data/DataUploadTab';
import { DataManageTab } from '@/components/data/DataManageTab';
import { DataTemplatesTab } from '@/components/data/DataTemplatesTab';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DataExportService, ExportOptions } from '@/utils/dataExportService';
import { CSVUploadService } from '@/utils/csvUploadService';
import { Database, Upload, FileSpreadsheet, Users, Plus, Download, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const DataManager = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const dataStats = [
    {
      title: 'Total Projects',
      value: '24',
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      change: '+15%'
    },
    {
      title: 'Data Records',
      value: '12,847',
      icon: FileSpreadsheet,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      lightBg: 'bg-green-50',
      change: '+32%'
    },
    {
      title: 'Active Campaigns',
      value: '8',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
      change: '+12%'
    },
    {
      title: 'Recent Uploads',
      value: '15',
      icon: Upload,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-r from-orange-500 to-orange-600',
      lightBg: 'bg-orange-50',
      change: '+8%'
    }
  ];

  const mockDataSets = [
    {
      id: 1,
      name: 'Summer Campaign 2024',
      rows: 2847,
      uploadDate: '2024-01-15',
      status: 'active' as const,
      progress: 85
    },
    {
      id: 2,
      name: 'Product Launch List',
      rows: 1203,
      uploadDate: '2024-01-10',
      status: 'processed' as const,
      progress: 100
    },
    {
      id: 3,
      name: 'Customer Database',
      rows: 5621,
      uploadDate: '2024-01-08',
      status: 'active' as const,
      progress: 92
    }
  ];

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const exportOptions: ExportOptions = {
        format: 'csv',
        includeProjects: true,
        includeCampaigns: true,
        includeQRCodes: true,
        includeAnalytics: true
      };

      const blob = await DataExportService.exportUserData('current-user', exportOptions);
      const filename = `clearqr-data-export-${new Date().toISOString().split('T')[0]}.csv`;
      
      DataExportService.downloadFile(blob, filename);
      setExportDialogOpen(false);
      
      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleUploadCSV = async () => {
    if (!uploadFile) {
      toast.error('Please select a CSV file to upload');
      return;
    }

    setIsUploading(true);
    try {
      const result = await CSVUploadService.uploadProjectData('current-user', await CSVUploadService.parseCSV(uploadFile));
      
      if (result.success) {
        toast.success(`Successfully uploaded ${result.recordsProcessed} records`);
        setUploadDialogOpen(false);
        setUploadFile(null);
      } else {
        toast.error(`Upload failed: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload CSV file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setUploadFile(file);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header Section */}
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      Data Manager
                    </h1>
                    <p className="text-lg text-gray-600">Upload, manage, and organize your campaign data with CSV files</p>
                  </div>
                  <div className="flex gap-3">
                    <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-100">
                          <Download className="h-4 w-4" />
                          Export Data
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Export Data</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-gray-600">
                            Export your data including projects, campaigns, QR codes, and analytics.
                          </p>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleExportData} disabled={isExporting}>
                              {isExporting ? 'Exporting...' : 'Export CSV'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Upload CSV
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upload CSV Data</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Input
                              type="file"
                              accept=".csv"
                              onChange={handleFileSelect}
                              className="w-full"
                            />
                            {uploadFile && (
                              <p className="text-sm text-gray-600 mt-2">
                                Selected: {uploadFile.name}
                              </p>
                            )}
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleUploadCSV} 
                              disabled={!uploadFile || isUploading}
                            >
                              {isUploading ? 'Uploading...' : 'Upload'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
                {dataStats.map((stat, index) => (
                  <Card key={index} className="group border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-4 rounded-2xl ${stat.bgColor} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">{stat.change}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Data Management */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl animate-fade-in">
                <div className="px-8 pt-8 pb-0">
                  <DataManagerTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="p-8">
                  {activeTab === 'upload' && <DataUploadTab />}
                  {activeTab === 'manage' && <DataManageTab mockDataSets={mockDataSets} />}
                  {activeTab === 'templates' && <DataTemplatesTab />}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DataManager;
