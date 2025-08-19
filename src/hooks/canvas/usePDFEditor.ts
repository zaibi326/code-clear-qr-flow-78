
import { useState, useCallback, useRef } from 'react';
import { Canvas, FabricObject, IText, Rect, Circle, FabricImage } from 'fabric';
import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { toast } from '@/hooks/use-toast';

interface PDFPage {
  pageNumber: number;
  canvas: Canvas;
  thumbnail: string;
  originalImage: string;
  textContent: any[];
}

interface TextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontName: string;
  fontSize: number;
  transform: number[];
}

export const usePDFEditor = () => {
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPages, setPdfPages] = useState<PDFPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [zoom, setZoom] = useState(1);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [editMode, setEditMode] = useState<'select' | 'text' | 'highlight'>('select');
  const [isTextEditingMode, setIsTextEditingMode] = useState(false);

  const saveState = useCallback(() => {
    if (!fabricCanvas) return;
    const state = JSON.stringify(fabricCanvas.toJSON());
    setUndoStack(prev => [...prev.slice(-19), state]);
    setRedoStack([]);
  }, [fabricCanvas]);

  const loadPDF = useCallback(async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      try { pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc as unknown as string; } catch {}
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages: PDFPage[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Get text content with more detailed information
        const textContent = await page.getTextContent();
        const textItems: TextItem[] = textContent.items.map((item: any) => {
          const transform = item.transform;
          const x = transform[4];
          const y = viewport.height - transform[5];
          
          return {
            str: item.str.trim(),
            x: x,
            y: y - (transform[0] || 12), // Adjust for font baseline
            width: item.width || (item.str.length * (transform[0] || 12) * 0.6),
            height: transform[0] || 12,
            fontName: item.fontName || 'Arial',
            fontSize: transform[0] || 12,
            transform: transform
          };
        }).filter(item => item.str.length > 0); // Filter out empty strings

        const imageData = canvas.toDataURL('image/png');
        const thumbnailCanvas = document.createElement('canvas');
        const thumbnailContext = thumbnailCanvas.getContext('2d')!;
        thumbnailCanvas.width = 120;
        thumbnailCanvas.height = 160;
        thumbnailContext.drawImage(canvas, 0, 0, 120, 160);
        const thumbnailData = thumbnailCanvas.toDataURL('image/png', 0.7);

        pages.push({
          pageNumber: pageNum,
          canvas: new Canvas(canvas),
          thumbnail: thumbnailData,
          originalImage: imageData,
          textContent: textItems
        });
      }

      setPdfPages(pages);
      if (pages.length > 0) {
        loadPageToCanvas(0);
      }
      
      toast({
        title: 'PDF Loaded Successfully',
        description: `Loaded ${pages.length} page(s). Click on text to edit directly.`,
      });
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({
        title: 'Error loading PDF',
        description: 'Failed to load PDF file. Please try again.',
        variant: 'destructive'
      });
    }
  }, []);

  const loadPageToCanvas = useCallback(async (pageIndex: number) => {
    if (!fabricCanvas || !pdfPages[pageIndex]) return;

    fabricCanvas.clear();
    const page = pdfPages[pageIndex];
    
    try {
      // Load background image
      const img = await FabricImage.fromURL(page.originalImage);
      const canvasWidth = 800;
      const canvasHeight = 600;
      
      const scaleX = canvasWidth / img.width!;
      const scaleY = canvasHeight / img.height!;
      const scale = Math.min(scaleX, scaleY);
      
      img.set({
        left: (canvasWidth - img.width! * scale) / 2,
        top: (canvasHeight - img.height! * scale) / 2,
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false
      });
      
      // Add custom property to identify background
      (img as any)._pdfTextId = 'background';
      
      fabricCanvas.add(img);
      fabricCanvas.sendObjectToBack(img);

      // Add editable text overlays for each text item
      page.textContent.forEach((textItem: TextItem, index) => {
        if (textItem.str && textItem.str.trim()) {
          const text = new IText(textItem.str, {
            left: (textItem.x * scale) + img.left!,
            top: (textItem.y * scale) + img.top!,
            fontSize: Math.max(8, textItem.fontSize * scale),
            fill: 'transparent', // Start transparent so original PDF text shows through
            fontFamily: 'Arial',
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            cornerColor: 'transparent',
            transparentCorners: true,
            padding: 2,
            hoverCursor: 'text',
            moveCursor: 'text'
          });

          // Add custom property to identify PDF text
          (text as any)._pdfTextId = `pdf-text-${index}`;

          // Add click handler for text editing
          text.on('mousedown', () => {
            if (editMode === 'text') {
              // Make text visible and editable
              text.set({
                fill: '#000000',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: '#2196F3',
                cornerColor: '#2196F3'
              });
              fabricCanvas.renderAll();
              
              setTimeout(() => {
                text.enterEditing();
                text.selectAll();
              }, 100);
            }
          });

          // Handle text editing completion
          text.on('editing:exited', () => {
            if (text.text?.trim()) {
              text.set({
                fill: '#000000',
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
              });
            } else {
              text.set({
                fill: 'transparent',
                backgroundColor: 'transparent'
              });
            }
            fabricCanvas.renderAll();
            saveState();
          });
          
          fabricCanvas.add(text);
        }
      });
      
      fabricCanvas.renderAll();
      setCurrentPage(pageIndex);
      saveState();
    } catch (error) {
      console.error('Error loading page:', error);
      toast({
        title: 'Error loading page',
        description: 'Failed to load PDF page. Please try again.',
        variant: 'destructive'
      });
    }
  }, [fabricCanvas, pdfPages, saveState, editMode]);

  const enableTextEditing = useCallback(() => {
    setIsTextEditingMode(true);
    setEditMode('text');
    
    if (fabricCanvas) {
      // Make all PDF text elements visible and highlight them
      fabricCanvas.getObjects().forEach(obj => {
        const pdfTextId = (obj as any)._pdfTextId;
        if (pdfTextId && pdfTextId.startsWith('pdf-text-')) {
          obj.set({
            fill: 'rgba(0, 0, 0, 0.1)',
            backgroundColor: 'rgba(173, 216, 230, 0.3)',
            borderColor: 'rgba(30, 144, 255, 0.5)',
            borderDashArray: [2, 2]
          });
        }
      });
      fabricCanvas.renderAll();
      
      toast({
        title: 'Text Editing Mode',
        description: 'Click on any text to edit it directly. Text areas are highlighted in blue.',
      });
    }
  }, [fabricCanvas, setEditMode]);

  const disableTextEditing = useCallback(() => {
    setIsTextEditingMode(false);
    setEditMode('select');
    
    if (fabricCanvas) {
      // Hide text overlays that haven't been edited
      fabricCanvas.getObjects().forEach(obj => {
        const pdfTextId = (obj as any)._pdfTextId;
        if (pdfTextId && pdfTextId.startsWith('pdf-text-')) {
          const textObj = obj as IText;
          if (!textObj.text || textObj.text.trim() === '') {
            textObj.set({
              fill: 'transparent',
              backgroundColor: 'transparent',
              borderColor: 'transparent'
            });
          } else {
            textObj.set({
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderColor: 'transparent'
            });
          }
        }
      });
      fabricCanvas.renderAll();
    }
  }, [fabricCanvas, setEditMode]);

  return {
    fabricCanvas,
    setFabricCanvas,
    pdfFile,
    setPdfFile,
    pdfPages,
    currentPage,
    selectedObject,
    setSelectedObject,
    zoom,
    setZoom,
    undoStack,
    redoStack,
    editMode,
    setEditMode,
    isTextEditingMode,
    saveState,
    loadPDF,
    loadPageToCanvas,
    enableTextEditing,
    disableTextEditing
  };
};
