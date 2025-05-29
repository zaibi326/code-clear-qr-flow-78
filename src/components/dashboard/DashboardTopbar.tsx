
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search, Bell, User, LogOut, Settings as SettingsIcon, QrCode, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function DashboardTopbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 border-b border-gray-200">
      <div className="responsive-padding py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            {/* Back Arrow Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToMain}
              className="shrink-0 hover:bg-gray-100"
              aria-label="Back to main page"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <SidebarTrigger 
              className="lg:hidden shrink-0" 
              aria-label="Toggle sidebar navigation"
            />
            
            {/* ClearQR.io Logo */}
            <Link to="/" className="flex items-center space-x-2 group shrink-0">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <QrCode className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
                ClearQR.io
              </span>
            </Link>
            
            {/* Search - hidden on very small screens, shown on sm+ */}
            <div className="relative max-w-md hidden sm:block flex-1 lg:flex-initial lg:w-80">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
                aria-hidden="true"
              />
              <Input
                placeholder="Search campaigns, QR codes..."
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors w-full"
                aria-label="Search campaigns and QR codes"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Mobile search button - only shown on small screens */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="sm:hidden shrink-0"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative shrink-0"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5" />
              <span 
                className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
                aria-label="New notifications available"
              ></span>
            </Button>
            
            {/* User profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 h-auto py-2"
                  aria-label="User menu"
                >
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                    <AvatarImage src="/placeholder.svg" alt="Profile picture" />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user ? getInitials(user.name) : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 leading-tight">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/support" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
