
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from './ProfileSettings';
import { AccountSettings } from './AccountSettings';
import { PlanPricing } from './PlanPricing';
import { User, Settings, CreditCard } from 'lucide-react';

export function SettingsTabs() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-1">
        <TabsTrigger value="profile" className="flex items-center gap-2 px-4 py-3">
          <User className="h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="account" className="flex items-center gap-2 px-4 py-3">
          <Settings className="h-4 w-4" />
          Account
        </TabsTrigger>
        <TabsTrigger value="billing" className="flex items-center gap-2 px-4 py-3">
          <CreditCard className="h-4 w-4" />
          Plan & Billing
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="mt-0">
        <ProfileSettings />
      </TabsContent>
      
      <TabsContent value="account" className="mt-0">
        <AccountSettings />
      </TabsContent>
      
      <TabsContent value="billing" className="mt-0">
        <PlanPricing />
      </TabsContent>
    </Tabs>
  );
}
