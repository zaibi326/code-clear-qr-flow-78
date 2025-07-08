import React, { useState } from 'react';

export interface Shape {
  id: string;
  type: 'rectangle' | 'circle';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  pageNumber: number;
}

interface ShapeToolsProps {
  shapes: Shape[];
  onAddShape: (shape: Omit<Shape, 'id'>) => void;
  onRemoveShape: (id: string) => void;
  currentPage: number;
  scale: number;
  color: string;
  activeTool: string;
}

export const ShapeTools: React.FC<ShapeToolsProps> = ({
  shapes,
  onAddShape,
  onRemoveShape,
  currentPage,
  scale,
  color,
  activeTool
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentShape, setCurrentShape] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const isShapeTool = activeTool === 'rectangle' || activeTool === 'circle';

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isShapeTool) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    setIsDrawing(true);
    setDrawStart({ x, y });
    setCurrentShape({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isShapeTool || !isDrawing || !drawStart) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) / scale;
    const currentY = (e.clientY - rect.top) / scale;
    
    const x = Math.min(drawStart.x, currentX);
    const y = Math.min(drawStart.y, currentY);
    const width = Math.abs(currentX - drawStart.x);
    const height = Math.abs(currentY - drawStart.y);
    
    setCurrentShape({ x, y, width, height });
  };

  const handleMouseUp = () => {
    if (!isShapeTool || !isDrawing || !currentShape || !drawStart) return;
    
    if (currentShape.width > 10 && currentShape.height > 10) {
      onAddShape({
        type: activeTool as 'rectangle' | 'circle',
        x: currentShape.x,
        y: currentShape.y,
        width: currentShape.width,
        height: currentShape.height,
        color: color + '40', // Add transparency
        strokeColor: color,
        strokeWidth: 2,
        pageNumber: currentPage + 1
      });
    }
    
    setIsDrawing(false);
    setDrawStart(null);
    setCurrentShape(null);
  };

  const currentPageShapes = shapes.filter(s => s.pageNumber === currentPage + 1);

  return (
    <>
      {/* Existing shapes */}
      {currentPageShapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute cursor-pointer hover:opacity-80"
          style={{
            left: `${shape.x * scale}px`,
            top: `${shape.y * scale}px`,
            width: `${shape.width * scale}px`,
            height: `${shape.height * scale}px`,
            backgroundColor: shape.color,
            border: `${shape.strokeWidth}px solid ${shape.strokeColor}`,
            borderRadius: shape.type === 'circle' ? '50%' : '4px',
            pointerEvents: 'auto'
          }}
          onClick={() => onRemoveShape(shape.id)}
          title="Click to remove shape"
        />
      ))}
      
      {/* Current shape being drawn */}
      {isShapeTool && currentShape && isDrawing && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${currentShape.x * scale}px`,
            top: `${currentShape.y * scale}px`,
            width: `${currentShape.width * scale}px`,
            height: `${currentShape.height * scale}px`,
            backgroundColor: color + '40',
            border: `2px solid ${color}`,
            borderRadius: activeTool === 'circle' ? '50%' : '4px'
          }}
        />
      )}
      
      {/* Drawing overlay */}
      {isShapeTool && (
        <div
          className="absolute inset-0 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ zIndex: 999 }}
        />
      )}
    </>
  );
};
