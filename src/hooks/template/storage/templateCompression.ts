import { Template } from '@/types/template';
import { fileToDataUrl, storageConstants } from './storageUtils';
import { createThumbnail } from './imageCompression';

const { THUMBNAIL_SIZE } = storageConstants;

// Smart compression that preserves usability, especially for PDFs
export const compressTemplateForStorage = async (template: Template) => {
  const { file, ...templateWithoutFile } = template;
  
  // For PDF files, always try to preserve the original file data for editing
  if (file && file.type === 'application/pdf') {
    try {
      const pdfDataUrl = await fileToDataUrl(file);
      console.log('Converting PDF to data URL for storage, size:', pdfDataUrl.length);
      
      // For PDFs, we need to keep the full data for editing capabilities
      // Only compress if the PDF is extremely large (over 10MB as data URL)
      const maxPdfSize = 10 * 1024 * 1024; // 10MB in characters (roughly)
      
      if (pdfDataUrl.length > maxPdfSize) {
        console.log('PDF too large, creating thumbnail fallback');
        const thumbnail = await createThumbnail(pdfDataUrl);
        return {
          ...templateWithoutFile,
          preview: thumbnail,
          template_url: pdfDataUrl, // Keep original for editing
          thumbnail_url: thumbnail,
          isCompressed: true,
          compressionLevel: 'pdf-thumbnail',
          originalSize: pdfDataUrl.length,
          isPdf: true
        };
      }
      
      // For reasonably sized PDFs, keep the full data
      return {
        ...templateWithoutFile,
        preview: pdfDataUrl,
        template_url: pdfDataUrl,
        thumbnail_url: pdfDataUrl,
        isPdf: true,
        originalSize: pdfDataUrl.length
      };
    } catch (error) {
      console.error('Error processing PDF for storage:', error);
      return {
        ...templateWithoutFile,
        preview: '',
        template_url: '',
        thumbnail_url: '',
        isCompressed: true,
        compressionLevel: 'pdf-error',
        isPdf: true
      };
    }
  }
  
  // Existing logic for non-PDF files
  let workingImageData = templateWithoutFile.preview || templateWithoutFile.template_url || templateWithoutFile.thumbnail_url;
  
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

  if (workingImageData.length > THUMBNAIL_SIZE) {
    console.log('Creating thumbnail for large template:', template.name);
    try {
      const thumbnail = await createThumbnail(workingImageData);
      return {
        ...templateWithoutFile,
        preview: thumbnail,
        template_url: thumbnail,
        thumbnail_url: thumbnail,
        isCompressed: true,
        compressionLevel: 'thumbnail',
        originalSize: workingImageData.length
      };
    } catch (error) {
      console.error('Error creating thumbnail:', error);
    }
  }
  
  return {
    ...templateWithoutFile,
    preview: workingImageData,
    template_url: workingImageData,
    thumbnail_url: workingImageData
  };
};
