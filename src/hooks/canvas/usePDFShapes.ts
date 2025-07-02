
import { useState, useCallback } from 'react';
import { PDFDocument, PDFPage, rgb } from 'pdf-lib';

interface PDFShape {
  id: string;
  type: 'rectangle' | 'circle' | 'triangle' | 'star' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: { r: number; g: number; b: number };
  strokeColor: { r: number; g: number; b: number };
  strokeWidth: number;
  opacity: number;
  rotation: number;
  pageNumber: number;
}

export const usePDFShapes = () => {
  const [shapes, setShapes] = useState<Map<string, PDFShape>>(new Map());

  const addShape = useCallback((
    type: PDFShape['type'],
    pageNumber: number,
    x: number,
    y: number
  ) => {
    const newId = `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newShape: PDFShape = {
      id: newId,
      type,
      x,
      y,
      width: type === 'circle' ? 100 : 120,
      height: type === 'circle' ? 100 : 80,
      fillColor: { r: 0.2, g: 0.6, b: 1 },
      strokeColor: { r: 0, g: 0, b: 0 },
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

    return newId;
  }, []);

  const updateShape = useCallback((shapeId: string, updates: Partial<PDFShape>) => {
    setShapes(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(shapeId);
      if (existing) {
        newMap.set(shapeId, { ...existing, ...updates });
      }
      return newMap;
    });
  }, []);

  const deleteShape = useCallback((shapeId: string) => {
    setShapes(prev => {
      const newMap = new Map(prev);
      newMap.delete(shapeId);
      return newMap;
    });
  }, []);

  const duplicateShape = useCallback((shapeId: string) => {
    const shape = shapes.get(shapeId);
    if (shape) {
      const newId = `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const duplicatedShape: PDFShape = {
        ...shape,
        id: newId,
        x: shape.x + 20,
        y: shape.y + 20
      };

      setShapes(prev => {
        const newMap = new Map(prev);
        newMap.set(newId, duplicatedShape);
        return newMap;
      });

      return newId;
    }
  }, [shapes]);

  const renderShapeInPDF = useCallback((page: PDFPage, shape: PDFShape, pageHeight: number) => {
    const pdfY = pageHeight - shape.y - shape.height;
    
    try {
      switch (shape.type) {
        case 'rectangle':
          if (shape.fillColor.r > 0 || shape.fillColor.g > 0 || shape.fillColor.b > 0) {
            page.drawRectangle({
              x: shape.x,
              y: pdfY,
              width: shape.width,
              height: shape.height,
              color: rgb(shape.fillColor.r, shape.fillColor.g, shape.fillColor.b),
              opacity: shape.opacity
            });
          }
          if (shape.strokeWidth > 0) {
            page.drawRectangle({
              x: shape.x,
              y: pdfY,
              width: shape.width,
              height: shape.height,
              borderColor: rgb(shape.strokeColor.r, shape.strokeColor.g, shape.strokeColor.b),
              borderWidth: shape.strokeWidth,
              opacity: shape.opacity
            });
          }
          break;

        case 'circle':
          const radius = Math.min(shape.width, shape.height) / 2;
          const centerX = shape.x + shape.width / 2;
          const centerY = pdfY + shape.height / 2;
          
          if (shape.fillColor.r > 0 || shape.fillColor.g > 0 || shape.fillColor.b > 0) {
            page.drawCircle({
              x: centerX,
              y: centerY,
              size: radius,
              color: rgb(shape.fillColor.r, shape.fillColor.g, shape.fillColor.b),
              opacity: shape.opacity
            });
          }
          if (shape.strokeWidth > 0) {
            page.drawCircle({
              x: centerX,
              y: centerY,
              size: radius,
              borderColor: rgb(shape.strokeColor.r, shape.strokeColor.g, shape.strokeColor.b),
              borderWidth: shape.strokeWidth,
              opacity: shape.opacity
            });
          }
          break;

        case 'line':
          page.drawLine({
            start: { x: shape.x, y: pdfY + shape.height },
            end: { x: shape.x + shape.width, y: pdfY },
            thickness: shape.strokeWidth,
            color: rgb(shape.strokeColor.r, shape.strokeColor.g, shape.strokeColor.b),
            opacity: shape.opacity
          });
          break;
      }
    } catch (error) {
      console.warn('Failed to render shape:', shape.id, error);
    }
  }, []);

  return {
    shapes,
    addShape,
    updateShape,
    deleteShape,
    duplicateShape,
    renderShapeInPDF
  };
};
