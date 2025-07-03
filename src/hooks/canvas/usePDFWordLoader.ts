
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

    const [scaleX, skewY, skewX, scaleY, translateX, translateY] = transform;
    const fontSize = Math.abs(scaleY);
    
    // Split text into individual words
    const words = item.str.trim().split(/(\s+)/);
    const extractedWords: PDFWord[] = [];
    
    let currentX = translateX * scale;
    const y = (viewport.height - translateY) * scale - (fontSize * scale);
    
    // Determine font properties
    const fontName = item.fontName || 'Arial';
    const isBold = fontName.toLowerCase().includes('bold');
    const isItalic = fontName.toLowerCase().includes('italic') || fontName.toLowerCase().includes('oblique');
    
    words.forEach((word, index) => {
      if (word.trim()) {
        // Calculate word width (approximate)
        const wordWidth = (word.length * fontSize * 0.6) * scale;
        const wordHeight = fontSize * scale;
        
        extractedWords.push({
          id: `page-${pageIndex + 1}-item-${wordIndex}-word-${index}`,
          text: word,
          originalText: word,
          x: Math.round(currentX),
          y: Math.round(y),
          width: Math.round(wordWidth),
          height: Math.round(wordHeight),
          fontSize: Math.max(8, Math.round(fontSize * scale)),
          fontName: 'Arial', // Use consistent font for editing
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
          color: { r: 0, g: 0, b: 0 },
          pageNumber: pageIndex + 1,
          isEdited: false,
          spaceAfter: index < words.length - 1 && words[index + 1].match(/\s+/)
        });
        
        // Move X position for next word (including space)
        currentX += wordWidth + (fontSize * 0.3 * scale); // Add some spacing
      }
    });
    
    return extractedWords;
  };

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

        // Extract text content with word-level granularity
        const textContent = await page.getTextContent();
        const words: PDFWord[] = [];

        // Process text items and extract individual words
        textContent.items.forEach((item: any, itemIndex: number) => {
          const extractedWords = extractWordsFromTextItem(item, pageNum - 1, itemIndex, originalViewport, optimalScale);
          words.push(...extractedWords);
        });

        // Sort words by position (top to bottom, left to right)
        words.sort((a, b) => {
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
          words,
          originalWidth: originalViewport.width,
          originalHeight: originalViewport.height,
          scaleFactor: optimalScale
        });
      }

      toast({
        title: 'PDF Processed Successfully',
        description: `Loaded ${pages.length} page(s) with ${pages.reduce((sum, p) => sum + p.words.length, 0)} editable words!`,
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
