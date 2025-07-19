
import { useState, useCallback, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import { toast } from '@/hooks/use-toast';
import { usePDFTextOperations } from './usePDFTextOperations';

// Enhanced PDF.js worker configuration
const configurePDFWorker = () => {
  if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    const isProduction = import.meta.env.PROD;
    
    if (isProduction) {
      // Use local worker in production
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    } else {
      // Use compatible CDN version in development
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
  const [originalPdfBytes, setOriginalPdfBytes] = useState<Uint8Array | null>(null);
  const isLoadingRef = useRef(false);

  const { addTextBlock: createTextBlock, exportPDFWithEdits } = usePDFTextOperations();

  const loadPDF = useCallback(async (file: File) => {
    if (isLoadingRef.current) {
      console.log('PDF already loading, skipping...');
      return;
    }

    // Validate file
    if (!file || file.type !== 'application/pdf') {
      const errorMsg = 'Invalid file type. Please select a PDF file.';
      setError(errorMsg);
      toast({
        title: 'Invalid File',
        description: errorMsg,
        variant: 'destructive'
      });
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading PDF file:', file.name, 'Size:', file.size);
      
      // Configure worker with enhanced error handling
      try {
        configurePDFWorker();
      } catch (workerError) {
        console.error('Worker configuration failed:', workerError);
        // Fallback configuration
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';
      }

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      setOriginalPdfBytes(uint8Array);
      
      // Load with pdf-lib for editing capabilities
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPdfDocument(pdfDoc);
      
      // Load with PDF.js for text extraction and rendering
      const loadingTask = pdfjsLib.getDocument({
        data: uint8Array,
        verbosity: 1,
        maxImageSize: 1024 * 1024,
        cMapPacked: true,
        disableFontFace: false,
        useSystemFonts: true,
        stopAtErrors: false,
        isEvalSupported: false,
        useWorkerFetch: false
      });

      // Add timeout for PDF loading
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('PDF loading timeout after 30 seconds')), 30000);
      });

      let pdfDocJS;
      try {
        pdfDocJS = await Promise.race([loadingTask.promise, timeoutPromise]);
        console.log('PDF loaded successfully with main worker');
      } catch (loadError) {
        console.error('PDF loading error, trying fallback:', loadError);
        
        // Try with more conservative settings
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';
        
        const fallbackTask = pdfjsLib.getDocument({
          data: uint8Array,
          verbosity: 0,
          maxImageSize: 512 * 512, 
          disableFontFace: true,
          stopAtErrors: false,
          isEvalSupported: false,
          useWorkerFetch: false
        });
        
        pdfDocJS = await Promise.race([fallbackTask.promise, timeoutPromise]);
        console.log('PDF loaded successfully with fallback configuration');
      }

      const pages: PDFPageData[] = [];
      console.log(`Processing ${pdfDocJS.numPages} pages...`);

      for (let i = 1; i <= pdfDocJS.numPages; i++) {
        try {
          const page = await pdfDocJS.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          
          // Create canvas for background image (rendered without text)
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) {
            throw new Error('Could not get canvas context');
          }
          
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          // Render page without text layer for clean background
          await page.render({
            canvasContext: context,
            viewport: viewport,
            textLayer: null // This ensures no text is rendered on background
          }).promise;

          // Extract text content for editable overlay
          const textContent = await page.getTextContent();
          const textBlocks: PDFTextBlock[] = [];

          if (textContent && textContent.items) {
            textContent.items.forEach((item: any, index: number) => {
              if (item.str && item.str.trim() && item.transform) {
                const transform = item.transform;
                
                // Calculate position and size
                const x = transform[4];
                const y = viewport.height - transform[5] - (item.height || Math.abs(transform[3]));
                const width = item.width || (item.str.length * (Math.abs(transform[0]) || 12));
                const height = item.height || Math.abs(transform[3]) || 16;
                const fontSize = Math.abs(transform[3]) || 16;

                textBlocks.push({
                  id: `text-${i}-${index}-${Date.now()}`,
                  text: item.str,
                  x: Math.max(0, x),
                  y: Math.max(0, y),
                  width: width,
                  height: height,
                  fontSize: fontSize,
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
          }

          pages.push({
            pageNumber: i,
            width: viewport.width,
            height: viewport.height,
            backgroundImage: canvas.toDataURL('image/png', 0.9),
            textBlocks
          });

          console.log(`Page ${i} processed: ${textBlocks.length} text blocks extracted`);
        } catch (pageError) {
          console.error(`Error processing page ${i}:`, pageError);
          // Continue with other pages even if one fails
        }
      }

      if (pages.length === 0) {
        throw new Error('No pages could be processed from the PDF');
      }

      setPdfPages(pages);
      setCurrentPage(0);
      setEditedTextBlocks(new Map());
      
      console.log(`PDF loaded successfully: ${pages.length} pages, ${pages.reduce((sum, p) => sum + p.textBlocks.length, 0)} total text blocks`);
      
      toast({
        title: 'PDF Loaded Successfully',
        description: `Loaded ${pages.length} pages with ${pages.reduce((sum, p) => sum + p.textBlocks.length, 0)} editable text elements.`,
      });

    } catch (error) {
      console.error('Error loading PDF:', error);
      let errorMessage = 'Failed to load PDF file.';
      
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = 'PDF loading timed out. The file might be too large or corrupted.';
        } else if (error.message.includes('worker')) {
          errorMessage = 'PDF processing failed. Please try refreshing the page.';
        } else if (error.message.includes('Invalid PDF')) {
          errorMessage = 'The file appears to be corrupted or is not a valid PDF.';
        } else {
          errorMessage = `PDF loading failed: ${error.message}`;
        }
      }
      
      setError(errorMessage);
      toast({
        title: 'PDF Loading Failed',
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
      // Mark original text as deleted (empty text)
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
      // Remove completely new text blocks
      setEditedTextBlocks(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    }
  }, []);

  const exportPDF = useCallback(async () => {
    if (!pdfDocument || !originalPdfBytes || !pdfPages.length) {
      toast({
        title: 'Nothing to Export',
        description: 'Please load a PDF first.',
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log('Exporting PDF with text edits...');
      
      const modifiedPdfBytes = await exportPDFWithEdits(originalPdfBytes, editedTextBlocks);
      
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'edited-document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
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
  }, [pdfDocument, originalPdfBytes, pdfPages, editedTextBlocks, exportPDFWithEdits]);

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
