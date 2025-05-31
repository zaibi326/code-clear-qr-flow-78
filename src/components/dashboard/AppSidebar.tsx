
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
      label: 'Home',
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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    console.log('Sidebar toggled:', !isCollapsed);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-md bg-white shadow-md border border-gray-200"
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 h-screen bg-white transition-all duration-300 ease-in-out border-r border-gray-200 shadow-sm ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:block w-[240px]`}
        style={{ boxSizing: 'border-box' }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <button 
            onClick={handleLogoClick}
            className="font-bold text-lg hover:text-blue-600 transition-colors cursor-pointer truncate"
          >
            ClearQR.io
          </button>
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 hidden md:block"
          >
            <ChevronUp className={`h-5 w-5 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <ScrollArea className="flex-1 h-[calc(100vh-120px)]">
          <nav className="p-3">
            <ul className="space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      closeMobileMenu();
                    }}
                    className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-left ${
                      location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                        : 'text-gray-700'
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="ml-3 truncate">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>

        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleSettingsClick}
            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 mb-2"
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            <span className="ml-3 truncate">Settings</span>
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
          >
            <User2 className="h-5 w-5 flex-shrink-0" />
            <span className="ml-3 truncate">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AppSidebar;
