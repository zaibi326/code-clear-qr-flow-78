
import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { toast } from '@/hooks/use-toast';

// Enhanced PDF.js worker configuration with proper version matching
const configurePDFWorker = () => {
  if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    const isProduction = import.meta.env.PROD;
    
    if (isProduction) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    } else {
      // Use more compatible version in development
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.11.47/pdf.worker.min.js';
    }
    
    console.log('PDF.js worker configured:', pdfjsLib.GlobalWorkerOptions.workerSrc);
  }
};

export const usePDFTextEditor = () => {
  const [pdfPages, setPdfPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPDF = useCallback(async (file: File) => {
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

      let pdfDoc;
      try {
        pdfDoc = await Promise.race([loadingTask.promise, timeoutPromise]);
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
        
        pdfDoc = await Promise.race([fallbackTask.promise, timeoutPromise]);
        console.log('PDF loaded successfully with fallback worker');
      }

      const pages = [];
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        pages.push({
          pageNumber: i,
          canvas,
          width: viewport.width,
          height: viewport.height
        });
      }

      setPdfPages(pages);
      
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
    }
  }, []);

  return {
    pdfPages,
    isLoading,
    error,
    loadPDF
  };
};
