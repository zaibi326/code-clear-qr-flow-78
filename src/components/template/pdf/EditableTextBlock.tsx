
import React, { useState, useRef, useEffect } from 'react';

interface PDFTextBlock {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
  color: { r: number; g: number; b: number };
  pageNumber: number;
  isEdited: boolean;
  originalText?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
}

interface EditableTextBlockProps {
  textBlock: PDFTextBlock;
  scale: number;
  onUpdate: (blockId: string, updates: Partial<PDFTextBlock>) => void;
  onDelete?: (blockId: string) => void;
}

export const EditableTextBlock: React.FC<EditableTextBlockProps> = ({
  textBlock,
  scale,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(textBlock.text);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalText(textBlock.text);
  }, [textBlock.text]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
    if (localText !== textBlock.text && localText.trim() !== '') {
      onUpdate(textBlock.id, { text: localText.trim() });
    } else if (localText.trim() === '' && onDelete) {
      onDelete(textBlock.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFinishEditing();
    } else if (e.key === 'Escape') {
      setLocalText(textBlock.text);
      setIsEditing(false);
    } else if (e.key === 'Delete' && e.ctrlKey && onDelete) {
      e.preventDefault();
      onDelete(textBlock.id);
    }
  };

  const getFontFamily = () => {
    const fontName = textBlock.fontName?.toLowerCase() || '';
    if (fontName.includes('helvetica') || fontName.includes('arial')) {
      return 'Arial, "Helvetica Neue", Helvetica, sans-serif';
    }
    if (fontName.includes('times')) {
      return '"Times New Roman", Times, serif';
    }
    if (fontName.includes('courier')) {
      return '"Courier New", Courier, monospace';
    }
    return 'Arial, system-ui, sans-serif';
  };

  const colorToHex = (color: { r: number; g: number; b: number }) => {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${textBlock.x * scale}px`,
    top: `${textBlock.y * scale}px`,
    width: `${textBlock.width * scale}px`,
    height: `${textBlock.height * scale}px`,
    fontSize: `${textBlock.fontSize * scale}px`,
    fontFamily: getFontFamily(),
    fontWeight: textBlock.fontWeight === 'bold' ? 'bold' : 'normal',
    fontStyle: textBlock.fontStyle === 'italic' ? 'italic' : 'normal',
    color: colorToHex(textBlock.color),
    margin: 0,
    padding: '2px',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    cursor: 'text',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.2',
    zIndex: 10
  };

  const editStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '2px solid #3B82F6',
    borderRadius: '3px',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    zIndex: 100,
    resize: 'none'
  };

  const hoverStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: textBlock.isEdited ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.08)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '2px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  };

  if (isEditing) {
    return (
      <textarea
        ref={inputRef}
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        onBlur={handleFinishEditing}
        onKeyDown={handleKeyDown}
        style={editStyle}
        spellCheck="false"
        autoComplete="off"
        placeholder="Edit text..."
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={isHovered ? hoverStyle : {
        ...baseStyle,
        backgroundColor: textBlock.isEdited ? 'rgba(34, 197, 94, 0.05)' : 'transparent'
      }}
      title={`Double-click to edit${textBlock.originalText && textBlock.originalText !== textBlock.text ? ` • Original: "${textBlock.originalText}"` : ''}`}
    >
      {textBlock.text}
    </div>
  );
};
