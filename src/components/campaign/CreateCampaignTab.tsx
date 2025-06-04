
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CampaignWizard } from './CampaignWizard';
import { CampaignTemplateSelector } from './CampaignTemplateSelector';
import { CampaignScheduler } from './CampaignScheduler';
import { Campaign } from '@/types/campaign';
import { toast } from 'sonner';
import { 
  Wand2, 
  Calendar, 
  FileText, 
  ArrowLeft,
  Rocket
} from 'lucide-react';

interface CreateCampaignTabProps {
  onCampaignCreate: (campaign: Campaign) => void;
}

export const CreateCampaignTab = ({ onCampaignCreate }: CreateCampaignTabProps) => {
  const [currentView, setCurrentView] = useState<'options' | 'wizard' | 'templates' | 'scheduler'>('options');

  const handleCreateCampaign = (campaign: Campaign) => {
    onCampaignCreate(campaign);
    toast.success(`Campaign "${campaign.name}" created successfully!`);
    setCurrentView('options');
  };

  const handleTemplateSelect = (template: any) => {
    toast.success(`Template "${template.name}" selected. Redirecting to campaign wizard...`);
    setTimeout(() => setCurrentView('wizard'), 1000);
  };

  const handleScheduleCampaign = (schedule: any) => {
    toast.success(`Campaign "${schedule.name}" scheduled successfully!`);
    setCurrentView('options');
  };

  const handleBackToOptions = () => {
    setCurrentView('options');
  };

  if (currentView === 'wizard') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToOptions}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Options
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Campaign Creation Wizard</h2>
        </div>
        <CampaignWizard onCampaignCreate={handleCreateCampaign} />
      </div>
    );
  }

  if (currentView === 'templates') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToOptions}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Options
          </Button>
        </div>
        <CampaignTemplateSelector onTemplateSelect={handleTemplateSelect} />
      </div>
    );
  }

  if (currentView === 'scheduler') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToOptions}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Options
          </Button>
        </div>
        <CampaignScheduler onScheduleCampaign={handleScheduleCampaign} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Create New Campaign</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose how you'd like to create your QR code campaign. Each option provides different levels of customization and control.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Quick Wizard */}
        <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500">
          <CardContent className="p-8 text-center">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform">
              <Wand2 className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Campaign Wizard</h3>
            <p className="text-gray-600 mb-6">
              Step-by-step guided process to create a complete campaign with templates and QR codes.
            </p>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setCurrentView('wizard')}
            >
              <Rocket className="h-4 w-4 mr-2" />
              Start Wizard
            </Button>
          </CardContent>
        </Card>

        {/* Template Browser */}
        <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-green-500">
          <CardContent className="p-8 text-center">
            <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform">
              <FileText className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Browse Templates</h3>
            <p className="text-gray-600 mb-6">
              Explore our collection of professional templates and start with a design you love.
            </p>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => setCurrentView('templates')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Browse Templates
            </Button>
          </CardContent>
        </Card>

        {/* Campaign Scheduler */}
        <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-500">
          <CardContent className="p-8 text-center">
            <div className="p-6 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Schedule Campaign</h3>
            <p className="text-gray-600 mb-6">
              Plan and schedule your campaign to launch at the perfect time with automated workflows.
            </p>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => setCurrentView('scheduler')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Campaign
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Quick Actions</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Import from CSV
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Duplicate Last Campaign
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            View Scheduled Campaigns
          </Button>
        </div>
      </div>
    </div>
  );
};
