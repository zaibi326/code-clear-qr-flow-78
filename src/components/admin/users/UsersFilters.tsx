
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface UsersFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterRole: string;
  onFilterRoleChange: (role: string) => void;
}

export function UsersFilters({ 
  searchTerm, 
  onSearchChange, 
  filterRole, 
  onFilterRoleChange 
}: UsersFiltersProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={filterRole} onValueChange={onFilterRoleChange}>
        <SelectTrigger className="w-48">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="super_admin">Super Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
