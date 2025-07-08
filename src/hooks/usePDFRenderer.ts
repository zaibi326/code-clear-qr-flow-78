
import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

interface PDFPageRender {
  canvas: HTMLCanvasElement;
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

export const usePDFRenderer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageRenders, setPageRenders] = useState<PDFPageRender[]>([]);
  const [numPages, setNumPages] = useState(0);
  const [documentInfo, setDocumentInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  // Initialize PDF.js worker
  if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
  }

  const loadPDF = useCallback(async (source: File | string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      let data: ArrayBuffer;
      
      if (source instanceof File) {
        data = await source.arrayBuffer();
      } else {
        const response = await fetch(source);
        data = await response.arrayBuffer();
      }

      const loadingTask = pdfjsLib.getDocument({
        data,
        useSystemFonts: true,
        disableFontFace: false
      });

      const doc = await loadingTask.promise;
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      
      // Get document info
      const info = await doc.getMetadata();
      setDocumentInfo(info);
      
      console.log('✅ PDF loaded successfully:', doc.numPages, 'pages');
    } catch (err) {
      console.error('❌ Error loading PDF:', err);
      setError('Failed to load PDF');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderAllPages = useCallback(async (options: { scale?: number; enableTextLayer?: boolean } = {}) => {
    if (!pdfDoc) return;

    try {
      setIsLoading(true);
      const { scale = 1.5 } = options;
      const renders: PDFPageRender[] = [];

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        await page.render(renderContext).promise;

        renders.push({
          canvas,
          width: viewport.width,
          height: viewport.height,
          pageNumber: pageNum
        });
      }

      setPageRenders(renders);
      console.log('✅ All pages rendered successfully');
    } catch (err) {
      console.error('❌ Error rendering pages:', err);
      setError('Failed to render PDF pages');
    } finally {
      setIsLoading(false);
    }
  }, [pdfDoc]);

  const extractTextElements = useCallback(async (): Promise<PDFTextElement[]> => {
    if (!pdfDoc) return [];

    try {
      const textElements: PDFTextElement[] = [];

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const textContent = await page.getTextContent();

        textContent.items.forEach((item: any, index: number) => {
          if (item.str && item.str.trim()) {
            const transform = item.transform;
            const x = transform[4];
            const y = viewport.height - transform[5];
            const fontSize = transform[0] || 12;
            const width = item.width || (item.str.length * fontSize * 0.6);
            const height = fontSize;

            textElements.push({
              text: item.str.trim(),
              x: x,
              y: y - fontSize, // Adjust for baseline
              width: width,
              height: height,
              fontSize: fontSize,
              fontFamily: item.fontName || 'Arial',
              color: '#000000',
              pageNumber: pageNum
            });
          }
        });
      }

      console.log('✅ Extracted', textElements.length, 'text elements');
      return textElements;
    } catch (err) {
      console.error('❌ Error extracting text elements:', err);
      return [];
    }
  }, [pdfDoc]);

  const searchInPDF = useCallback(async (searchTerm: string): Promise<PDFSearchResult[]> => {
    if (!pdfDoc || !searchTerm.trim()) return [];

    try {
      const results: PDFSearchResult[] = [];

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const textContent = await page.getTextContent();

        textContent.items.forEach((item: any, index: number) => {
          if (item.str && item.str.toLowerCase().includes(searchTerm.toLowerCase())) {
            const transform = item.transform;
            const x = transform[4];
            const y = viewport.height - transform[5];
            const fontSize = transform[0] || 12;
            const width = item.width || (item.str.length * fontSize * 0.6);
            const height = fontSize;

            // Get context from surrounding items
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
  }, [pdfDoc]);

  return {
    isLoading,
    pageRenders,
    numPages,
    documentInfo,
    error,
    loadPDF,
    renderAllPages,
    extractTextElements,
    searchInPDF
  };
};
