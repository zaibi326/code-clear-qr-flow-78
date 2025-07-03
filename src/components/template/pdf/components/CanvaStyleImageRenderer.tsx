
import React from 'react';

interface PDFImage {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  rotation: number;
  pageNumber: number;
}

interface CanvaStyleImageRendererProps {
  image: PDFImage;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
}

export const CanvaStyleImageRenderer: React.FC<CanvaStyleImageRendererProps> = ({
  image,
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
    left: `${image.x * scale}px`,
    top: `${image.y * scale}px`,
    width: `${image.width * scale}px`,
    height: `${image.height * scale}px`,
    opacity: image.opacity,
    transform: `rotate(${image.rotation}deg)`,
    cursor: 'pointer',
    zIndex: isSelected ? 50 : 30,
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: isSelected ? '0 0 0 2px #3B82F6' : 'none'
  };

  return (
    <>
      <img
        src={image.src}
        alt="PDF Image"
        style={baseStyle}
        onClick={handleClick}
        draggable={false}
      />
      
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
