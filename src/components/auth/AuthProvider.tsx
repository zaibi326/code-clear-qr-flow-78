
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, User, AuthState } from '@/utils/authService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, company?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authService.checkAuthStatus();
      setAuthState({
        ...authService.getAuthState(),
        isLoading: false
      });
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    const result = await authService.login({ email, password });
    
    if (result.success) {
      setAuthState(authService.getAuthState());
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      return true;
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Login failed",
        description: result.error || "Please check your credentials.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, company?: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    const result = await authService.register({ name, email, password, company });
    
    if (result.success) {
      setAuthState(authService.getAuthState());
      toast({
        title: "Account created!",
        description: "Welcome to ClearQR.io",
      });
      return true;
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Registration failed",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    const result = await authService.updateProfile(updates);
    
    if (result.success) {
      setAuthState(authService.getAuthState());
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      return true;
    } else {
      toast({
        title: "Update failed",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
