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
  userRole: string | null;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let authTimeout: NodeJS.Timeout;

    console.log('useAuth: Initializing auth state');

    // Set timeout to prevent infinite loading
    authTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('useAuth: Auth initialization timeout, setting loading to false');
        setLoading(false);
        setError('Authentication timeout - please refresh the page');
      }
    }, 10000); // 10 second timeout

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state change:', event, session?.user?.email);
        
        if (!mounted) return;

        try {
          setSession(session);
          setUser(session?.user ?? null);
          setError(null);
          
          if (session?.user && event !== 'SIGNED_OUT') {
            console.log('useAuth: User authenticated, loading profile');
            // Use setTimeout to avoid potential deadlocks
            setTimeout(async () => {
              if (mounted) {
                try {
                  await loadUserProfile(session.user.id);
                } catch (profileError) {
                  console.error('useAuth: Profile loading error:', profileError);
                  setError('Failed to load user profile');
                }
              }
            }, 0);
          } else {
            console.log('useAuth: User signed out or no session');
            setProfile(null);
            setUserRole(null);
            if (mounted) {
              clearTimeout(authTimeout);
              setLoading(false);
            }
          }
        } catch (error) {
          console.error('useAuth: Error in auth state change handler:', error);
          setError('Authentication error occurred');
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log('useAuth: Checking for existing session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('useAuth: Session error:', error);
          setError('Failed to get session');
          // Clear any invalid tokens
          await supabase.auth.signOut();
        }
        
        if (mounted) {
          console.log('useAuth: Session check complete, session exists:', !!session);
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            try {
              await loadUserProfile(session.user.id);
            } catch (profileError) {
              console.error('useAuth: Initial profile loading error:', profileError);
              setError('Failed to load user profile');
              setLoading(false);
            }
          } else {
            clearTimeout(authTimeout);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('useAuth: Auth initialization error:', error);
        setError('Failed to initialize authentication');
        if (mounted) {
          clearTimeout(authTimeout);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      console.log('useAuth: Cleaning up auth provider');
      mounted = false;
      clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('useAuth: Loading profile for user:', userId);
      
      // Try to get profile from Supabase first
      let userProfile = await supabaseService.getUserProfile(userId);
      
      // If no profile exists in Supabase, load from userProfileService
      if (!userProfile) {
        console.log('useAuth: No Supabase profile found, trying userProfileService');
        userProfile = await userProfileService.loadUserProfile(userId);
      }
      
      if (userProfile) {
        console.log('useAuth: Profile loaded successfully');
        setProfile(userProfile);
      } else {
        console.log('useAuth: No profile found');
      }

      // Load user role with proper error handling
      try {
        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .single();

        if (error) {
          // Check if error is due to no rows returned (PGRST116)
          if (error.code === 'PGRST116') {
            console.log('useAuth: No role found for user, setting default role');
            setUserRole('user');
          } else {
            console.error('useAuth: Error loading user role:', error);
            setUserRole('user'); // Default fallback
          }
        } else if (roleData) {
          console.log('useAuth: User role loaded:', roleData.role);
          setUserRole(roleData.role);
        } else {
          // Fallback to default role
          console.log('useAuth: No role data, setting default');
          setUserRole('user');
        }
      } catch (roleError) {
        console.error('useAuth: Unexpected error loading user role:', roleError);
        setUserRole('user'); // Default fallback
      }
      
    } catch (error) {
      console.error('useAuth: Error loading user profile:', error);
      throw error; // Re-throw to be caught by caller
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('useAuth: Attempting sign in for:', email);
      
      // First test database connection
      try {
        await supabase.from('user_roles').select('count', { count: 'exact', head: true });
        console.log('useAuth: Database connection verified');
      } catch (dbError) {
        console.error('useAuth: Database connection failed:', dbError);
        return { 
          error: { 
            message: 'Unable to connect to the authentication service. Please check your internet connection and try again.' 
          } 
        };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        console.error('useAuth: Sign in error details:', {
          message: error.message,
          status: error.status,
          code: error.name
        });
        
        // Provide more user-friendly error messages
        let friendlyMessage = error.message;
        if (error.message?.includes('Invalid login credentials')) {
          friendlyMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message?.includes('Email not confirmed')) {
          friendlyMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message?.includes('Too many requests')) {
          friendlyMessage = 'Too many login attempts. Please wait a few minutes and try again.';
        } else if (error.message?.includes('Network error') || error.message?.includes('Failed to fetch')) {
          friendlyMessage = 'Network connection error. Please check your internet connection and try again.';
        }
        
        return { error: { ...error, message: friendlyMessage } };
      }
      
      if (data.user) {
        console.log('useAuth: Sign in successful for user:', data.user.id);
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('useAuth: Unexpected sign in error:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error.message?.includes('fetch')) {
        errorMessage = 'Unable to connect to the authentication service. Please check your internet connection and try again.';
      }
      
      return { 
        error: {
          message: errorMessage
        }
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        console.error('useAuth: Sign up error:', error);
        return { error };
      }
      
      return { error: null };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string, company?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('useAuth: Starting registration process for:', email);
      
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
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
        console.error('useAuth: Registration error:', error);
        return false;
      }

      if (data.user) {
        console.log('useAuth: User created successfully:', data.user.id);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          const profileData: Omit<DatabaseUser, 'id'> = {
            email: email.trim().toLowerCase(),
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

          console.log('useAuth: Creating profile with data:', profileData);
          await supabaseService.createUserProfile(profileData, data.user.id);
          console.log('useAuth: Profile created successfully');

          await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: 'user'
            });
          
          await userProfileService.updateProfile({
            name: fullName,
            email: email.trim().toLowerCase(),
            company: company
          });
          
          return true;
        } catch (profileError) {
          console.error('useAuth: Profile creation error:', profileError);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('useAuth: Registration error:', error);
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
        console.error('useAuth: Sign out error:', error);
      }
      
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('useAuth: Unexpected sign out error:', error);
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
      console.error('useAuth: Error updating profile:', error);
    }
  };

  const value = {
    user,
    profile,
    session,
    userRole,
    loading,
    isLoading,
    error,
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
