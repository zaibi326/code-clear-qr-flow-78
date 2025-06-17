import { useState, useEffect } from 'react';
import { Template } from '@/types/template';
import { toast } from '@/hooks/use-toast';

const TEMPLATES_STORAGE_KEY = 'qr-templates';
const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB limit to stay under localStorage quota
const MAX_TEMPLATE_SIZE = 1 * 1024 * 1024; // 1MB per template

export const useTemplateStorage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Convert File to data URL for storage
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Check file size before processing
      if (file.size > MAX_TEMPLATE_SIZE) {
        console.warn('File too large for localStorage storage:', file.size);
        toast({
          title: "File too large",
          description: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds storage limit. Template will be stored without preview.`,
          variant: "destructive"
        });
        resolve(''); // Return empty string for oversized files
        return;
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

  // Calculate storage size estimate
  const calculateStorageSize = (templates: Template[]) => {
    const jsonString = JSON.stringify(templates.map(template => {
      const { file, ...templateWithoutFile } = template;
      return {
        ...templateWithoutFile,
        preview: templateWithoutFile.preview,
        template_url: templateWithoutFile.template_url || templateWithoutFile.preview,
        thumbnail_url: templateWithoutFile.thumbnail_url || templateWithoutFile.preview
      };
    }));
    return new Blob([jsonString]).size;
  };

  // Compress template data for storage
  const compressTemplateForStorage = (template: Template) => {
    const { file, ...templateWithoutFile } = template;
    
    // For large templates, remove preview data but keep metadata
    if (templateWithoutFile.preview && templateWithoutFile.preview.length > MAX_TEMPLATE_SIZE) {
      console.log('Compressing large template:', template.name);
      return {
        ...templateWithoutFile,
        preview: '', // Remove large preview
        template_url: '', // Remove large template_url
        thumbnail_url: '', // Remove large thumbnail
        isCompressed: true, // Flag to indicate compression
        originalSize: templateWithoutFile.preview.length
      };
    }
    
    return {
      ...templateWithoutFile,
      preview: templateWithoutFile.preview,
      template_url: templateWithoutFile.template_url || templateWithoutFile.preview,
      thumbnail_url: templateWithoutFile.thumbnail_url || templateWithoutFile.preview
    };
  };

  // Load templates from localStorage on component mount
  useEffect(() => {
    console.log('Loading templates from localStorage...');
    const savedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
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
          
          // Handle compressed templates
          if (processedTemplate.isCompressed) {
            console.log('Loaded compressed template:', processedTemplate.name, {
              originalSize: processedTemplate.originalSize,
              wasCompressed: true
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
        console.log('Successfully loaded', templatesWithDates.length, 'templates from storage');
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
      console.log('No saved templates found in localStorage');
    }
    setIsLoaded(true);
  }, []);

  // Save templates to localStorage whenever templates state changes (but only after initial load)
  useEffect(() => {
    if (isLoaded && templates.length >= 0) {
      console.log('Saving', templates.length, 'templates to localStorage');
      
      try {
        // Convert templates for storage with compression
        const templatesForStorage = templates.map(compressTemplateForStorage);
        
        // Check total storage size
        const storageSize = calculateStorageSize(templatesForStorage);
        console.log('Estimated storage size:', (storageSize / 1024 / 1024).toFixed(2), 'MB');
        
        if (storageSize > MAX_STORAGE_SIZE) {
          console.warn('Storage size exceeds limit, applying additional compression');
          
          // Apply more aggressive compression
          const compressedTemplates = templatesForStorage.map(template => ({
            ...template,
            preview: template.preview ? '' : template.preview, // Remove all previews
            template_url: '',
            thumbnail_url: '',
            isCompressed: true,
            compressionLevel: 'aggressive'
          }));
          
          localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(compressedTemplates));
          
          toast({
            title: "Storage optimized",
            description: "Templates compressed to fit storage limits. Some previews may not be available.",
          });
        } else {
          localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templatesForStorage));
        }
        
        console.log('Templates saved to localStorage successfully');
        
      } catch (error) {
        console.error('Error saving templates to localStorage:', error);
        
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          toast({
            title: "Storage full",
            description: "Cannot save more templates. Consider deleting some old templates to free up space.",
            variant: "destructive"
          });
          
          // Try to save with maximum compression
          try {
            const minimalTemplates = templates.map(template => {
              const { file, preview, template_url, thumbnail_url, editable_json, ...minimal } = template;
              return {
                ...minimal,
                isCompressed: true,
                compressionLevel: 'maximum'
              };
            });
            
            localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(minimalTemplates));
            
            toast({
              title: "Templates saved with minimal data",
              description: "Due to storage limits, only basic template information was saved.",
            });
          } catch (finalError) {
            console.error('Failed to save even compressed templates:', finalError);
            toast({
              title: "Cannot save templates",
              description: "Storage is completely full. Please delete some templates.",
              variant: "destructive"
            });
          }
        }
      }
    }
  }, [templates, isLoaded]);

  return {
    templates,
    setTemplates,
    isLoaded,
    fileToDataUrl
  };
};
