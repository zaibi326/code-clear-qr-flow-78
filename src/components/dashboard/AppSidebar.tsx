
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
  Plug
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
    navigate('/');
  };

  return (
    <div
      className={`fixed left-0 top-0 z-30 flex flex-col h-screen bg-white ${isCollapsed ? 'w-20' : 'w-60'} border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out shadow-sm`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <button 
            onClick={handleLogoClick}
            className="font-bold text-lg hover:text-blue-600 transition-colors cursor-pointer"
          >
            ClearQR.io
          </button>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <ChevronUp className={`h-6 w-6 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <nav className="p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex items-center w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                    location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
                      ? 'bg-gray-100 dark:bg-gray-800' 
                      : ''
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-2 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Settings className="h-5 w-5 mr-2 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">Settings</span>}
        </button>
      </div>
    </div>
  );
};

export default AppSidebar;
