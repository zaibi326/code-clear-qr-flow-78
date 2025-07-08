import React, { useRef, useCallback, useState, useEffect } from 'react';
import { PDFElement } from '../ClearQRPDFEditor';
import { InlinePDFTextEditor } from './InlinePDFTextEditor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Move, 
  Type, 
  Image as ImageIcon, 
  Square, 
  Circle,
  Minus,
  Download,
  Save,
  X
} from 'lucide-react';

interface EnhancedPDFCanvasProps {
  pageRender?: { canvas: HTMLCanvasElement; width: number; height: number };
  elements: PDFElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<PDFElement>) => void;
  onAddElement: (element: Omit<PDFElement, 'id'>) => void;
  onDeleteElement: (id: string) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  activeTool: 'select' | 'text' | 'image' | 'shape';
  onToolChange: (tool: 'select' | 'text' | 'image' | 'shape') => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSave: () => void;
  onExport: () => void;
}

export const EnhancedPDFCanvas: React.FC<EnhancedPDFCanvasProps> = ({
  pageRender,
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onAddElement,
  onDeleteElement,
  zoom,
  onZoomChange,
  activeTool,
  onToolChange,
  currentPage,
  totalPages,
  onPageChange,
  onSave,
  onExport
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasWidth = pageRender ? pageRender.width : 800;
  const canvasHeight = pageRender ? pageRender.height : 1000;

  // Handle canvas click for adding elements
  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    if (editingElementId) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom;
    const y = (event.clientY - rect.top) / zoom;

    if (activeTool === 'text') {
      onAddElement({
        type: 'text',
        x,
        y,
        width: 200,
        height: 40,
        pageNumber: currentPage,
        text: 'Click to edit text',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'left',
        color: '#000000',
        backgroundColor: 'transparent',
        opacity: 1,
        rotation: 0,
        properties: {}
      });
      onToolChange('select');
    } else if (activeTool === 'shape') {
      onAddElement({
        type: 'shape',
        x,
        y,
        width: 100,
        height: 100,
        pageNumber: currentPage,
        shapeType: 'rectangle',
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 2,
        opacity: 0.8,
        rotation: 0,
        properties: {}
      });
      onToolChange('select');
    } else if (activeTool === 'select') {
      onSelectElement(null);
    }
  }, [activeTool, zoom, currentPage, onAddElement, onSelectElement, onToolChange, editingElementId]);

  // Handle element dragging
  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    if (editingElementId) return;
    
    e.stopPropagation();
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startX = (e.clientX - rect.left) / zoom;
    const startY = (e.clientY - rect.top) / zoom;

    setDraggedElement(elementId);
    setDragOffset({
      x: startX - element.x,
      y: startY - element.y
    });
    onSelectElement(elementId);
  }, [elements, zoom, onSelectElement, editingElementId]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedElement || editingElementId) return;

    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / zoom - dragOffset.x;
    const y = (e.clientY - rect.top) / zoom - dragOffset.y;

    onUpdateElement(draggedElement, { x: Math.max(0, x), y: Math.max(0, y) });
  }, [draggedElement, dragOffset, zoom, onUpdateElement, editingElementId]);

  const handleMouseUp = useCallback(() => {
    setDraggedElement(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedElementId && !editingElementId) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          onDeleteElement(selectedElementId);
          onSelectElement(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, editingElementId, onDeleteElement, onSelectElement]);

  const renderElement = (element: PDFElement) => {
    if (element.type === 'text') {
      return (
        <InlinePDFTextEditor
          key={element.id}
          element={{
            id: element.id,
            text: element.text || '',
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height,
            fontSize: element.fontSize || 16,
            fontFamily: element.fontFamily || 'Arial',
            fontWeight: element.fontWeight || 'normal',
            color: element.color || '#000000',
            textAlign: element.textAlign || 'left'
          }}
          scale={zoom}
          isEditing={editingElementId === element.id}
          onStartEdit={() => setEditingElementId(element.id)}
          onFinishEdit={(updates) => {
            onUpdateElement(element.id, updates);
            setEditingElementId(null);
          }}
          onCancel={() => setEditingElementId(null)}
        />
      );
    }

    if (element.type === 'shape') {
      return (
        <div
          key={element.id}
          className={`absolute cursor-move border-2 transition-all ${
            selectedElementId === element.id ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-blue-300'
          }`}
          style={{
            left: element.x * zoom,
            top: element.y * zoom,
            width: element.width * zoom,
            height: element.height * zoom,
            backgroundColor: element.fill,
            borderColor: element.stroke,
            borderWidth: (element.strokeWidth || 2) * zoom,
            opacity: element.opacity || 1,
            borderRadius: element.shapeType === 'circle' ? '50%' : '4px',
          }}
          onMouseDown={(e) => handleMouseDown(e, element.id)}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Enhanced Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Tool Selection */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <Button
              variant={activeTool === 'select' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onToolChange('select')}
              className="h-8"
            >
              <Move className="w-4 h-4 mr-2" />
              Select
            </Button>
            <Button
              variant={activeTool === 'text' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onToolChange('text')}
              className="h-8"
            >
              <Type className="w-4 h-4 mr-2" />
              Text
            </Button>
            <Button
              variant={activeTool === 'image' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onToolChange('image')}
              className="h-8"
              disabled
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Image
            </Button>
            <Button
              variant={activeTool === 'shape' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onToolChange('shape')}
              className="h-8"
            >
              <Square className="w-4 h-4 mr-2" />
              Shape
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onZoomChange(Math.max(0.25, zoom - 0.25))}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-3 py-1 bg-white rounded min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onZoomChange(Math.min(3, zoom + 0.25))}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="h-8"
            >
              Previous
            </Button>
            <span className="text-sm font-medium px-3 py-1 bg-white rounded min-w-[80px] text-center">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="h-8"
            >
              Next
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onSave} className="h-8">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button onClick={onExport} className="h-8">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto bg-gray-100">
        <Card className="shadow-2xl">
          <div
            ref={canvasContainerRef}
            className="relative bg-white overflow-hidden"
            style={{
              width: canvasWidth * zoom,
              height: canvasHeight * zoom,
              cursor: activeTool === 'text' || activeTool === 'shape' ? 'crosshair' : 'default'
            }}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* PDF Background */}
            {pageRender && (
              <canvas
                ref={(canvas) => {
                  if (canvas && pageRender.canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      canvas.width = canvasWidth * zoom;
                      canvas.height = canvasHeight * zoom;
                      ctx.scale(zoom, zoom);
                      ctx.drawImage(pageRender.canvas, 0, 0);
                    }
                  }
                }}
                className="absolute inset-0 w-full h-full"
                style={{ width: '100%', height: '100%' }}
              />
            )}

            {/* Elements Layer */}
            <div className="absolute inset-0 w-full h-full">
              {elements.map(renderElement)}
            </div>

            {/* Selection Overlay */}
            {selectedElementId && !editingElementId && (
              <SelectionOverlay
                element={elements.find(el => el.id === selectedElementId)!}
                zoom={zoom}
                onDelete={() => {
                  onDeleteElement(selectedElementId);
                  onSelectElement(null);
                }}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Selection overlay component
const SelectionOverlay: React.FC<{
  element: PDFElement;
  zoom: number;
  onDelete: () => void;
}> = ({ element, zoom, onDelete }) => {
  return (
    <div
      className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none"
      style={{
        left: element.x * zoom - 2,
        top: element.y * zoom - 2,
        width: element.width * zoom + 4,
        height: element.height * zoom + 4,
      }}
    >
      {/* Resize handles */}
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full pointer-events-auto cursor-nw-resize" />
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full pointer-events-auto cursor-ne-resize" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full pointer-events-auto cursor-sw-resize" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full pointer-events-auto cursor-se-resize" />
      
      {/* Delete button */}
      <Button
        variant="destructive"
        size="sm"
        className="absolute -top-8 -right-8 h-6 w-6 p-0 pointer-events-auto"
        onClick={onDelete}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
};
