
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
      
      // Auto-resize textarea to fit content
      const adjustTextareaSize = () => {
        if (textareaRef.current && spanRef.current) {
          spanRef.current.textContent = localText || word.text;
          const textWidth = spanRef.current.offsetWidth;
          const textHeight = spanRef.current.offsetHeight;
          
          textareaRef.current.style.width = `${Math.max(textWidth + 20, 100)}px`;
          textareaRef.current.style.height = `${Math.max(textHeight + 10, word.height * scale)}px`;
        }
      };
      
      adjustTextareaSize();
    }
  }, [isEditing, localText, word.text, word.height, scale]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
    if (localText !== word.text && localText.trim() !== '') {
      // Calculate new dimensions based on text content with improved accuracy
      const lines = localText.split('\n');
      const maxLineLength = Math.max(...lines.map(line => line.length));
      
      // Enhanced character width calculation based on font size
      const charWidth = word.fontSize * 0.6 * scale; // Improved from 0.55 to 0.6
      const lineHeight = word.fontSize * 1.15 * scale; // Improved from 1.2 to 1.15
      
      const newWidth = Math.max(maxLineLength * charWidth, word.width * scale);
      const newHeight = Math.max(lines.length * lineHeight, word.height * scale);
      
      onUpdate(word.id, { 
        text: localText.trim(),
        width: newWidth / scale, // Convert back to original scale
        height: newHeight / scale,
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

  const getFontFamily = () => {
    // Use system fonts that closely match common PDF fonts for better consistency
    const fontMap: { [key: string]: string } = {
      'helvetica': '"Helvetica Neue", Helvetica, Arial, sans-serif',
      'arial': 'Arial, "Helvetica Neue", Helvetica, sans-serif',
      'times': '"Times New Roman", Times, serif',
      'courier': '"Courier New", Courier, monospace'
    };
    
    const fontName = word.fontName?.toLowerCase() || '';
    for (const [key, value] of Object.entries(fontMap)) {
      if (fontName.includes(key)) {
        return value;
      }
    }
    
    return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
  };

  const colorToHex = (color: { r: number; g: number; b: number }) => {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  // Enhanced styling with better font rendering and positioning
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${word.x * scale}px`,
    top: `${word.y * scale}px`,
    fontSize: `${word.fontSize * scale}px`,
    fontFamily: getFontFamily(),
    fontWeight: word.fontWeight === 'bold' ? 'bold' : 'normal',
    fontStyle: word.fontStyle === 'italic' ? 'italic' : 'normal',
    color: colorToHex(word.color),
    margin: 0,
    padding: '1px 2px', // Reduced padding for better precision
    border: 'none',
    outline: 'none',
    background: 'transparent',
    cursor: 'text',
    whiteSpace: 'pre-wrap',
    minWidth: `${Math.max(word.width * scale, 50)}px`,
    minHeight: `${word.height * scale}px`,
    lineHeight: `${word.fontSize * 1.15 * scale}px`, // Improved line height
    textRendering: 'optimizeLegibility' as const,
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const,
    direction: word.dir as 'ltr' | 'rtl' | undefined,
    userSelect: 'none',
    // Enhanced text rendering for PDF accuracy
    letterSpacing: 'normal',
    wordSpacing: 'normal',
    textAlign: 'left'
  };

  const editStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    border: '2px solid #3B82F6',
    borderRadius: '3px',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
    userSelect: 'text',
    cursor: 'text',
    resize: 'none',
    overflow: 'hidden',
    zIndex: 100 // Ensure editing text is on top
  };

  const hoverStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: word.isEdited ? 'rgba(34, 197, 94, 0.08)' : 'rgba(59, 130, 246, 0.08)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '2px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
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
          height: 'auto',
          padding: '1px 2px'
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
            backgroundColor: word.isEdited ? 'rgba(34, 197, 94, 0.03)' : 'transparent'
          }}
          title={`Double-click to edit${word.originalText && word.originalText !== word.text ? ` • Original: "${word.originalText}"` : ''}`}
        >
          {word.text.split('\n').map((line, index) => (
            <div key={index} style={{ minHeight: `${word.fontSize * 1.15 * scale}px` }}>
              {line}
              {word.spaceAfter && index === word.text.split('\n').length - 1 && '\u00A0'}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
