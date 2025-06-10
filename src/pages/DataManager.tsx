
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataManagerTabs } from '@/components/data/DataManagerTabs';
import { DataUploadTab } from '@/components/data/DataUploadTab';
import { DataManageTab } from '@/components/data/DataManageTab';
import { DataTemplatesTab } from '@/components/data/DataTemplatesTab';
import { 
  Database, 
  Upload, 
  BarChart3, 
  Users, 
  TrendingUp
} from 'lucide-react';

interface DataSet {
  id: number;
  name: string;
  rows: number;
  uploadDate: string;
  status: 'active' | 'processed' | 'error';
  progress: number;
}

const DataManager = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [dataSets, setDataSets] = useState<DataSet[]>([]);

  const defaultDataSets: DataSet[] = [
    {
      id: 1,
      name: 'Customer Contact List',
      rows: 2500,
      uploadDate: '2024-01-15',
      status: 'active',
      progress: 100
    },
    {
      id: 2,
      name: 'Product Catalog Data',
      rows: 850,
      uploadDate: '2024-01-12',
      status: 'processed',
      progress: 100
    },
    {
      id: 3,
      name: 'Event Registration List',
      rows: 1200,
      uploadDate: '2024-01-10',
      status: 'active',
      progress: 85
    }
  ];

  // Load data sets from localStorage on component mount
  useEffect(() => {
    const savedDataSets = localStorage.getItem('dataSets');
    if (savedDataSets) {
      try {
        const parsedDataSets = JSON.parse(savedDataSets);
        setDataSets(parsedDataSets);
      } catch (error) {
        console.error('Error loading data sets from localStorage:', error);
        setDataSets(defaultDataSets);
        localStorage.setItem('dataSets', JSON.stringify(defaultDataSets));
      }
    } else {
      setDataSets(defaultDataSets);
      localStorage.setItem('dataSets', JSON.stringify(defaultDataSets));
    }
  }, []);

  // Save data sets to localStorage whenever dataSets state changes
  useEffect(() => {
    if (dataSets.length > 0) {
      localStorage.setItem('dataSets', JSON.stringify(dataSets));
    }
  }, [dataSets]);

  const dataStats = [
    {
      title: 'Total Data Sets',
      value: dataSets.length.toString(),
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '+3'
    },
    {
      title: 'Total Records',
      value: dataSets.reduce((sum, ds) => sum + ds.rows, 0).toLocaleString(),
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      change: '+12%'
    },
    {
      title: 'Active Sets',
      value: dataSets.filter(ds => ds.status === 'active').length.toString(),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      change: '+2'
    },
    {
      title: 'Upload Success Rate',
      value: '98.5%',
      icon: Upload,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-r from-orange-500 to-orange-600',
      change: '+0.5%'
    }
  ];

  const handleDataUpload = (newDataSet: DataSet) => {
    setDataSets(prev => [newDataSet, ...prev]);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return <DataUploadTab onDataUpload={handleDataUpload} />;
      case 'manage':
        return <DataManageTab mockDataSets={dataSets} onDataSetsChange={setDataSets} />;
      case 'templates':
        return <DataTemplatesTab />;
      default:
        return <DataUploadTab onDataUpload={handleDataUpload} />;
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
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      Data Manager
                    </h1>
                    <p className="text-lg text-gray-600">Upload, organize, and manage your CSV data files</p>
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

              {/* Data Manager Content */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl animate-fade-in">
                <div className="px-8 pt-8 pb-0">
                  <DataManagerTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="p-8">
                  {renderTabContent()}
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
