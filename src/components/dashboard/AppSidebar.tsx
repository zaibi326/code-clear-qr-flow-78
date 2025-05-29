import React from 'react';
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
  FileTemplate,
  Megaphone,
  HelpCircle,
  TestTube,
  Activity,
  Plug
} from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface AppSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const sidebarItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'Home',
    },
    {
      path: '/dashboard/analytics',
      icon: BarChart3,
      label: 'Analytics',
    },
    {
      path: '/dashboard/qr-codes',
      icon: QrCode,
      label: 'QR Codes',
    },
    {
      path: '/dashboard/templates',
      icon: FileTemplate,
      label: 'Templates',
    },
    {
      path: '/dashboard/projects',
      icon: Database,
      label: 'Projects',
    },
    {
      path: '/dashboard/campaigns',
      icon: Megaphone,
      label: 'Campaigns',
    },
    {
      path: '/dashboard/integrations',
      icon: Plug,
      label: 'Integrations',
    },
    {
      path: '/dashboard/activity',
      icon: Activity,
      label: 'Activity',
    },
    {
      path: '/dashboard/help',
      icon: HelpCircle,
      label: 'Help',
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div
      className={`flex flex-col h-full ${isCollapsed ? 'w-20' : 'w-60'} border-r border-gray-200 dark:border-gray-700 transition-width duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {!isCollapsed && <span className="font-bold text-lg">ClearQR.io</span>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <ChevronUp className={`h-6 w-6 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-grow p-4">
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.path} className="mb-1">
              <button
                onClick={() => navigate(item.path)}
                className={`flex items-center w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${location.pathname.startsWith(item.path) ? 'bg-gray-100 dark:bg-gray-800' : ''
                  }`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Settings className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>
    </div>
  );
};

export default AppSidebar;
