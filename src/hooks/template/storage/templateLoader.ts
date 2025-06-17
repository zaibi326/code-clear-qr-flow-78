
import { Template } from '@/types/template';
import { getStorageKey } from './storageUtils';
import { toast } from '@/hooks/use-toast';

// Load templates from localStorage for the current user
export const loadUserTemplates = (userId: string): Template[] => {
  const storageKey = getStorageKey(userId);
  if (!storageKey) return [];

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
      return templatesWithDates;
    } catch (error) {
      console.error('Error loading templates from localStorage:', error);
      toast({
        title: "Storage error",
        description: "Failed to load saved templates. Starting fresh.",
        variant: "destructive"
      });
      return [];
    }
  } else {
    console.log('No saved templates found for user:', userId);
    return [];
  }
};
