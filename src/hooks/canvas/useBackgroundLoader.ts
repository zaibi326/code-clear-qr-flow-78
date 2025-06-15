
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

      // Handle different file sources with priority order
      if (template.file && template.file instanceof File) {
        console.log('Loading template file:', template.file.name, template.file.type, 'Size:', template.file.size);
        
        if (template.file.type === 'application/pdf') {
          // Create PDF placeholder with better styling
          console.log('PDF template detected - creating placeholder');
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = 800;
          tempCanvas.height = 600;
          const ctx = tempCanvas.getContext('2d');
          
          if (ctx) {
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, 600);
            gradient.addColorStop(0, '#f8fafc');
            gradient.addColorStop(1, '#e2e8f0');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 800, 600);
            
            // Add border
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2;
            ctx.strokeRect(10, 10, 780, 580);
            
            // Add PDF icon and text
            ctx.fillStyle = '#dc2626';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('📄', 400, 250);
            
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 24px Arial';
            ctx.fillText('PDF Template', 400, 300);
            
            ctx.fillStyle = '#64748b';
            ctx.font = '16px Arial';
            ctx.fillText('Ready for editing and customization', 400, 330);
            ctx.fillText(`File: ${template.file.name}`, 400, 360);
          }
          
          imageUrl = tempCanvas.toDataURL('image/png');
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
        console.log('Loading background image from URL:', imageUrl.substring(0, 100));
        
        // Create image with timeout
        const img = await Promise.race([
          FabricImage.fromURL(imageUrl, {
            crossOrigin: 'anonymous'
          }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Image loading timeout')), 5000)
          )
        ]);
        
        if (!canvas.disposed && img) {
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();
          const imgWidth = img.width || canvasWidth;
          const imgHeight = img.height || canvasHeight;
          
          // Scale to fit canvas while maintaining aspect ratio
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
          return true;
        }
      } else {
        console.log('No image URL available, using white background');
        // Just use white background if no image is available
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
        return true;
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
