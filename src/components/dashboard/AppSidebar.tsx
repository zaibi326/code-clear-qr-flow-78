
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
        className={`fixed left-0 top-0 z-40 h-screen bg-white/95 backdrop-blur-md transition-all duration-300 ease-in-out border-r border-indigo-100 shadow-2xl shadow-indigo-500/10 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:block w-[240px]`}
        style={{ boxSizing: 'border-box' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <button 
            onClick={handleLogoClick}
            className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 cursor-pointer truncate"
          >
            ClearQR.io
          </button>
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-indigo-100 transition-colors flex-shrink-0 hidden md:block group"
          >
            <ChevronUp className={`h-5 w-5 text-indigo-600 group-hover:text-indigo-700 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
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
                    className={`flex items-center w-full p-4 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-left group ${
                      location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25' 
                        : 'text-slate-700 hover:text-indigo-700'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                      location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
                        ? 'text-white' 
                        : 'text-slate-500 group-hover:text-indigo-600'
                    }`} />
                    <span className="ml-4 truncate font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <button
            onClick={handleSettingsClick}
            className="flex items-center w-full p-4 rounded-xl hover:bg-indigo-100 transition-all duration-200 text-slate-700 hover:text-indigo-700 mb-2 group"
          >
            <Settings className="h-5 w-5 flex-shrink-0 text-slate-500 group-hover:text-indigo-600 transition-colors duration-200" />
            <span className="ml-4 truncate font-medium">Settings</span>
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full p-4 rounded-xl hover:bg-red-50 transition-all duration-200 text-slate-700 hover:text-red-600 group"
          >
            <User2 className="h-5 w-5 flex-shrink-0 text-slate-500 group-hover:text-red-500 transition-colors duration-200" />
            <span className="ml-4 truncate font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AppSidebar;
