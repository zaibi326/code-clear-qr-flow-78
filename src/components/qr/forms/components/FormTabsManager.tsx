
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FormTabsManagerProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  showBulkTab: boolean;
  children: React.ReactNode;
}

export function FormTabsManager({ activeTab, onTabChange, showBulkTab, children }: FormTabsManagerProps) {
  console.log('FormTabsManager - activeTab:', activeTab, 'showBulkTab:', showBulkTab);
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="single" 
            className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            Single Record
          </TabsTrigger>
          {showBulkTab && (
            <TabsTrigger 
              value="bulk" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              Bulk Records
            </TabsTrigger>
          )}
        </TabsList>
        
        <div className="mt-6">
          {children}
        </div>
      </Tabs>
    </div>
  );
}
