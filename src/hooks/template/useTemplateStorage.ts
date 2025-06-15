import { useState, useEffect } from 'react';
import { Template } from '@/types/template';

const TEMPLATES_STORAGE_KEY = 'qr-templates';

export const useTemplateStorage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Convert File to data URL for storage
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
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
            previewLength: processedTemplate.preview?.length || 0,
            dataType: processedTemplate.preview?.substring(0, 20) || 'none'
          });
          
          return processedTemplate;
        });
        console.log('Successfully loaded', templatesWithDates.length, 'templates from storage');
        setTemplates(templatesWithDates);
      } catch (error) {
        console.error('Error loading templates from localStorage:', error);
        setTemplates([]);
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
      
      // Convert templates for storage (remove File objects but keep all data URLs)
      const templatesForStorage = templates.map(template => {
        const { file, ...templateWithoutFile } = template;
        
        // Ensure all image URLs are preserved for editing capability
        const storageTemplate = {
          ...templateWithoutFile,
          // Make sure preview data is preserved
          preview: templateWithoutFile.preview,
          template_url: templateWithoutFile.template_url || templateWithoutFile.preview,
          thumbnail_url: templateWithoutFile.thumbnail_url || templateWithoutFile.preview
        };
        
        console.log('Saving template to storage:', template.name, {
          hasPreview: !!storageTemplate.preview,
          hasTemplateUrl: !!storageTemplate.template_url,
          hasThumbnail: !!storageTemplate.thumbnail_url,
          previewLength: storageTemplate.preview?.length || 0
        });
        
        return storageTemplate;
      });
      
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templatesForStorage));
      console.log('Templates saved to localStorage successfully');
    }
  }, [templates, isLoaded]);

  return {
    templates,
    setTemplates,
    isLoaded,
    fileToDataUrl
  };
};
