
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
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
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
        const templatesWithDates = parsedTemplates.map((template: any) => ({
          ...template,
          createdAt: new Date(template.createdAt),
          updatedAt: new Date(template.updatedAt),
          // Ensure preview exists for editing
          preview: template.preview || template.template_url || template.thumbnail_url
        }));
        console.log('Loaded templates:', templatesWithDates);
        setTemplates(templatesWithDates);
      } catch (error) {
        console.error('Error loading templates from localStorage:', error);
        setTemplates([]);
      }
    } else {
      console.log('No saved templates found');
    }
    setIsLoaded(true);
  }, []);

  // Save templates to localStorage whenever templates state changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      console.log('Saving templates to localStorage:', templates);
      // Convert templates for storage (remove File objects)
      const templatesForStorage = templates.map(template => {
        const { file, ...templateWithoutFile } = template;
        return templateWithoutFile;
      });
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templatesForStorage));
    }
  }, [templates, isLoaded]);

  return {
    templates,
    setTemplates,
    isLoaded,
    fileToDataUrl
  };
};
