
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bold, Italic, Type, Trash2 } from 'lucide-react';

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
  searchTerm?: string;
}

export const EnhancedTextEditor: React.FC<EnhancedTextEditorProps> = ({
  textElement,
  scale,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  searchTerm
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(textElement.text);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const [showToolbar, setShowToolbar] = useState(false);
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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSelected) {
      onSelect();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSelected) {
      setIsEditing(true);
      setShowToolbar(false);
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
    
    if (localText.trim() !== textElement.text && localText.trim() !== '') {
      onUpdate(textElement.id, { 
        text: localText.trim(),
        isEdited: true
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
    }
  };

  const toggleBold = () => {
    onUpdate(textElement.id, {
      fontWeight: textElement.fontWeight === 'bold' ? 'normal' : 'bold'
    });
  };

  const toggleItalic = () => {
    onUpdate(textElement.id, {
      fontStyle: textElement.fontStyle === 'italic' ? 'normal' : 'italic'
    });
  };

  const handleFontSizeChange = (size: number) => {
    onUpdate(textElement.id, { fontSize: size });
  };

  const handleColorChange = (color: string) => {
    onUpdate(textElement.id, { color });
  };

  // Highlight search terms
  const getHighlightedText = (text: string) => {
    if (!searchTerm || !searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark style="background-color: yellow;">$1</mark>');
  };

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

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        onBlur={handleFinishEditing}
        onKeyDown={handleKeyDown}
        style={{
          ...baseStyle,
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          border: `${Math.max(2 * scale, 2)}px solid #3B82F6`,
          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
          cursor: 'text',
          resize: 'none',
          zIndex: 1200
        }}
        spellCheck="false"
        autoComplete="off"
        placeholder="Type your text..."
      />
    );
  }

  return (
    <>
      <div
        ref={elementRef}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsDragging(false);
        }}
        style={baseStyle}
        title="Click to select • Double-click to edit"
        dangerouslySetInnerHTML={{
          __html: getHighlightedText(textElement.text || 'Empty text')
        }}
      />

      {/* Toolbar */}
      {isSelected && !isEditing && (
        <div
          className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex items-center gap-2 z-50"
          style={{
            left: `${textElement.x * scale}px`,
            top: `${(textElement.y - 50) * scale}px`,
            transform: `scale(${Math.min(1, 1 / scale)})`
          }}
        >
          <Button
            size="sm"
            variant={textElement.fontWeight === 'bold' ? 'default' : 'outline'}
            onClick={toggleBold}
            className="h-8 w-8 p-0"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={textElement.fontStyle === 'italic' ? 'default' : 'outline'}
            onClick={toggleItalic}
            className="h-8 w-8 p-0"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Input
            type="number"
            value={textElement.fontSize}
            onChange={(e) => handleFontSizeChange(parseInt(e.target.value) || 12)}
            className="w-16 h-8"
            min="8"
            max="72"
          />
          <input
            type="color"
            value={textElement.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-8 h-8 border rounded cursor-pointer"
            title="Text Color"
          />
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(textElement.id)}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </>
  );
};
