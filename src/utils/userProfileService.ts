import { DatabaseUser } from '@/types/database';

export interface UserProfileUpdate {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  avatar_url?: string;
}

export interface NotificationPreferences {
  email: boolean;
  scan_alerts: boolean;
  weekly_reports: boolean;
  marketing: boolean;
}

export interface DashboardPreferences {
  default_view: 'grid' | 'list';
  items_per_page: number;
}

export class UserProfileService {
  private static instance: UserProfileService;
  private userProfile: DatabaseUser | null = null;

  static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService();
    }
    return UserProfileService.instance;
  }

  async loadUserProfile(userId: string): Promise<DatabaseUser | null> {
    try {
      // Get user data from localStorage to sync with auth service
      const userStr = localStorage.getItem('user');
      let baseUserData = null;
      
      if (userStr) {
        try {
          baseUserData = JSON.parse(userStr);
        } catch (e) {
          console.warn('Failed to parse user data from localStorage');
        }
      }

      // Create mock profile based on auth service data
      const mockProfile: DatabaseUser = {
        id: userId,
        email: baseUserData?.email || 'user@example.com',
        name: baseUserData?.name || 'Demo User',
        company: baseUserData?.company || '',
        phone: '+1-555-0123',
        plan: baseUserData?.plan || 'free',
        subscription_status: 'active',
        created_at: baseUserData?.createdAt ? new Date(baseUserData.createdAt) : new Date('2024-01-01'),
        updated_at: new Date(),
        timezone: 'America/New_York',
        language: 'en',
        preferences: {
          notifications: {
            email: true,
            scan_alerts: true,
            weekly_reports: true,
            marketing: false
          },
          dashboard: {
            default_view: 'grid',
            items_per_page: 20
          }
        },
        usage_stats: {
          qr_codes_created: 156,
          campaigns_created: 23,
          total_scans: 4829,
          storage_used: 52428800 // 50MB
        }
      };

      this.userProfile = mockProfile;
      return mockProfile;
    } catch (error) {
      console.error('Failed to load user profile:', error);
      return null;
    }
  }

  async updateProfile(updates: UserProfileUpdate): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.userProfile) {
        return { success: false, error: 'No user profile loaded' };
      }

      // Validate updates
      if (updates.email && !this.isValidEmail(updates.email)) {
        return { success: false, error: 'Invalid email format' };
      }

      if (updates.phone && !this.isValidPhone(updates.phone)) {
        return { success: false, error: 'Invalid phone format' };
      }

      // Apply updates
      this.userProfile = {
        ...this.userProfile,
        ...updates,
        updated_at: new Date()
      };

      // Sync with localStorage if auth data needs updating
      if (updates.name || updates.email || updates.company) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            const updatedUserData = {
              ...userData,
              ...(updates.name && { name: updates.name }),
              ...(updates.email && { email: updates.email }),
              ...(updates.company && { company: updates.company })
            };
            localStorage.setItem('user', JSON.stringify(updatedUserData));
          } catch (e) {
            console.warn('Failed to update user data in localStorage');
          }
        }
      }

      console.log('Profile updated:', this.userProfile);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  }

  async updateNotificationPreferences(preferences: NotificationPreferences): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.userProfile) {
        return { success: false, error: 'No user profile loaded' };
      }

      this.userProfile.preferences.notifications = preferences;
      this.userProfile.updated_at = new Date();

      console.log('Notification preferences updated:', preferences);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update preferences' };
    }
  }

  async updateDashboardPreferences(preferences: DashboardPreferences): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.userProfile) {
        return { success: false, error: 'No user profile loaded' };
      }

      this.userProfile.preferences.dashboard = preferences;
      this.userProfile.updated_at = new Date();

      console.log('Dashboard preferences updated:', preferences);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update preferences' };
    }
  }

  getUserProfile(): DatabaseUser | null {
    return this.userProfile;
  }

  getUsageStats(): DatabaseUser['usage_stats'] | null {
    return this.userProfile?.usage_stats || null;
  }

  getPlanLimits(): { qr_codes: number; campaigns: number; storage: number } {
    const plan = this.userProfile?.plan || 'free';
    
    switch (plan) {
      case 'free':
        return { qr_codes: 50, campaigns: 5, storage: 100 * 1024 * 1024 }; // 100MB
      case 'pro':
        return { qr_codes: 1000, campaigns: 50, storage: 1024 * 1024 * 1024 }; // 1GB
      case 'enterprise':
        return { qr_codes: -1, campaigns: -1, storage: -1 }; // Unlimited
      default:
        return { qr_codes: 50, campaigns: 5, storage: 100 * 1024 * 1024 };
    }
  }

  isWithinLimits(): { qr_codes: boolean; campaigns: boolean; storage: boolean } {
    const usage = this.getUsageStats();
    const limits = this.getPlanLimits();

    if (!usage) {
      return { qr_codes: true, campaigns: true, storage: true };
    }

    return {
      qr_codes: limits.qr_codes === -1 || usage.qr_codes_created < limits.qr_codes,
      campaigns: limits.campaigns === -1 || usage.campaigns_created < limits.campaigns,
      storage: limits.storage === -1 || usage.storage_used < limits.storage
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  async deleteAccount(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Account deletion requested for user:', this.userProfile?.id);
      this.userProfile = null;
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete account' };
    }
  }

  async exportUserData(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      if (!this.userProfile) {
        return { success: false, error: 'No user profile loaded' };
      }

      const exportData = {
        profile: this.userProfile,
        exported_at: new Date().toISOString(),
        format_version: '1.0'
      };

      return { success: true, data: exportData };
    } catch (error) {
      return { success: false, error: 'Failed to export user data' };
    }
  }
}

export const userProfileService = UserProfileService.getInstance();
