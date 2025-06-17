import { Template } from '@/types/template';
import { fileToDataUrl, storageConstants } from './storageUtils';
import { createThumbnail } from './imageCompression';

const { THUMBNAIL_SIZE } = storageConstants;

// Smart compression that preserves usability
export const compressTemplateForStorage = async (template: Template) => {
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
