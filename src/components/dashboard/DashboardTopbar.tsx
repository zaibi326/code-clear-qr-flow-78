
import React, { useState } from 'react';
import { Bell, Search, Menu, Settings, HelpCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';

interface DashboardTopbarProps {
  toggleSidebar?: () => void;
}

export const DashboardTopbar = ({ toggleSidebar }: DashboardTopbarProps) => {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const handleGlobalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalSearchQuery(value);
    console.log('Global search query:', value);
    // Add global search functionality here
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleHelpClick = () => {
    navigate('/support');
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        
        <div className="relative w-96 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            type="search" 
            placeholder="Search QR codes, campaigns, templates..." 
            value={globalSearchQuery}
            onChange={handleGlobalSearch}
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button 
          onClick={() => navigate('/quick-generate')}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create QR Code
        </Button>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Pro Plan
          </Badge>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button variant="ghost" size="icon" onClick={handleHelpClick}>
            <HelpCircle className="h-5 w-5 text-gray-600" />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={handleSettingsClick}>
            <Settings className="h-5 w-5 text-gray-600" />
          </Button>
        </div>

        <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {profile?.name?.charAt(0).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{profile?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{profile?.email}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-gray-600 hover:text-gray-900">
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};
