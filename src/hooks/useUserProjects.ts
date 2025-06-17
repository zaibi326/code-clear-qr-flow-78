
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}

export const useUserProjects = () => {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get user-specific storage key
  const getStorageKey = (userId?: string) => {
    if (!userId) return null;
    return `user-projects-${userId}`;
  };

  // Clear projects when user signs out
  const clearUserData = () => {
    console.log('Clearing user projects data');
    setProjects([]);
    setIsLoaded(false);
  };

  // Load projects from localStorage for the current user
  const loadUserProjects = (userId: string) => {
    const storageKey = getStorageKey(userId);
    if (!storageKey) return;

    console.log('Loading projects for user:', userId);
    const savedProjects = localStorage.getItem(storageKey);
    
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        const projectsWithDates = parsedProjects.map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
        }));
        console.log('Successfully loaded', projectsWithDates.length, 'projects for user:', userId);
        setProjects(projectsWithDates);
      } catch (error) {
        console.error('Error loading projects from localStorage:', error);
        setProjects([]);
      }
    } else {
      console.log('No saved projects found for user:', userId);
      setProjects([]);
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
      console.log('User authenticated, loading projects for:', user.id);
      loadUserProjects(user.id);
    } else {
      console.log('User not authenticated, clearing projects');
      clearUserData();
      setIsLoaded(true);
    }
  }, [user, authLoading]);

  // Save projects to localStorage for the current user
  useEffect(() => {
    if (!isLoaded || !user?.id || authLoading) {
      return;
    }

    const storageKey = getStorageKey(user.id);
    if (!storageKey) return;

    console.log('Saving', projects.length, 'projects for user:', user.id);
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(projects));
      console.log('Projects saved to localStorage successfully for user:', user.id);
    } catch (error) {
      console.error('Error saving projects to localStorage:', error);
    }
  }, [projects, isLoaded, user, authLoading]);

  return {
    projects,
    setProjects,
    isLoaded: isLoaded && !authLoading,
    userId: user?.id || null
  };
};
