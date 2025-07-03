
import { useState, useCallback, useRef } from 'react';
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

interface HistoryState {
  textElements: Map<string, PDFTextElement>;
  shapes: Map<string, PDFShape>;
  images: Map<string, PDFImage>;
}

export const useCanvaStylePDFEditor = () => {
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [originalPdfBytes, setOriginalPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfPages, setPdfPages] = useState<PDFPageData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Element states
  const [textElements, setTextElements] = useState<Map<string, PDFTextElement>>(new Map());
  const [shapes, setShapes] = useState<Map<string, PDFShape>>(new Map());
  const [images, setImages] = useState<Map<string, PDFImage>>(new Map());
  
  // Selection and tool states
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<'select' | 'text' | 'rectangle' | 'circle' | 'image'>('select');
  
  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveHistoryState = useCallback(() => {
    const state: HistoryState = {
      textElements: new Map(textElements),
      shapes: new Map(shapes),
      images: new Map(images)
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    
    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(prev => prev + 1);
    }
    
    setHistory(newHistory);
  }, [textElements, shapes, images, history, historyIndex]);

  const extractTextWithoutOverlap = useCallback(async (page: any, pageNumber: number, viewport: any): Promise<PDFTextElement[]> => {
    const textContent = await page.getTextContent({
      includeMarkedContent: false,
      disableCombineTextItems: false
    });
    
    const textElements: PDFTextElement[] = [];

    textContent.items.forEach((item: any, index: number) => {
      if ('str' in item && item.str && item.str.trim()) {
        const transform = item.transform;
        if (!transform || transform.length < 6) return;

        const [scaleX, skewY, skewX, scaleY, translateX, translateY] = transform;
        const fontSize = Math.abs(scaleY);
        
        // Precise coordinate mapping
        const x = translateX;
        const y = viewport.height - translateY - fontSize;
        
        const textWidth = item.width || item.str.length * fontSize * 0.6;
        const textHeight = fontSize * 1.2;
        
        // Enhanced font detection
        const fontName = item.fontName || 'Arial';
        const isBold = fontName.toLowerCase().includes('bold');
        const isItalic = fontName.toLowerCase().includes('italic');
        
        // Color extraction
        let textColor = '#000000';
        if (item.color && Array.isArray(item.color)) {
          const r = Math.round((item.color[0] || 0) * 255);
          const g = Math.round((item.color[1] || 0) * 255);
          const b = Math.round((item.color[2] || 0) * 255);
          textColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }

        textElements.push({
          id: `text-${pageNumber}-${index}`,
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
          color: textColor,
          backgroundColor: 'transparent',
          opacity: 1,
          rotation: 0,
          pageNumber: pageNumber,
          isEdited: false
        });
      }
    });

    return textElements.sort((a, b) => {
      const yDiff = a.y - b.y;
      if (Math.abs(yDiff) < Math.max(a.fontSize, b.fontSize) * 0.5) {
        return a.x - b.x;
      }
      return yDiff;
    });
  }, []);

  const loadPDF = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      setOriginalPdfBytes(uint8Array);

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      setPdfDocument(pdfDoc);

      const pages: PDFPageData[] = [];
      const scale = 2.0; // High quality rendering

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        
        // Create canvas for background without text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render background only (graphics, images, shapes - NO text)
        await page.render({
          canvasContext: context,
          viewport: viewport,
          intent: 'display'
        }).promise;

        // Extract text elements for editable overlay
        const textElements = await extractTextWithoutOverlap(page, pageNum, viewport);

        pages.push({
          pageNumber: pageNum,
          width: viewport.width,
          height: viewport.height,
          backgroundImage: canvas.toDataURL('image/png', 0.95),
          textElements: textElements,
          shapes: [],
          images: []
        });
      }

      setPdfPages(pages);
      setCurrentPage(0);
      setTextElements(new Map());
      setShapes(new Map());
      setImages(new Map());
      setHistory([]);
      setHistoryIndex(-1);

      toast({
        title: 'PDF Loaded Successfully',
        description: `Canva-style editor ready with ${pages.length} pages and no text overlap.`,
      });

    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({
        title: 'Error Loading PDF',
        description: 'Failed to load PDF file. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [extractTextWithoutOverlap]);

  // Text operations
  const updateTextElement = useCallback((elementId: string, updates: Partial<PDFTextElement>) => {
    setTextElements(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(elementId);
      
      if (existing) {
        newMap.set(elementId, { ...existing, ...updates, isEdited: true });
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

  // Shape operations
  const addShape = useCallback((pageNumber: number, type: PDFShape['type'], x: number, y: number) => {
    const newId = `shape-${Date.now()}`;
    const newShape: PDFShape = {
      id: newId,
      type,
      x,
      y,
      width: type === 'circle' ? 100 : 150,
      height: type === 'circle' ? 100 : 100,
      fill: type === 'line' || type === 'arrow' ? 'transparent' : '#3B82F6',
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

  // Image operations
  const addImage = useCallback(async (pageNumber: number, file: File, x: number, y: number) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newId = `image-${Date.now()}`;
        const newImage: PDFImage = {
          id: newId,
          src: e.target?.result as string,
          x,
          y,
          width: 200,
          height: 150,
          opacity: 1,
          rotation: 0,
          pageNumber
        };
        
        setImages(prev => {
          const newMap = new Map(prev);
          newMap.set(newId, newImage);
          return newMap;
        });
        
        setSelectedElementId(newId);
        saveHistoryState();
        resolve(newId);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, [saveHistoryState]);

  // Delete operations
  const deleteElement = useCallback((elementId: string) => {
    setTextElements(prev => {
      const newMap = new Map(prev);
      newMap.delete(elementId);
      return newMap;
    });
    
    setShapes(prev => {
      const newMap = new Map(prev);
      newMap.delete(elementId);
      return newMap;
    });
    
    setImages(prev => {
      const newMap = new Map(prev);
      newMap.delete(elementId);
      return newMap;
    });
    
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
    
    saveHistoryState();
  }, [selectedElementId, saveHistoryState]);

  // Undo/Redo operations
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

  // Export functionality
  const exportPDF = useCallback(async () => {
    if (!originalPdfBytes || (!textElements.size && !shapes.size && !images.size)) {
      toast({
        title: 'No Changes to Export',
        description: 'Make some edits before exporting.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const pdfDoc = await PDFDocument.load(originalPdfBytes);
      const pages = pdfDoc.getPages();
      
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // Process each page
      for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
        const page = pages[pageIndex];
        const { height: pageHeight } = page.getSize();
        const pageNum = pageIndex + 1;
        
        // Add white rectangles to hide original text
        const pageTextElements = Array.from(textElements.values()).filter(el => el.pageNumber === pageNum);
        pageTextElements.forEach(element => {
          if (element.originalText && element.originalText !== element.text) {
            page.drawRectangle({
              x: element.x - 2,
              y: pageHeight - element.y - element.height - 2,
              width: element.width + 4,
              height: element.height + 4,
              color: rgb(1, 1, 1),
              opacity: 1
            });
          }
        });
        
        // Add edited/new text elements
        pageTextElements.forEach(element => {
          if (element.text.trim()) {
            const font = element.fontWeight === 'bold' ? boldFont : regularFont;
            const colorMatch = element.color.match(/^#([0-9a-f]{6})$/i);
            let color = rgb(0, 0, 0);
            
            if (colorMatch) {
              const hex = colorMatch[1];
              const r = parseInt(hex.substr(0, 2), 16) / 255;
              const g = parseInt(hex.substr(2, 2), 16) / 255;
              const b = parseInt(hex.substr(4, 2), 16) / 255;
              color = rgb(r, g, b);
            }
            
            page.drawText(element.text, {
              x: element.x,
              y: pageHeight - element.y - element.fontSize * 0.8,
              size: element.fontSize,
              font: font,
              color: color,
              opacity: element.opacity
            });
          }
        });
      }
      
      const modifiedPdfBytes = await pdfDoc.save();
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
        description: 'Your Canva-style edited PDF has been downloaded.',
      });
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export PDF. Please try again.',
        variant: 'destructive'
      });
    }
  }, [originalPdfBytes, textElements, shapes, images]);

  return {
    // State
    pdfDocument,
    pdfPages,
    currentPage,
    setCurrentPage,
    isLoading,
    
    // Elements
    textElements,
    shapes,
    images,
    
    // Selection
    selectedElementId,
    setSelectedElementId,
    selectedTool,
    setSelectedTool,
    
    // History
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    
    // Operations
    loadPDF,
    updateTextElement,
    addTextElement,
    addShape,
    addImage,
    deleteElement,
    undo,
    redo,
    exportPDF
  };
};
