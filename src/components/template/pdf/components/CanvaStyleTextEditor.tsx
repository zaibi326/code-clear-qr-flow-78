

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

  // ENHANCED: Better click handling with proper event delegation
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

  // ENHANCED: Much better styling with proper visual feedback
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
    padding: `${4 * scale}px ${6 * scale}px`,
    border: isSelected 
      ? `${Math.max(3 * scale, 2)}px solid #3B82F6` 
      : isHovered 
        ? `${Math.max(2 * scale, 1)}px solid #93C5FD` 
        : `${Math.max(1 * scale, 1)}px solid rgba(59, 130, 246, 0.3)`,
    borderRadius: `${6 * scale}px`,
    outline: 'none',
    cursor: isEditing 
      ? 'text' 
      : isDragging 
        ? 'grabbing' 
        : isSelected || isHovered 
          ? 'grab' 
          : 'pointer',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.3',
    zIndex: isSelected ? 1000 : isHovered ? 900 : isEditing ? 1100 : 800,
    boxShadow: isSelected 
      ? `0 4px 12px rgba(59, 130, 246, 0.4)` 
      : isHovered 
        ? `0 2px 8px rgba(59, 130, 246, 0.3)` 
        : `0 1px 3px rgba(0, 0, 0, 0.1)`,
    transition: 'all 0.2s ease',
    userSelect: isEditing ? 'text' : 'none',
    pointerEvents: 'auto',
    // CRITICAL: Ensure text appears above PDF background
    background: isSelected || isHovered 
      ? 'rgba(255, 255, 255, 0.95)' 
      : textElement.backgroundColor === 'transparent' 
        ? 'rgba(255, 255, 255, 0.8)' 
        : textElement.backgroundColor
  };

  const editStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    border: `${Math.max(3 * scale, 2)}px solid #3B82F6`,
    resize: 'none',
    zIndex: 1200,
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5)',
    cursor: 'text'
  };

  // Debug attributes (remove in production)
  const debugProps = process.env.NODE_ENV === 'development' ? {
    'data-text-id': textElement.id,
    'data-is-selected': isSelected,
    'data-is-editing': isEditing,
    'data-coordinates': `${textElement.x},${textElement.y}`,
    'data-scale': scale,
    'data-text': textElement.text
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
        {...debugProps}
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
      {...debugProps}
    >
      {textElement.text || 'Empty text'}
      
      {/* ENHANCED: Better selection handles */}
      {isSelected && !isEditing && (
        <>
          <div 
            className="absolute -top-2 -left-2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-md"
            style={{ 
              transform: `scale(${Math.max(1 / scale, 0.5)})`, 
              transformOrigin: 'center',
              zIndex: 1
            }}
          />
          <div 
            className="absolute -top-2 -right-2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-md"
            style={{ 
              transform: `scale(${Math.max(1 / scale, 0.5)})`, 
              transformOrigin: 'center',
              zIndex: 1
            }}
          />
          <div 
            className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-md"
            style={{ 
              transform: `scale(${Math.max(1 / scale, 0.5)})`, 
              transformOrigin: 'center',
              zIndex: 1
            }}
          />
          <div 
            className="absolute -bottom-2 -right-2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-md"
            style={{ 
              transform: `scale(${Math.max(1 / scale, 0.5)})`, 
              transformOrigin: 'center',
              zIndex: 1
            }}
          />
        </>
      )}
      
      {/* ENHANCED: Better hover indicator */}
      {isHovered && !isSelected && !isEditing && (
        <div 
          className="absolute -top-8 left-0 bg-gray-800 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap shadow-lg"
          style={{ 
            fontSize: `${Math.max(12 / scale, 10)}px`,
            transform: `scale(${Math.max(1 / scale, 0.7)})`,
            transformOrigin: 'left bottom',
            zIndex: 2
          }}
        >
          Click to select • Double-click to edit
        </div>
      )}
    </div>
  );
};
