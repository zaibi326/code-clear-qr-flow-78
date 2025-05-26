
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Grid, 
  List, 
  Eye, 
  Download, 
  Trash2, 
  Users, 
  Calendar,
  BarChart3
} from 'lucide-react';

const CampaignCreator = () => {
  const [activeTab, setActiveTab] = useState('manage');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'completed'>('all');
  
  const mockCampaigns = [
    {
      id: 1,
      name: 'Summer Sale 2024',
      status: 'active',
      qrCodes: 150,
      scans: 2847,
      createdDate: '2024-01-15',
      template: 'Marketing Flyer'
    },
    {
      id: 2,
      name: 'Product Launch',
      status: 'draft',
      qrCodes: 0,
      scans: 0,
      createdDate: '2024-01-10',
      template: 'Business Card'
    },
    {
      id: 3,
      name: 'Holiday Campaign',
      status: 'completed',
      qrCodes: 200,
      scans: 5621,
      createdDate: '2024-01-08',
      template: 'Event Poster'
    }
  ];

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || campaign.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const tabs = [
    { id: 'create', label: 'Create Campaign', icon: Plus },
    { id: 'manage', label: 'Manage Campaigns', icon: Megaphone },
    { id: 'analytics', label: 'Campaign Analytics', icon: BarChart3 }
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaign Creator</h1>
                <p className="text-gray-600">Create, manage, and track your marketing campaigns</p>
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

              {/* Create Tab */}
              {activeTab === 'create' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Plus className="h-5 w-5 text-blue-600" />
                        <span>Create New Campaign</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                          <Input placeholder="Enter campaign name..." />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows={4}
                            placeholder="Describe your campaign..."
                          />
                        </div>
                        <div className="flex gap-4">
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            Create Campaign
                          </Button>
                          <Button variant="outline">
                            Save as Draft
                          </Button>
                        </div>
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
                        placeholder="Search campaigns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="completed">Completed</option>
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
                        New Campaign
                      </Button>
                    </div>
                  </div>

                  {/* Campaigns Display */}
                  <div className="grid gap-4">
                    {filteredCampaigns.map((campaign) => (
                      <Card key={campaign.id} className="hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-orange-100 rounded-lg">
                                <Megaphone className="h-6 w-6 text-orange-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    <span>{campaign.qrCodes} QR Codes</span>
                                  </div>
                                  <span>•</span>
                                  <span>{campaign.scans.toLocaleString()} scans</span>
                                  <span>•</span>
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>{campaign.createdDate}</span>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    campaign.status === 'active' 
                                      ? 'bg-green-100 text-green-700'
                                      : campaign.status === 'draft'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {campaign.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <BarChart3 className="h-4 w-4 mr-1" />
                                Analytics
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

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">8,468</div>
                        <p className="text-xs text-muted-foreground">+15% from last month</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Active QR Codes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">350</div>
                        <p className="text-xs text-muted-foreground">Across all campaigns</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Campaign Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Detailed analytics charts would be displayed here</p>
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

export default CampaignCreator;
