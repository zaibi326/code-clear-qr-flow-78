
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, UserCheck, UserX } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  role?: string;
  subscription_status?: string;
  is_active?: boolean;
}

interface UsersTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onActivateUser: (userId: string) => void;
  onSuspendUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export function UsersTable({ 
  users, 
  onEditUser, 
  onActivateUser, 
  onSuspendUser, 
  onDeleteUser 
}: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-medium">Name</th>
            <th className="text-left p-3 font-medium">Email</th>
            <th className="text-left p-3 font-medium">Role</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-left p-3 font-medium">Joined</th>
            <th className="text-left p-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium">{user.name}</td>
              <td className="p-3 text-gray-600">{user.email}</td>
              <td className="p-3">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </td>
              <td className="p-3">
                <Badge variant={user.is_active ? 'default' : 'destructive'}>
                  {user.is_active ? 'Active' : 'Suspended'}
                </Badge>
              </td>
              <td className="p-3 text-gray-600">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="p-3">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditUser(user)}
                    title="Edit user"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  {user.is_active ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSuspendUser(user.id)}
                      className="text-yellow-600 hover:text-yellow-700"
                      title="Suspend user"
                    >
                      <UserX className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onActivateUser(user.id)}
                      className="text-green-600 hover:text-green-700"
                      title="Activate user"
                    >
                      <UserCheck className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete user"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
