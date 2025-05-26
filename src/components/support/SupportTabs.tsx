
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SupportTicketForm } from './SupportTicketForm';
import { TicketList } from './TicketList';
import { HelpCenter } from './HelpCenter';
import { MessageSquare, List, HelpCircle } from 'lucide-react';

export function SupportTabs() {
  return (
    <Tabs defaultValue="submit" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="submit" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Submit Ticket
        </TabsTrigger>
        <TabsTrigger value="tickets" className="flex items-center gap-2">
          <List className="h-4 w-4" />
          My Tickets
        </TabsTrigger>
        <TabsTrigger value="help" className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          Help Center
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="submit">
        <SupportTicketForm />
      </TabsContent>
      
      <TabsContent value="tickets">
        <TicketList />
      </TabsContent>
      
      <TabsContent value="help">
        <HelpCenter />
      </TabsContent>
    </Tabs>
  );
}
