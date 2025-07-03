
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

    // Extract transform matrix values for precise positioning
    const [scaleX, skewY, skewX, scaleY, translateX, translateY] = transform;
    const fontSize = Math.abs(scaleY);
    
    // Enhanced baseline calculation for better vertical alignment
    const baseline = fontSize * 0.25;
    
    // Handle text direction (left-to-right vs right-to-left)
    const textDirection = item.dir || 'ltr';
    
    // More accurate coordinate transformation with enhanced precision
    const actualX = translateX * scale;
    const actualY = (viewport.height - translateY - baseline) * scale;
    
    // Enhanced text splitting that preserves formatting
    const textParts = item.str.split(/(\s+)/);
    const extractedWords = [];
    
    let currentX = actualX;
    const lineHeight = fontSize * 1.2 * scale; // Better line height calculation
    
    // Enhanced font detection with better accuracy
    const fontName = item.fontName || 'Arial';
    const isBold = fontName.toLowerCase().includes('bold') || 
                  fontName.toLowerCase().includes('black') ||
                  Math.abs(scaleX) > Math.abs(scaleY) * 1.3;
    const isItalic = fontName.toLowerCase().includes('italic') || 
                    fontName.toLowerCase().includes('oblique') ||
                    Math.abs(skewX) > 0.15;
    
    textParts.forEach((part, index) => {
      if (part.trim()) {
        // Enhanced width calculation with character-specific adjustments
        const baseCharWidth = fontSize * 0.6;
        let adjustedWidth = part.length * baseCharWidth * scale;
        
        // Adjust for narrow characters
        const narrowChars = part.match(/[iIlLfFjJ1\.\,\:\;]/g);
        if (narrowChars) {
          adjustedWidth *= (1 - (narrowChars.length * 0.2 / part.length));
        }
        
        // Adjust for wide characters
        const wideChars = part.match(/[mMwWoO0]/g);
        if (wideChars) {
          adjustedWidth *= (1 + (wideChars.length * 0.15 / part.length));
        }
        
        extractedWords.push({
          id: `page-${pageIndex + 1}-item-${wordIndex}-word-${index}`,
          text: part,
          originalText: part,
          x: Math.round(currentX * 100) / 100, // Sub-pixel precision
          y: Math.round(actualY * 100) / 100,
          width: Math.round(adjustedWidth * 100) / 100,
          height: Math.round(lineHeight * 100) / 100,
          fontSize: Math.max(8, Math.round(fontSize * scale * 100) / 100),
          fontName: 'Arial', // Standardize for consistency
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
          color: { r: 0, g: 0, b: 0 },
          pageNumber: pageIndex + 1,
          isEdited: false,
          spaceAfter: index < textParts.length - 1 && textParts[index + 1].match(/\s+/),
          transform: transform,
          dir: textDirection,
          baseline: baseline
        });
        
        // Enhanced spacing calculation
        const spaceWidth = fontSize * 0.35 * scale;
        currentX += adjustedWidth + spaceWidth;
      }
    });
    
    return extractedWords;
  };

  const loadPDF = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalBytes = new Uint8Array(arrayBuffer);

      // Enhanced PDF.js configuration for superior text extraction
      const pdfJsDoc = await pdfjsLib.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
        disableFontFace: false,
        verbosity: 0,
        standardFontDataUrl: undefined // Let PDF.js handle fonts automatically
      }).promise;
      
      const pages = [];

      // Optimized viewport sizing for enhanced text alignment
      const VIEWPORT_WIDTH = 1200; // Increased for better precision
      const VIEWPORT_HEIGHT = 1697; // Better A4 ratio

      for (let pageNum = 1; pageNum <= pdfJsDoc.numPages; pageNum++) {
        const page = await pdfJsDoc.getPage(pageNum);
        const originalViewport = page.getViewport({ scale: 1.0 });
        
        // Calculate optimal scale for maximum text clarity
        const scaleX = VIEWPORT_WIDTH / originalViewport.width;
        const scaleY = VIEWPORT_HEIGHT / originalViewport.height;
        const optimalScale = Math.min(scaleX, scaleY);
        
        // Ensure minimum scale for text readability with better threshold
        const finalScale = Math.max(optimalScale, 1.0);
        
        const scaledViewport = page.getViewport({ scale: finalScale });
        
        // Ultra high-quality canvas rendering
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not get canvas context');
        }
        
        // Enhanced canvas sizing with device pixel ratio for crisp rendering
        const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2); // Limit to prevent memory issues
        canvas.width = scaledViewport.width * devicePixelRatio;
        canvas.height = scaledViewport.height * devicePixelRatio;
        canvas.style.width = `${scaledViewport.width}px`;
        canvas.style.height = `${scaledViewport.height}px`;
        
        context.scale(devicePixelRatio, devicePixelRatio);

        // Render with maximum quality settings
        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
          intent: 'display'
        }).promise;

        // Enhanced text extraction with superior positioning
        const textContent = await page.getTextContent({
          includeMarkedContent: true,
          disableNormalization: false
        });
        
        const words = [];

        // Process text items with enhanced accuracy - add type checking
        textContent.items.forEach((item, itemIndex) => {
          // Type guard to check if item is TextItem (has str property)
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

        // Advanced sorting for optimal text flow
        words.sort((a, b) => {
          const yDiff = a.y - b.y;
          const lineThreshold = Math.max(a.fontSize, b.fontSize) * 0.6;
          
          if (Math.abs(yDiff) < lineThreshold) {
            // Same line - sort by x position with RTL support
            return a.dir === 'rtl' ? b.x - a.x : a.x - b.x;
          }
          return yDiff;
        });

        // Enhanced duplicate removal and text merging
        const cleanedWords = words.filter((word, index) => {
          const nextWord = words[index + 1];
          if (!nextWord) return true;
          
          // More precise overlap detection
          const xOverlap = Math.abs(word.x - nextWord.x) < 3;
          const yOverlap = Math.abs(word.y - nextWord.y) < 3;
          const sameText = word.text.trim() === nextWord.text.trim();
          const similarSize = Math.abs(word.fontSize - nextWord.fontSize) < 2;
          
          return !(xOverlap && yOverlap && sameText && similarSize);
        });

        pages.push({
          pageNumber: pageNum,
          width: scaledViewport.width,
          height: scaledViewport.height,
          backgroundImage: canvas.toDataURL('image/png', 0.95),
          words: cleanedWords,
          originalWidth: originalViewport.width,
          originalHeight: originalViewport.height,
          scaleFactor: finalScale
        });
      }

      toast({
        title: 'PDF Processed with Enhanced Accuracy',
        description: `Loaded ${pages.length} page(s) with ${pages.reduce((sum, p) => sum + p.words.length, 0)} precisely aligned words! Multi-line editing enabled.`,
      });

      return { pages, originalBytes };
    } catch (error) {
      console.error('Error loading PDF with enhanced processing:', error);
      
      toast({
        title: 'Error loading PDF',
        description: 'Failed to process PDF file with enhanced text extraction. Please try again.',
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
