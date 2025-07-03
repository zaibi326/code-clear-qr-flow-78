
import React, { useRef, useCallback } from 'react';
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
    // Only handle clicks on the canvas background
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
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No page data available</p>
      </div>
    );
  }

  const currentPageTextElements = Array.from(textElements.values()).filter(
    el => el.pageNumber === currentPage + 1
  );
  const currentPageShapes = Array.from(shapes.values()).filter(
    shape => shape.pageNumber === currentPage + 1
  );
  const currentPageImages = Array.from(images.values()).filter(
    img => img.pageNumber === currentPage + 1
  );

  return (
    <div className="flex items-center justify-center min-h-full">
      <div 
        className="bg-white rounded-lg shadow-lg relative"
        style={{
          width: pageData.width * zoom,
          height: pageData.height * zoom,
          cursor: selectedTool === 'select' ? 'default' : 'crosshair'
        }}
      >
        {/* Background PDF Image */}
        <div 
          className="w-full h-full absolute inset-0 rounded-lg"
          style={{
            background: `url(${pageData.backgroundImage}) no-repeat center center`,
            backgroundSize: 'cover',
            pointerEvents: 'none'
          }}
        />

        {/* Konva Stage for Advanced Rendering */}
        <Stage
          width={pageData.width * zoom}
          height={pageData.height * zoom}
          scaleX={zoom}
          scaleY={zoom}
          onClick={handleCanvasClick}
          ref={stageRef}
          className="absolute inset-0"
        >
          <Layer>
            {/* Render shapes using Konva */}
            {currentPageShapes.map((shape) => {
              if (shape.type === 'rectangle') {
                return (
                  <Rect
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    fill={shape.fill}
                    stroke={shape.stroke}
                    strokeWidth={shape.strokeWidth}
                    opacity={shape.opacity}
                    onClick={() => onSelectElement(shape.id)}
                  />
                );
              } else if (shape.type === 'circle') {
                return (
                  <Circle
                    key={shape.id}
                    x={shape.x + shape.width / 2}
                    y={shape.y + shape.height / 2}
                    radius={shape.width / 2}
                    fill={shape.fill}
                    stroke={shape.stroke}
                    strokeWidth={shape.strokeWidth}
                    opacity={shape.opacity}
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

        {/* Development Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white p-2 rounded text-xs z-50">
            <div>Page {currentPage + 1}</div>
            <div>Elements: {currentPageTextElements.length}</div>
            <div>Tool: {selectedTool}</div>
            <div>Selected: {selectedElementId ? 'Yes' : 'No'}</div>
          </div>
        )}
      </div>
    </div>
  );
};
