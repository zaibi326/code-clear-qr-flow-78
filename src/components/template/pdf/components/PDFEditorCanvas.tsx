
import React, { useRef, useCallback } from 'react';
import { PDFElement } from '../ClearQRPDFEditor';
import { CanvaStyleTextEditor } from './CanvaStyleTextEditor';

interface PDFEditorCanvasProps {
  pageRender?: { canvas: HTMLCanvasElement; width: number; height: number };
  elements: PDFElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<PDFElement>) => void;
  onAddElement: (element: Omit<PDFElement, 'id'>) => void;
  zoom: number;
  activeTool: 'select' | 'text' | 'image' | 'shape';
  currentPage: number;
}

export const PDFEditorCanvas: React.FC<PDFEditorCanvasProps> = ({
  pageRender,
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onAddElement,
  zoom,
  activeTool,
  currentPage
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    if (activeTool === 'select') {
      onSelectElement(null);
      return;
    }

    if (activeTool === 'text') {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / zoom;
      const y = (event.clientY - rect.top) / zoom;

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
        properties: {} // Add required properties field
      });
    }
  }, [activeTool, zoom, currentPage, onSelectElement, onAddElement]);

  const canvasWidth = pageRender ? pageRender.width : 800;
  const canvasHeight = pageRender ? pageRender.height : 1000;

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div 
        ref={canvasContainerRef}
        className="relative bg-white shadow-lg rounded-lg overflow-hidden"
        style={{
          width: canvasWidth * zoom,
          height: canvasHeight * zoom,
          cursor: activeTool === 'text' ? 'crosshair' : 'default'
        }}
        onClick={handleCanvasClick}
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
          {elements.map((element) => {
            if (element.type === 'text') {
              return (
                <CanvaStyleTextEditor
                  key={element.id}
                  textElement={{
                    id: element.id,
                    text: element.text || '',
                    x: element.x,
                    y: element.y,
                    width: element.width,
                    height: element.height,
                    fontSize: element.fontSize || 16,
                    fontFamily: element.fontFamily || 'Arial',
                    fontWeight: element.fontWeight || 'normal',
                    fontStyle: element.fontStyle || 'normal',
                    textAlign: element.textAlign || 'left',
                    color: element.color || '#000000',
                    backgroundColor: element.backgroundColor || 'transparent',
                    opacity: element.opacity || 1,
                    rotation: element.rotation || 0,
                    pageNumber: element.pageNumber,
                    isEdited: element.isEdited || false,
                    originalText: element.text
                  }}
                  scale={zoom}
                  isSelected={selectedElementId === element.id}
                  onSelect={() => onSelectElement(element.id)}
                  onUpdate={(id, updates) => {
                    onUpdateElement(id, updates);
                  }}
                />
              );
            }

            // Render other element types (image, shape) here
            return null;
          })}
        </div>

        {/* Overlay for non-select tools */}
        {activeTool !== 'select' && (
          <div 
            className="absolute inset-0 w-full h-full pointer-events-auto"
            style={{ zIndex: 1000 }}
          />
        )}
      </div>
    </div>
  );
};
