
import React, { useState, useRef, useEffect } from 'react';

interface PDFWord {
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
  spaceAfter?: boolean;
  transform?: number[];
  dir?: string;
  baseline?: number;
}

interface EditableWordProps {
  word: PDFWord;
  scale: number;
  onUpdate: (wordId: string, updates: Partial<PDFWord>) => void;
  onDelete?: (wordId: string) => void;
}

export const EditableWord: React.FC<EditableWordProps> = ({
  word,
  scale,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(word.text);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setLocalText(word.text);
  }, [word.text]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
      
      // Auto-resize input to fit content
      const adjustInputWidth = () => {
        if (inputRef.current && spanRef.current) {
          spanRef.current.textContent = localText || word.text;
          const textWidth = spanRef.current.offsetWidth;
          inputRef.current.style.width = `${Math.max(textWidth + 10, 50)}px`;
        }
      };
      
      adjustInputWidth();
    }
  }, [isEditing, localText, word.text]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
    if (localText !== word.text && localText.trim() !== '') {
      // Calculate new width based on text length
      const charWidth = word.fontSize * 0.55 * scale;
      const newWidth = localText.length * charWidth;
      
      onUpdate(word.id, { 
        text: localText.trim(),
        width: newWidth,
        isEdited: true
      });
    } else if (localText.trim() === '') {
      // If text is empty, mark for deletion
      onDelete?.(word.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFinishEditing();
    } else if (e.key === 'Escape') {
      setLocalText(word.text);
      setIsEditing(false);
    } else if (e.key === 'Delete' && e.ctrlKey && onDelete) {
      e.preventDefault();
      onDelete(word.id);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalText(e.target.value);
  };

  const getFontFamily = () => {
    // Use system fonts for better rendering
    const baseFont = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    
    if (word.fontWeight === 'bold' && word.fontStyle === 'italic') {
      return `${baseFont}`;
    }
    return baseFont;
  };

  const colorToHex = (color: { r: number; g: number; b: number }) => {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  // More precise positioning with subpixel accuracy
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${word.x * scale}px`,
    top: `${word.y * scale}px`,
    fontSize: `${word.fontSize * scale}px`,
    fontFamily: getFontFamily(),
    fontWeight: word.fontWeight === 'bold' ? 'bold' : 'normal',
    fontStyle: word.fontStyle === 'italic' ? 'italic' : 'normal',
    color: colorToHex(word.color),
    zIndex: 10,
    margin: 0,
    padding: '1px',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    cursor: 'text',
    whiteSpace: 'nowrap',
    minWidth: `${Math.max(word.width * scale, 20)}px`,
    height: `${word.height * scale}px`,
    lineHeight: `${word.height * scale}px`,
    textRendering: 'optimizeLegibility' as const,
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const,
    direction: word.dir as 'ltr' | 'rtl' | undefined,
    userSelect: 'none'
  };

  const editStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '2px solid #3B82F6',
    borderRadius: '3px',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
    userSelect: 'text',
    cursor: 'text'
  };

  const hoverStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: word.isEdited ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '2px'
  };

  return (
    <>
      {/* Hidden span for measuring text width */}
      <span
        ref={spanRef}
        style={{
          ...baseStyle,
          visibility: 'hidden',
          position: 'absolute',
          top: '-1000px',
          left: '-1000px',
          whiteSpace: 'nowrap',
          zIndex: -1
        }}
        aria-hidden="true"
      />
      
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={localText}
          onChange={handleTextChange}
          onBlur={handleFinishEditing}
          onKeyDown={handleKeyDown}
          style={editStyle}
          spellCheck="false"
          autoComplete="off"
        />
      ) : (
        <span
          onDoubleClick={handleDoubleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={isHovered ? hoverStyle : {
            ...baseStyle,
            backgroundColor: word.isEdited ? 'rgba(34, 197, 94, 0.05)' : 'transparent'
          }}
          title={`Double-click to edit • Original: "${word.originalText || word.text}"`}
        >
          {word.text}
          {word.spaceAfter && '\u00A0'}
        </span>
      )}
    </>
  );
};
