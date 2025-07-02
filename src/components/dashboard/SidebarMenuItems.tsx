
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  QrCode,
  Zap,
  Database,
  Tag,
  Settings,
  TrendingUp,
  Users,
  HelpCircle,
  List
} from 'lucide-react';

interface MenuItem {
  title: string;
  icon: any;
  href: string;
  isActive: boolean;
}

interface SidebarMenuItemsProps {
  collapsed: boolean;
}

export const SidebarMenuItems = React.memo(({ collapsed }: SidebarMenuItemsProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = React.useMemo(() => [
    {
      title: "Dashboard",
      icon: BarChart3,
      href: "/dashboard",
      isActive: location.pathname === "/dashboard"
    },
    {
      title: "Create QR Code",
      icon: QrCode,
      href: "/create",
      isActive: location.pathname === "/create"
    },
    {
      title: "Quick Generate",
      icon: Zap,
      href: "/quick-generate",
      isActive: location.pathname === "/quick-generate"
    },
    {
      title: "QR Database",
      icon: Database,
      href: "/qr-database",
      isActive: location.pathname === "/qr-database"
    },
    {
      title: "Tags Management",
      icon: Tag,
      href: "/tags",
      isActive: location.pathname === "/tags"
    },
    {
      title: "Leads Management",
      icon: Users,
      href: "/leads",
      isActive: location.pathname === "/leads"
    },
    {
      title: "List Management",
      icon: List,
      href: "/list-management",
      isActive: location.pathname === "/list-management"
    },
    {
      title: "Analytics",
      icon: TrendingUp,
      href: "/analytics",
      isActive: location.pathname === "/analytics"
    },
    {
      title: "Support",
      icon: HelpCircle,
      href: "/support",
      isActive: location.pathname === "/support"
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
      isActive: location.pathname === "/settings"
    }
  ], [location.pathname]);

  const handleNavigation = React.useCallback((href: string) => {
    navigate(href);
  }, [navigate]);

  return (
    <ul className="space-y-2">
      {menuItems.map((item) => (
        <li key={item.title}>
          <button
            onClick={() => handleNavigation(item.href)}
            className={`group flex items-center rounded-xl text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 w-full ${
              item.isActive
                ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border-l-4 border-blue-500"
                : "text-gray-600 hover:border-l-4 hover:border-blue-300"
            } py-3 px-4`}
          >
            <item.icon
              className={`h-5 w-5 transition-all duration-200 ${
                collapsed ? "mr-0" : "mr-3"
              } ${item.isActive ? "text-blue-600" : ""}`}
            />
            <span
              className={`transition-all duration-300 ${
                collapsed ? "hidden" : "block"
              }`}
            >
              {item.title}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
});

SidebarMenuItems.displayName = 'SidebarMenuItems';
