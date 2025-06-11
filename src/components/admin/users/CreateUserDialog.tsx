
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface CreateUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newUser: {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin' | 'super_admin';
    subscription: 'free' | 'pro' | 'enterprise';
  };
  onUserChange: (user: any) => void;
  onCreateUser: () => void;
}

export function CreateUserDialog({ 
  isOpen, 
  onOpenChange, 
  newUser, 
  onUserChange, 
  onCreateUser 
}: CreateUserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newUser.name}
              onChange={(e) => onUserChange({ ...newUser, name: e.target.value })}
              placeholder="User's full name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) => onUserChange({ ...newUser, email: e.target.value })}
              placeholder="user@example.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={newUser.password}
              onChange={(e) => onUserChange({ ...newUser, password: e.target.value })}
              placeholder="Temporary password"
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={newUser.role} onValueChange={(value: 'user' | 'admin' | 'super_admin') => onUserChange({ ...newUser, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subscription">Subscription Plan</Label>
            <Select value={newUser.subscription} onValueChange={(value: 'free' | 'pro' | 'enterprise') => onUserChange({ ...newUser, subscription: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onCreateUser} className="w-full">
            Create User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
