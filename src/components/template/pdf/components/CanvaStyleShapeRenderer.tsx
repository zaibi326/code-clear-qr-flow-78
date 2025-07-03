
import React from 'react';

interface PDFShape {
  id: string;
  type: 'rectangle' | 'circle' | 'line' | 'arrow';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  rotation: number;
  pageNumber: number;
}

interface CanvaStyleShapeRendererProps {
  shape: PDFShape;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
}

export const CanvaStyleShapeRenderer: React.FC<CanvaStyleShapeRendererProps> = ({
  shape,
  scale,
  isSelected,
  onSelect
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${shape.x * scale}px`,
    top: `${shape.y * scale}px`,
    width: `${shape.width * scale}px`,
    height: `${shape.height * scale}px`,
    opacity: shape.opacity,
    transform: `rotate(${shape.rotation}deg)`,
    cursor: 'pointer',
    zIndex: isSelected ? 50 : 20
  };

  const renderShape = () => {
    switch (shape.type) {
      case 'rectangle':
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: shape.fill,
              border: `${shape.strokeWidth}px solid ${shape.stroke}`,
              borderRadius: '4px',
              boxShadow: isSelected ? '0 0 0 2px #3B82F6' : 'none'
            }}
            onClick={handleClick}
          />
        );
      
      case 'circle':
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: shape.fill,
              border: `${shape.strokeWidth}px solid ${shape.stroke}`,
              borderRadius: '50%',
              boxShadow: isSelected ? '0 0 0 2px #3B82F6' : 'none'
            }}
            onClick={handleClick}
          />
        );
      
      case 'line':
        return (
          <div
            style={{
              position: 'absolute',
              left: `${shape.x * scale}px`,
              top: `${shape.y * scale}px`,
              width: `${shape.width * scale}px`,
              height: `${shape.strokeWidth}px`,
              backgroundColor: shape.stroke,
              opacity: shape.opacity,
              transform: `rotate(${shape.rotation}deg)`,
              cursor: 'pointer',
              zIndex: isSelected ? 50 : 20,
              boxShadow: isSelected ? '0 0 0 2px #3B82F6' : 'none'
            }}
            onClick={handleClick}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {renderShape()}
      
      {/* Selection handles */}
      {isSelected && (
        <div style={{ ...baseStyle, border: '2px dashed #3B82F6', backgroundColor: 'transparent' }}>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </div>
      )}
    </>
  );
};
