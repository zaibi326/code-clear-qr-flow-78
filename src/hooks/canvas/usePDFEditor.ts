
import { useState, useCallback, useRef } from 'react';
import { Canvas, FabricObject, IText, Rect, Circle, FabricImage } from 'fabric';
import * as pdfjsLib from 'pdfjs-dist';
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

  const saveState = useCallback(() => {
    if (!fabricCanvas) return;
    const state = JSON.stringify(fabricCanvas.toJSON());
    setUndoStack(prev => [...prev.slice(-19), state]);
    setRedoStack([]);
  }, [fabricCanvas]);

  const loadPDF = useCallback(async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages: PDFPage[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        const textContent = await page.getTextContent();
        const textItems: TextItem[] = textContent.items.map((item: any) => {
          const transform = item.transform;
          return {
            str: item.str,
            x: transform[4],
            y: viewport.height - transform[5],
            width: item.width,
            height: item.height,
            fontName: item.fontName,
            fontSize: transform[0] || 12
          };
        });

        const imageData = canvas.toDataURL('image/png');
        const thumbnailData = canvas.toDataURL('image/png', 0.3);

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
      const img = await FabricImage.fromURL(page.originalImage);
      img.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
        scaleX: 800 / img.width!,
        scaleY: 600 / img.height!
      });
      
      fabricCanvas.add(img);
      fabricCanvas.sendObjectToBack(img);

      const scaleX = 800 / img.width!;
      const scaleY = 600 / img.height!;

      page.textContent.forEach((textItem: TextItem) => {
        const text = new IText(textItem.str, {
          left: textItem.x * scaleX,
          top: textItem.y * scaleY,
          fontSize: textItem.fontSize * scaleX,
          fill: '#000000',
          fontFamily: 'Arial',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: 2,
          cornerSize: 6,
          transparentCorners: false,
          borderColor: '#2196F3',
          cornerColor: '#2196F3'
        });
        
        fabricCanvas.add(text);
      });
      
      fabricCanvas.renderAll();
      setCurrentPage(pageIndex);
      saveState();
    } catch (error) {
      console.error('Error loading page:', error);
    }
  }, [fabricCanvas, pdfPages, saveState]);

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
    saveState,
    loadPDF,
    loadPageToCanvas
  };
};
