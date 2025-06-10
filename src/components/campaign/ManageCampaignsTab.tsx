
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [dialogType, setDialogType] = useState<'view' | 'edit' | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    status: 'draft' as Campaign['status']
  });

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (campaign: Campaign, newStatus: Campaign['status']) => {
    const updatedCampaign = { ...campaign, status: newStatus };
    onCampaignUpdate(updatedCampaign);
    
    // Update localStorage
    const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const updatedCampaigns = existingCampaigns.map((c: Campaign) => 
      c.id === campaign.id ? updatedCampaign : c
    );
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    
    toast.success(`Campaign "${campaign.name}" ${newStatus === 'active' ? 'activated' : 'paused'}`);
  };

  const handleDelete = (campaign: Campaign) => {
    if (window.confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
      onCampaignDelete(campaign.id);
      
      // Update localStorage
      const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      const updatedCampaigns = existingCampaigns.filter((c: Campaign) => c.id !== campaign.id);
      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
      
      toast.success(`Campaign "${campaign.name}" deleted`);
    }
  };

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setDialogType('view');
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setEditForm({
      name: campaign.name,
      description: campaign.description || '',
      status: campaign.status
    });
    setDialogType('edit');
  };

  const handleSaveEdit = () => {
    if (!selectedCampaign) return;

    const updatedCampaign = {
      ...selectedCampaign,
      name: editForm.name,
      description: editForm.description,
      status: editForm.status
    };

    onCampaignUpdate(updatedCampaign);
    
    // Update localStorage
    const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const updatedCampaigns = existingCampaigns.map((c: Campaign) => 
      c.id === selectedCampaign.id ? updatedCampaign : c
    );
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    
    setDialogType(null);
    setSelectedCampaign(null);
    toast.success(`Campaign "${updatedCampaign.name}" updated successfully`);
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
                      <DropdownMenuItem onClick={() => handleViewDetails(campaign)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
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
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewDetails(campaign)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={dialogType === 'view'} onOpenChange={() => setDialogType(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Campaign Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedCampaign?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Campaign Name</label>
                  <p className="text-gray-900">{selectedCampaign.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge className={getStatusColor(selectedCampaign.status)} variant="secondary">
                    {selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-gray-900">{selectedCampaign.type.charAt(0).toUpperCase() + selectedCampaign.type.slice(1)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created Date</label>
                  <p className="text-gray-900">{selectedCampaign.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900">{selectedCampaign.description || 'No description provided'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">QR Codes</label>
                  <p className="text-gray-900">{selectedCampaign.qrCodes.length}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Scans</label>
                  <p className="text-gray-900">{selectedCampaign.scans || 0}</p>
                </div>
              </div>
              {selectedCampaign.qrCodes.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">QR Codes in Campaign</label>
                  <div className="mt-2 max-h-40 overflow-y-auto">
                    {selectedCampaign.qrCodes.map((qr, index) => (
                      <div key={qr.id} className="flex justify-between items-center py-1 border-b">
                        <span className="text-sm">QR #{index + 1}</span>
                        <span className="text-sm text-gray-500">{qr.scans} scans</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={dialogType === 'edit'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Make changes to your campaign details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Campaign Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as Campaign['status'] }))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="generating">Generating</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogType(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
