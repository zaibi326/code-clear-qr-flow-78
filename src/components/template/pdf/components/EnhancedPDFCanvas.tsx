import React, { useRef, useCallback, useState, useEffect } from 'react';
import { PDFElement } from '../ClearQRPDFEditor';
import { InlinePDFTextEditor } from './InlinePDFTextEditor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Type, 
  Square, 
  Download,
  Save,
  X,
  MousePointer,
  Eye,
  EyeOff
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
  const [showOriginalPDF, setShowOriginalPDF] = useState(true);

  const canvasWidth = pageRender ? pageRender.width : 800;
  const canvasHeight = pageRender ? pageRender.height : 1000;

  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    if (editingElementId) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom;
    const y = (event.clientY - rect.top) / zoom;

    if (activeTool === 'text') {
      const newElement = {
        type: 'text' as const,
        x,
        y,
        width: 200,
        height: 40,
        pageNumber: currentPage,
        text: 'Click to edit text',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal' as const,
        fontStyle: 'normal' as const,
        textAlign: 'left' as const,
        color: '#000000',
        backgroundColor: 'transparent',
        opacity: 1,
        rotation: 0,
        properties: {}
      };
      
      onAddElement(newElement);
      onToolChange('select');
      
      // Generate a temporary ID for immediate editing
      const tempId = `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setTimeout(() => {
        // Find the newly added element by checking the latest one
        const latestElement = elements
          .filter(el => el.type === 'text' && el.pageNumber === currentPage)
          .sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime())[0];
        
        if (latestElement) {
          setEditingElementId(latestElement.id);
        }
      }, 100);
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
      setEditingElementId(null);
    }
  }, [activeTool, zoom, currentPage, onAddElement, onSelectElement, onToolChange, editingElementId, elements]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingElementId) return; // Don't handle shortcuts while editing
      
      if (selectedElementId) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          onDeleteElement(selectedElementId);
          onSelectElement(null);
        } else if (e.key === 'Enter' || e.key === 'F2') {
          // Start editing selected text element
          const element = elements.find(el => el.id === selectedElementId);
          if (element?.type === 'text') {
            setEditingElementId(selectedElementId);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, editingElementId, onDeleteElement, onSelectElement, elements]);

  const currentPageElements = elements.filter(el => el.pageNumber === currentPage);

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
          onStartEdit={() => {
            setEditingElementId(element.id);
            onSelectElement(element.id);
          }}
          onFinishEdit={(updates) => {
            onUpdateElement(element.id, { ...updates, isEdited: true });
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
          className={`absolute cursor-move transition-all ${
            selectedElementId === element.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:ring-1 hover:ring-blue-300'
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
              title="Select Tool"
            >
              <MousePointer className="w-4 h-4 mr-2" />
              Select
            </Button>
            <Button
              variant={activeTool === 'text' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onToolChange('text')}
              className="h-8"
              title="Add Text"
            >
              <Type className="w-4 h-4 mr-2" />
              Text
            </Button>
            <Button
              variant={activeTool === 'shape' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onToolChange('shape')}
              className="h-8"
              title="Add Shape"
            >
              <Square className="w-4 h-4 mr-2" />
              Shape
            </Button>
          </div>

          {/* PDF Background Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <Button
              variant={showOriginalPDF ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowOriginalPDF(!showOriginalPDF)}
              className="h-8"
              title={showOriginalPDF ? "Hide Original PDF" : "Show Original PDF"}
            >
              {showOriginalPDF ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showOriginalPDF ? 'Hide PDF' : 'Show PDF'}
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onZoomChange(Math.max(0.25, zoom - 0.25))}
              className="h-8 w-8 p-0"
              title="Zoom Out"
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
              title="Zoom In"
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
          {activeTool === 'text' && (
            <div className="text-sm text-gray-600 mr-4">
              Click anywhere to add text
            </div>
          )}
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
      <div className="flex-1 overflow-auto bg-gray-100">
        <div className="flex items-start justify-center p-4 min-h-full">
          <Card className="shadow-2xl">
            <div
              ref={canvasContainerRef}
              className="relative bg-white overflow-visible"
              style={{
                width: canvasWidth * zoom,
                height: canvasHeight * zoom,
                cursor: activeTool === 'text' || activeTool === 'shape' ? 'crosshair' : 'default',
              }}
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* PDF Background - Only show when toggled on */}
              {showOriginalPDF && pageRender && (
                <canvas
                  ref={(canvas) => {
                    if (canvas && pageRender.canvas) {
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        canvas.width = canvasWidth * zoom;
                        canvas.height = canvasHeight * zoom;
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.scale(zoom, zoom);
                        ctx.drawImage(pageRender.canvas, 0, 0);
                      }
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-30"
                  style={{ width: '100%', height: '100%' }}
                />
              )}

              {/* Elements Layer */}
              <div className="absolute inset-0 w-full h-full">
                {currentPageElements.map(renderElement)}
              </div>

              {/* Selection Overlay */}
              {selectedElementId && !editingElementId && (
                <SelectionOverlay
                  element={currentPageElements.find(el => el.id === selectedElementId)!}
                  zoom={zoom}
                  onDelete={() => {
                    onDeleteElement(selectedElementId);
                    onSelectElement(null);
                  }}
                  onEdit={() => {
                    const element = currentPageElements.find(el => el.id === selectedElementId);
                    if (element?.type === 'text') {
                      setEditingElementId(selectedElementId);
                    }
                  }}
                />
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-white border-t border-gray-200 px-6 py-2">
        <div className="text-xs text-gray-500 flex items-center justify-center gap-6">
          <span>• Click on text to edit directly</span>
          <span>• Press Enter or F2 to edit selected text</span>
          <span>• Press Delete to remove selected element</span>
          <span>• Use {showOriginalPDF ? 'Hide PDF' : 'Show PDF'} to toggle original background</span>
        </div>
      </div>
    </div>
  );
};

// Selection overlay component
const SelectionOverlay: React.FC<{
  element: PDFElement;
  zoom: number;
  onDelete: () => void;
  onEdit: () => void;
}> = ({ element, zoom, onDelete, onEdit }) => {
  if (!element) return null;

  return (
    <div
      className="absolute border-2 border-blue-500 bg-blue-500/5 pointer-events-none"
      style={{
        left: element.x * zoom - 2,
        top: element.y * zoom - 2,
        width: element.width * zoom + 4,
        height: element.height * zoom + 4,
      }}
    >
      {/* Resize handles */}
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
      
      {/* Action buttons */}
      <div className="absolute -top-10 -right-0 flex gap-1 pointer-events-auto">
        {element.type === 'text' && (
          <Button
            variant="secondary"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onEdit}
            title="Edit Text"
          >
            <Type className="w-3 h-3" />
          </Button>
        )}
        <Button
          variant="destructive"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onDelete}
          title="Delete Element"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
