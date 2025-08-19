
import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Set PDF.js worker (use bundled worker to avoid CORS/CDN issues)
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc as unknown as string;

export const renderPDFToImage = async (pdfDataUrl: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
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
      
      // Get original viewport
      const viewport = page.getViewport({ scale: 1 });
      
      // Set canvas size to match the original PDF page dimensions
      // Scale up for better quality
      const scale = 2;
      const scaledViewport = page.getViewport({ scale });
      
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;
      
      // Fill with white background
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Render PDF page at full size
      await page.render({
        canvasContext: context,
        viewport: scaledViewport
      }).promise;
      
      // Convert to data URL with high quality
      const imageDataUrl = canvas.toDataURL('image/png', 1.0);
      resolve(imageDataUrl);
      
    } catch (error) {
      console.error('PDF rendering error:', error);
      // Create a better fallback that maintains aspect ratio
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Set standard size for fallback
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
      ctx.fillStyle = '#f8f9fa';
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
