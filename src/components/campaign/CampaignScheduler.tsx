
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Send, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface CampaignSchedule {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  autoStart: boolean;
  notifications: boolean;
}

interface CampaignSchedulerProps {
  onScheduleCampaign: (schedule: CampaignSchedule) => void;
}

export const CampaignScheduler = ({ onScheduleCampaign }: CampaignSchedulerProps) => {
  const [schedule, setSchedule] = useState<CampaignSchedule>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    timezone: 'UTC',
    autoStart: true,
    notifications: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!schedule.name.trim()) {
      toast.error('Campaign name is required');
      return;
    }
    
    if (!schedule.startDate) {
      toast.error('Start date is required');
      return;
    }

    onScheduleCampaign(schedule);
    toast.success(`Campaign "${schedule.name}" scheduled successfully`);
    
    // Reset form
    setSchedule({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'UTC',
      autoStart: true,
      notifications: true
    });
  };

  const handleInputChange = (field: keyof CampaignSchedule, value: string | boolean) => {
    setSchedule(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Campaign
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  value={schedule.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter campaign name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={schedule.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your campaign"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Date and Time Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Schedule Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={schedule.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={schedule.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  value={schedule.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Additional Settings
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoStart"
                    checked={schedule.autoStart}
                    onChange={(e) => handleInputChange('autoStart', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="autoStart">Auto-start campaign at scheduled time</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={schedule.notifications}
                    onChange={(e) => handleInputChange('notifications', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="notifications">Send email notifications</Label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <Send className="h-4 w-4" />
                Schedule Campaign
              </Button>
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
