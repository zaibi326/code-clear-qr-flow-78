
import { useState, useEffect } from 'react';
import { Template } from '@/types/template';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { fileToDataUrl } from './storage/storageUtils';
import { loadUserTemplates } from './storage/templateLoader';
import { saveUserTemplates } from './storage/templateSaver';

export const useTemplateStorage = () => {
  const { user, loading: authLoading } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Clear templates when user signs out
  const clearUserData = () => {
    console.log('Clearing user templates data');
    setTemplates([]);
    setIsLoaded(false);
  };

  // Handle user authentication changes
  useEffect(() => {
    if (authLoading) {
      console.log('Authentication still loading...');
      return;
    }

    if (user?.id) {
      console.log('User authenticated, loading templates for:', user.id);
      const userTemplates = loadUserTemplates(user.id);
      setTemplates(userTemplates);
    } else {
      console.log('User not authenticated, clearing templates');
      clearUserData();
    }
    setIsLoaded(true);
  }, [user, authLoading]);

  // Save templates to localStorage for the current user
  useEffect(() => {
    if (!isLoaded || !user?.id || authLoading) {
      return;
    }

    saveUserTemplates(templates, user.id);
  }, [templates, isLoaded, user, authLoading]);

  return {
    templates,
    setTemplates,
    isLoaded: isLoaded && !authLoading,
    fileToDataUrl,
    userId: user?.id || null
  };
};
