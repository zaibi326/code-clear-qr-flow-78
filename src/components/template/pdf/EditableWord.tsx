
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setLocalText(word.text);
  }, [word.text]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      
      // Auto-resize textarea to match content
      const adjustTextareaSize = () => {
        if (textareaRef.current && spanRef.current) {
          spanRef.current.textContent = localText || word.text;
          const textWidth = spanRef.current.offsetWidth;
          const textHeight = spanRef.current.offsetHeight;
          
          textareaRef.current.style.width = `${Math.max(textWidth + 10, word.width * scale)}px`;
          textareaRef.current.style.height = `${Math.max(textHeight + 5, word.height * scale)}px`;
        }
      };
      
      adjustTextareaSize();
    }
  }, [isEditing, localText, word.text, word.height, word.width, scale]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
    if (localText !== word.text && localText.trim() !== '') {
      // Preserve original dimensions for consistent layout
      onUpdate(word.id, { 
        text: localText.trim(),
        isEdited: true
      });
    } else if (localText.trim() === '') {
      onDelete?.(word.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    
    if (e.key === 'Enter' && e.ctrlKey) {
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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalText(e.target.value);
  };

  // Map PDF font names to system fonts for better consistency
  const getFontFamily = () => {
    const fontName = word.fontName?.toLowerCase() || '';
    
    // More comprehensive font mapping
    if (fontName.includes('helvetica') || fontName.includes('arial')) {
      return 'Arial, "Helvetica Neue", Helvetica, sans-serif';
    }
    if (fontName.includes('times')) {
      return '"Times New Roman", Times, serif';
    }
    if (fontName.includes('courier')) {
      return '"Courier New", Courier, monospace';
    }
    if (fontName.includes('calibri')) {
      return 'Calibri, "Segoe UI", Arial, sans-serif';
    }
    
    return 'Arial, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  };

  const colorToHex = (color: { r: number; g: number; b: number }) => {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  // Precise styling to match original PDF appearance
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${word.x * scale}px`,
    top: `${word.y * scale}px`,
    width: `${word.width * scale}px`,
    height: `${word.height * scale}px`,
    fontSize: `${word.fontSize * scale}px`,
    fontFamily: getFontFamily(),
    fontWeight: word.fontWeight === 'bold' ? 'bold' : 'normal',
    fontStyle: word.fontStyle === 'italic' ? 'italic' : 'normal',
    color: colorToHex(word.color),
    margin: 0,
    padding: 0,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    cursor: 'text',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.2',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    direction: word.dir as 'ltr' | 'rtl' | undefined,
    userSelect: 'none',
    letterSpacing: 'normal',
    wordSpacing: 'normal',
    textAlign: 'left',
    verticalAlign: 'top',
    overflow: 'visible'
  };

  const editStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #3B82F6',
    borderRadius: '2px',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
    userSelect: 'text',
    cursor: 'text',
    resize: 'none',
    zIndex: 100,
    padding: '2px'
  };

  const hoverStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: word.isEdited ? 'rgba(34, 197, 94, 0.05)' : 'rgba(59, 130, 246, 0.05)',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    borderRadius: '1px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  };

  return (
    <>
      {/* Hidden span for measuring text dimensions */}
      <span
        ref={spanRef}
        style={{
          ...baseStyle,
          visibility: 'hidden',
          position: 'absolute',
          top: '-2000px',
          left: '-2000px',
          whiteSpace: 'pre-wrap',
          width: 'auto',
          height: 'auto'
        }}
        aria-hidden="true"
      />
      
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={localText}
          onChange={handleTextChange}
          onBlur={handleFinishEditing}
          onKeyDown={handleKeyDown}
          style={editStyle}
          spellCheck="false"
          autoComplete="off"
          placeholder="Edit text... (Ctrl+Enter to save, Esc to cancel)"
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={isHovered ? hoverStyle : {
            ...baseStyle,
            backgroundColor: word.isEdited ? 'rgba(34, 197, 94, 0.02)' : 'transparent'
          }}
          title={`Double-click to edit${word.originalText && word.originalText !== word.text ? ` • Original: "${word.originalText}"` : ''}`}
        >
          {word.text}
        </div>
      )}
    </>
  );
};
