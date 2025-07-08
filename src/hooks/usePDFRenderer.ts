
import { useState, useCallback, useRef, useEffect } from 'react';
import { pdfRenderingService, PDFRenderOptions, PDFPageRender } from '@/services/pdfRenderingService';
import { toast } from '@/hooks/use-toast';

export const usePDFRenderer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageRenders, setPageRenders] = useState<PDFPageRender[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [documentInfo, setDocumentInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadPDF = useCallback(async (source: string | File | ArrayBuffer) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let pdfData: string | ArrayBuffer;
      
      if (source instanceof File) {
        pdfData = await source.arrayBuffer();
      } else {
        pdfData = source;
      }
      
      await pdfRenderingService.loadPDF(pdfData);
      const info = pdfRenderingService.getDocumentInfo();
      
      if (info) {
        setNumPages(info.numPages);
        setDocumentInfo(info);
        setCurrentPage(1);
        
        toast({
          title: "PDF Loaded Successfully",
          description: `Document with ${info.numPages} pages loaded with full preview support`,
        });
      }
    } catch (error: any) {
      console.error('Error loading PDF:', error);
      setError(error.message || 'Failed to load PDF');
      toast({
        title: "Error Loading PDF",
        description: error.message || 'Failed to load PDF document',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderPage = useCallback(async (pageNumber: number, options: PDFRenderOptions = {}) => {
    try {
      const pageRender = await pdfRenderingService.renderPage(pageNumber, {
        scale: 1.5,
        enableTextLayer: true,
        enableAnnotations: true,
        ...options
      });
      
      return pageRender;
    } catch (error: any) {
      console.error('Error rendering page:', error);
      setError(error.message || 'Failed to render page');
      throw error;
    }
  }, []);

  const renderAllPages = useCallback(async (options: PDFRenderOptions = {}) => {
    setIsLoading(true);
    
    try {
      const renders = await pdfRenderingService.renderAllPages({
        scale: 1.2,
        enableTextLayer: true,
        ...options
      });
      
      setPageRenders(renders);
      
      toast({
        title: "All Pages Rendered",
        description: `Successfully rendered ${renders.length} pages with full preview`,
      });
      
      return renders;
    } catch (error: any) {
      console.error('Error rendering all pages:', error);
      setError(error.message || 'Failed to render pages');
      toast({
        title: "Rendering Error",
        description: error.message || 'Failed to render PDF pages',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const convertToImages = useCallback(async (options: any = {}) => {
    setIsLoading(true);
    
    try {
      const images = await pdfRenderingService.convertToImages({
        format: 'PNG',
        quality: 0.95,
        dpi: 300,
        ...options
      });
      
      toast({
        title: "PDF Converted to Images",
        description: `Successfully converted ${images.length} pages to images`,
      });
      
      return images;
    } catch (error: any) {
      console.error('Error converting to images:', error);
      setError(error.message || 'Failed to convert PDF');
      toast({
        title: "Conversion Error",
        description: error.message || 'Failed to convert PDF to images',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchInPDF = useCallback(async (searchTerm: string) => {
    try {
      const results = await pdfRenderingService.searchText(searchTerm);
      
      toast({
        title: "Search Completed",
        description: `Found ${results.length} matches for "${searchTerm}"`,
      });
      
      return results;
    } catch (error: any) {
      console.error('Error searching PDF:', error);
      setError(error.message || 'Failed to search PDF');
      throw error;
    }
  }, []);

  const processWithPDFCo = useCallback(async (operation: string, params: any = {}) => {
    setIsLoading(true);
    
    try {
      const result = await pdfRenderingService.processWithPDFCo(operation, params);
      
      toast({
        title: "PDF.co Operation Successful",
        description: `${operation} completed successfully`,
      });
      
      return result;
    } catch (error: any) {
      console.error('Error with PDF.co operation:', error);
      setError(error.message || 'PDF.co operation failed');
      toast({
        title: "PDF.co Error",
        description: error.message || 'PDF.co operation failed',
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pdfRenderingService.dispose();
    };
  }, []);

  return {
    isLoading,
    pageRenders,
    currentPage,
    setCurrentPage,
    numPages,
    documentInfo,
    error,
    containerRef,
    loadPDF,
    renderPage,
    renderAllPages,
    convertToImages,
    searchInPDF,
    processWithPDFCo
  };
};
