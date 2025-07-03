
import React, { useState, useRef, useEffect } from 'react';

interface PDFTextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  color: string;
  backgroundColor: string;
  opacity: number;
  rotation: number;
  pageNumber: number;
  isEdited: boolean;
  originalText?: string;
}

interface CanvaStyleTextEditorProps {
  textElement: PDFTextElement;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (elementId: string, updates: Partial<PDFTextElement>) => void;
}

export const CanvaStyleTextEditor: React.FC<CanvaStyleTextEditorProps> = ({
  textElement,
  scale,
  isSelected,
  onSelect,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(textElement.text);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalText(textElement.text);
  }, [textElement.text]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // Enhanced click handler with better event stopping
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Text element clicked:', textElement.id, textElement.text);
    
    if (!isSelected) {
      onSelect();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Text element double-clicked for editing:', textElement.id);
    
    if (isSelected) {
      setIsEditing(true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Text element mouse down:', textElement.id);
    
    if (!isSelected) {
      onSelect();
    }
    
    if (!isEditing && isSelected) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        elementX: textElement.x,
        elementY: textElement.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && !isEditing && isSelected) {
      e.preventDefault();
      e.stopPropagation();
      
      const deltaX = (e.clientX - dragStart.x) / scale;
      const deltaY = (e.clientY - dragStart.y) / scale;
      
      const newX = Math.max(0, dragStart.elementX + deltaX);
      const newY = Math.max(0, dragStart.elementY + deltaY);
      
      onUpdate(textElement.id, {
        x: newX,
        y: newY
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsDragging(false);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
    if (localText !== textElement.text && localText.trim() !== '') {
      onUpdate(textElement.id, { 
        text: localText.trim(),
        width: Math.max(localText.length * textElement.fontSize * 0.6, 50)
      });
    } else if (localText.trim() === '') {
      setLocalText(textElement.text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFinishEditing();
    } else if (e.key === 'Escape') {
      setLocalText(textElement.text);
      setIsEditing(false);
    }
  };

  // Enhanced styling with better hover and selection states
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${textElement.x * scale}px`,
    top: `${textElement.y * scale}px`,
    width: `${Math.max(textElement.width * scale, 50)}px`,
    minHeight: `${textElement.height * scale}px`,
    fontSize: `${textElement.fontSize * scale}px`,
    fontFamily: textElement.fontFamily,
    fontWeight: textElement.fontWeight,
    fontStyle: textElement.fontStyle,
    textAlign: textElement.textAlign,
    color: textElement.color,
    backgroundColor: textElement.backgroundColor === 'transparent' ? 'transparent' : textElement.backgroundColor,
    opacity: textElement.opacity,
    transform: `rotate(${textElement.rotation}deg)`,
    margin: 0,
    padding: `${2 * scale}px ${4 * scale}px`,
    border: isSelected 
      ? `${Math.max(2 * scale, 2)}px solid #3B82F6` 
      : isHovered 
        ? `${Math.max(1 * scale, 1)}px solid #93C5FD` 
        : `${Math.max(1 * scale, 1)}px solid transparent`,
    borderRadius: `${4 * scale}px`,
    outline: 'none',
    cursor: isEditing 
      ? 'text' 
      : isDragging 
        ? 'grabbing' 
        : isSelected || isHovered 
          ? 'grab' 
          : 'pointer',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.2',
    zIndex: isSelected ? 1000 : isHovered ? 900 : isEditing ? 1100 : 800,
    boxShadow: isSelected 
      ? `0 4px 12px rgba(59, 130, 246, 0.4)` 
      : isHovered 
        ? `0 2px 8px rgba(59, 130, 246, 0.2)` 
        : 'none',
    transition: 'all 0.2s ease',
    userSelect: isEditing ? 'text' : 'none',
    pointerEvents: 'auto'
  };

  const editStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    border: `${Math.max(2 * scale, 2)}px solid #3B82F6`,
    resize: 'none',
    zIndex: 1200,
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5)',
    cursor: 'text'
  };

  // Debug info (can be removed in production)
  const debugInfo = process.env.NODE_ENV === 'development' ? {
    'data-text-id': textElement.id,
    'data-is-selected': isSelected,
    'data-is-editing': isEditing,
    'data-coordinates': `${textElement.x},${textElement.y}`,
    'data-scale': scale
  } : {};

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        onBlur={handleFinishEditing}
        onKeyDown={handleKeyDown}
        style={editStyle}
        spellCheck="false"
        autoComplete="off"
        placeholder="Type your text..."
        {...debugInfo}
      />
    );
  }

  return (
    <div
      ref={elementRef}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={baseStyle}
      title={`${textElement.isEdited ? 'Modified' : 'Original'} text • Click to select • Double-click to edit`}
      {...debugInfo}
    >
      {textElement.text || 'Empty text'}
      
      {/* Enhanced selection handles */}
      {isSelected && !isEditing && (
        <>
          <div 
            className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm"
            style={{ transform: `scale(${1 / scale})`, transformOrigin: 'center' }}
          />
          <div 
            className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm"
            style={{ transform: `scale(${1 / scale})`, transformOrigin: 'center' }}
          />
          <div 
            className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm"
            style={{ transform: `scale(${1 / scale})`, transformOrigin: 'center' }}
          />
          <div 
            className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm"
            style={{ transform: `scale(${1 / scale})`, transformOrigin: 'center' }}
          />
        </>
      )}
      
      {/* Hover indicator */}
      {isHovered && !isSelected && !isEditing && (
        <div 
          className="absolute -top-6 left-0 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
          style={{ 
            fontSize: `${12 / scale}px`,
            transform: `scale(${1 / scale})`,
            transformOrigin: 'left bottom'
          }}
        >
          Click to select
        </div>
      )}
    </div>
  );
};
