
import React, { createContext, useContext, useEffect, useState } from 'react';

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
      console.log('Attempting admin login for:', email);
      
      const response = await fetch(`https://tiaxynkduixekzqzsgvk.supabase.co/functions/v1/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpYXh5bmtkdWl4ZWt6cXpzZ3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MDQwMjMsImV4cCI6MjA2Mzk4MDAyM30.pLiy2dtIssgVsP-_UnP7nepo1WSui7SqExU0dWctPpY`
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('Admin login response:', data);

      if (data.success && data.user) {
        const adminUserData: AdminUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          is_active: data.user.is_active,
          created_at: new Date(data.user.created_at),
          last_login_at: data.user.last_login_at ? new Date(data.user.last_login_at) : undefined
        };
        
        setAdminUser(adminUserData);
        localStorage.setItem('adminUser', JSON.stringify(adminUserData));
        localStorage.setItem('adminSession', JSON.stringify(data.session));
        console.log('Admin login successful');
        return true;
      }
      
      console.log('Admin login failed:', data.error);
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
      console.log('Attempting admin registration for:', email);
      
      const response = await fetch(`https://tiaxynkduixekzqzsgvk.supabase.co/functions/v1/admin-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpYXh5bmtkdWl4ZWt6cXpzZ3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MDQwMjMsImV4cCI6MjA2Mzk4MDAyM30.pLiy2dtIssgVsP-_UnP7nepo1WSui7SqExU0dWctPpY`
        },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await response.json();
      console.log('Admin registration response:', data);
      
      return data.success;
    } catch (error) {
      console.error('Admin registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogout = async (): Promise<void> => {
    console.log('Admin logout');
    setAdminUser(null);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminSession');
  };

  useEffect(() => {
    // Check for existing admin session
    const storedAdminUser = localStorage.getItem('adminUser');
    const storedSession = localStorage.getItem('adminSession');
    
    if (storedAdminUser && storedSession) {
      try {
        const parsedUser = JSON.parse(storedAdminUser);
        const parsedSession = JSON.parse(storedSession);
        
        // Check if session is still valid
        const sessionData = JSON.parse(atob(parsedSession.access_token));
        if (sessionData.exp > Date.now()) {
          console.log('Restored admin session:', parsedUser.email);
          setAdminUser({
            ...parsedUser,
            created_at: new Date(parsedUser.created_at),
            last_login_at: parsedUser.last_login_at ? new Date(parsedUser.last_login_at) : undefined
          });
        } else {
          console.log('Admin session expired, clearing storage');
          localStorage.removeItem('adminUser');
          localStorage.removeItem('adminSession');
        }
      } catch (error) {
        console.error('Error parsing stored admin session:', error);
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminSession');
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
