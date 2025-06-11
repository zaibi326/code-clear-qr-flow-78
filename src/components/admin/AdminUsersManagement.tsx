
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreateUserDialog } from './users/CreateUserDialog';
import { EditUserDialog } from './users/EditUserDialog';
import { UsersTable } from './users/UsersTable';
import { UsersFilters } from './users/UsersFilters';

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  role?: string;
  subscription_status?: string;
  is_active?: boolean;
}

export const AdminUsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin' | 'super_admin',
    subscription: 'free' as 'free' | 'pro' | 'enterprise'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users from profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching users:', profilesError);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive"
        });
        return;
      }

      console.log('Fetched profiles:', profiles);

      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
      }

      console.log('Fetched user roles:', userRoles);

      // Fetch subscriptions
      const { data: subscriptions, error: subsError } = await supabase
        .from('subscriptions')
        .select('user_id, status');

      if (subsError) {
        console.error('Error fetching subscriptions:', subsError);
      }

      console.log('Fetched subscriptions:', subscriptions);

      // Combine data
      const usersWithRoles = profiles?.map(profile => {
        const userRole = userRoles?.find(role => role.user_id === profile.id);
        const userSub = subscriptions?.find(sub => sub.user_id === profile.id);
        
        return {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          created_at: profile.created_at,
          role: userRole?.role || 'user',
          subscription_status: userSub?.status || 'free',
          is_active: true // Default to active since we don't have this field in profiles
        };
      }) || [];

      console.log('Combined users data:', usersWithRoles);
      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      toast({
        title: "Success",
        description: "User activated successfully",
      });
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_active: true } : user
      ));
    } catch (error) {
      console.error('Error activating user:', error);
      toast({
        title: "Error",
        description: "Failed to activate user",
        variant: "destructive"
      });
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      toast({
        title: "Success",
        description: "User suspended successfully",
      });
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_active: false } : user
      ));
    } catch (error) {
      console.error('Error suspending user:', error);
      toast({
        title: "Error",
        description: "Failed to suspend user",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete user role first
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Delete user profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        throw error;
      }

      await fetchUsers();
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      // Update user role if changed
      if (updates.role) {
        await supabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            role: updates.role as 'user' | 'admin' | 'super_admin'
          });
      }

      // Update profile if name changed
      if (updates.name) {
        await supabase
          .from('profiles')
          .update({ name: updates.name })
          .eq('id', userId);
      }

      await fetchUsers();
      setEditingUser(null);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleCreateUser = async () => {
    try {
      console.log('Creating user with data:', newUser);
      
      // Call the admin-signup edge function
      const response = await fetch(`https://tiaxynkduixekzqzsgvk.supabase.co/functions/v1/admin-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpYXh5bmtkdWl4ZWt6cXpzZ3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MDQwMjMsImV4cCI6MjA2Mzk4MDAyM30.pLiy2dtIssgVsP-_UnP7nepo1WSui7SqExU0dWctPpY`
        },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          name: newUser.name,
          role: newUser.role,
          plan: newUser.subscription
        })
      });

      const data = await response.json();
      console.log('Admin signup response:', data);

      if (data.success) {
        // Refresh the users list to show the new user
        await fetchUsers();
        
        setIsDialogOpen(false);
        setNewUser({ name: '', email: '', password: '', role: 'user', subscription: 'free' });
        
        toast({
          title: "Success",
          description: "User created successfully",
        });
      } else {
        throw new Error(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage users, roles, and subscriptions</p>
        </div>
        <CreateUserDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          newUser={newUser}
          onUserChange={setNewUser}
          onCreateUser={handleCreateUser}
        />
      </div>

      <UsersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterRole={filterRole}
        onFilterRoleChange={setFilterRole}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={filteredUsers}
            onEditUser={setEditingUser}
            onActivateUser={handleActivateUser}
            onSuspendUser={handleSuspendUser}
            onDeleteUser={handleDeleteUser}
          />
        </CardContent>
      </Card>

      <EditUserDialog
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUpdateUser={handleUpdateUser}
        onUserChange={setEditingUser}
      />
    </div>
  );
};
