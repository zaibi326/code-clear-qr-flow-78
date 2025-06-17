
import { storageConstants } from './storageUtils';

const { THUMBNAIL_SIZE } = storageConstants;

// Create compressed thumbnail for storage
export const createThumbnail = (imageDataUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageDataUrl);
        return;
      }

      // Calculate thumbnail dimensions (max 400x300)
      const maxWidth = 400;
      const maxHeight = 300;
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get compressed thumbnail
      const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
      console.log('Created thumbnail:', {
        originalSize: imageDataUrl.length,
        thumbnailSize: thumbnail.length,
        compressionRatio: (thumbnail.length / imageDataUrl.length * 100).toFixed(1) + '%'
      });
      
      resolve(thumbnail);
    };
    img.onerror = () => resolve(imageDataUrl);
    img.src = imageDataUrl;
  });
};
