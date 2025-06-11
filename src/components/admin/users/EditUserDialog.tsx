
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  role?: string;
  subscription_status?: string;
  is_active?: boolean;
}

interface EditUserDialogProps {
  user: User | null;
  onClose: () => void;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onUserChange: (user: User) => void;
}

export function EditUserDialog({ user, onClose, onUpdateUser, onUserChange }: EditUserDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="editName">Name</Label>
            <Input
              id="editName"
              value={user.name}
              onChange={(e) => onUserChange({ ...user, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="editEmail">Email</Label>
            <Input
              id="editEmail"
              value={user.email}
              disabled
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="editRole">Role</Label>
            <Select
              value={user.role}
              onValueChange={(value) => onUserChange({ ...user, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => onUpdateUser(user.id, user)}
              className="flex-1"
            >
              Save Changes
            </Button>
            <Button 
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
