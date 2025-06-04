
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Campaign } from '@/types/campaign';
import { 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  Eye, 
  MoreHorizontal,
  Calendar,
  QrCode,
  TrendingUp
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ManageCampaignsTabProps {
  campaigns: Campaign[];
  onCampaignUpdate: (campaign: Campaign) => void;
  onCampaignDelete: (campaignId: string) => void;
}

export const ManageCampaignsTab = ({ 
  campaigns, 
  onCampaignUpdate, 
  onCampaignDelete 
}: ManageCampaignsTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (campaign: Campaign, newStatus: Campaign['status']) => {
    const updatedCampaign = { ...campaign, status: newStatus };
    onCampaignUpdate(updatedCampaign);
    toast.success(`Campaign "${campaign.name}" ${newStatus === 'active' ? 'activated' : 'paused'}`);
  };

  const handleDelete = (campaign: Campaign) => {
    if (window.confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
      onCampaignDelete(campaign.id);
      toast.success(`Campaign "${campaign.name}" deleted`);
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manage Campaigns</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
            <option value="generating">Generating</option>
          </select>
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <QrCode className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600">
              {campaigns.length === 0 
                ? "Create your first campaign to get started" 
                : "Try adjusting your search or filter criteria"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg truncate">{campaign.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Campaign
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(campaign)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Badge className={getStatusColor(campaign.status)} variant="secondary">
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-gray-500" />
                    <span>{campaign.qrCodes.length} QR Codes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <span>{campaign.scans || 0} Scans</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Created {campaign.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {campaign.status === 'active' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(campaign, 'draft')}
                      className="flex-1"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  ) : campaign.status === 'draft' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(campaign, 'active')}
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Activate
                    </Button>
                  ) : null}
                  
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
