
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
    
    // Calculate baseline for better vertical alignment
    const baseline = item.hasEOL ? 0 : fontSize * 0.2;
    
    // Handle text direction (left-to-right vs right-to-left)
    const textDirection = item.dir || 'ltr';
    
    // More accurate coordinate transformation
    const actualX = translateX * scale;
    const actualY = (viewport.height - translateY - baseline) * scale;
    
    // Split text into words while preserving spaces
    const textParts = item.str.split(/(\s+)/);
    const extractedWords: PDFWord[] = [];
    
    let currentX = actualX;
    const lineHeight = fontSize * scale;
    
    // More accurate font detection
    const fontName = item.fontName || 'Arial';
    const isBold = fontName.toLowerCase().includes('bold') || 
                  fontName.toLowerCase().includes('black') ||
                  Math.abs(scaleX) > Math.abs(scaleY) * 1.2;
    const isItalic = fontName.toLowerCase().includes('italic') || 
                    fontName.toLowerCase().includes('oblique') ||
                    Math.abs(skewX) > 0.1;
    
    textParts.forEach((part, index) => {
      if (part.trim()) {
        // More accurate width calculation using character metrics
        const charWidth = fontSize * 0.55; // Average character width ratio
        const wordWidth = part.length * charWidth * scale;
        
        // Handle special characters and ligatures
        const adjustedWidth = wordWidth * (part.match(/[iIlLfFjJ1\.]/g) ? 0.8 : 1);
        
        extractedWords.push({
          id: `page-${pageIndex + 1}-item-${wordIndex}-word-${index}`,
          text: part,
          originalText: part,
          x: Math.round(currentX),
          y: Math.round(actualY),
          width: Math.round(adjustedWidth),
          height: Math.round(lineHeight),
          fontSize: Math.max(8, Math.round(fontSize * scale)),
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
        
        // Update X position for next word with proper spacing
        const spaceWidth = fontSize * 0.3 * scale;
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

      // Enhanced PDF.js configuration for better text extraction
      const pdfJsDoc = await pdfjsLib.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
        disableFontFace: false,
        verbosity: 0
      }).promise;
      
      const pages: PDFPageData[] = [];

      // Optimized viewport sizing for better text alignment
      const VIEWPORT_WIDTH = 1000;
      const VIEWPORT_HEIGHT = 1414; // A4 ratio

      for (let pageNum = 1; pageNum <= pdfJsDoc.numPages; pageNum++) {
        const page = await pdfJsDoc.getPage(pageNum);
        const originalViewport = page.getViewport({ scale: 1.0 });
        
        // Calculate optimal scale for text clarity
        const scaleX = VIEWPORT_WIDTH / originalViewport.width;
        const scaleY = VIEWPORT_HEIGHT / originalViewport.height;
        const optimalScale = Math.min(scaleX, scaleY);
        
        // Ensure minimum scale for text readability
        const finalScale = Math.max(optimalScale, 0.75);
        
        const scaledViewport = page.getViewport({ scale: finalScale });
        
        // High-quality canvas rendering
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not get canvas context');
        }
        
        // Set canvas size with device pixel ratio for crisp rendering
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = scaledViewport.width * devicePixelRatio;
        canvas.height = scaledViewport.height * devicePixelRatio;
        canvas.style.width = `${scaledViewport.width}px`;
        canvas.style.height = `${scaledViewport.height}px`;
        
        context.scale(devicePixelRatio, devicePixelRatio);

        // Render with enhanced quality settings
        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
          renderInteractiveForms: false,
          intent: 'display'
        }).promise;

        // Enhanced text extraction with better positioning
        const textContent = await page.getTextContent({
          includeMarkedContent: true,
          disableNormalization: false
        });
        
        const words: PDFWord[] = [];

        // Process text items with improved accuracy
        textContent.items.forEach((item: any, itemIndex: number) => {
          if (item.str && item.str.trim()) {
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

        // Advanced sorting for better text flow
        words.sort((a, b) => {
          const yDiff = a.y - b.y;
          const lineThreshold = Math.max(a.fontSize, b.fontSize) * 0.7;
          
          if (Math.abs(yDiff) < lineThreshold) {
            // Same line - sort by x position
            return a.x - b.x;
          }
          return yDiff;
        });

        // Remove duplicate words and merge overlapping text
        const cleanedWords = words.filter((word, index) => {
          const nextWord = words[index + 1];
          if (!nextWord) return true;
          
          // Check for overlapping words
          const xOverlap = Math.abs(word.x - nextWord.x) < 5;
          const yOverlap = Math.abs(word.y - nextWord.y) < 5;
          const sameText = word.text === nextWord.text;
          
          return !(xOverlap && yOverlap && sameText);
        });

        pages.push({
          pageNumber: pageNum,
          width: scaledViewport.width,
          height: scaledViewport.height,
          backgroundImage: canvas.toDataURL('image/png', 0.98),
          words: cleanedWords,
          originalWidth: originalViewport.width,
          originalHeight: originalViewport.height,
          scaleFactor: finalScale
        });
      }

      toast({
        title: 'PDF Processed Successfully',
        description: `Loaded ${pages.length} page(s) with ${pages.reduce((sum, p) => sum + p.words.length, 0)} precisely aligned words!`,
      });

      return { pages, originalBytes };
    } catch (error) {
      console.error('Error loading PDF:', error);
      
      toast({
        title: 'Error loading PDF',
        description: 'Failed to process PDF file. Please try again with a different file.',
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
