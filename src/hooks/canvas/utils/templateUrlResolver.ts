
import { Template } from '@/types/template';
import { fileUploadService } from '@/services/fileUploadService';

export const resolveTemplateImageUrl = async (template: Template): Promise<string | null> => {
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

  // If no HTTP URLs found, try to convert data URLs to public URLs using correct bucket
  for (const url of urls) {
    if (url && url.startsWith('data:')) {
      console.log('Converting data URL to public URL for PDF.co compatibility');
      
      try {
        const uploadResult = await fileUploadService.uploadDataUrlToStorage(
          url,
          `${template.name || 'template'}.pdf`
        );
        
        if (uploadResult.success && uploadResult.publicUrl) {
          console.log('Successfully converted data URL to public URL:', uploadResult.publicUrl);
          return uploadResult.publicUrl;
        }
      } catch (error) {
        console.error('Failed to convert data URL to public URL:', error);
      }
    }
  }

  console.warn('No valid image source found and could not convert data URLs');
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

export const validatePDFUrl = async (url: string | null | undefined): Promise<{ 
  isValid: boolean; 
  error?: string; 
  correctedUrl?: string;
}> => {
  if (!url) {
    return { isValid: false, error: 'No URL provided' };
  }

  if (typeof url !== 'string') {
    return { isValid: false, error: 'URL must be a string' };
  }

  // If it's already a valid HTTP/HTTPS URL, return it
  if (isValidHttpUrl(url)) {
    if (url.includes(' ')) {
      const encodedUrl = encodeURI(url);
      return { 
        isValid: true, 
        correctedUrl: encodedUrl,
        error: 'URL contained spaces and was automatically encoded' 
      };
    }
    return { isValid: true, correctedUrl: url };
  }

  // If it's a data URL, try to convert it to a public URL
  if (url.startsWith('data:')) {
    try {
      console.log('Attempting to convert data URL to public URL');
      const uploadResult = await fileUploadService.uploadDataUrlToStorage(url, 'document.pdf');
      
      if (uploadResult.success && uploadResult.publicUrl) {
        return {
          isValid: true,
          correctedUrl: uploadResult.publicUrl,
          error: 'Data URL was converted to public HTTP/HTTPS URL'
        };
      } else {
        return {
          isValid: false,
          error: `Failed to convert data URL to public URL: ${uploadResult.error}`
        };
      }
    } catch (error: any) {
      return {
        isValid: false,
        error: `Failed to convert data URL: ${error.message}`
      };
    }
  }

  // Check for blob URLs
  if (url.startsWith('blob:')) {
    return { 
      isValid: false, 
      error: 'Blob URLs are not supported by PDF.co API. Please upload to a public HTTP/HTTPS URL.' 
    };
  }

  return { 
    isValid: false, 
    error: 'URL must be a valid HTTP or HTTPS URL, or a data URL that can be converted' 
  };
};

export const generatePublicUrl = async (file: File): Promise<string> => {
  try {
    // Convert file to data URL first
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Upload to get public URL
    const uploadResult = await fileUploadService.uploadDataUrlToStorage(dataUrl, file.name);
    
    if (uploadResult.success && uploadResult.publicUrl) {
      return uploadResult.publicUrl;
    } else {
      throw new Error(uploadResult.error || 'Failed to generate public URL');
    }
  } catch (error: any) {
    throw new Error(`File upload failed: ${error.message}`);
  }
};
