
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  type: 'single' | 'bulk';
  createdAt: Date;
  updatedAt: Date;
  startDate?: Date;
  endDate?: Date;
  targetAudience?: string;
  budget?: number;
  expectedScans?: number;
  settings?: any;
}

export const useUserCampaigns = () => {
  const { user, loading: authLoading } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get user-specific storage key
  const getStorageKey = (userId?: string) => {
    if (!userId) return null;
    return `user-campaigns-${userId}`;
  };

  // Clear campaigns when user signs out
  const clearUserData = () => {
    console.log('Clearing user campaigns data');
    setCampaigns([]);
    setIsLoaded(false);
  };

  // Load campaigns from localStorage for the current user
  const loadUserCampaigns = (userId: string) => {
    const storageKey = getStorageKey(userId);
    if (!storageKey) return;

    console.log('Loading campaigns for user:', userId);
    const savedCampaigns = localStorage.getItem(storageKey);
    
    if (savedCampaigns) {
      try {
        const parsedCampaigns = JSON.parse(savedCampaigns);
        const campaignsWithDates = parsedCampaigns.map((campaign: any) => ({
          ...campaign,
          createdAt: new Date(campaign.createdAt),
          updatedAt: new Date(campaign.updatedAt),
          startDate: campaign.startDate ? new Date(campaign.startDate) : undefined,
          endDate: campaign.endDate ? new Date(campaign.endDate) : undefined,
        }));
        console.log('Successfully loaded', campaignsWithDates.length, 'campaigns for user:', userId);
        setCampaigns(campaignsWithDates);
      } catch (error) {
        console.error('Error loading campaigns from localStorage:', error);
        setCampaigns([]);
      }
    } else {
      console.log('No saved campaigns found for user:', userId);
      setCampaigns([]);
    }
    setIsLoaded(true);
  };

  // Handle user authentication changes
  useEffect(() => {
    if (authLoading) {
      console.log('Authentication still loading...');
      return;
    }

    if (user?.id) {
      console.log('User authenticated, loading campaigns for:', user.id);
      loadUserCampaigns(user.id);
    } else {
      console.log('User not authenticated, clearing campaigns');
      clearUserData();
      setIsLoaded(true);
    }
  }, [user, authLoading]);

  // Save campaigns to localStorage for the current user
  useEffect(() => {
    if (!isLoaded || !user?.id || authLoading) {
      return;
    }

    const storageKey = getStorageKey(user.id);
    if (!storageKey) return;

    console.log('Saving', campaigns.length, 'campaigns for user:', user.id);
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(campaigns));
      console.log('Campaigns saved to localStorage successfully for user:', user.id);
    } catch (error) {
      console.error('Error saving campaigns to localStorage:', error);
    }
  }, [campaigns, isLoaded, user, authLoading]);

  return {
    campaigns,
    setCampaigns,
    isLoaded: isLoaded && !authLoading,
    userId: user?.id || null
  };
};
