
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

        // Fill with white background only - no PDF content, no text extraction
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Create empty page with no text blocks - completely clean slate
        pages.push({
          pageNumber: pageNum,
          width: viewport.width,
          height: viewport.height,
          backgroundImage: canvas.toDataURL('image/png'),
          textBlocks: [] // Empty array - no original text content
        });
      }

      toast({
        title: 'PDF Loaded Successfully',
        description: `Loaded ${pages.length} clean page(s). Start adding your own text using "Add Text" mode!`,
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
