
import React, { useState, useRef, useEffect } from 'react';

interface EditableText {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  pageNumber: number;
  originalText: string;
  isEdited: boolean;
}

interface InlineTextEditorProps {
  textElement: EditableText;
  scale: number;
  isSelected: boolean;
  onUpdate: (id: string, newText: string) => void;
  onSelect: () => void;
  onDeselect: () => void;
}

export const InlineTextEditor: React.FC<InlineTextEditorProps> = ({
  textElement,
  scale,
  isSelected,
  onUpdate,
  onSelect,
  onDeselect
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(textElement.text);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(textElement.text);
  }, [textElement.text]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      finishEditing();
    } else if (e.key === 'Escape') {
      setEditValue(textElement.text);
      setIsEditing(false);
    }
  };

  const finishEditing = () => {
    if (editValue !== textElement.text) {
      onUpdate(textElement.id, editValue);
    }
    setIsEditing(false);
  };

  const handleBlur = () => {
    finishEditing();
  };

  return (
    <div
      className={`absolute cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-opacity-75' : ''
      } ${textElement.isEdited ? 'bg-blue-50 bg-opacity-50' : ''}`}
      style={{
        left: textElement.x * scale,
        top: textElement.y * scale,
        width: Math.max(textElement.width * scale, 100),
        height: textElement.height * scale,
        fontSize: textElement.fontSize * scale,
        lineHeight: `${textElement.height * scale}px`,
        zIndex: isSelected ? 10 : 1
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <textarea
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full h-full resize-none border-2 border-blue-500 bg-white p-1 focus:outline-none"
          style={{
            fontSize: textElement.fontSize * scale,
            fontFamily: 'inherit',
            lineHeight: 'normal'
          }}
        />
      ) : (
        <div
          className="w-full h-full flex items-center p-1 hover:bg-blue-100 hover:bg-opacity-50 transition-colors"
          style={{
            fontSize: textElement.fontSize * scale,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
        >
          {textElement.text}
        </div>
      )}
      
      {/* Selection indicators */}
      {isSelected && !isEditing && (
        <>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
        </>
      )}
    </div>
  );
};
