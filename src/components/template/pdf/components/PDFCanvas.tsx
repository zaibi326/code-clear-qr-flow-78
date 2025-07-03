
import React, { useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Image, Text, Rect, Circle } from 'react-konva';
import { CanvaStyleTextEditor } from './CanvaStyleTextEditor';

interface PDFCanvasProps {
  pageData: any;
  zoom: number;
  selectedTool: string;
  selectedElementId: string | null;
  textElements: Map<string, any>;
  shapes: Map<string, any>;
  images: Map<string, any>;
  onSelectElement: (id: string | null) => void;
  onUpdateTextElement: (id: string, updates: any) => void;
  onAddTextElement: (pageNumber: number, x: number, y: number, text?: string) => string;
  onAddShape: (pageNumber: number, type: string, x: number, y: number) => string;
  currentPage: number;
}

export const PDFCanvas: React.FC<PDFCanvasProps> = ({
  pageData,
  zoom,
  selectedTool,
  selectedElementId,
  textElements,
  shapes,
  images,
  onSelectElement,
  onUpdateTextElement,
  onAddTextElement,
  onAddShape,
  currentPage
}) => {
  const stageRef = useRef<any>(null);

  const handleCanvasClick = useCallback((e: any) => {
    if (e.target === e.target.getStage()) {
      const pos = e.target.getPointerPosition();
      const x = pos.x / zoom;
      const y = pos.y / zoom;

      if (selectedTool === 'text') {
        onAddTextElement(currentPage + 1, x, y, 'Click to edit');
      } else if (selectedTool === 'shape') {
        onAddShape(currentPage + 1, 'rectangle', x, y);
      } else if (selectedTool === 'select') {
        onSelectElement(null);
      }
    }
  }, [selectedTool, currentPage, zoom, onAddTextElement, onAddShape, onSelectElement]);

  if (!pageData) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center p-8">
          <div className="text-lg font-medium text-gray-600 mb-2">No Page Data</div>
          <div className="text-sm text-gray-500">Please upload a PDF to get started</div>
        </div>
      </div>
    );
  }

  const currentPageTextElements = Array.from(textElements.values()).filter(
    el => el.pageNumber === currentPage + 1
  );
  const currentPageShapes = Array.from(shapes.values()).filter(
    shape => shape.pageNumber === currentPage + 1
  );

  return (
    <div className="flex items-center justify-center min-h-full bg-gray-50 p-4">
      <div 
        className="bg-white rounded-lg shadow-xl relative border border-gray-200"
        style={{
          width: Math.max(600, pageData.width * zoom),
          height: Math.max(400, pageData.height * zoom),
          cursor: selectedTool === 'select' ? 'default' : 'crosshair'
        }}
      >
        {/* Background PDF Image */}
        {pageData.backgroundImage ? (
          <div 
            className="w-full h-full absolute inset-0 rounded-lg bg-white"
            style={{
              backgroundImage: `url(${pageData.backgroundImage})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ) : (
          <div className="w-full h-full absolute inset-0 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">PDF Page {currentPage + 1}</div>
              <div className="text-sm">Click to add elements</div>
            </div>
          </div>
        )}

        {/* Konva Stage for Shapes */}
        <Stage
          width={Math.max(600, pageData.width * zoom)}
          height={Math.max(400, pageData.height * zoom)}
          scaleX={zoom}
          scaleY={zoom}
          onClick={handleCanvasClick}
          ref={stageRef}
          className="absolute inset-0"
        >
          <Layer>
            {currentPageShapes.map((shape) => {
              if (shape.type === 'rectangle') {
                return (
                  <Rect
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    fill={shape.fill || '#3B82F6'}
                    stroke={shape.stroke || '#1E40AF'}
                    strokeWidth={shape.strokeWidth || 2}
                    opacity={shape.opacity || 1}
                    onClick={() => onSelectElement(shape.id)}
                  />
                );
              } else if (shape.type === 'circle') {
                return (
                  <Circle
                    key={shape.id}
                    x={shape.x + (shape.width || 100) / 2}
                    y={shape.y + (shape.height || 100) / 2}
                    radius={(shape.width || 100) / 2}
                    fill={shape.fill || '#3B82F6'}
                    stroke={shape.stroke || '#1E40AF'}
                    strokeWidth={shape.strokeWidth || 2}
                    opacity={shape.opacity || 1}
                    onClick={() => onSelectElement(shape.id)}
                  />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>

        {/* Text Elements Overlay */}
        {currentPageTextElements.map((textElement) => (
          <CanvaStyleTextEditor
            key={textElement.id}
            textElement={textElement}
            scale={zoom}
            isSelected={selectedElementId === textElement.id}
            onSelect={() => onSelectElement(textElement.id)}
            onUpdate={onUpdateTextElement}
          />
        ))}
      </div>
    </div>
  );
};
