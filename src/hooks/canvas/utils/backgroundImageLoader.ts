
import { Canvas, FabricImage } from 'fabric';
import { renderPDFToImage } from './pdfRenderer';

export const loadBackgroundImage = async (canvas: Canvas, imageUrl: string): Promise<boolean> => {
  if (!canvas || canvas.disposed) {
    console.log('Canvas not available for background loading');
    return false;
  }

  try {
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
    
    let processedImageUrl = imageUrl;
    
    // Handle PDF files - render actual PDF content
    if (imageUrl.includes('data:application/pdf')) {
      console.log('PDF detected - rendering PDF content');
      try {
        processedImageUrl = await renderPDFToImage(imageUrl);
        console.log('PDF rendered to image successfully');
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
        FabricImage.fromURL(processedImageUrl, {
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
    
    return true;
  } catch (error) {
    console.error('Error loading background image:', error);
    // Set white background as fallback
    if (!canvas.disposed) {
      canvas.backgroundColor = '#ffffff';
      canvas.renderAll();
    }
    return false;
  }
};
