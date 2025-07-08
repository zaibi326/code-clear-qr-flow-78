import React from 'react';
import { CanvaElement } from '../FullCanvaPDFEditor';
import { MessageSquare } from 'lucide-react';

interface CanvaAnnotationElementProps {
  element: CanvaElement;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, updates: Partial<CanvaElement>) => void;
  onDelete: (id: string) => void;
}

export const CanvaAnnotationElement: React.FC<CanvaAnnotationElementProps> = ({
  element,
  scale,
  isSelected,
  onSelect
}) => {
  if (element.annotationType === 'freehand' && element.points) {
    return (
      <svg
        className={`absolute cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={{
          left: element.x * scale,
          top: element.y * scale,
          width: element.width * scale,
          height: element.height * scale,
          zIndex: element.zIndex
        }}
        onClick={onSelect}
      >
        <path
          d={`M ${element.points[0]?.x * scale || 0} ${element.points[0]?.y * scale || 0} ${element.points.slice(1).map(p => `L ${p.x * scale} ${p.y * scale}`).join(' ')}`}
          stroke={element.stroke || '#EF4444'}
          strokeWidth={element.strokeWidth || 2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (element.annotationType === 'comment') {
    return (
      <div
        className={`absolute cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={{
          left: element.x * scale,
          top: element.y * scale,
          width: element.width * scale,
          height: element.height * scale,
          zIndex: element.zIndex
        }}
        onClick={onSelect}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
          style={{ backgroundColor: element.fill || '#F59E0B' }}
        >
          <MessageSquare className="w-3 h-3 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`absolute cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: element.x * scale,
        top: element.y * scale,
        width: element.width * scale,
        height: element.height * scale,
        backgroundColor: element.fill,
        opacity: element.opacity,
        zIndex: element.zIndex
      }}
      onClick={onSelect}
    />
  );
};