
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
    
    try {
      let imageUrl = '';

      // Handle different file sources
      if (template.file && template.file instanceof File) {
        console.log('Loading template file:', template.file.name, template.file.type);
        
        if (template.file.type === 'application/pdf') {
          // Create PDF placeholder
          console.log('PDF template detected - creating placeholder');
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = 800;
          tempCanvas.height = 600;
          const ctx = tempCanvas.getContext('2d');
          
          if (ctx) {
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, 800, 600);
            ctx.strokeStyle = '#dee2e6';
            ctx.lineWidth = 2;
            ctx.strokeRect(10, 10, 780, 580);
            ctx.fillStyle = '#dc3545';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('📄 PDF Template', 400, 280);
            ctx.fillStyle = '#6c757d';
            ctx.font = '18px Arial';
            ctx.fillText('Ready for editing and customization', 400, 320);
          }
          
          imageUrl = tempCanvas.toDataURL();
        } else if (template.file.type.startsWith('image/')) {
          console.log('Image template detected');
          imageUrl = URL.createObjectURL(template.file);
        }
      } else if (template.preview) {
        console.log('Loading from preview URL');
        imageUrl = template.preview;
      } else if (template.template_url) {
        console.log('Loading from template URL');
        imageUrl = template.template_url;
      } else if (template.thumbnail_url) {
        console.log('Loading from thumbnail URL');
        imageUrl = template.thumbnail_url;
      }

      if (imageUrl && !canvas.disposed) {
        console.log('Loading background image from URL');
        
        const img = await FabricImage.fromURL(imageUrl, {
          crossOrigin: 'anonymous'
        });
        
        if (!canvas.disposed && img) {
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();
          const imgWidth = img.width || canvasWidth;
          const imgHeight = img.height || canvasHeight;
          
          const scaleX = canvasWidth / imgWidth;
          const scaleY = canvasHeight / imgHeight;
          const scale = Math.min(scaleX, scaleY);

          img.set({
            left: (canvasWidth - imgWidth * scale) / 2,
            top: (canvasHeight - imgHeight * scale) / 2,
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            evented: false,
            excludeFromExport: false,
          });

          canvas.add(img);
          canvas.sendObjectToBack(img);
          canvas.renderAll();
          
          console.log('Background template loaded successfully');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error loading background template:', error);
      return false;
    }
  }, []);

  return { loadBackgroundTemplate };
};
