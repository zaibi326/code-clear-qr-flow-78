
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  last_login_at?: Date;
  created_at: Date;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminRegister: (name: string, email: string, password: string, role: 'admin' | 'super_admin') => Promise<boolean>;
  adminLogout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // This would typically call an edge function for admin authentication
      // For now, we'll simulate the login process
      console.log('Admin login attempt:', email);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login for demo purposes
      if (email === 'admin@example.com' && password === 'password') {
        const mockAdminUser: AdminUser = {
          id: 'admin-1',
          email: email,
          name: 'Super Admin',
          role: 'super_admin',
          is_active: true,
          created_at: new Date(),
          last_login_at: new Date()
        };
        
        setAdminUser(mockAdminUser);
        localStorage.setItem('adminUser', JSON.stringify(mockAdminUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const adminRegister = async (name: string, email: string, password: string, role: 'admin' | 'super_admin'): Promise<boolean> => {
    setIsLoading(true);
    try {
      // This would typically call an edge function to create admin user
      console.log('Admin registration attempt:', { name, email, role });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, always return true
      return true;
    } catch (error) {
      console.error('Admin registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogout = async (): Promise<void> => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
  };

  useEffect(() => {
    // Check for existing admin session
    const storedAdminUser = localStorage.getItem('adminUser');
    if (storedAdminUser) {
      try {
        const parsedUser = JSON.parse(storedAdminUser);
        setAdminUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored admin user:', error);
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const value = {
    adminUser,
    isLoading,
    adminLogin,
    adminRegister,
    adminLogout,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
