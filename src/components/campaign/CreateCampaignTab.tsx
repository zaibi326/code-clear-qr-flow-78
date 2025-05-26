
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

export const CreateCampaignTab = () => {
  return (
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
  );
};
