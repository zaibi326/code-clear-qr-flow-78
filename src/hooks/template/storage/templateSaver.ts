
import { Template } from '@/types/template';
import { getStorageKey, calculateStorageSize, storageConstants } from './storageUtils';
import { compressTemplateForStorage } from './templateCompression';
import { createThumbnail } from './imageCompression';
import { toast } from '@/hooks/use-toast';

const { MAX_STORAGE_SIZE, THUMBNAIL_SIZE } = storageConstants;

// Save templates to localStorage for the current user
export const saveUserTemplates = async (templates: Template[], userId: string) => {
  const storageKey = getStorageKey(userId);
  if (!storageKey) return;

  console.log('Saving', templates.length, 'templates for user:', userId);
  
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
    
    console.log('Templates saved to localStorage successfully for user:', userId);
    
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
