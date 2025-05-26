
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Database, Download, Eye, Trash2, Plus, Search, Filter, Grid, List } from 'lucide-react';
import { Template } from '@/types/template';

const TemplateManager = () => {
  const [activeTab, setActiveTab] = useState('manage');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'image'>('all');
  
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

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || template.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const tabs = [
    { id: 'upload', label: 'Upload Template', icon: Upload },
    { id: 'manage', label: 'Manage Templates', icon: Database },
    { id: 'library', label: 'Template Library', icon: FileText }
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

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Upload className="h-5 w-5 text-blue-600" />
                        <span>Upload Template</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Drag and drop your template here
                        </h3>
                        <p className="text-gray-600 mb-4">
                          or click to browse files from your computer
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Choose File
                        </Button>
                        <p className="text-sm text-gray-500 mt-4">
                          Supports PDF, PNG, JPG files up to 10MB
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Manage Tab */}
              {activeTab === 'manage' && (
                <div className="space-y-6">
                  {/* Search and Filter Bar */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="all">All Types</option>
                        <option value="pdf">PDF Only</option>
                        <option value="image">Images Only</option>
                      </select>
                      
                      <div className="flex border border-gray-300 rounded-md overflow-hidden">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className="rounded-none"
                        >
                          <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className="rounded-none"
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Upload New
                      </Button>
                    </div>
                  </div>

                  {/* Templates Display */}
                  <div className="grid gap-4">
                    {filteredTemplates.map((template) => (
                      <Card key={template.id} className="hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-purple-100 rounded-lg">
                                <FileText className="h-6 w-6 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>{template.type.toUpperCase()}</span>
                                  <span>•</span>
                                  <span>Uploaded {template.uploadDate}</span>
                                  <span>•</span>
                                  <span>{template.usageCount} uses</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    template.status === 'active' 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {template.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Preview
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Library Tab */}
              {activeTab === 'library' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span>Template Library</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                          <h3 className="font-semibold text-gray-900 mb-3">Marketing Templates</h3>
                          <p className="text-gray-600 text-sm mb-4">
                            Professional marketing templates for campaigns and promotions.
                          </p>
                          <Button variant="outline" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Browse Templates
                          </Button>
                        </div>
                        
                        <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                          <h3 className="font-semibold text-gray-900 mb-3">Business Templates</h3>
                          <p className="text-gray-600 text-sm mb-4">
                            Business card and corporate template designs.
                          </p>
                          <Button variant="outline" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Browse Templates
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default TemplateManager;
