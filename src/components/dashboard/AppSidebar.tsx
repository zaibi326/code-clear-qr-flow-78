
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
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
  const { signOut, user } = useAuth();

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
      <div className="flex items-center justify-between py-3 px-3">
        <a href="/" className="flex items-center gap-2">
          <img
            src="/clearqr-logo.svg"
            alt="ClearQR Logo"
            className={`transition-all duration-300 ${
              collapsed ? "w-8 h-8" : "w-10 h-10"
            }`}
          />
          <span
            className={`transition-all duration-300 ${
              collapsed ? "hidden" : "block"
            }`}
          >
            ClearQR
          </span>
        </a>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url as string} />
                <AvatarFallback>
                  {user?.email?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mr-2">
            <DropdownMenuItem>
              {user?.user_metadata?.full_name || user?.email}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/support")}>
              Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              <a
                href={item.href}
                className={`group flex items-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-300 ${
                  item.isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                } py-2 px-3`}
              >
                <item.icon
                  className={`mr-2 h-4 w-4 transition-all duration-300 ${
                    collapsed ? "mr-0" : ""
                  }`}
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
    </aside>
  );
}
