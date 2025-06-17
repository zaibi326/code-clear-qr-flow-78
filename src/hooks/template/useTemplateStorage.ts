
import { useState, useEffect } from 'react';
import { Template } from '@/types/template';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useSupabaseAuth';

const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB limit to stay under localStorage quota
const MAX_TEMPLATE_SIZE = 1 * 1024 * 1024; // 1MB per template
const THUMBNAIL_SIZE = 200 * 1024; // 200KB for thumbnail

export const useTemplateStorage = () => {
  const { user, loading: authLoading } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get user-specific storage key
  const getStorageKey = (userId?: string) => {
    if (!userId) return null;
    return `qr-templates-${userId}`;
  };

  // Convert File to data URL for storage
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Check file size before processing
      if (file.size > MAX_TEMPLATE_SIZE) {
        console.warn('File too large for localStorage storage:', file.size);
        toast({
          title: "File too large",
          description: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds storage limit. Template will be stored with compressed preview.`,
          variant: "destructive"
        });
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        console.log('File converted to data URL:', {
          originalSize: file.size,
          dataUrlLength: result.length,
          type: file.type
        });
        resolve(result);
      };
      reader.onerror = (error) => {
        console.error('Error converting file to data URL:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  // Create compressed thumbnail for storage
  const createThumbnail = (imageDataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(imageDataUrl);
          return;
        }

        // Calculate thumbnail dimensions (max 400x300)
        const maxWidth = 400;
        const maxHeight = 300;
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get compressed thumbnail
        const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
        console.log('Created thumbnail:', {
          originalSize: imageDataUrl.length,
          thumbnailSize: thumbnail.length,
          compressionRatio: (thumbnail.length / imageDataUrl.length * 100).toFixed(1) + '%'
        });
        
        resolve(thumbnail);
      };
      img.onerror = () => resolve(imageDataUrl);
      img.src = imageDataUrl;
    });
  };

  // Calculate storage size estimate
  const calculateStorageSize = (templates: Template[]) => {
    const jsonString = JSON.stringify(templates.map(template => {
      const { file, ...templateWithoutFile } = template;
      return templateWithoutFile;
    }));
    return new Blob([jsonString]).size;
  };

  // Smart compression that preserves usability
  const compressTemplateForStorage = async (template: Template) => {
    const { file, ...templateWithoutFile } = template;
    
    // Always ensure we have some image data for preview/editing
    let workingImageData = templateWithoutFile.preview || templateWithoutFile.template_url || templateWithoutFile.thumbnail_url;
    
    // If we have a file but no image data, convert file to data URL
    if (!workingImageData && file) {
      try {
        workingImageData = await fileToDataUrl(file);
      } catch (error) {
        console.error('Error converting file for storage:', error);
      }
    }
    
    if (!workingImageData) {
      console.warn('No image data available for template:', template.name);
      return {
        ...templateWithoutFile,
        preview: '',
        template_url: '',
        thumbnail_url: '',
        isCompressed: true,
        compressionLevel: 'no-data'
      };
    }

    // For large images, create thumbnail but keep original structure
    if (workingImageData.length > THUMBNAIL_SIZE) {
      console.log('Creating thumbnail for large template:', template.name);
      try {
        const thumbnail = await createThumbnail(workingImageData);
        return {
          ...templateWithoutFile,
          preview: thumbnail,
          template_url: thumbnail, // Ensure both fields have data
          thumbnail_url: thumbnail,
          isCompressed: true,
          compressionLevel: 'thumbnail',
          originalSize: workingImageData.length
        };
      } catch (error) {
        console.error('Error creating thumbnail:', error);
      }
    }
    
    // For smaller images, keep original
    return {
      ...templateWithoutFile,
      preview: workingImageData,
      template_url: workingImageData,
      thumbnail_url: workingImageData
    };
  };

  // Clear templates when user signs out
  const clearUserData = () => {
    console.log('Clearing user templates data');
    setTemplates([]);
    setIsLoaded(false);
  };

  // Load templates from localStorage for the current user
  const loadUserTemplates = (userId: string) => {
    const storageKey = getStorageKey(userId);
    if (!storageKey) return;

    console.log('Loading templates for user:', userId);
    const savedTemplates = localStorage.getItem(storageKey);
    
    if (savedTemplates) {
      try {
        const parsedTemplates = JSON.parse(savedTemplates);
        // Convert date strings back to Date objects and ensure proper data structure
        const templatesWithDates = parsedTemplates.map((template: any) => {
          const processedTemplate = {
            ...template,
            createdAt: new Date(template.createdAt),
            updatedAt: new Date(template.updatedAt),
          };
          
          // Handle templates and ensure they have usable data
          if (processedTemplate.isCompressed) {
            console.log('Loaded compressed template:', processedTemplate.name, {
              hasPreview: !!processedTemplate.preview,
              hasTemplateUrl: !!processedTemplate.template_url,
              compressionLevel: processedTemplate.compressionLevel,
              originalSize: processedTemplate.originalSize
            });
          } else {
            // Ensure all image fields are available for editing
            if (processedTemplate.preview && !processedTemplate.template_url) {
              processedTemplate.template_url = processedTemplate.preview;
            }
            if (processedTemplate.preview && !processedTemplate.thumbnail_url) {
              processedTemplate.thumbnail_url = processedTemplate.preview;
            }
            
            console.log('Loaded template for editing:', processedTemplate.name, {
              hasPreview: !!processedTemplate.preview,
              hasTemplateUrl: !!processedTemplate.template_url,
              hasThumbnail: !!processedTemplate.thumbnail_url,
              previewLength: processedTemplate.preview?.length || 0
            });
          }
          
          return processedTemplate;
        });
        console.log('Successfully loaded', templatesWithDates.length, 'templates for user:', userId);
        setTemplates(templatesWithDates);
      } catch (error) {
        console.error('Error loading templates from localStorage:', error);
        setTemplates([]);
        toast({
          title: "Storage error",
          description: "Failed to load saved templates. Starting fresh.",
          variant: "destructive"
        });
      }
    } else {
      console.log('No saved templates found for user:', userId);
      setTemplates([]);
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
      console.log('User authenticated, loading templates for:', user.id);
      loadUserTemplates(user.id);
    } else {
      console.log('User not authenticated, clearing templates');
      clearUserData();
      setIsLoaded(true);
    }
  }, [user, authLoading]);

  // Save templates to localStorage for the current user
  useEffect(() => {
    if (!isLoaded || !user?.id || authLoading) {
      return;
    }

    const storageKey = getStorageKey(user.id);
    if (!storageKey) return;

    console.log('Saving', templates.length, 'templates for user:', user.id);
    
    const saveTemplates = async () => {
      try {
        // Convert templates for storage with smart compression
        const templatesForStorage = await Promise.all(
          templates.map(template => compressTemplateForStorage(template))
        );
        
        // Check total storage size
        const storageSize = calculateStorageSize(templatesForStorage);
        console.log('Estimated storage size:', (storageSize / 1024 / 1024).toFixed(2), 'MB');
        
        if (storageSize > MAX_STORAGE_SIZE) {
          console.warn('Storage size exceeds limit, applying additional compression');
          
          // Apply more aggressive compression but still preserve thumbnails
          const aggressivelyCompressed = await Promise.all(
            templatesForStorage.map(async (template) => {
              if (template.preview && template.preview.length > THUMBNAIL_SIZE / 2) {
                try {
                  const smallerThumbnail = await createThumbnail(template.preview);
                  return {
                    ...template,
                    preview: smallerThumbnail,
                    template_url: smallerThumbnail,
                    thumbnail_url: smallerThumbnail,
                    isCompressed: true,
                    compressionLevel: 'aggressive'
                  };
                } catch (error) {
                  console.error('Error in aggressive compression:', error);
                  return template;
                }
              }
              return template;
            })
          );
          
          localStorage.setItem(storageKey, JSON.stringify(aggressivelyCompressed));
          
          toast({
            title: "Storage optimized",
            description: "Templates compressed to fit storage limits. Preview quality reduced but functionality preserved.",
          });
        } else {
          localStorage.setItem(storageKey, JSON.stringify(templatesForStorage));
        }
        
        console.log('Templates saved to localStorage successfully for user:', user.id);
        
      } catch (error) {
        console.error('Error saving templates to localStorage:', error);
        
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          toast({
            title: "Storage full",
            description: "Cannot save more templates. Consider deleting some old templates to free up space.",
            variant: "destructive"
          });
        }
      }
    };

    saveTemplates();
  }, [templates, isLoaded, user, authLoading]);

  return {
    templates,
    setTemplates,
    isLoaded: isLoaded && !authLoading,
    fileToDataUrl,
    userId: user?.id || null
  };
};
