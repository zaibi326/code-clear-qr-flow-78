import { useState, useCallback, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

export interface PDFPageRender {
  canvas: HTMLCanvasElement;
  textLayer?: HTMLDivElement;
  width: number;
  height: number;
  pageNumber: number;
}

interface PDFTextElement {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  pageNumber: number;
}

interface PDFSearchResult {
  pageNumber: number;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  context: string;
}

interface PDFRenderOptions {
  scale?: number;
  enableTextLayer?: boolean;
}

interface ConvertToImagesOptions {
  format?: 'PNG' | 'JPEG';
  quality?: number;
}

// Type for PDF.js document
interface PDFDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<any>;
  getMetadata: () => Promise<any>;
}

// Improved PDF.js worker configuration with proper version matching
const configurePDFWorker = () => {
  if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    // Always use the bundled worker to avoid CORS/CDN issues
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc as unknown as string;
    console.log('PDF.js worker configured:', pdfjsLib.GlobalWorkerOptions.workerSrc);
  }
};

export const usePDFRenderer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageRenders, setPageRenders] = useState<PDFPageRender[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [documentInfo, setDocumentInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const loadPDF = useCallback(async (source: File | string) => {
    try {
      setIsLoading(true);
      setError(null);
      setPageRenders([]);
      setPdfDoc(null);
      
      // Configure worker with enhanced error handling
      try {
        configurePDFWorker();
      } catch (workerError) {
        console.error('Worker configuration failed:', workerError);
        // Use bundled worker as fallback
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc as unknown as string;
      }
      
      console.log('🔄 Loading PDF for rendering...', source instanceof File ? source.name : source);
      
      let data: ArrayBuffer;
      
      if (source instanceof File) {
        console.log('Converting file to array buffer...');
        data = await source.arrayBuffer();
        console.log('File converted to array buffer, size:', data.byteLength);
      } else {
        console.log('Fetching PDF from URL...');
        try {
          const response = await fetch(source);
          if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText} (${response.status})`);
          }
          data = await response.arrayBuffer();
          console.log('PDF fetched from URL, size:', data.byteLength);
        } catch (fetchError) {
          console.error('Fetch error:', fetchError);
          throw new Error('Unable to load PDF file. Please check the file and try again.');
        }
      }

      if (data.byteLength === 0) {
        throw new Error('PDF file is empty or corrupted');
      }

      console.log('Creating PDF document...');
      
      // Enhanced PDF loading configuration with better error handling
      const loadingTask = pdfjsLib.getDocument({
        data,
        useSystemFonts: true,
        disableFontFace: false,
        verbosity: 1, // Increase verbosity for debugging
        maxImageSize: 1024 * 1024,
        cMapPacked: true,
        stopAtErrors: false, // Continue processing even if there are errors
        isEvalSupported: false, // Disable eval for security
        useWorkerFetch: false // Disable worker fetch to avoid CORS issues
      });

      // Enhanced timeout handling with better error messages
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('PDF loading timeout. The file might be too large or the worker failed to load.')), 30000);
      });

      let doc: PDFDocumentProxy;
      try {
        doc = await Promise.race([loadingTask.promise, timeoutPromise]) as PDFDocumentProxy;
        console.log('PDF document created successfully');
      } catch (loadError) {
        console.error('PDF loading error:', loadError);
        
        // Try with alternative worker configuration
        console.log('Retrying with alternative worker configuration...');
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc as unknown as string;
        
        const retryLoadingTask = pdfjsLib.getDocument({
          data,
          useSystemFonts: true,
          disableFontFace: true,
          verbosity: 0,
          maxImageSize: 512 * 512,
          stopAtErrors: false,
          isEvalSupported: false,
          useWorkerFetch: false
        });
        
        doc = await Promise.race([retryLoadingTask.promise, timeoutPromise]) as PDFDocumentProxy;
        console.log('PDF document created successfully on retry');
      }
      
      setPdfDoc(doc);
      pdfDocRef.current = doc;
      setNumPages(doc.numPages);
      // Get document info with error handling
      try {
        const info = await doc.getMetadata();
        setDocumentInfo(info);
      } catch (metaError) {
        console.warn('Could not load PDF metadata:', metaError);
      }
      
      console.log('✅ PDF loaded successfully:', doc.numPages, 'pages');
      return doc;
    } catch (err) {
      console.error('❌ Error loading PDF:', err);
      let errorMessage = 'Failed to load PDF';
      
      if (err instanceof Error) {
        if (err.message.includes('timeout')) {
          errorMessage = 'PDF loading timed out. The file might be too large or corrupted.';
        } else if (err.message.includes('fetch') || err.message.includes('network')) {
          errorMessage = 'Unable to load PDF file. Please check your internet connection and try again.';
        } else if (err.message.includes('worker')) {
          errorMessage = 'PDF worker failed to load. Please refresh the page and try again.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderAllPages = useCallback(async (options: PDFRenderOptions = {}) => {
    const doc = pdfDocRef.current;
    if (!doc) {
      console.warn('No PDF document loaded');
      return [];
    }

    try {
      setIsLoading(true);
      const { scale = 1.5, enableTextLayer = false } = options;
      const renders: PDFPageRender[] = [];

      console.log('🔄 Rendering all pages with scale:', scale);

      for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
        try {
          const page = await doc.getPage(pageNum);
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            console.error('Could not get canvas context for page', pageNum);
            continue;
          }

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };

          await page.render(renderContext).promise;

          const render: PDFPageRender = {
            canvas,
            width: viewport.width,
            height: viewport.height,
            pageNumber: pageNum
          };

          if (enableTextLayer) {
            try {
              const textContent = await page.getTextContent();
              const textLayer = document.createElement('div');
              textLayer.style.position = 'absolute';
              textLayer.style.left = '0';
              textLayer.style.top = '0';
              textLayer.style.right = '0';
              textLayer.style.bottom = '0';
              textLayer.style.overflow = 'hidden';
              textLayer.style.opacity = '0.2';
              textLayer.style.lineHeight = '1.0';

              textContent.items.forEach((textItem: any) => {
                if (textItem.str && textItem.str.trim()) {
                  const textDiv = document.createElement('div');
                  textDiv.textContent = textItem.str;
                  textDiv.style.position = 'absolute';
                  textDiv.style.whiteSpace = 'pre';
                  textDiv.style.color = 'transparent';
                  textDiv.style.transformOrigin = '0% 0%';
                  
                  const transform = textItem.transform;
                  if (transform) {
                    textDiv.style.transform = `matrix(${transform.join(',')})`;
                  }

                  textLayer.appendChild(textDiv);
                }
              });

              render.textLayer = textLayer;
            } catch (textError) {
              console.warn('Failed to create text layer for page', pageNum, ':', textError);
            }
          }

          renders.push(render);
          console.log(`✅ Rendered page ${pageNum}/${doc.numPages}`);
        } catch (pageError) {
          console.error(`❌ Error rendering page ${pageNum}:`, pageError);
        }
      }

      setPageRenders(renders);
      console.log('✅ All pages rendered successfully:', renders.length);
      return renders;
    } catch (err) {
      console.error('❌ Error rendering pages:', err);
      setError('Failed to render PDF pages');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []) ;

  const extractTextElements = useCallback(async (): Promise<PDFTextElement[]> => {
    const doc = pdfDocRef.current;
    if (!doc) {
      console.warn('No PDF document loaded for text extraction');
      return [];
    }

    try {
      const textElements: PDFTextElement[] = [];

      console.log('🔄 Extracting text elements from', doc.numPages, 'pages');

      for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
        try {
          const page = await doc.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });
          const textContent = await page.getTextContent();

          textContent.items.forEach((item: any, index: number) => {
            if (item.str && item.str.trim()) {
              const transform = item.transform;
              if (transform && transform.length >= 6) {
                const x = transform[4];
                const y = viewport.height - transform[5];
                const fontSize = Math.abs(transform[3]) || 12;
                const width = item.width || (item.str.length * fontSize * 0.6);
                const height = fontSize;

                textElements.push({
                  text: item.str.trim(),
                  x: x,
                  y: y - fontSize,
                  width: width,
                  height: height,
                  fontSize: fontSize,
                  fontFamily: item.fontName || 'Arial',
                  color: '#000000',
                  pageNumber: pageNum
                });
              }
            }
          });
        } catch (pageError) {
          console.error(`❌ Error extracting text from page ${pageNum}:`, pageError);
        }
      }

      console.log('✅ Extracted', textElements.length, 'text elements');
      return textElements;
    } catch (err) {
      console.error('❌ Error extracting text elements:', err);
      return [];
    }
  }, []);

  const searchInPDF = useCallback(async (searchTerm: string): Promise<PDFSearchResult[]> => {
    const doc = pdfDocRef.current;
    if (!doc || !searchTerm.trim()) return [];

    try {
      const results: PDFSearchResult[] = [];

      for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
        const page = await doc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const textContent = await page.getTextContent();

        textContent.items.forEach((item: any, index: number) => {
          if (item.str && item.str.toLowerCase().includes(searchTerm.toLowerCase())) {
            const transform = item.transform;
            const x = transform[4];
            const y = viewport.height - transform[5];
            const fontSize = Math.abs(transform[3]) || 12;
            const width = item.width || (item.str.length * fontSize * 0.6);
            const height = fontSize;

            const contextStart = Math.max(0, index - 2);
            const contextEnd = Math.min(textContent.items.length, index + 3);
            const context = textContent.items
              .slice(contextStart, contextEnd)
              .map((contextItem: any) => contextItem.str || '')
              .join(' ');

            results.push({
              pageNumber: pageNum,
              text: item.str,
              x: x,
              y: y - fontSize,
              width: width,
              height: height,
              context: context
            });
          }
        });
      }

      console.log('✅ Found', results.length, 'search results for:', searchTerm);
      return results;
    } catch (err) {
      console.error('❌ Error searching PDF:', err);
      return [];
    }
  }, []);

  const convertToImages = useCallback(async (options: ConvertToImagesOptions = {}): Promise<string[]> => {
    if (!pageRenders || pageRenders.length === 0) {
      console.warn('No rendered pages available for conversion');
      return [];
    }

    try {
      const { format = 'PNG', quality = 0.95 } = options;
      const images: string[] = [];

      pageRenders.forEach((render) => {
        const imageData = render.canvas.toDataURL(`image/${format.toLowerCase()}`, quality);
        images.push(imageData);
      });

      console.log('✅ Converted', images.length, 'pages to images');
      return images;
    } catch (err) {
      console.error('❌ Error converting to images:', err);
      return [];
    }
  }, [pageRenders]);

  const processWithPDFCo = useCallback(async (operation: string, params: any = {}) => {
    try {
      console.log('🔄 Processing with PDF.co API:', operation);
      
      // This is a placeholder for PDF.co integration
      // In a real implementation, you would call the actual PDF.co API
      switch (operation) {
        case 'textReplace':
          return { success: true, url: params.pdfUrl, replacements: 0 };
        case 'convertToImage':
          return { success: true, images: [] };
        default:
          throw new Error(`Unsupported PDF.co operation: ${operation}`);
      }
    } catch (error) {
      console.error('❌ PDF.co operation failed:', error);
      throw error;
    }
  }, []);

  return {
    isLoading,
    pageRenders,
    currentPage,
    setCurrentPage,
    numPages,
    documentInfo,
    error,
    loadPDF,
    renderAllPages,
    extractTextElements,
    searchInPDF,
    convertToImages,
    processWithPDFCo
  };
};
