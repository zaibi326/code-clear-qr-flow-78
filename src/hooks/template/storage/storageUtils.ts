
import { toast } from '@/hooks/use-toast';

const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB limit to stay under localStorage quota
const MAX_TEMPLATE_SIZE = 1 * 1024 * 1024; // 1MB per template
const THUMBNAIL_SIZE = 200 * 1024; // 200KB for thumbnail

export const storageConstants = {
  MAX_STORAGE_SIZE,
  MAX_TEMPLATE_SIZE,
  THUMBNAIL_SIZE
};

// Get user-specific storage key
export const getStorageKey = (userId?: string) => {
  if (!userId) return null;
  return `qr-templates-${userId}`;
};

// Convert File to data URL for storage
export const fileToDataUrl = (file: File): Promise<string> => {
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

// Calculate storage size estimate
export const calculateStorageSize = (templates: any[]) => {
  const jsonString = JSON.stringify(templates.map(template => {
    const { file, ...templateWithoutFile } = template;
    return templateWithoutFile;
  }));
  return new Blob([jsonString]).size;
};
