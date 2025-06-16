
import { useCallback } from 'react';
import { Canvas, FabricImage } from 'fabric';
import { Template } from '@/types/template';

export const useBackgroundLoader = () => {
  const loadBackgroundTemplate = useCallback(async (canvas: Canvas, template: Template): Promise<boolean> => {
    if (!canvas || canvas.disposed) {
      console.log('Canvas not available for background loading');
      return false;
    }

    console.log('Loading background template:', template.name);
    console.log('Template file info:', {
      hasFile: !!template.file,
      fileType: template.file?.type,
      fileSize: template.file?.size,
      hasPreview: !!template.preview,
      hasTemplateUrl: !!template.template_url,
      hasThumbnailUrl: !!template.thumbnail_url,
      previewLength: template.preview?.length || 0
    });
    
    try {
      let imageUrl = '';

      // Priority order: preview (data URL) > template_url > thumbnail_url
      if (template.preview && template.preview.startsWith('data:')) {
        console.log('Using preview data URL for background');
        imageUrl = template.preview;
      } else if (template.template_url && template.template_url.startsWith('data:')) {
        console.log('Using template_url data URL for background');
        imageUrl = template.template_url;
      } else if (template.preview) {
        console.log('Using preview URL for background');
        imageUrl = template.preview;
      } else if (template.template_url) {
        console.log('Using template_url for background');
        imageUrl = template.template_url;
      } else if (template.thumbnail_url) {
        console.log('Using thumbnail_url for background');
        imageUrl = template.thumbnail_url;
      } else {
        console.warn('No valid image source found, using white background');
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
        return true;
      }

      if (imageUrl && !canvas.disposed) {
        console.log('Loading background image:', {
          isDataUrl: imageUrl.startsWith('data:'),
          urlLength: imageUrl.length,
          mimeType: imageUrl.startsWith('data:') ? imageUrl.split(';')[0] : 'external',
          isPNG: imageUrl.includes('data:image/png'),
          isJPG: imageUrl.includes('data:image/jpeg') || imageUrl.includes('data:image/jpg'),
          isPDF: imageUrl.includes('data:application/pdf')
        });
        
        // Clear any existing background objects first
        const existingBackground = canvas.getObjects().find(obj => (obj as any).isBackgroundTemplate);
        if (existingBackground) {
          console.log('Removing existing background');
          canvas.remove(existingBackground);
        }
        
        // Handle PDF files - convert to image first
        if (imageUrl.includes('data:application/pdf')) {
          console.log('PDF detected - converting to image');
          try {
            imageUrl = await convertPdfToImage(imageUrl);
            console.log('PDF converted to image successfully');
          } catch (pdfError) {
            console.warn('PDF conversion failed:', pdfError);
            // Set white background as fallback for PDFs
            canvas.backgroundColor = '#ffffff';
            canvas.renderAll();
            return false;
          }
        }
        
        // Create Fabric image with improved error handling
        const img = await new Promise<FabricImage>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Image loading timeout after 60 seconds'));
          }, 60000);

          try {
            console.log('Creating Fabric image from URL...');
            FabricImage.fromURL(imageUrl, {
              crossOrigin: 'anonymous'
            }).then((fabricImg) => {
              clearTimeout(timeout);
              
              if (!fabricImg) {
                console.error('Fabric image loading failed: No image returned');
                reject(new Error('Failed to load image: No image returned'));
                return;
              }
              
              console.log('Fabric image loaded successfully:', {
                width: fabricImg.width,
                height: fabricImg.height,
                type: typeof fabricImg,
                hasElement: !!fabricImg.getElement()
              });
              resolve(fabricImg);
            }).catch((error) => {
              clearTimeout(timeout);
              console.error('Fabric image loading failed:', error);
              reject(new Error(`Failed to load image: ${error.message || 'Unknown error'}`));
            });
          } catch (syncError) {
            clearTimeout(timeout);
            console.error('Synchronous error during image loading:', syncError);
            reject(syncError);
          }
        });
        
        if (!canvas.disposed && img) {
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();
          const imgWidth = img.width || canvasWidth;
          const imgHeight = img.height || canvasHeight;
          
          console.log('Fitting image to canvas:', {
            canvasSize: `${canvasWidth}x${canvasHeight}`,
            imageSize: `${imgWidth}x${imgHeight}`
          });
          
          // Calculate scale to fit the image to fill the entire canvas (cover mode)
          const scaleX = canvasWidth / imgWidth;
          const scaleY = canvasHeight / imgHeight;
          
          // Use the larger scale to ensure the image covers the entire canvas without white space
          const scale = Math.max(scaleX, scaleY);
          
          // Calculate position to center the scaled image
          const scaledWidth = imgWidth * scale;
          const scaledHeight = imgHeight * scale;
          const left = (canvasWidth - scaledWidth) / 2;
          const top = (canvasHeight - scaledHeight) / 2;

          img.set({
            left: left,
            top: top,
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            evented: false,
            excludeFromExport: false,
            originX: 'left',
            originY: 'top'
          });

          // Add custom data to identify background objects
          (img as any).isBackgroundTemplate = true;

          canvas.add(img);
          canvas.sendObjectToBack(img);
          canvas.renderAll();
          
          console.log('Background template loaded and fitted to canvas successfully');
          return true;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error loading background template:', error);
      // Set white background as fallback
      if (!canvas.disposed) {
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
      }
      return false;
    }
  }, []);

  return { loadBackgroundTemplate };
};

// Helper function to convert PDF data URL to image
const convertPdfToImage = async (pdfDataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a temporary canvas to render the PDF
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Set canvas size
      canvas.width = 800;
      canvas.height = 600;
      
      // Fill with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add text indicating PDF conversion
      ctx.fillStyle = '#666666';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PDF Document', canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = '16px Arial';
      ctx.fillText('Click to edit and add content', canvas.width / 2, canvas.height / 2 + 20);
      
      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL('image/png');
      resolve(imageDataUrl);
    } catch (error) {
      reject(error);
    }
  });
};
