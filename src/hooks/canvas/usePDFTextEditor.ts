
import { useState, useCallback, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import { toast } from '@/hooks/use-toast';
import { usePDFTextOperations } from './usePDFTextOperations';

// Enhanced PDF.js worker configuration with proper version matching
const configurePDFWorker = () => {
  if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    const isProduction = import.meta.env.PROD;
    
    if (isProduction) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    } else {
      // Use more compatible version in development
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';
    }
    
    console.log('PDF.js worker configured:', pdfjsLib.GlobalWorkerOptions.workerSrc);
  }
};

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
  textAlign?: 'left' | 'center' | 'right';
}

interface PDFPageData {
  pageNumber: number;
  width: number;
  height: number;
  backgroundImage: string;
  textBlocks: PDFTextBlock[];
}

export const usePDFTextEditor = () => {
  const [pdfDocument, setPdfDocument] = useState<PDFDocument | null>(null);
  const [pdfPages, setPdfPages] = useState<PDFPageData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedTextBlocks, setEditedTextBlocks] = useState<Map<string, PDFTextBlock>>(new Map());
  const isLoadingRef = useRef(false);

  const { addTextBlock: createTextBlock, exportPDFWithEdits } = usePDFTextOperations();

  const loadPDF = useCallback(async (file: File) => {
    if (isLoadingRef.current) {
      console.log('PDF already loading, skipping...');
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      // Configure worker with enhanced error handling
      try {
        configurePDFWorker();
      } catch (workerError) {
        console.error('Worker configuration failed:', workerError);
        // Fallback configuration
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';
      }

      const arrayBuffer = await file.arrayBuffer();
      
      // Load with pdf-lib for editing
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPdfDocument(pdfDoc);
      
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        verbosity: 1,
        maxImageSize: 1024 * 1024,
        cMapPacked: true,
        disableFontFace: false,
        useSystemFonts: true,
        stopAtErrors: false,
        isEvalSupported: false,
        useWorkerFetch: false
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('PDF loading timeout')), 30000);
      });

      let pdfDocJS;
      try {
        pdfDocJS = await Promise.race([loadingTask.promise, timeoutPromise]);
      } catch (loadError) {
        console.error('PDF loading error, trying fallback:', loadError);
        
        // Try with fallback worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';
        
        const fallbackTask = pdfjsLib.getDocument({
          data: arrayBuffer,
          verbosity: 0,
          maxImageSize: 512 * 512,
          disableFontFace: true,
          stopAtErrors: false,
          isEvalSupported: false,
          useWorkerFetch: false
        });
        
        pdfDocJS = await Promise.race([fallbackTask.promise, timeoutPromise]);
        console.log('PDF loaded successfully with fallback worker');
      }

      const pages: PDFPageData[] = [];
      for (let i = 1; i <= pdfDocJS.numPages; i++) {
        const page = await pdfDocJS.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        
        // Create canvas for background image (without text)
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
          textLayer: null // Disable text rendering in background
        }).promise;

        // Extract text content for editable overlay
        const textContent = await page.getTextContent();
        const textBlocks: PDFTextBlock[] = [];

        textContent.items.forEach((item: any, index: number) => {
          if (item.str && item.str.trim()) {
            const transform = item.transform;
            textBlocks.push({
              id: `text-${i}-${index}`,
              text: item.str,
              x: transform[4],
              y: viewport.height - transform[5] - (item.height || Math.abs(transform[3])),
              width: item.width || (item.str.length * (Math.abs(transform[0]) || 12)),
              height: item.height || Math.abs(transform[3]) || 16,
              fontSize: Math.abs(transform[3]) || 16,
              fontName: item.fontName || 'Helvetica',
              fontWeight: 'normal',
              fontStyle: 'normal',
              textAlign: 'left',
              color: { r: 0, g: 0, b: 0 },
              pageNumber: i,
              isEdited: false
            });
          }
        });

        pages.push({
          pageNumber: i,
          width: viewport.width,
          height: viewport.height,
          backgroundImage: canvas.toDataURL(),
          textBlocks
        });
      }

      setPdfPages(pages);
      setCurrentPage(0);
      setEditedTextBlocks(new Map());
      
      toast({
        title: 'PDF Loaded Successfully',
        description: `Loaded ${pages.length} pages for editing.`,
      });

    } catch (error) {
      console.error('Error loading PDF:', error);
      let errorMessage = 'Failed to load PDF';
      
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = 'PDF loading timed out. The file might be too large or the worker failed to load.';
        } else if (error.message.includes('worker')) {
          errorMessage = 'PDF worker failed to load. Please refresh the page and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      toast({
        title: 'Error Loading PDF',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  const updateTextBlock = useCallback((id: string, updates: Partial<PDFTextBlock>) => {
    setEditedTextBlocks(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(id) || findOriginalTextBlock(id);
      
      if (existing) {
        const originalText = existing.originalText || existing.text;
        
        newMap.set(id, { 
          ...existing, 
          ...updates, 
          id,
          isEdited: true,
          originalText: originalText
        });
      }
      return newMap;
    });
  }, []);

  const findOriginalTextBlock = (id: string): PDFTextBlock | undefined => {
    for (const page of pdfPages) {
      const block = page.textBlocks.find(b => b.id === id);
      if (block) return block;
    }
    return undefined;
  };

  const addTextBlock = useCallback((pageNumber: number, x: number, y: number, text: string = 'New Text') => {
    const { newId, newTextBlock } = createTextBlock(pageNumber, x, y, text);
    
    setEditedTextBlocks(prev => {
      const newMap = new Map(prev);
      newMap.set(newId, newTextBlock as PDFTextBlock);
      return newMap;
    });

    return newId;
  }, [createTextBlock]);

  const deleteTextBlock = useCallback((id: string) => {
    const originalBlock = findOriginalTextBlock(id);
    
    if (originalBlock) {
      setEditedTextBlocks(prev => {
        const newMap = new Map(prev);
        newMap.set(id, {
          ...originalBlock,
          text: '',
          isEdited: true,
          originalText: originalBlock.text
        });
        return newMap;
      });
    } else {
      setEditedTextBlocks(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    }
  }, []);

  const exportPDF = useCallback(async () => {
    if (!pdfDocument || !pdfPages.length) {
      toast({
        title: 'No PDF to export',
        description: 'Please load a PDF first.',
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log('Exporting PDF with text edits...');
      
      const pdfBytes = await pdfDocument.save();
      const modifiedPdfBytes = await exportPDFWithEdits(pdfBytes, editedTextBlocks);
      
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'edited-document.pdf';
      link.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: 'PDF Exported Successfully',
        description: 'Your edited PDF has been downloaded.',
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export PDF. Please try again.',
        variant: 'destructive'
      });
    }
  }, [pdfDocument, pdfPages, editedTextBlocks, exportPDFWithEdits]);

  return {
    pdfDocument,
    pdfPages,
    currentPage,
    setCurrentPage,
    isLoading,
    error,
    editedTextBlocks,
    loadPDF,
    updateTextBlock,
    addTextBlock,
    deleteTextBlock,
    exportPDF
  };
};
