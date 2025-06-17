
import React, { useState } from 'react';
import { Plus, Search, Calendar, Target, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserCampaigns, Campaign } from '@/hooks/useUserCampaigns';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/hooks/use-toast';

const CampaignCreator = () => {
  const { user, loading: authLoading } = useAuth();
  const { campaigns, setCampaigns, isLoaded } = useUserCampaigns();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'active' | 'paused' | 'completed'>('all');

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (campaign.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCampaign = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create campaigns.",
        variant: "destructive"
      });
      return;
    }

    const newCampaign: Campaign = {
      id: `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `Campaign ${campaigns.length + 1}`,
      description: 'A new marketing campaign',
      status: 'draft',
      type: 'single',
      createdAt: new Date(),
      updatedAt: new Date(),
      expectedScans: 100,
      settings: {
        format: 'PNG',
        qr_size: 300,
        qr_color: '#000000',
        background_color: '#FFFFFF',
        error_correction: 'M'
      }
    };

    setCampaigns(prev => [...prev, newCampaign]);
    toast({
      title: "Campaign created",
      description: `${newCampaign.name} has been created successfully.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view and manage your campaigns.</p>
          <Button onClick={() => window.location.href = '/login'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
              <p className="text-gray-600 mt-2">
                Create and manage your QR code marketing campaigns
              </p>
            </div>
            <Button onClick={handleCreateCampaign} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <Target className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {campaigns.length === 0 ? 'No campaigns yet' : 'No campaigns found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {campaigns.length === 0 
                ? 'Create your first campaign to start your QR marketing journey'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {campaigns.length === 0 && (
              <Button onClick={handleCreateCampaign} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create First Campaign
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {campaign.description || 'No description provided'}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      Created {campaign.createdAt.toLocaleDateString()}
                    </div>
                    
                    {campaign.expectedScans && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        Target: {campaign.expectedScans.toLocaleString()} scans
                      </div>
                    )}
                    
                    {campaign.budget && (
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Budget: ${campaign.budget.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {campaign.type.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {campaigns.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {campaigns.filter(c => c.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {campaigns.filter(c => c.status === 'draft').length}
                </div>
                <div className="text-sm text-gray-600">Draft</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {campaigns.filter(c => c.status === 'paused').length}
                </div>
                <div className="text-sm text-gray-600">Paused</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {campaigns.filter(c => c.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCreator;
