
import { useState, useCallback, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { toast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

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

interface PDFQRCode {
  id: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  rotation: number;
  pageNumber: number;
  backgroundColor: string;
  foregroundColor: string;
}

interface Layer {
  id: string;
  name: string;
  type: 'text' | 'shape' | 'image' | 'qr';
  visible: boolean;
  locked: boolean;
  pageNumber: number;
  zIndex: number;
}

interface ExportOptions {
  format: 'pdf' | 'png' | 'jpg';
  quality: number;
  resolution: 'low' | 'medium' | 'high' | 'print';
  pages: 'all' | 'current' | 'range';
  pageRange?: string;
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
  qrCodes: Map<string, PDFQRCode>;
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

  // New state for Phase 3 & 4 features
  const [qrCodes, setQrCodes] = useState<Map<string, PDFQRCode>>(new Map());
  const [layers, setLayers] = useState<Layer[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [maxZIndex, setMaxZIndex] = useState(100);

  const saveHistoryState = useCallback(() => {
    const state: HistoryState = {
      textElements: new Map(textElements),
      shapes: new Map(shapes),
      images: new Map(images),
      qrCodes: new Map(qrCodes)
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
  }, [textElements, shapes, images, qrCodes, history, historyIndex]);

  // Enhanced text extraction with better coordinate mapping
  const extractTextWithoutOverlap = useCallback(async (page: any, pageNumber: number, viewport: any): Promise<PDFTextElement[]> => {
    console.log(`Extracting text from page ${pageNumber} with viewport:`, viewport.width, 'x', viewport.height);
    
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
        
        // FIXED: Improved coordinate mapping for better positioning
        const x = translateX;
        const y = viewport.height - translateY - fontSize; // Correct Y coordinate mapping
        
        // Better width calculation based on actual text metrics
        const textWidth = Math.max(item.width || item.str.length * fontSize * 0.6, item.str.length * fontSize * 0.5);
        const textHeight = fontSize * 1.3; // Slightly increased for better coverage
        
        // Enhanced font detection
        const fontName = item.fontName || 'Arial';
        const isBold = fontName.toLowerCase().includes('bold');
        const isItalic = fontName.toLowerCase().includes('italic');
        
        // Color extraction with fallback
        let textColor = '#000000';
        if (item.color && Array.isArray(item.color)) {
          const r = Math.round((item.color[0] || 0) * 255);
          const g = Math.round((item.color[1] || 0) * 255);
          const b = Math.round((item.color[2] || 0) * 255);
          textColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }

        const textElement: PDFTextElement = {
          id: `extracted-text-${pageNumber}-${index}`,
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
        };

        textElements.push(textElement);
        console.log(`Extracted text element: "${item.str}" at (${x}, ${y}) size ${fontSize}`);
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

  // FIXED: Enhanced PDF loading with better background rendering (NO TEXT)
  const loadPDF = useCallback(async (file: File) => {
    setIsLoading(true);
    console.log('Loading PDF for Canva-style editing...');
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      setOriginalPdfBytes(uint8Array);

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      setPdfDocument(pdfDoc);

      const pages: PDFPageData[] = [];
      const allTextElements = new Map<string, PDFTextElement>();
      const scale = 2.0; // High quality rendering

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        
        // Create canvas for background WITHOUT TEXT
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // CRITICAL FIX: Render page WITHOUT text layer
        await page.render({
          canvasContext: context,
          viewport: viewport,
          intent: 'display'
          // Removed invalid renderTextLayer property
        }).promise;

        // Extract text elements for overlay
        const pageTextElements = await extractTextWithoutOverlap(page, pageNum, viewport);
        
        // Add to state map
        pageTextElements.forEach(textElement => {
          allTextElements.set(textElement.id, textElement);
        });

        pages.push({
          pageNumber: pageNum,
          width: viewport.width,
          height: viewport.height,
          backgroundImage: canvas.toDataURL('image/png', 0.95),
          textElements: pageTextElements,
          shapes: [],
          images: []
        });

        console.log(`Page ${pageNum}: Rendered background without text, extracted ${pageTextElements.length} text elements`);
      }

      setPdfPages(pages);
      setCurrentPage(0);
      
      // CRITICAL: Set the text elements in state
      setTextElements(allTextElements);
      console.log(`TOTAL TEXT ELEMENTS LOADED: ${allTextElements.size}`);
      
      // Reset other states
      setShapes(new Map());
      setImages(new Map());
      setQrCodes(new Map());
      setLayers([]);
      setMaxZIndex(100);
      setHistory([]);
      setHistoryIndex(-1);
      setSelectedElementId(null);

      // Update layers
      updateLayers();

      toast({
        title: 'PDF Loaded Successfully',
        description: `Canva-style editor ready! ${pages.length} pages with ${allTextElements.size} editable text elements.`,
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

  // Enhanced layer management - fix to work with new text elements
  const updateLayers = useCallback(() => {
    const newLayers: Layer[] = [];
    let zIndex = 1;

    // Add text layers
    Array.from(textElements.values()).forEach(element => {
      newLayers.push({
        id: element.id,
        name: element.text.substring(0, 20) + (element.text.length > 20 ? '...' : ''),
        type: 'text',
        visible: true,
        locked: false,
        pageNumber: element.pageNumber,
        zIndex: zIndex++
      });
    });

    // Add shape layers
    Array.from(shapes.values()).forEach(shape => {
      newLayers.push({
        id: shape.id,
        name: `${shape.type.charAt(0).toUpperCase() + shape.type.slice(1)}`,
        type: 'shape',
        visible: true,
        locked: false,
        pageNumber: shape.pageNumber,
        zIndex: zIndex++
      });
    });

    // Add image layers
    Array.from(images.values()).forEach(image => {
      newLayers.push({
        id: image.id,
        name: 'Image',
        type: 'image',
        visible: true,
        locked: false,
        pageNumber: image.pageNumber,
        zIndex: zIndex++
      });
    });

    // Add QR code layers
    Array.from(qrCodes.values()).forEach(qr => {
      newLayers.push({
        id: qr.id,
        name: qr.content.substring(0, 15) + (qr.content.length > 15 ? '...' : ''),
        type: 'qr',
        visible: true,
        locked: false,
        pageNumber: qr.pageNumber,
        zIndex: zIndex++
      });
    });

    setLayers(newLayers);
    setMaxZIndex(zIndex);
  }, [textElements, shapes, images, qrCodes]);

  // Text operations
  const updateTextElement = useCallback((elementId: string, updates: Partial<PDFTextElement>) => {
    console.log('Updating text element:', elementId, updates);
    
    setTextElements(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(elementId);
      
      if (existing) {
        const updated = { ...existing, ...updates, isEdited: true };
        newMap.set(elementId, updated);
        console.log('Text element updated:', updated);
        saveHistoryState();
      } else {
        console.warn('Text element not found for update:', elementId);
      }
      
      return newMap;
    });
    
    // Update layers after text element change
    setTimeout(() => updateLayers(), 0);
  }, [saveHistoryState, updateLayers]);

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
      fontWeight: 'normal', // Fix: Ensure proper typing
      fontStyle: 'normal', // Fix: Ensure proper typing
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

  // QR Code operations
  const addQRCode = useCallback((pageNumber: number, x: number, y: number, content: string = 'https://example.com') => {
    const newId = `qr-${Date.now()}`;
    const newQRCode: PDFQRCode = {
      id: newId,
      content,
      x,
      y,
      width: 100,
      height: 100,
      opacity: 1,
      rotation: 0,
      pageNumber,
      backgroundColor: '#FFFFFF',
      foregroundColor: '#000000'
    };
    
    setQrCodes(prev => {
      const newMap = new Map(prev);
      newMap.set(newId, newQRCode);
      return newMap;
    });
    
    setSelectedElementId(newId);
    saveHistoryState();
    updateLayers();
    return newId;
  }, [saveHistoryState, updateLayers]);

  const updateQRCode = useCallback((qrId: string, updates: Partial<PDFQRCode>) => {
    setQrCodes(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(qrId);
      
      if (existing) {
        newMap.set(qrId, { ...existing, ...updates });
        saveHistoryState();
        updateLayers();
      }
      
      return newMap;
    });
  }, [saveHistoryState, updateLayers]);

  // Enhanced delete operations
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

    setQrCodes(prev => {
      const newMap = new Map(prev);
      newMap.delete(elementId);
      return newMap;
    });
    
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
    
    saveHistoryState();
    updateLayers();
  }, [selectedElementId, saveHistoryState, updateLayers]);

  // Layer management operations
  const handleLayerToggleVisibility = useCallback((layerId: string) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    );
  }, []);

  const handleLayerToggleLock = useCallback((layerId: string) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, locked: !layer.locked }
          : layer
      )
    );
  }, []);

  const handleLayerMove = useCallback((layerId: string, direction: 'up' | 'down') => {
    const adjustment = direction === 'up' ? 1 : -1;
    setLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, zIndex: Math.max(1, layer.zIndex + adjustment) }
          : layer
      )
    );
  }, []);

  const duplicateElement = useCallback((elementId: string) => {
    const textElement = textElements.get(elementId);
    const shape = shapes.get(elementId);
    const image = images.get(elementId);
    const qrCode = qrCodes.get(elementId);

    if (textElement) {
      const newId = `text-${Date.now()}`;
      const duplicated = {
        ...textElement,
        id: newId,
        x: textElement.x + 10,
        y: textElement.y + 10
      };
      setTextElements(prev => new Map(prev).set(newId, duplicated));
      setSelectedElementId(newId);
    } else if (shape) {
      const newId = `shape-${Date.now()}`;
      const duplicated = {
        ...shape,
        id: newId,
        x: shape.x + 10,
        y: shape.y + 10
      };
      setShapes(prev => new Map(prev).set(newId, duplicated));
      setSelectedElementId(newId);
    } else if (image) {
      const newId = `image-${Date.now()}`;
      const duplicated = {
        ...image,
        id: newId,
        x: image.x + 10,
        y: image.y + 10
      };
      setImages(prev => new Map(prev).set(newId, duplicated));
      setSelectedElementId(newId);
    } else if (qrCode) {
      const newId = `qr-${Date.now()}`;
      const duplicated = {
        ...qrCode,
        id: newId,
        x: qrCode.x + 10,
        y: qrCode.y + 10
      };
      setQrCodes(prev => new Map(prev).set(newId, duplicated));
      setSelectedElementId(newId);
    }

    saveHistoryState();
    updateLayers();
  }, [textElements, shapes, images, qrCodes, saveHistoryState, updateLayers]);

  // Export functionality
  const exportPDF = useCallback(async (): Promise<Blob | null> => {
    if (!pdfDocument || pdfPages.length === 0) {
      console.warn('No PDF document loaded for export');
      return null;
    }

    try {
      // Create a new PDF document using pdf-lib
      const pdfDoc = await PDFDocument.create();

      // Process each page
      for (let pageIndex = 0; pageIndex < pdfPages.length; pageIndex++) {
        const pageData = pdfPages[pageIndex];
        
        // Add page from original PDF
        const [copiedPage] = await pdfDoc.copyPages(pdfDocument, [pageIndex]);
        const page = pdfDoc.addPage(copiedPage);

        // Add text elements for this page
        const pageTextElements = Array.from(textElements.values()).filter(
          el => el.pageNumber === pageIndex + 1
        );

        for (const textElement of pageTextElements) {
          const color = hexToRgb(textElement.color || '#000000');
          page.drawText(textElement.text || '', {
            x: textElement.x,
            y: page.getHeight() - textElement.y - (textElement.fontSize || 16),
            size: textElement.fontSize || 16,
            color: rgb(color.r, color.g, color.b)
          });
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

      // Generate PDF bytes
      const pdfBytes = await pdfDoc.save();
      return new Blob([pdfBytes], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      return null;
    }
  }, [pdfDocument, pdfPages, textElements, shapes]);

  // Helper function to convert hex color to RGB values (0-1 range)
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    } : { r: 0, g: 0, b: 0 };
  };

  // Export operations
  const exportWithOptions = useCallback(async (options: ExportOptions) => {
    if (!originalPdfBytes && !pdfPages.length) {
      toast({
        title: 'Nothing to Export',
        description: 'No content available for export.',
        variant: 'destructive'
      });
      return;
    }

    setIsExporting(true);
    
    try {
      if (options.format === 'pdf') {
        await exportPDF();
      } else {
        // Export as image
        const canvasElement = document.querySelector('.pdf-canvas') as HTMLElement;
        if (canvasElement) {
          const canvas = await html2canvas(canvasElement, {
            scale: options.resolution === 'print' ? 4 : 
                   options.resolution === 'high' ? 2 : 
                   options.resolution === 'medium' ? 1.5 : 1,
            useCORS: true,
            backgroundColor: '#ffffff'
          });

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `exported-document.${options.format}`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }
          }, `image/${options.format}`, options.quality / 100);

          toast({
            title: 'Export Successful',
            description: `Document exported as ${options.format.toUpperCase()}.`,
          });
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export document. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  }, [originalPdfBytes, pdfPages, exportPDF]);

  // Undo/Redo operations
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setTextElements(new Map(prevState.textElements));
      setShapes(new Map(prevState.shapes));
      setImages(new Map(prevState.images));
      setQrCodes(new Map(prevState.qrCodes));
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setTextElements(new Map(nextState.textElements));
      setShapes(new Map(nextState.shapes));
      setImages(new Map(nextState.images));
      setQrCodes(new Map(nextState.qrCodes));
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex]);

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
    exportPDF,
    
    // New Phase 3 & 4 features
    qrCodes,
    layers,
    isExporting,
    
    // QR operations
    addQRCode,
    updateQRCode,
    
    // Layer operations
    handleLayerToggleVisibility,
    handleLayerToggleLock,
    handleLayerMove,
    duplicateElement,
    
    // Export operations
    exportWithOptions
  };
};
