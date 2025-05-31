
import React, { useState } from 'react';
import { Search, Bell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface DashboardTopbarProps {
  toggleSidebar?: () => void;
}

export const DashboardTopbar: React.FC<DashboardTopbarProps> = ({ toggleSidebar }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/settings');
  };

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
          {/* Notification Bell */}
          <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-3 hover:bg-indigo-50 rounded-xl transition-all duration-300 relative border border-indigo-100/50 bg-white/80 backdrop-blur-sm"
              >
                <Bell className="h-5 w-5 text-slate-600 hover:text-indigo-600" />
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-gradient-to-r from-red-400 to-pink-400 text-white text-xs border-2 border-white"
                >
                  3
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
              <NotificationCenter />
            </PopoverContent>
          </Popover>

          {/* Profile Avatar with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-10 w-10 rounded-xl border border-indigo-100/50 bg-white/80 backdrop-blur-sm hover:bg-indigo-50 transition-all duration-300 p-0"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-sm">
                    U
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    user@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
