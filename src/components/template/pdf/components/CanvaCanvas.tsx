import React, { useRef, useCallback, useState, useEffect } from 'react';
import { CanvaElement } from '../FullCanvaPDFEditor';
import { PDFPageRender } from '@/services/pdfRenderingService';
import { EnhancedTextEditor } from './EnhancedTextEditor';
import { CanvaImageElement } from './CanvaImageElement';
import { CanvaShapeElement } from './CanvaShapeElement';
import { CanvaAnnotationElement } from './CanvaAnnotationElement';

interface CanvaCanvasProps {
  pageRender?: PDFPageRender;
  elements: Map<string, CanvaElement>;
  selectedElementIds: Set<string>;
  currentPage: number;
  zoom: number;
  tool: string;
  onSelectElements: (ids: string[]) => void;
  onAddElement: (element: Omit<CanvaElement, 'id' | 'zIndex'>) => string;
  onUpdateElement: (id: string, updates: Partial<CanvaElement>) => void;
  onDeleteElement: (id: string) => void;
  searchTerm: string;
}

export const CanvaCanvas: React.FC<CanvaCanvasProps> = ({
  pageRender,
  elements,
  selectedElementIds,
  currentPage,
  zoom,
  tool,
  onSelectElements,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  searchTerm
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawPath, setDrawPath] = useState<Array<{x: number, y: number}>>([]);
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  // Get canvas dimensions
  const canvasWidth = pageRender ? pageRender.width * zoom : 800;
  const canvasHeight = pageRender ? pageRender.height * zoom : 1000;

  // Filter elements for current page
  const pageElements = Array.from(elements.values()).filter(
    element => element.pageNumber === currentPage && element.visible
  );

  // Sort elements by z-index
  const sortedElements = pageElements.sort((a, b) => a.zIndex - b.zIndex);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    // Clear selection if clicking on empty space
    if (tool === 'select') {
      onSelectElements([]);
      return;
    }

    // Add new elements based on selected tool
    switch (tool) {
      case 'text':
        onAddElement({
          type: 'text',
          x,
          y,
          width: 200,
          height: 40,
          pageNumber: currentPage,
          visible: true,
          locked: false,
          rotation: 0,
          opacity: 1,
          text: 'Click to edit',
          fontSize: 16,
          fontFamily: 'Arial',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textAlign: 'left',
          color: '#000000'
        });
        break;

      case 'rectangle':
        onAddElement({
          type: 'shape',
          x,
          y,
          width: 100,
          height: 60,
          pageNumber: currentPage,
          visible: true,
          locked: false,
          rotation: 0,
          opacity: 1,
          shapeType: 'rectangle',
          fill: '#3B82F6',
          stroke: '#1E40AF',
          strokeWidth: 2
        });
        break;

      case 'circle':
        onAddElement({
          type: 'shape',
          x,
          y,
          width: 80,
          height: 80,
          pageNumber: currentPage,
          visible: true,
          locked: false,
          rotation: 0,
          opacity: 1,
          shapeType: 'circle',
          fill: '#10B981',
          stroke: '#059669',
          strokeWidth: 2
        });
        break;

      case 'comment':
        onAddElement({
          type: 'comment',
          x,
          y,
          width: 24,
          height: 24,
          pageNumber: currentPage,
          visible: true,
          locked: false,
          rotation: 0,
          opacity: 1,
          annotationType: 'comment',
          commentText: 'New comment',
          fill: '#F59E0B'
        });
        break;
    }
  }, [tool, zoom, currentPage, onAddElement, onSelectElements]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (tool === 'draw') {
      setIsDrawing(true);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;
      setDrawPath([{ x, y }]);
    } else if (tool === 'select' && e.target === e.currentTarget) {
      // Start selection box
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setSelectionBox({ startX: x, startY: y, endX: x, endY: y });
    }
  }, [tool, zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDrawing && tool === 'draw') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;
      setDrawPath(prev => [...prev, { x, y }]);
    } else if (selectionBox) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setSelectionBox(prev => prev ? { ...prev, endX: x, endY: y } : null);
    }
  }, [isDrawing, tool, zoom, selectionBox]);

  const handleMouseUp = useCallback(() => {
    if (isDrawing && tool === 'draw' && drawPath.length > 1) {
      onAddElement({
        type: 'annotation',
        x: Math.min(...drawPath.map(p => p.x)),
        y: Math.min(...drawPath.map(p => p.y)),
        width: Math.max(...drawPath.map(p => p.x)) - Math.min(...drawPath.map(p => p.x)),
        height: Math.max(...drawPath.map(p => p.y)) - Math.min(...drawPath.map(p => p.y)),
        pageNumber: currentPage,
        visible: true,
        locked: false,
        rotation: 0,
        opacity: 1,
        annotationType: 'freehand',
        points: drawPath,
        stroke: '#EF4444',
        strokeWidth: 2
      });
    }
    
    if (selectionBox) {
      // Select elements within selection box
      const selectedIds: string[] = [];
      // Implementation for multi-select would go here
      onSelectElements(selectedIds);
      setSelectionBox(null);
    }
    
    setIsDrawing(false);
    setDrawPath([]);
  }, [isDrawing, tool, drawPath, currentPage, onAddElement, selectionBox, onSelectElements]);

  const getCursor = () => {
    switch (tool) {
      case 'text':
      case 'rectangle':
      case 'circle':
      case 'comment':
        return 'crosshair';
      case 'draw':
        return 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23000\' d=\'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z\'/%3E%3C/svg%3E") 12 12, auto';
      default:
        return 'default';
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-100">
      <div className="flex items-center justify-center min-h-full p-8">
        <div
          ref={canvasRef}
          className="relative bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            cursor: getCursor()
          }}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* PDF Background */}
          {pageRender && (
            <canvas
              width={pageRender.canvas.width}
              height={pageRender.canvas.height}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1
              }}
              ref={(canvas) => {
                if (canvas) {
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.drawImage(pageRender.canvas, 0, 0);
                  }
                }
              }}
            />
          )}

          {/* Elements Layer */}
          <div className="absolute inset-0" style={{ zIndex: 10 }}>
            {sortedElements.map((element) => {
              const isSelected = selectedElementIds.has(element.id);
              
              switch (element.type) {
                case 'text':
                  return (
                    <EnhancedTextEditor
                      key={element.id}
                      textElement={element as any}
                      scale={zoom}
                      isSelected={isSelected}
                      onSelect={() => onSelectElements([element.id])}
                      onUpdate={onUpdateElement}
                      onDelete={onDeleteElement}
                      searchTerm={searchTerm}
                    />
                  );
                
                case 'image':
                  return (
                    <CanvaImageElement
                      key={element.id}
                      element={element}
                      scale={zoom}
                      isSelected={isSelected}
                      onSelect={() => onSelectElements([element.id])}
                      onUpdate={onUpdateElement}
                      onDelete={onDeleteElement}
                    />
                  );
                
                case 'shape':
                  return (
                    <CanvaShapeElement
                      key={element.id}
                      element={element}
                      scale={zoom}
                      isSelected={isSelected}
                      onSelect={() => onSelectElements([element.id])}
                      onUpdate={onUpdateElement}
                      onDelete={onDeleteElement}
                    />
                  );
                
                case 'annotation':
                case 'highlight':
                case 'comment':
                  return (
                    <CanvaAnnotationElement
                      key={element.id}
                      element={element}
                      scale={zoom}
                      isSelected={isSelected}
                      onSelect={() => onSelectElements([element.id])}
                      onUpdate={onUpdateElement}
                      onDelete={onDeleteElement}
                    />
                  );
                
                default:
                  return null;
              }
            })}
          </div>

          {/* Drawing Path Preview */}
          {isDrawing && drawPath.length > 1 && (
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 100 }}
            >
              <path
                d={`M ${drawPath[0].x * zoom} ${drawPath[0].y * zoom} ${drawPath.slice(1).map(p => `L ${p.x * zoom} ${p.y * zoom}`).join(' ')}`}
                stroke="#EF4444"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {/* Selection Box */}
          {selectionBox && (
            <div
              className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none"
              style={{
                left: Math.min(selectionBox.startX, selectionBox.endX),
                top: Math.min(selectionBox.startY, selectionBox.endY),
                width: Math.abs(selectionBox.endX - selectionBox.startX),
                height: Math.abs(selectionBox.endY - selectionBox.startY),
                zIndex: 1000
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};