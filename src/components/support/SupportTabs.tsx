
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SupportTicketForm } from './SupportTicketForm';
import { TicketList } from './TicketList';
import { HelpCenter } from './HelpCenter';
import { MessageSquare, List, HelpCircle } from 'lucide-react';

export function SupportTabs() {
  return (
    <Tabs defaultValue="submit" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 h-auto p-1">
        <TabsTrigger 
          value="submit" 
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"
        >
          <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
          <span className="hidden xs:inline sm:inline">Submit Ticket</span>
          <span className="xs:hidden sm:hidden">Submit</span>
        </TabsTrigger>
        <TabsTrigger 
          value="tickets" 
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"
        >
          <List className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
          <span className="hidden xs:inline sm:inline">My Tickets</span>
          <span className="xs:hidden sm:hidden">Tickets</span>
        </TabsTrigger>
        <TabsTrigger 
          value="help" 
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"
        >
          <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
          <span className="hidden xs:inline sm:inline">Help Center</span>
          <span className="xs:hidden sm:hidden">Help</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="submit" className="mt-0">
        <SupportTicketForm />
      </TabsContent>
      
      <TabsContent value="tickets" className="mt-0">
        <TicketList />
      </TabsContent>
      
      <TabsContent value="help" className="mt-0">
        <HelpCenter />
      </TabsContent>
    </Tabs>
  );
}
