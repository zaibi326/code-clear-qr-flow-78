
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

interface EnhancedTextEditorProps {
  textElement: PDFTextElement;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (elementId: string, updates: Partial<PDFTextElement>) => void;
  onDelete?: (elementId: string) => void;
}

export const EnhancedTextEditor: React.FC<EnhancedTextEditorProps> = ({
  textElement,
  scale,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
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
      
      // Auto-resize textarea
      const resizeTextarea = () => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
          textareaRef.current.style.width = Math.max(textareaRef.current.scrollWidth, textElement.width * scale) + 'px';
        }
      };
      
      resizeTextarea();
      textareaRef.current.addEventListener('input', resizeTextarea);
      
      return () => {
        if (textareaRef.current) {
          textareaRef.current.removeEventListener('input', resizeTextarea);
        }
      };
    }
  }, [isEditing, textElement.width, scale]);

  // Enhanced click handling
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSelected) {
      onSelect();
      console.log('Text element selected:', textElement.id);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSelected) {
      setIsEditing(true);
      console.log('Starting text edit for:', textElement.id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    
    if (localText.trim() !== textElement.text && localText.trim() !== '') {
      // Preserve original formatting while updating text
      const textWidth = Math.max(localText.length * textElement.fontSize * 0.6, 50);
      
      onUpdate(textElement.id, { 
        text: localText.trim(),
        width: textWidth,
        isEdited: true
      });
      
      console.log('Text updated:', {
        id: textElement.id,
        oldText: textElement.text,
        newText: localText.trim()
      });
    } else if (localText.trim() === '' && onDelete) {
      onDelete(textElement.id);
    } else {
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
    } else if (e.key === 'Delete' && e.ctrlKey && onDelete) {
      e.preventDefault();
      onDelete(textElement.id);
    }
  };

  // Enhanced styling with better visual feedback
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
    backgroundColor: textElement.backgroundColor === 'transparent' ? 'rgba(255, 255, 255, 0.8)' : textElement.backgroundColor,
    opacity: textElement.opacity,
    transform: `rotate(${textElement.rotation}deg)`,
    margin: 0,
    padding: `${4 * scale}px ${6 * scale}px`,
    border: isSelected 
      ? `${Math.max(2 * scale, 2)}px solid #3B82F6` 
      : isHovered 
        ? `${Math.max(1 * scale, 1)}px solid #93C5FD` 
        : '1px solid transparent',
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
    lineHeight: '1.4',
    zIndex: isEditing ? 1200 : isSelected ? 1000 : isHovered ? 900 : 800,
    boxShadow: isSelected 
      ? `0 4px 12px rgba(59, 130, 246, 0.3)` 
      : isHovered 
        ? `0 2px 8px rgba(59, 130, 246, 0.2)` 
        : 'none',
    transition: 'all 0.2s ease',
    userSelect: isEditing ? 'text' : 'none',
    pointerEvents: 'auto',
    wordWrap: 'break-word',
    overflow: 'visible'
  };

  const editStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    border: `${Math.max(2 * scale, 2)}px solid #3B82F6`,
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
    cursor: 'text',
    resize: 'none',
    zIndex: 1200
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
        data-text-id={textElement.id}
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
      data-text-id={textElement.id}
      data-is-selected={isSelected}
      data-is-editing={isEditing}
    >
      {textElement.text || 'Empty text'}
      
      {/* Selection handles */}
      {isSelected && !isEditing && (
        <>
          <div 
            className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm"
            style={{ 
              transform: `scale(${Math.max(1 / scale, 0.8)})`, 
              transformOrigin: 'center'
            }}
          />
          <div 
            className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm"
            style={{ 
              transform: `scale(${Math.max(1 / scale, 0.8)})`, 
              transformOrigin: 'center'
            }}
          />
          <div 
            className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm"
            style={{ 
              transform: `scale(${Math.max(1 / scale, 0.8)})`, 
              transformOrigin: 'center'
            }}
          />
          <div 
            className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm"
            style={{ 
              transform: `scale(${Math.max(1 / scale, 0.8)})`, 
              transformOrigin: 'center'
            }}
          />
        </>
      )}
      
      {/* Hover tooltip */}
      {isHovered && !isSelected && !isEditing && (
        <div 
          className="absolute -top-8 left-0 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg"
          style={{ 
            fontSize: `${Math.max(10 / scale, 8)}px`,
            transform: `scale(${Math.max(1 / scale, 0.8)})`,
            transformOrigin: 'left bottom'
          }}
        >
          Click to select • Double-click to edit
        </div>
      )}
      
      {/* Edit indicator */}
      {textElement.isEdited && (
        <div 
          className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full border border-white shadow-sm"
          style={{ 
            transform: `scale(${Math.max(1 / scale, 0.6)})`, 
            transformOrigin: 'center'
          }}
          title="This text has been modified"
        />
      )}
    </div>
  );
};
