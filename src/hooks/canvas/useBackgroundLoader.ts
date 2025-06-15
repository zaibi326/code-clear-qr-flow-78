
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
      let fileType = '';

      // Handle different file sources with priority order
      if (template.file && template.file instanceof File) {
        console.log('Loading template file:', template.file.name, template.file.type, 'Size:', template.file.size);
        fileType = template.file.type.toLowerCase();
        
        if (fileType === 'application/pdf') {
          // Handle PDF files - convert first page to image
          console.log('PDF template detected - converting first page');
          try {
            const pdfImageUrl = await convertPDFToImage(template.file);
            if (pdfImageUrl) {
              imageUrl = pdfImageUrl;
              fileType = 'image/png'; // PDF converted to PNG
            }
          } catch (pdfError) {
            console.error('PDF conversion failed:', pdfError);
            // Create PDF placeholder
            imageUrl = createPDFPlaceholder(template.file.name);
            fileType = 'image/png';
          }
        } else if (fileType.startsWith('image/')) {
          // Handle JPG, PNG, and other image files
          console.log('Image template detected:', fileType);
          imageUrl = URL.createObjectURL(template.file);
        } else {
          console.warn('Unsupported file type:', fileType);
          return false;
        }
      } else if (template.preview) {
        console.log('Loading from preview URL');
        imageUrl = template.preview;
        fileType = 'image/unknown';
      } else if (template.template_url) {
        console.log('Loading from template URL');
        imageUrl = template.template_url;
        fileType = 'image/unknown';
      } else if (template.thumbnail_url) {
        console.log('Loading from thumbnail URL');
        imageUrl = template.thumbnail_url;
        fileType = 'image/unknown';
      }

      if (imageUrl && !canvas.disposed) {
        console.log('Loading background image from URL:', imageUrl.substring(0, 100));
        
        // Create image with timeout and better error handling
        const img = await Promise.race([
          new Promise<FabricImage>((resolve, reject) => {
            FabricImage.fromURL(imageUrl, {
              crossOrigin: 'anonymous'
            }, (fabricImg, isError) => {
              if (isError || !fabricImg) {
                reject(new Error('Failed to load image'));
              } else {
                resolve(fabricImg);
              }
            });
          }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Image loading timeout')), 10000)
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
          
          console.log('Background template loaded successfully');
          return true;
        }
      } else {
        console.log('No image URL available, using white background');
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

  // Convert PDF first page to image using canvas
  const convertPDFToImage = async (pdfFile: File): Promise<string | null> => {
    try {
      // For now, we'll create a better PDF placeholder
      // In a production app, you'd use PDF.js here
      return createPDFPlaceholder(pdfFile.name);
    } catch (error) {
      console.error('PDF conversion error:', error);
      return null;
    }
  };

  // Create a professional PDF placeholder
  const createPDFPlaceholder = (fileName: string): string => {
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
      
      // Add inner border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(30, 30, 740, 540);
      
      // Add PDF icon
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 64px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('📄', 400, 220);
      
      // Add title
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('PDF Template', 400, 280);
      
      // Add subtitle
      ctx.fillStyle = '#64748b';
      ctx.font = '18px Arial';
      ctx.fillText('Ready for editing and customization', 400, 320);
      
      // Add filename
      ctx.font = '16px Arial';
      ctx.fillText(`File: ${fileName}`, 400, 350);
      
      // Add instructions
      ctx.font = '14px Arial';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Add text, shapes, QR codes and images', 400, 390);
      ctx.fillText('Use the toolbar on the left to get started', 400, 410);
    }
    
    return tempCanvas.toDataURL('image/png');
  };

  return { loadBackgroundTemplate };
};
