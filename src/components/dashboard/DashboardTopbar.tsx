
import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface DashboardTopbarProps {
  toggleSidebar?: () => void;
}

export const DashboardTopbar = ({ toggleSidebar }: DashboardTopbarProps) => {
  const { signOut, profile } = useAuth();

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="ml-2 w-full max-w-md">
          <Input type="search" placeholder="Search..." />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Badge variant="secondary">Pro</Badge>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarImage src={profile?.avatar_url || ""} />
          <AvatarFallback>{profile?.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          Logout
        </Button>
      </div>
    </div>
  );
};
