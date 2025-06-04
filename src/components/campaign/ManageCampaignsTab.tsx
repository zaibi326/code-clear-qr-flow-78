
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { databaseService } from '@/utils/databaseService';
import { toast } from 'sonner';
import { 
  Search, 
  Grid, 
  List, 
  Eye, 
  Trash2, 
  Users, 
  Calendar,
  BarChart3,
  Plus,
  Megaphone,
  Play,
  Pause,
  Edit
} from 'lucide-react';
import { Campaign } from '@/types/campaign';

interface ManageCampaignsTabProps {
  campaigns: Campaign[];
  onCreateNew: () => void;
}

export const ManageCampaignsTab = ({ campaigns: initialCampaigns, onCreateNew }: ManageCampaignsTabProps) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'completed'>('all');
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || campaign.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewCampaign = (campaign: Campaign) => {
    toast.success(`Opening campaign: ${campaign.name}`);
    // In a real app, this would navigate to campaign details
  };

  const handleEditCampaign = (campaign: Campaign) => {
    toast.success(`Editing campaign: ${campaign.name}`);
    // In a real app, this would open the campaign editor
  };

  const handleToggleCampaign = async (campaign: Campaign) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    
    try {
      // Update in database
      const result = await databaseService.update({
        table: 'campaigns',
        id: campaign.id,
        data: { status: newStatus }
      });

      if (result.success) {
        // Update local state
        setCampaigns(prev => prev.map(c => 
          c.id === campaign.id ? { ...c, status: newStatus as any } : c
        ));
        toast.success(`Campaign ${newStatus === 'active' ? 'activated' : 'paused'}`);
      } else {
        toast.error(result.error || 'Failed to update campaign');
      }
    } catch (error) {
      toast.error('Failed to update campaign');
      console.error('Toggle campaign error:', error);
    }
  };

  const handleDeleteCampaign = async (campaign: Campaign) => {
    if (!confirm(`Are you sure you want to delete "${campaign.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingIds(prev => new Set(prev).add(campaign.id));
    
    try {
      const result = await databaseService.delete('campaigns', campaign.id);
      
      if (result.success) {
        setCampaigns(prev => prev.filter(c => c.id !== campaign.id));
        toast.success(`Campaign "${campaign.name}" deleted successfully`);
      } else {
        toast.error(result.error || 'Failed to delete campaign');
      }
    } catch (error) {
      toast.error('Failed to delete campaign');
      console.error('Delete campaign error:', error);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(campaign.id);
        return newSet;
      });
    }
  };

  const handleViewAnalytics = (campaign: Campaign) => {
    toast.success(`Opening analytics for: ${campaign.name}`);
    // In a real app, this would navigate to analytics page
  };

  return (
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
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          
          <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Campaigns Display */}
      <div className="grid gap-4">
        {filteredCampaigns.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
              <p className="text-gray-600 mb-4">
                {campaigns.length === 0 
                  ? "Get started by creating your first campaign"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Campaign
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredCampaigns.map((campaign) => {
            const isDeleting = deletingIds.has(campaign.id);
            
            return (
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
                            <span>{campaign.qrCodes.length} QR Codes</span>
                          </div>
                          <span>•</span>
                          <span>{campaign.scans || 0} scans</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{campaign.createdAt.toLocaleDateString()}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            campaign.status === 'active' 
                              ? 'bg-green-100 text-green-700'
                              : campaign.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-700'
                              : campaign.status === 'generating'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {campaign.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewCampaign(campaign)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditCampaign(campaign)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleCampaign(campaign)}
                      >
                        {campaign.status === 'active' ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewAnalytics(campaign)}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analytics
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteCampaign(campaign)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
