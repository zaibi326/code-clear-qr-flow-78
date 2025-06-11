
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronUp,
  User2,
  BarChart3,
  QrCode,
  Database,
  FileText,
  Megaphone,
  HelpCircle,
  TestTube,
  Activity,
  Plug,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AppSidebarProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  isCollapsed: propIsCollapsed, 
  setIsCollapsed: propSetIsCollapsed 
}) => {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  // Use props if provided, otherwise use internal state
  const isCollapsed = propIsCollapsed !== undefined ? propIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = propSetIsCollapsed || setInternalIsCollapsed;

  const sidebarItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'Overview',
    },
    {
      path: '/analytics',
      icon: BarChart3,
      label: 'Analytics',
    },
    {
      path: '/quick-generate',
      icon: QrCode,
      label: 'QR Codes',
    },
    {
      path: '/template-manager',
      icon: FileText,
      label: 'Templates',
    },
    {
      path: '/data-manager',
      icon: Database,
      label: 'Projects',
    },
    {
      path: '/campaign-creator',
      icon: Megaphone,
      label: 'Campaigns',
    },
    {
      path: '/dashboard/integrations',
      icon: Plug,
      label: 'Integrations',
    },
    {
      path: '/monitoring',
      icon: Activity,
      label: 'Activity',
    },
    {
      path: '/support',
      icon: HelpCircle,
      label: 'Help',
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-3 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg border border-indigo-100 hover:bg-white transition-all duration-200"
      >
        {isMobileMenuOpen ? <X className="h-5 w-5 text-indigo-600" /> : <Menu className="h-5 w-5 text-indigo-600" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-30 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-[240px]`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button 
            onClick={handleLogoClick}
            className="font-bold text-xl text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
          >
            ClearQR.io
          </button>
        </div>

        <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      closeMobileMenu();
                    }}
                    className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-left group ${
                      location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                      location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
                        ? 'text-blue-600' 
                        : 'text-gray-500 group-hover:text-gray-700'
                    }`} />
                    <span className="ml-3 font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSettingsClick}
            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900 mb-2 group"
          >
            <Settings className="h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
            <span className="ml-3 font-medium">Settings</span>
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full p-3 rounded-lg hover:bg-red-50 transition-colors text-gray-700 hover:text-red-600 group"
          >
            <User2 className="h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-red-500 transition-colors duration-200" />
            <span className="ml-3 font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AppSidebar;
