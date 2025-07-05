
import { Template } from '@/types/template';

export const resolveTemplateImageUrl = (template: Template): string | null => {
  console.log('Template file info:', {
    hasFile: !!template.file,
    fileType: template.file?.type,
    fileSize: template.file?.size,
    hasPreview: !!template.preview,
    hasTemplateUrl: !!template.template_url,
    hasThumbnailUrl: !!template.thumbnail_url,
    previewLength: template.preview?.length || 0
  });

  // Priority order: template_url (if HTTP) > preview (if HTTP) > thumbnail_url
  const urls = [
    template.template_url,
    template.preview,
    template.thumbnail_url
  ].filter(Boolean);

  for (const url of urls) {
    if (isValidHttpUrl(url)) {
      console.log('Using valid HTTP URL:', url.substring(0, 100) + '...');
      return url;
    }
  }

  // If no HTTP URLs found, check for data URLs as fallback
  if (template.preview && template.preview.startsWith('data:')) {
    console.log('Using preview data URL for background (not suitable for PDF.co API)');
    return template.preview;
  } else if (template.template_url && template.template_url.startsWith('data:')) {
    console.log('Using template_url data URL for background (not suitable for PDF.co API)');
    return template.template_url;
  }

  console.warn('No valid image source found');
  return null;
};

export const isValidHttpUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const validatePDFUrl = (url: string | null | undefined): { 
  isValid: boolean; 
  error?: string; 
  url?: string;
} => {
  if (!url) {
    return { isValid: false, error: 'No URL provided' };
  }

  if (typeof url !== 'string') {
    return { isValid: false, error: 'URL must be a string' };
  }

  // Check if it's a data URL
  if (url.startsWith('data:')) {
    return { 
      isValid: false, 
      error: 'Data URLs are not supported by PDF.co API. Please upload to a public HTTP/HTTPS URL.' 
    };
  }

  // Check if it's a blob URL
  if (url.startsWith('blob:')) {
    return { 
      isValid: false, 
      error: 'Blob URLs are not supported by PDF.co API. Please upload to a public HTTP/HTTPS URL.' 
    };
  }

  // Validate HTTP/HTTPS URL format
  if (!isValidHttpUrl(url)) {
    return { 
      isValid: false, 
      error: 'URL must be a valid HTTP or HTTPS URL' 
    };
  }

  // Check for common URL issues
  if (url.includes(' ')) {
    const encodedUrl = encodeURI(url);
    return { 
      isValid: true, 
      url: encodedUrl,
      error: 'URL contained spaces and was automatically encoded' 
    };
  }

  return { isValid: true, url };
};

export const generatePublicUrl = async (file: File): Promise<string> => {
  // This would integrate with your storage service
  // For now, we'll return a placeholder that shows the proper format
  throw new Error('File upload to public storage not implemented. Please upload your file to a public HTTP/HTTPS URL manually.');
};
