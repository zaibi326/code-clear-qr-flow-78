
import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { toast } from '@/hooks/use-toast';

interface PDFWord {
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
  spaceAfter?: boolean;
  transform?: number[];
  dir?: string;
  baseline?: number;
}

interface PDFPageData {
  pageNumber: number;
  width: number;
  height: number;
  backgroundImage: string;
  words: PDFWord[];
  originalWidth: number;
  originalHeight: number;
  scaleFactor: number;
}

export const usePDFWordLoader = () => {
  const [isLoading, setIsLoading] = useState(false);

  const extractWordsFromTextItem = (item: any, pageIndex: number, wordIndex: number, viewport: any, scale: number) => {
    if (!item.str || !item.str.trim()) return [];

    const transform = item.transform;
    if (!transform || transform.length < 6) return [];

    // Preserve exact transform matrix values for pixel-perfect positioning
    const [scaleX, skewY, skewX, scaleY, translateX, translateY] = transform;
    const fontSize = Math.abs(scaleY);
    
    // Use exact PDF coordinates without adjustment to maintain original layout
    const actualX = translateX * scale;
    const actualY = (viewport.height - translateY) * scale;
    
    // Preserve original text as single blocks to maintain formatting
    const textContent = item.str;
    
    // Calculate exact dimensions based on PDF metrics
    const textWidth = (item.width || textContent.length * fontSize * 0.55) * scale;
    const textHeight = fontSize * scale;
    
    // Detect font properties from fontName
    const fontName = item.fontName || 'Arial';
    const isBold = fontName.toLowerCase().includes('bold') || 
                  fontName.toLowerCase().includes('black') ||
                  Math.abs(scaleX) > fontSize * 1.2;
    const isItalic = fontName.toLowerCase().includes('italic') || 
                    fontName.toLowerCase().includes('oblique') ||
                    Math.abs(skewX) > 0.1;
    
    // Extract color information if available
    let textColor = { r: 0, g: 0, b: 0 };
    if (item.color && Array.isArray(item.color)) {
      textColor = {
        r: item.color[0] || 0,
        g: item.color[1] || 0,
        b: item.color[2] || 0
      };
    }

    return [{
      id: `page-${pageIndex + 1}-item-${wordIndex}`,
      text: textContent,
      originalText: textContent,
      x: Math.round(actualX * 100) / 100,
      y: Math.round(actualY * 100) / 100,
      width: Math.round(textWidth * 100) / 100,
      height: Math.round(textHeight * 100) / 100,
      fontSize: Math.round(fontSize * scale * 100) / 100,
      fontName: fontName,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      color: textColor,
      pageNumber: pageIndex + 1,
      isEdited: false,
      spaceAfter: false,
      transform: transform,
      dir: item.dir || 'ltr',
      baseline: fontSize * 0.2
    }];
  };

  const loadPDF = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalBytes = new Uint8Array(arrayBuffer);

      // Enhanced PDF.js configuration for maximum accuracy
      const pdfJsDoc = await pdfjsLib.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
        disableFontFace: false,
        verbosity: 0,
        standardFontDataUrl: undefined
      }).promise;
      
      const pages = [];

      // Use higher resolution for better text extraction accuracy
      const VIEWPORT_SCALE = 2.0; // Increased for better precision

      for (let pageNum = 1; pageNum <= pdfJsDoc.numPages; pageNum++) {
        const page = await pdfJsDoc.getPage(pageNum);
        const originalViewport = page.getViewport({ scale: 1.0 });
        
        // Calculate optimal scale for text clarity while preserving layout
        const finalScale = VIEWPORT_SCALE;
        const scaledViewport = page.getViewport({ scale: finalScale });
        
        // High-quality canvas rendering for background
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not get canvas context');
        }
        
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        // Render with maximum quality
        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
          intent: 'display'
        }).promise;

        // Extract text with enhanced accuracy
        const textContent = await page.getTextContent({
          includeMarkedContent: true,
          disableNormalization: false
        });
        
        const words = [];

        // Process each text item while preserving original structure
        textContent.items.forEach((item, itemIndex) => {
          if ('str' in item && item.str && item.str.trim()) {
            const extractedWords = extractWordsFromTextItem(
              item, 
              pageNum - 1, 
              itemIndex, 
              originalViewport, 
              finalScale
            );
            words.push(...extractedWords);
          }
        });

        // Minimal sorting to preserve original text flow
        words.sort((a, b) => {
          const yDiff = a.y - b.y;
          const lineThreshold = Math.max(a.fontSize, b.fontSize) * 0.5;
          
          if (Math.abs(yDiff) < lineThreshold) {
            return a.dir === 'rtl' ? b.x - a.x : a.x - b.x;
          }
          return yDiff;
        });

        pages.push({
          pageNumber: pageNum,
          width: scaledViewport.width,
          height: scaledViewport.height,
          backgroundImage: canvas.toDataURL('image/png', 0.98),
          words: words,
          originalWidth: originalViewport.width,
          originalHeight: originalViewport.height,
          scaleFactor: finalScale
        });
      }

      toast({
        title: 'PDF Loaded with Exact Layout Preservation',
        description: `Loaded ${pages.length} page(s) with ${pages.reduce((sum, p) => sum + p.words.length, 0)} precisely positioned text blocks maintaining original formatting!`,
      });

      return { pages, originalBytes };
    } catch (error) {
      console.error('Error loading PDF with layout preservation:', error);
      
      toast({
        title: 'Error loading PDF',
        description: 'Failed to process PDF file while preserving layout. Please try again.',
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
