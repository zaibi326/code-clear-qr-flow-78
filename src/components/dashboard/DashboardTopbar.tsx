
import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DashboardTopbarProps {
  toggleSidebar?: () => void;
}

export const DashboardTopbar: React.FC<DashboardTopbarProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white/95 backdrop-blur-lg border-b border-indigo-100/50 px-4 sm:px-6 lg:px-8 py-4 shadow-lg shadow-indigo-500/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {toggleSidebar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="md:hidden p-3 hover:bg-indigo-50 rounded-xl transition-all duration-300 border border-indigo-100/50"
            >
              <Menu className="h-5 w-5 text-indigo-600" />
            </Button>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search QR codes..."
              className="pl-10 w-64 lg:w-96 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-3 hover:bg-indigo-50 rounded-xl transition-all duration-300 relative border border-indigo-100/50 bg-white/80 backdrop-blur-sm"
          >
            <Bell className="h-5 w-5 text-slate-600 hover:text-indigo-600" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse"></span>
          </Button>
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
            <span className="text-white font-semibold text-sm">U</span>
          </div>
        </div>
      </div>
    </header>
  );
};
