
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Campaign } from '@/types/campaign';
import { useToast } from '@/hooks/use-toast';
import { Upload, Copy, Calendar, Zap } from 'lucide-react';
import { CSVUploadService } from '@/utils/csvUploadService';

interface CreateCampaignTabProps {
  onCampaignCreate: (campaign: Campaign) => void;
}

export const CreateCampaignTab = ({ onCampaignCreate }: CreateCampaignTabProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'single' as 'single' | 'bulk',
    status: 'draft' as 'draft' | 'active' | 'completed' | 'generating'
  });
  
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateCampaign = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Campaign name is required",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const newCampaign: Campaign = {
        id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        qrCodes: [],
        scans: 0,
        createdAt: new Date(),
        template: null
      };

      // Store in localStorage to persist across tab changes
      const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      existingCampaigns.unshift(newCampaign);
      localStorage.setItem('campaigns', JSON.stringify(existingCampaigns));

      onCampaignCreate(newCampaign);
      setFormData({ name: '', description: '', type: 'single', status: 'draft' });
      
      toast({
        title: "Success",
        description: "Campaign created successfully!",
      });
    } catch (error) {
      console.error('Campaign creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleImportFromCSV = async () => {
    if (!csvFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to import",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    try {
      const csvData = await CSVUploadService.parseCSV(csvFile);
      
      const campaignName = csvFile.name.replace('.csv', '') + ' Campaign';
      const campaignId = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const currentTime = new Date().toISOString();
      
      const newCampaign: Campaign = {
        id: campaignId,
        name: campaignName,
        description: `Imported from ${csvFile.name}`,
        type: 'bulk',
        status: 'draft',
        qrCodes: csvData.map((row, index) => ({
          id: `qr_${Date.now()}_${index}`,
          url: row.url || row.website || row.link || '',
          scans: 0,
          createdAt: currentTime,
          campaignId: campaignId,
          content: row.url || row.website || row.link || '',
          customData: row
        })),
        scans: 0,
        createdAt: new Date(),
        template: null
      };

      // Store in localStorage to persist across tab changes
      const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      existingCampaigns.unshift(newCampaign);
      localStorage.setItem('campaigns', JSON.stringify(existingCampaigns));

      onCampaignCreate(newCampaign);
      setCsvFile(null);
      
      toast({
        title: "Import Successful",
        description: `Campaign created with ${csvData.length} QR codes from CSV`,
      });
    } catch (error) {
      console.error('CSV import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import CSV file",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDuplicateLastCampaign = () => {
    const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const lastCampaign = existingCampaigns[0];
    
    if (lastCampaign) {
      setFormData({
        name: `Copy of ${lastCampaign.name}`,
        description: lastCampaign.description || 'Duplicated campaign',
        type: lastCampaign.type || 'single',
        status: 'draft'
      });
    } else {
      setFormData({
        name: 'Copy of Last Campaign',
        description: 'Duplicated campaign',
        type: 'single',
        status: 'draft'
      });
    }
    
    toast({
      title: "Campaign Duplicated",
      description: "Last campaign has been duplicated. You can modify and save it.",
    });
  };

  const handleViewScheduled = () => {
    toast({
      title: "Scheduled Campaigns",
      description: "Opening scheduled campaigns view...",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid CSV file",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <Label htmlFor="csv-upload">Import from CSV</Label>
              <div className="flex gap-2">
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="flex-1"
                />
                <Button 
                  onClick={handleImportFromCSV}
                  disabled={!csvFile || isImporting}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {isImporting ? 'Importing...' : 'Import'}
                </Button>
              </div>
              {csvFile && (
                <p className="text-sm text-gray-600">
                  Selected: {csvFile.name}
                </p>
              )}
            </div>

            <Button 
              variant="outline" 
              onClick={handleDuplicateLastCampaign}
              className="flex items-center gap-2 h-fit"
            >
              <Copy className="h-4 w-4" />
              Duplicate Last Campaign
            </Button>

            <Button 
              variant="outline" 
              onClick={handleViewScheduled}
              className="flex items-center gap-2 h-fit"
            >
              <Calendar className="h-4 w-4" />
              View Scheduled Campaigns
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Campaign</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter campaign name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-type">Campaign Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single QR Code</SelectItem>
                  <SelectItem value="bulk">Bulk QR Codes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign-description">Description</Label>
            <Textarea
              id="campaign-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter campaign description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign-status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="generating">Generating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleCreateCampaign}
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? 'Creating...' : 'Create Campaign'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
