
import React from "react";
import {
  BarChart3,
  QrCode,
  Zap,
  Database,
  Tag,
  Settings,
  TrendingUp,
  Users,
  FileText,
  HelpCircle,
  Puzzle
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useSupabaseAuth";

interface MenuItem {
  title: string;
  icon: any;
  href: string;
  isActive: boolean;
}

export default function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const collapsed = state === "collapsed";

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const menuItems = [
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
      title: "Template Manager",
      icon: FileText,
      href: "/template-manager",
      isActive: location.pathname === "/template-manager"
    },
    {
      title: "Integrations",
      icon: Puzzle,
      href: "/dashboard/integrations",
      isActive: location.pathname === "/dashboard/integrations"
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
  ];

  return (
    <aside
      className={`group/sidebar flex flex-col h-screen fixed z-50 bg-white border-r shadow-sm transition-all duration-300 ${
        collapsed ? "w-[70px]" : "w-[240px]"
      }`}
    >
      <div className="flex items-center justify-center py-4 px-3 border-b">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
            <QrCode className="h-6 w-6 text-white" />
          </div>
          <span
            className={`font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 ${
              collapsed ? "hidden" : "block"
            }`}
          >
            ClearQR
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <a
                href={item.href}
                className={`group flex items-center rounded-xl text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 ${
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
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t p-3">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center text-sm text-gray-600 hover:text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors"
        >
          {collapsed ? "↗" : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
