import React, { useState, useCallback } from 'react';
import { CanvaElement } from '../FullCanvaPDFEditor';

interface EnhancedTextEditorProps {
  textElement: CanvaElement;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, updates: Partial<CanvaElement>) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
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
  const [editText, setEditText] = useState(textElement.text || '');

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setEditText(textElement.text || '');
  }, [textElement.text]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(e.target.value);
  }, []);

  const handleTextSubmit = useCallback(() => {
    onUpdate(textElement.id, { text: editText });
    setIsEditing(false);
  }, [textElement.id, editText, onUpdate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(textElement.text || '');
    }
  }, [handleTextSubmit, textElement.text]);

  // Highlight search terms
  const getHighlightedText = (text: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-300 text-black">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const style = {
    position: 'absolute' as const,
    left: textElement.x * scale,
    top: textElement.y * scale,
    width: textElement.width * scale,
    height: textElement.height * scale,
    transform: `rotate(${textElement.rotation}deg)`,
    opacity: textElement.opacity,
    zIndex: textElement.zIndex,
    fontSize: (textElement.fontSize || 16) * scale,
    fontFamily: textElement.fontFamily || 'Arial',
    fontWeight: textElement.fontWeight || 'normal',
    fontStyle: textElement.fontStyle || 'normal',
    textAlign: textElement.textAlign || 'left',
    color: textElement.color || '#000000',
    cursor: isEditing ? 'text' : 'pointer'
  };

  return (
    <div
      style={style}
      className={`border-2 transition-all duration-200 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50/20' 
          : 'border-transparent hover:border-gray-300'
      }`}
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <textarea
          value={editText}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onBlur={handleTextSubmit}
          className="w-full h-full border-none outline-none resize-none bg-transparent"
          style={{
            fontSize: (textElement.fontSize || 16) * scale,
            fontFamily: textElement.fontFamily || 'Arial',
            fontWeight: textElement.fontWeight || 'normal',
            fontStyle: textElement.fontStyle || 'normal',
            textAlign: textElement.textAlign || 'left',
            color: textElement.color || '#000000'
          }}
          autoFocus
        />
      ) : (
        <div className="w-full h-full overflow-hidden break-words">
          {getHighlightedText(textElement.text || 'Click to edit')}
        </div>
      )}
      
      {/* Selection handles */}
      {isSelected && !isEditing && (
        <>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full cursor-nw-resize" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full cursor-ne-resize" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full cursor-sw-resize" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full cursor-se-resize" />
        </>
      )}
    </div>
  );
};