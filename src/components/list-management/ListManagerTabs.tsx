
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateListTab } from './CreateListTab';
import { ManageListsTab } from './ManageListsTab';
import { ViewListTab } from './ViewListTab';
import { List, Plus, Eye } from 'lucide-react';

export const ListManagerTabs = () => {
  const [activeTab, setActiveTab] = useState('manage');

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-8 pt-8 pb-0">
          <TabsList className="grid grid-cols-3 w-full max-w-lg bg-gray-100/60 backdrop-blur-sm">
            <TabsTrigger value="manage" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md">
              <List className="w-4 h-4 mr-2" />
              Manage Lists
            </TabsTrigger>
            <TabsTrigger value="create" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Create List
            </TabsTrigger>
            <TabsTrigger value="view" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Eye className="w-4 h-4 mr-2" />
              View List
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="p-8">
          <TabsContent value="manage" className="m-0">
            <ManageListsTab />
          </TabsContent>
          
          <TabsContent value="create" className="m-0">
            <CreateListTab />
          </TabsContent>
          
          <TabsContent value="view" className="m-0">
            <ViewListTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
