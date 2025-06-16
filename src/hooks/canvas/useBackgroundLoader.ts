
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
    console.log('Template image sources available:', {
      hasPreview: !!template.preview,
      hasTemplateUrl: !!template.template_url,
      hasThumbnailUrl: !!template.thumbnail_url,
      previewType: template.preview?.substring(0, 30) + '...',
      templateUrlType: template.template_url?.substring(0, 30) + '...'
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
        console.log('Loading background image, source type:', {
          isDataUrl: imageUrl.startsWith('data:'),
          urlLength: imageUrl.length,
          mimeType: imageUrl.startsWith('data:') ? imageUrl.split(';')[0] : 'external'
        });
        
        // Clear any existing background objects first
        const existingBackground = canvas.getObjects().find(obj => (obj as any).isBackgroundTemplate);
        if (existingBackground) {
          canvas.remove(existingBackground);
        }
        
        // Create image with proper error handling
        const img = await new Promise<FabricImage>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Image loading timeout after 30 seconds'));
          }, 30000);

          try {
            // Use the static fromURL method properly
            FabricImage.fromURL(imageUrl).then((fabricImg) => {
              clearTimeout(timeout);
              
              if (!fabricImg) {
                console.error('Fabric image loading failed: No image returned');
                reject(new Error('Failed to load image: No image returned'));
                return;
              }
              
              console.log('Fabric image loaded successfully:', {
                width: fabricImg.width,
                height: fabricImg.height,
                type: typeof fabricImg
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
          
          console.log('Scaling and positioning background image:', {
            canvasSize: `${canvasWidth}x${canvasHeight}`,
            imageSize: `${imgWidth}x${imgHeight}`
          });
          
          // Scale to fit canvas while maintaining aspect ratio
          const scaleX = canvasWidth / imgWidth;
          const scaleY = canvasHeight / imgHeight;
          const scale = Math.min(scaleX, scaleY, 1);

          img.set({
            left: (canvasWidth - imgWidth * scale) / 2,
            top: (canvasHeight - imgHeight * scale) / 2,
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            evented: false,
            excludeFromExport: false
          });

          // Add custom data to identify background objects
          (img as any).isBackgroundTemplate = true;

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
