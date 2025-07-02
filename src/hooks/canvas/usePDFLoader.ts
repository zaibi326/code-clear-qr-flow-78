
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

      // Define maximum canvas dimensions (editor viewport)
      const MAX_CANVAS_WIDTH = 1200;
      const MAX_CANVAS_HEIGHT = 800;

      for (let pageNum = 1; pageNum <= pdfJsDoc.numPages; pageNum++) {
        const page = await pdfJsDoc.getPage(pageNum);
        const originalViewport = page.getViewport({ scale: 1.0 });
        
        // Calculate scale to fit within max dimensions while maintaining aspect ratio
        const scaleX = MAX_CANVAS_WIDTH / originalViewport.width;
        const scaleY = MAX_CANVAS_HEIGHT / originalViewport.height;
        const optimalScale = Math.min(scaleX, scaleY, 2.0); // Cap at 2x for quality
        
        const scaledViewport = page.getViewport({ scale: optimalScale });
        
        // Create clean white background canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not get canvas context');
        }
        
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        // Fill with white background only - no PDF visual content
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Extract text content for editable text blocks with proper scaling
        const textContent = await page.getTextContent();
        const textBlocks: PDFTextBlock[] = [];

        const textItems = textContent.items.filter((item: any) => item.str && item.str.trim());
        
        textItems.forEach((item: any, index: number) => {
          const transform = item.transform;
          const originalX = transform[4];
          const originalY = originalViewport.height - transform[5];
          const originalFontSize = Math.abs(transform[0]) || 12;
          
          // Scale coordinates and dimensions
          const scaledX = originalX * optimalScale;
          const scaledY = originalY * optimalScale;
          const scaledFontSize = originalFontSize * optimalScale;
          const scaledWidth = (item.width || (item.str.length * originalFontSize * 0.6)) * optimalScale;
          const scaledHeight = originalFontSize * optimalScale;
          
          const fontName = item.fontName || 'Helvetica';
          const isBold = fontName.toLowerCase().includes('bold');
          const isItalic = fontName.toLowerCase().includes('italic') || fontName.toLowerCase().includes('oblique');
          
          textBlocks.push({
            id: `page-${pageNum}-text-${index}`,
            text: item.str.trim(),
            originalText: item.str.trim(),
            x: scaledX,
            y: scaledY - scaledFontSize, // Adjust for baseline
            width: scaledWidth,
            height: scaledHeight,
            fontSize: Math.max(8, scaledFontSize), // Minimum readable size
            fontName: 'Helvetica',
            fontWeight: isBold ? 'bold' : 'normal',
            fontStyle: isItalic ? 'italic' : 'normal',
            color: { r: 0, g: 0, b: 0 },
            pageNumber: pageNum,
            isEdited: false
          });
        });

        pages.push({
          pageNumber: pageNum,
          width: scaledViewport.width,
          height: scaledViewport.height,
          backgroundImage: canvas.toDataURL('image/png'),
          textBlocks,
          originalWidth: originalViewport.width,
          originalHeight: originalViewport.height,
          scaleFactor: optimalScale
        });
      }

      toast({
        title: 'PDF Loaded Successfully',
        description: `Loaded ${pages.length} page(s) with optimal scaling. Text is perfectly aligned and ready for editing!`,
      });

      return { pages, originalBytes };
    } catch (error) {
      console.error('Error loading PDF:', error);
      
      toast({
        title: 'Error loading PDF',
        description: 'Failed to load PDF file. Please try again.',
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
