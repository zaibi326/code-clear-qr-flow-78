import React from 'react';
import { CanvaElement } from '../FullCanvaPDFEditor';

interface CanvaImageElementProps {
  element: CanvaElement;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, updates: Partial<CanvaElement>) => void;
  onDelete: (id: string) => void;
}

export const CanvaImageElement: React.FC<CanvaImageElementProps> = ({
  element,
  scale,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  return (
    <div
      className={`absolute cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: element.x * scale,
        top: element.y * scale,
        width: element.width * scale,
        height: element.height * scale,
        transform: `rotate(${element.rotation}deg)`,
        opacity: element.opacity,
        zIndex: element.zIndex
      }}
      onClick={onSelect}
    >
      {element.src ? (
        <img
          src={element.src}
          alt="PDF Element"
          className="w-full h-full object-contain"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center">
          <span className="text-gray-500 text-xs">Image</span>
        </div>
      )}
    </div>
  );
};