
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from './ProfileSettings';
import { SubscriptionSettings } from './SubscriptionSettings';
import { AccountSettings } from './AccountSettings';
import { User, CreditCard, Settings } from 'lucide-react';

export function SettingsTabs() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile Info
        </TabsTrigger>
        <TabsTrigger value="subscription" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Subscription
        </TabsTrigger>
        <TabsTrigger value="account" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Account Settings
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <ProfileSettings />
      </TabsContent>
      
      <TabsContent value="subscription">
        <SubscriptionSettings />
      </TabsContent>
      
      <TabsContent value="account">
        <AccountSettings />
      </TabsContent>
    </Tabs>
  );
}
