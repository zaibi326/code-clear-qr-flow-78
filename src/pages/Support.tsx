
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { SupportTabs } from '@/components/support/SupportTabs';
import { HelpCenter } from '@/components/support/HelpCenter';
import { SupportTicketSystem } from '@/components/support/SupportTicketSystem';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, MessageCircle, Book, Phone } from 'lucide-react';

const Support = () => {
  const [activeTab, setActiveTab] = useState('help');

  const supportStats = [
    {
      title: 'Help Articles',
      value: '150+',
      icon: Book,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Tickets',
      value: '3',
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Avg Response',
      value: '2h',
      icon: Phone,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Satisfaction',
      value: '98%',
      icon: HelpCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Support Center
                </h1>
                <p className="text-gray-600">Get help, browse documentation, and contact our support team</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {supportStats.map((stat, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Support Content */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
                <div className="px-6 pt-6 pb-0">
                  <SupportTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="p-6">
                  {activeTab === 'help' && <HelpCenter />}
                  {activeTab === 'tickets' && <SupportTicketSystem />}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Support;
