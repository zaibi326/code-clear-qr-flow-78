
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
        
        // Handle PDF files - render actual PDF content
        if (imageUrl.includes('data:application/pdf')) {
          console.log('PDF detected - rendering PDF content');
          try {
            const pdfImageUrl = await renderPDFToImage(imageUrl);
            console.log('PDF rendered to image successfully');
            imageUrl = pdfImageUrl;
          } catch (pdfError) {
            console.warn('PDF rendering failed:', pdfError);
            // Create a better fallback for PDFs that shows it's editable
            canvas.backgroundColor = '#f8f9fa';
            
            // Add a text indicator that this is a PDF ready for editing
            const { IText } = await import('fabric');
            const pdfText = new IText('PDF Document Ready for Editing\n\nAdd your QR codes, text, and other elements\nusing the tools on the left', {
              left: canvas.getWidth() / 2,
              top: canvas.getHeight() / 2,
              originX: 'center',
              originY: 'center',
              fontSize: 18,
              fill: '#666666',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
              selectable: false,
              evented: false
            });
            
            (pdfText as any).isBackgroundTemplate = true;
            canvas.add(pdfText);
            canvas.renderAll();
            return true;
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

// Enhanced PDF to image renderer using PDF.js
const renderPDFToImage = async (pdfDataUrl: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Load PDF.js dynamically
      const pdfjsLib = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js');
      
      // Set worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      
      // Convert data URL to array buffer
      const base64Data = pdfDataUrl.split(',')[1];
      const binaryData = atob(base64Data);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }
      
      // Load PDF document
      const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
      const page = await pdf.getPage(1); // Get first page
      
      // Set up canvas for rendering
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Could not get canvas context');
      }
      
      // Calculate scale to fit 800x600 canvas
      const viewport = page.getViewport({ scale: 1 });
      const scaleX = 800 / viewport.width;
      const scaleY = 600 / viewport.height;
      const scale = Math.min(scaleX, scaleY);
      
      const scaledViewport = page.getViewport({ scale });
      
      canvas.width = 800;
      canvas.height = 600;
      
      // Fill with white background
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Center the PDF content
      const offsetX = (canvas.width - scaledViewport.width) / 2;
      const offsetY = (canvas.height - scaledViewport.height) / 2;
      
      context.save();
      context.translate(offsetX, offsetY);
      
      // Render PDF page
      await page.render({
        canvasContext: context,
        viewport: scaledViewport
      }).promise;
      
      context.restore();
      
      // Convert to data URL
      const imageDataUrl = canvas.toDataURL('image/png', 1.0);
      resolve(imageDataUrl);
      
    } catch (error) {
      console.error('PDF rendering error:', error);
      // Fallback to a better placeholder
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = 800;
      canvas.height = 600;
      
      // Create a document-like background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add border
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      
      // Add document icon representation
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
      
      ctx.strokeStyle = '#d0d0d0';
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
      
      // Add text
      ctx.fillStyle = '#666666';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PDF Document', canvas.width / 2, canvas.height / 2 - 40);
      
      ctx.font = '18px Arial';
      ctx.fillText('Ready for editing', canvas.width / 2, canvas.height / 2);
      
      ctx.font = '14px Arial';
      ctx.fillStyle = '#888888';
      ctx.fillText('Add QR codes, text, and other elements', canvas.width / 2, canvas.height / 2 + 30);
      
      const imageDataUrl = canvas.toDataURL('image/png');
      resolve(imageDataUrl);
    }
  });
};
