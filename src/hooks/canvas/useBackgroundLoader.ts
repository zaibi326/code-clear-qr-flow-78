
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
    console.log('Template data available:', {
      hasPreview: !!template.preview,
      hasTemplateUrl: !!template.template_url,
      hasThumbnailUrl: !!template.thumbnail_url,
      previewType: template.preview?.substring(0, 30) + '...'
    });
    
    try {
      let imageUrl = '';

      // Handle different image sources with priority order
      if (template.preview) {
        console.log('Using preview URL/data');
        imageUrl = template.preview;
      } else if (template.template_url) {
        console.log('Using template URL');
        imageUrl = template.template_url;
      } else if (template.thumbnail_url) {
        console.log('Using thumbnail URL');
        imageUrl = template.thumbnail_url;
      } else {
        console.log('No image source available, using white background');
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
        return true;
      }

      if (imageUrl && !canvas.disposed) {
        console.log('Loading background image from source, URL length:', imageUrl.length);
        
        // Create image with better error handling
        const img = await new Promise<FabricImage>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Image loading timeout after 15 seconds'));
          }, 15000); // Increased timeout

          FabricImage.fromURL(imageUrl, {
            crossOrigin: 'anonymous'
          }, (fabricImg, isError) => {
            clearTimeout(timeout);
            if (isError || !fabricImg) {
              console.error('Fabric image loading failed:', isError);
              reject(new Error(`Failed to load image: ${isError || 'Unknown error'}`));
            } else {
              console.log('Fabric image loaded successfully:', fabricImg.width, 'x', fabricImg.height);
              resolve(fabricImg);
            }
          });
        });
        
        if (!canvas.disposed && img) {
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();
          const imgWidth = img.width || canvasWidth;
          const imgHeight = img.height || canvasHeight;
          
          console.log('Scaling image to fit canvas:', {
            canvasSize: `${canvasWidth}x${canvasHeight}`,
            imageSize: `${imgWidth}x${imgHeight}`
          });
          
          // Scale to fit canvas while maintaining aspect ratio
          const scaleX = canvasWidth / imgWidth;
          const scaleY = canvasHeight / imgHeight;
          const scale = Math.min(scaleX, scaleY, 1); // Don't scale up

          img.set({
            left: (canvasWidth - imgWidth * scale) / 2,
            top: (canvasHeight - imgHeight * scale) / 2,
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            evented: false,
            excludeFromExport: false,
            name: 'background-template'
          });

          canvas.add(img);
          canvas.sendObjectToBack(img);
          canvas.renderAll();
          
          console.log('Background template loaded and rendered successfully');
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
