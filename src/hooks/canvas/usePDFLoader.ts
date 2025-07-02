
import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { toast } from '@/hooks/use-toast';

interface PDFTextBlock {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
  color: { r: number; g: number; b: number };
  pageNumber: number;
  isEdited: boolean;
  originalText?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
}

interface PDFPageData {
  pageNumber: number;
  width: number;
  height: number;
  backgroundImage: string;
  textBlocks: PDFTextBlock[];
  originalWidth: number;
  originalHeight: number;
  scaleFactor: number;
}

export const usePDFLoader = () => {
  const [isLoading, setIsLoading] = useState(false);

  const loadPDF = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalBytes = new Uint8Array(arrayBuffer);

      const pdfJsDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages: PDFPageData[] = [];

      // Define viewport dimensions to fit the editor
      const VIEWPORT_WIDTH = 800;
      const VIEWPORT_HEIGHT = 600;

      for (let pageNum = 1; pageNum <= pdfJsDoc.numPages; pageNum++) {
        const page = await pdfJsDoc.getPage(pageNum);
        const originalViewport = page.getViewport({ scale: 1.0 });
        
        // Calculate scale to fit viewport while maintaining aspect ratio
        const scaleX = VIEWPORT_WIDTH / originalViewport.width;
        const scaleY = VIEWPORT_HEIGHT / originalViewport.height;
        const optimalScale = Math.min(scaleX, scaleY, 1.5); // Cap at 1.5x for better text quality
        
        const scaledViewport = page.getViewport({ scale: optimalScale });
        
        // Create canvas for background image
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not get canvas context');
        }
        
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        // Render PDF page to canvas
        await page.render({
          canvasContext: context,
          viewport: scaledViewport
        }).promise;

        // Extract text content with accurate positioning
        const textContent = await page.getTextContent();
        const textBlocks: PDFTextBlock[] = [];

        // Process text items with proper coordinate transformation
        textContent.items.forEach((item: any, index: number) => {
          if (!item.str || !item.str.trim()) return;

          const transform = item.transform;
          if (!transform || transform.length < 6) return;

          // Extract transform matrix values
          const [scaleX, skewY, skewX, scaleY, translateX, translateY] = transform;
          
          // Calculate font size from transform matrix
          const fontSize = Math.abs(scaleY);
          
          // Calculate position - PDF coordinates are bottom-left origin, we need top-left
          const x = translateX * optimalScale;
          const y = (originalViewport.height - translateY) * optimalScale - (fontSize * optimalScale);
          
          // Calculate text dimensions
          const textWidth = (item.width || item.str.length * fontSize * 0.6) * optimalScale;
          const textHeight = fontSize * optimalScale;
          
          // Determine font properties
          const fontName = item.fontName || 'Arial';
          const isBold = fontName.toLowerCase().includes('bold');
          const isItalic = fontName.toLowerCase().includes('italic') || fontName.toLowerCase().includes('oblique');
          
          // Ensure text is within page bounds
          if (x >= 0 && y >= 0 && x + textWidth <= scaledViewport.width && y + textHeight <= scaledViewport.height) {
            textBlocks.push({
              id: `page-${pageNum}-text-${index}`,
              text: item.str.trim(),
              originalText: item.str.trim(),
              x: Math.round(x),
              y: Math.round(y),
              width: Math.round(textWidth),
              height: Math.round(textHeight),
              fontSize: Math.max(8, Math.round(fontSize * optimalScale)),
              fontName: 'Arial', // Use consistent font for editing
              fontWeight: isBold ? 'bold' : 'normal',
              fontStyle: isItalic ? 'italic' : 'normal',
              color: { r: 0, g: 0, b: 0 },
              pageNumber: pageNum,
              isEdited: false
            });
          }
        });

        // Sort text blocks by position (top to bottom, left to right)
        textBlocks.sort((a, b) => {
          const yDiff = a.y - b.y;
          if (Math.abs(yDiff) < 5) { // Same line
            return a.x - b.x;
          }
          return yDiff;
        });

        pages.push({
          pageNumber: pageNum,
          width: scaledViewport.width,
          height: scaledViewport.height,
          backgroundImage: canvas.toDataURL('image/png', 0.95),
          textBlocks,
          originalWidth: originalViewport.width,
          originalHeight: originalViewport.height,
          scaleFactor: optimalScale
        });
      }

      toast({
        title: 'PDF Processed Successfully',
        description: `Loaded ${pages.length} page(s) with ${pages.reduce((sum, p) => sum + p.textBlocks.length, 0)} perfectly aligned text blocks!`,
      });

      return { pages, originalBytes };
    } catch (error) {
      console.error('Error loading PDF:', error);
      
      toast({
        title: 'Error loading PDF',
        description: 'Failed to process PDF file. Please try again.',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    loadPDF,
    isLoading
  };
};
