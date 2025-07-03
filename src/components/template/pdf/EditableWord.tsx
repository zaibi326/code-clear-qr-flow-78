
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalText(word.text);
  }, [word.text]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
    if (localText !== word.text) {
      onUpdate(word.id, { 
        text: localText,
        isEdited: true
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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

  const getFontFamily = () => {
    let family = word.fontName || 'Arial';
    if (word.fontWeight === 'bold' && word.fontStyle === 'italic') {
      return `${family}, bold italic`;
    } else if (word.fontWeight === 'bold') {
      return `${family}, bold`;
    } else if (word.fontStyle === 'italic') {
      return `${family}, italic`;
    }
    return family;
  };

  const colorToHex = (color: { r: number; g: number; b: number }) => {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  const baseStyle = {
    position: 'absolute' as const,
    left: word.x * scale,
    top: word.y * scale,
    fontSize: word.fontSize * scale,
    fontFamily: getFontFamily(),
    fontWeight: word.fontWeight === 'bold' ? 'bold' : 'normal',
    fontStyle: word.fontStyle === 'italic' ? 'italic' : 'normal',
    color: colorToHex(word.color),
    zIndex: 10,
    margin: 0,
    padding: '1px 2px',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    cursor: 'text',
    whiteSpace: 'nowrap' as const,
    minWidth: word.width * scale,
    height: word.height * scale,
    lineHeight: `${word.height * scale}px`
  };

  return (
    <>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          onBlur={handleFinishEditing}
          onKeyDown={handleKeyDown}
          style={{
            ...baseStyle,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #2196F3',
            borderRadius: '2px'
          }}
        />
      ) : (
        <span
          onDoubleClick={handleDoubleClick}
          style={{
            ...baseStyle,
            backgroundColor: word.isEdited ? 'rgba(255, 255, 0, 0.1)' : 'transparent'
          }}
          title="Double-click to edit"
        >
          {word.text}
          {word.spaceAfter && '\u00A0'}
        </span>
      )}
    </>
  );
};
