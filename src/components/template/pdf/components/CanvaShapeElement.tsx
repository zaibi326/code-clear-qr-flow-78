import React from 'react';
import { CanvaElement } from '../FullCanvaPDFEditor';

interface CanvaShapeElementProps {
  element: CanvaElement;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, updates: Partial<CanvaElement>) => void;
  onDelete: (id: string) => void;
}

export const CanvaShapeElement: React.FC<CanvaShapeElementProps> = ({
  element,
  scale,
  isSelected,
  onSelect
}) => {
  const style = {
    position: 'absolute' as const,
    left: element.x * scale,
    top: element.y * scale,
    width: element.width * scale,
    height: element.height * scale,
    transform: `rotate(${element.rotation}deg)`,
    opacity: element.opacity,
    zIndex: element.zIndex,
    cursor: 'pointer'
  };

  if (element.shapeType === 'circle') {
    return (
      <div
        style={{
          ...style,
          borderRadius: '50%',
          backgroundColor: element.fill,
          border: `${element.strokeWidth || 2}px solid ${element.stroke}`,
          boxSizing: 'border-box'
        }}
        className={isSelected ? 'ring-2 ring-blue-500' : ''}
        onClick={onSelect}
      />
    );
  }

  return (
    <div
      style={{
        ...style,
        backgroundColor: element.fill,
        border: `${element.strokeWidth || 2}px solid ${element.stroke}`,
        boxSizing: 'border-box'
      }}
      className={isSelected ? 'ring-2 ring-blue-500' : ''}
      onClick={onSelect}
    />
  );
};