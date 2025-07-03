
import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { toast } from '@/hooks/use-toast';

interface PDFTextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  color: string;
  backgroundColor: string;
  opacity: number;
  rotation: number;
  pageNumber: number;
  isEdited: boolean;
  originalText?: string;
}

interface PDFShape {
  id: string;
  type: 'rectangle' | 'circle' | 'line' | 'arrow';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  rotation: number;
  pageNumber: number;
}

interface PDFImage {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  rotation: number;
  pageNumber: number;
}

interface PDFPageData {
  pageNumber: number;
  width: number;
  height: number;
  backgroundImage: string;
  textElements: PDFTextElement[];
  shapes: PDFShape[];
  images: PDFImage[];
}

export const useCanvaStylePDFEditor = () => {
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [originalPdfBytes, setOriginalPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfPages, setPdfPages] = useState<PDFPageData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const [textElements, setTextElements] = useState<Map<string, PDFTextElement>>(new Map());
  const [shapes, setShapes] = useState<Map<string, PDFShape>>(new Map());
  const [images, setImages] = useState<Map<string, PDFImage>>(new Map());
  
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveHistoryState = useCallback(() => {
    const state = {
      textElements: new Map(textElements),
      shapes: new Map(shapes),
      images: new Map(images)
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(prev => prev + 1);
    }
    
    setHistory(newHistory);
  }, [textElements, shapes, images, history, historyIndex]);

  const loadPDF = useCallback(async (file: File) => {
    setIsLoading(true);
    console.log('Starting PDF load process...');
    
    try {
      // Reset states
      setPdfDocument(null);
      setOriginalPdfBytes(null);
      setPdfPages([]);
      setTextElements(new Map());
      setShapes(new Map());
      setImages(new Map());
      setCurrentPage(0);

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      setOriginalPdfBytes(uint8Array);

      // Initialize PDF.js with proper worker
      if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
      }

      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0
      });
      const pdfDoc = await loadingTask.promise;
      setPdfDocument(pdfDoc);

      const pages: PDFPageData[] = [];
      const allTextElements = new Map<string, PDFTextElement>();
      const scale = 1.5;

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not get canvas context');
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Extract text elements
        const textContent = await page.getTextContent({
          includeMarkedContent: false,
          disableCombineTextItems: false
        });
        
        const pageTextElements: PDFTextElement[] = [];

        textContent.items?.forEach((item: any, index: number) => {
          if ('str' in item && item.str && item.str.trim()) {
            const transform = item.transform;
            if (!transform || transform.length < 6) return;

            const [scaleX, skewY, skewX, scaleY, translateX, translateY] = transform;
            const fontSize = Math.abs(scaleY);
            
            const x = translateX;
            const y = viewport.height - translateY - fontSize;
            
            const textWidth = Math.max(item.width || item.str.length * fontSize * 0.6, item.str.length * fontSize * 0.5);
            const textHeight = fontSize * 1.3;
            
            const fontName = item.fontName || 'Arial';
            const isBold = fontName.toLowerCase().includes('bold');
            const isItalic = fontName.toLowerCase().includes('italic');

            const textElement: PDFTextElement = {
              id: `extracted-text-${pageNum}-${index}`,
              text: item.str,
              originalText: item.str,
              x: Math.round(x),
              y: Math.round(y),
              width: Math.round(textWidth),
              height: Math.round(textHeight),
              fontSize: Math.round(fontSize),
              fontFamily: 'Arial',
              fontWeight: isBold ? 'bold' : 'normal',
              fontStyle: isItalic ? 'italic' : 'normal',
              textAlign: 'left',
              color: '#000000',
              backgroundColor: 'transparent',
              opacity: 1,
              rotation: 0,
              pageNumber: pageNum,
              isEdited: false
            };

            pageTextElements.push(textElement);
            allTextElements.set(textElement.id, textElement);
          }
        });

        const pageData: PDFPageData = {
          pageNumber: pageNum,
          width: viewport.width,
          height: viewport.height,
          backgroundImage: canvas.toDataURL('image/png', 0.9),
          textElements: pageTextElements,
          shapes: [],
          images: []
        };

        pages.push(pageData);
      }

      setPdfPages(pages);
      setTextElements(allTextElements);
      setCurrentPage(0);
      
      toast({
        title: 'PDF Loaded Successfully',
        description: `Loaded ${pages.length} pages with ${allTextElements.size} text elements.`,
      });

    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({
        title: 'Error Loading PDF',
        description: `Failed to load PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
      
      setPdfPages([]);
      setTextElements(new Map());
      setPdfDocument(null);
      setOriginalPdfBytes(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTextElement = useCallback((elementId: string, updates: Partial<PDFTextElement>) => {
    setTextElements(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(elementId);
      
      if (existing) {
        const updated = { ...existing, ...updates, isEdited: true };
        newMap.set(elementId, updated);
        saveHistoryState();
      }
      
      return newMap;
    });
  }, [saveHistoryState]);

  const addTextElement = useCallback((pageNumber: number, x: number, y: number, text: string = 'New Text') => {
    const newId = `custom-text-${Date.now()}`;
    const newElement: PDFTextElement = {
      id: newId,
      text,
      x,
      y,
      width: text.length * 12,
      height: 20,
      fontSize: 16,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#000000',
      backgroundColor: 'transparent',
      opacity: 1,
      rotation: 0,
      pageNumber,
      isEdited: true
    };
    
    setTextElements(prev => {
      const newMap = new Map(prev);
      newMap.set(newId, newElement);
      return newMap;
    });
    
    setSelectedElementId(newId);
    saveHistoryState();
    return newId;
  }, [saveHistoryState]);

  const addShape = useCallback((pageNumber: number, type: PDFShape['type'], x: number, y: number) => {
    const newId = `shape-${Date.now()}`;
    const newShape: PDFShape = {
      id: newId,
      type,
      x,
      y,
      width: type === 'circle' ? 100 : 150,
      height: type === 'circle' ? 100 : 100,
      fill: '#3B82F6',
      stroke: '#1E40AF',
      strokeWidth: 2,
      opacity: 1,
      rotation: 0,
      pageNumber
    };
    
    setShapes(prev => {
      const newMap = new Map(prev);
      newMap.set(newId, newShape);
      return newMap;
    });
    
    setSelectedElementId(newId);
    saveHistoryState();
    return newId;
  }, [saveHistoryState]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setTextElements(new Map(prevState.textElements));
      setShapes(new Map(prevState.shapes));
      setImages(new Map(prevState.images));
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setTextElements(new Map(nextState.textElements));
      setShapes(new Map(nextState.shapes));
      setImages(new Map(nextState.images));
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex]);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    } : { r: 0, g: 0, b: 0 };
  };

  const exportPDF = useCallback(async (): Promise<Blob | null> => {
    if (!originalPdfBytes) {
      console.warn('No PDF document loaded for export');
      return null;
    }

    try {
      const pdfDoc = await PDFDocument.load(originalPdfBytes);
      const pages = pdfDoc.getPages();

      // Add text elements for each page
      for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
        const page = pages[pageIndex];
        const pageTextElements = Array.from(textElements.values()).filter(
          el => el.pageNumber === pageIndex + 1
        );

        for (const textElement of pageTextElements) {
          if (textElement.text && textElement.text.trim()) {
            const color = hexToRgb(textElement.color || '#000000');
            page.drawText(textElement.text, {
              x: textElement.x,
              y: page.getHeight() - textElement.y - (textElement.fontSize || 16),
              size: textElement.fontSize || 16,
              color: rgb(color.r, color.g, color.b)
            });
          }
        }

        // Add shapes for this page
        const pageShapes = Array.from(shapes.values()).filter(
          shape => shape.pageNumber === pageIndex + 1
        );

        for (const shape of pageShapes) {
          if (shape.type === 'rectangle') {
            const borderColor = hexToRgb(shape.stroke || '#000000');
            const fillColor = hexToRgb(shape.fill || '#000000');
            
            page.drawRectangle({
              x: shape.x,
              y: page.getHeight() - shape.y - shape.height,
              width: shape.width,
              height: shape.height,
              borderColor: rgb(borderColor.r, borderColor.g, borderColor.b),
              color: shape.fill && shape.fill !== 'transparent' ? rgb(fillColor.r, fillColor.g, fillColor.b) : undefined,
              opacity: shape.opacity || 1
            });
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      return new Blob([pdfBytes], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      return null;
    }
  }, [originalPdfBytes, textElements, shapes]);

  return {
    pdfDocument,
    pdfPages,
    currentPage,
    setCurrentPage,
    isLoading,
    textElements,
    shapes,
    images,
    selectedElementId,
    setSelectedElementId,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    loadPDF,
    updateTextElement,
    addTextElement,
    addShape,
    undo,
    redo,
    exportPDF
  };
};
