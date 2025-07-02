
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

      for (let pageNum = 1; pageNum <= pdfJsDoc.numPages; pageNum++) {
        const page = await pdfJsDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        
        // Create clean white background canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not get canvas context');
        }
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Fill with white background only - no PDF content
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Extract text content for editable text blocks
        const textContent = await page.getTextContent();
        const textBlocks: PDFTextBlock[] = [];

        const textItems = textContent.items.filter((item: any) => item.str && item.str.trim());
        
        textItems.forEach((item: any, index: number) => {
          const transform = item.transform;
          const x = transform[4];
          const y = viewport.height - transform[5];
          const fontSize = Math.abs(transform[0]) || 12;
          
          const fontName = item.fontName || 'Helvetica';
          const isBold = fontName.toLowerCase().includes('bold');
          const isItalic = fontName.toLowerCase().includes('italic') || fontName.toLowerCase().includes('oblique');
          
          textBlocks.push({
            id: `page-${pageNum}-text-${index}`,
            text: item.str.trim(),
            originalText: item.str.trim(),
            x: x,
            y: y - fontSize,
            width: item.width || (item.str.length * fontSize * 0.6),
            height: fontSize,
            fontSize: fontSize,
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
          width: viewport.width,
          height: viewport.height,
          backgroundImage: canvas.toDataURL('image/png'),
          textBlocks
        });
      }

      toast({
        title: 'PDF Loaded Successfully',
        description: `Loaded ${pages.length} page(s). Click on any text to edit it directly like in Canva!`,
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
