
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseUser } from '@/types/database';
import { supabaseService } from '@/utils/supabaseService';
import { userProfileService } from '@/utils/userProfileService';

interface AuthContextType {
  user: User | null;
  profile: DatabaseUser | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  register: (fullName: string, email: string, password: string, company?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<DatabaseUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<DatabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'SIGNED_OUT') {
          // Use setTimeout to avoid potential deadlocks
          setTimeout(async () => {
            if (mounted) {
              await loadUserProfile(session.user.id);
            }
          }, 0);
        } else {
          setProfile(null);
          setUserRole(null);
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          // Clear any invalid tokens
          await supabase.auth.signOut();
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await loadUserProfile(session.user.id);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // Try to get profile from Supabase first
      let userProfile = await supabaseService.getUserProfile(userId);
      
      // If no profile exists in Supabase, load from userProfileService
      if (!userProfile) {
        userProfile = await userProfileService.loadUserProfile(userId);
      }
      
      if (userProfile) {
        setProfile(userProfile);
      }

      // Load user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleData) {
        setUserRole(roleData.role);
      } else {
        // Default role for new users
        setUserRole('user');
      }
      
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
      }
      
      return { error };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
      }
      
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string, company?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Starting registration process for:', email);
      
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: fullName,
            company: company || ''
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        return false;
      }

      if (data.user) {
        console.log('User created successfully:', data.user.id);
        
        // Wait a moment for the auth state to settle
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          // Create user profile in Supabase
          const profileData: Omit<DatabaseUser, 'id'> = {
            email,
            name: fullName,
            company: company || '',
            phone: null,
            avatar_url: null,
            plan: 'free' as const,
            subscription_status: 'trial' as const,
            language: 'en',
            timezone: 'UTC',
            preferences: {
              notifications: {
                email: true,
                scan_alerts: true,
                weekly_reports: false,
                marketing: false
              },
              dashboard: {
                default_view: 'grid' as const,
                items_per_page: 10
              }
            },
            usage_stats: {
              qr_codes_created: 0,
              campaigns_created: 0,
              total_scans: 0,
              storage_used: 0
            },
            created_at: new Date(),
            updated_at: new Date(),
            trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            last_login_at: null
          };

          console.log('Creating profile with data:', profileData);
          await supabaseService.createUserProfile(profileData, data.user.id);
          console.log('Profile created successfully');

          // Create default user role
          await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: 'user'
            });
          
          // Also sync with userProfileService for immediate local access
          await userProfileService.updateProfile({
            name: fullName,
            email: email,
            company: company
          });
          
          return true;
        } catch (profileError) {
          console.error('Profile creation error:', profileError);
          // Even if profile creation fails, the user account was created
          // We'll let them proceed and fix the profile later
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      
      // Clear local state
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Unexpected sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<DatabaseUser>) => {
    if (!user) return;
    
    try {
      await supabaseService.updateUserProfile(user.id, updates);
      if (profile) {
        setProfile({ ...profile, ...updates });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const value = {
    user,
    profile,
    session,
    userRole,
    loading,
    isLoading,
    signIn,
    signUp,
    register,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
