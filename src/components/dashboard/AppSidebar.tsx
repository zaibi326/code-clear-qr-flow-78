
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';
import { 
  QrCode, 
  BarChart3, 
  Megaphone, 
  FileText, 
  Settings, 
  Home,
  Upload,
  Database,
  Users,
  CreditCard,
  HelpCircle
} from 'lucide-react';

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    description: "Overview & analytics"
  },
  {
    title: "Templates",
    url: "/templates",
    icon: FileText,
    description: "Design templates"
  },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: Megaphone,
    description: "Create & manage"
  },
  {
    title: "Data Manager",
    url: "/data-manager",
    icon: Database,
    description: "CSV uploads"
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    description: "Performance insights"
  },
];

const accountMenuItems = [
  {
    title: "Account Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
  {
    title: "Support",
    url: "/support",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-4 border-b border-gray-100">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl group-hover:scale-105 transition-transform duration-200">
            <QrCode className="h-6 w-6 text-white" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ClearQR.io
            </span>
            <div className="text-xs text-gray-500 font-medium">SaaS Platform</div>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="hover:bg-blue-50 hover:text-blue-600 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700 data-[active=true]:border-r-2 data-[active=true]:border-blue-600 rounded-lg transition-all duration-200"
                  >
                    <Link to={item.url} className="flex items-center space-x-3 p-3">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <div className="group-data-[collapsible=icon]:hidden">
                        <span className="font-medium">{item.title}</span>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="hover:bg-gray-50 hover:text-gray-700 data-[active=true]:bg-gray-100 data-[active=true]:text-gray-900 rounded-lg transition-all duration-200"
                  >
                    <Link to={item.url} className="flex items-center space-x-3 p-3">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-100">
        <div className="group-data-[collapsible=icon]:hidden">
          <div className="text-xs text-gray-500 mb-2">Current Plan</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Pro Plan</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">© 2024 ClearQR.io</div>
        </div>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}
