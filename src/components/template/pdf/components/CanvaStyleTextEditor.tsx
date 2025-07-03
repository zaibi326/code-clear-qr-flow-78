
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
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalText(textElement.text);
  }, [textElement.text]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    
    if (!isEditing) {
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
    if (isDragging && !isEditing) {
      const deltaX = (e.clientX - dragStart.x) / scale;
      const deltaY = (e.clientY - dragStart.y) / scale;
      
      onUpdate(textElement.id, {
        x: dragStart.elementX + deltaX,
        y: dragStart.elementY + deltaY
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
    if (localText !== textElement.text && localText.trim() !== '') {
      onUpdate(textElement.id, { 
        text: localText.trim(),
        width: localText.length * textElement.fontSize * 0.6
      });
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

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${textElement.x * scale}px`,
    top: `${textElement.y * scale}px`,
    width: `${textElement.width * scale}px`,
    minHeight: `${textElement.height * scale}px`,
    fontSize: `${textElement.fontSize * scale}px`,
    fontFamily: textElement.fontFamily,
    fontWeight: textElement.fontWeight,
    fontStyle: textElement.fontStyle,
    textAlign: textElement.textAlign,
    color: textElement.color,
    backgroundColor: textElement.backgroundColor,
    opacity: textElement.opacity,
    transform: `rotate(${textElement.rotation}deg)`,
    margin: 0,
    padding: '4px',
    border: isSelected ? '2px solid #3B82F6' : '2px solid transparent',
    borderRadius: '4px',
    outline: 'none',
    cursor: isEditing ? 'text' : isDragging ? 'grabbing' : 'grab',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.2',
    zIndex: isSelected ? 100 : 10,
    boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
    transition: 'box-shadow 0.2s ease'
  };

  const editStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '2px solid #3B82F6',
    resize: 'none',
    zIndex: 200
  };

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
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={baseStyle}
      title={`Double-click to edit • ${textElement.isEdited ? 'Modified' : 'Original'} text`}
    >
      {textElement.text}
      
      {/* Selection handles */}
      {isSelected && !isEditing && (
        <>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </>
      )}
    </div>
  );
};
