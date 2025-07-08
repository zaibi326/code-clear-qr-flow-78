import React, { useState, useRef } from 'react';

interface Highlight {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  pageNumber: number;
}

interface HighlightToolProps {
  highlights: Highlight[];
  onAddHighlight: (highlight: Omit<Highlight, 'id'>) => void;
  onRemoveHighlight: (id: string) => void;
  currentPage: number;
  scale: number;
  color: string;
  isActive: boolean;
}

export const HighlightTool: React.FC<HighlightToolProps> = ({
  highlights,
  onAddHighlight,
  onRemoveHighlight,
  currentPage,
  scale,
  color,
  isActive
}) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [currentSelection, setCurrentSelection] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    setIsSelecting(true);
    setSelectionStart({ x, y });
    setCurrentSelection({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isActive || !isSelecting || !selectionStart) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) / scale;
    const currentY = (e.clientY - rect.top) / scale;
    
    const x = Math.min(selectionStart.x, currentX);
    const y = Math.min(selectionStart.y, currentY);
    const width = Math.abs(currentX - selectionStart.x);
    const height = Math.abs(currentY - selectionStart.y);
    
    setCurrentSelection({ x, y, width, height });
  };

  const handleMouseUp = () => {
    if (!isActive || !isSelecting || !currentSelection || !selectionStart) return;
    
    if (currentSelection.width > 10 && currentSelection.height > 10) {
      onAddHighlight({
        x: currentSelection.x,
        y: currentSelection.y,
        width: currentSelection.width,
        height: currentSelection.height,
        color: color,
        pageNumber: currentPage + 1
      });
    }
    
    setIsSelecting(false);
    setSelectionStart(null);
    setCurrentSelection(null);
  };

  const currentPageHighlights = highlights.filter(h => h.pageNumber === currentPage + 1);

  return (
    <>
      {/* Existing highlights */}
      {currentPageHighlights.map((highlight) => (
        <div
          key={highlight.id}
          className="absolute cursor-pointer opacity-40 hover:opacity-60"
          style={{
            left: `${highlight.x * scale}px`,
            top: `${highlight.y * scale}px`,
            width: `${highlight.width * scale}px`,
            height: `${highlight.height * scale}px`,
            backgroundColor: highlight.color,
            pointerEvents: 'auto'
          }}
          onClick={() => onRemoveHighlight(highlight.id)}
          title="Click to remove highlight"
        />
      ))}
      
      {/* Current selection */}
      {isActive && currentSelection && (
        <div
          className="absolute pointer-events-none opacity-30"
          style={{
            left: `${currentSelection.x * scale}px`,
            top: `${currentSelection.y * scale}px`,
            width: `${currentSelection.width * scale}px`,
            height: `${currentSelection.height * scale}px`,
            backgroundColor: color,
            border: `2px dashed ${color}`
          }}
        />
      )}
      
      {/* Invisible overlay for selection */}
      {isActive && (
        <div
          className="absolute inset-0 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ zIndex: 1000 }}
        />
      )}
    </>
  );
};
