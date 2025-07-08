
import React, { useState, useRef, useEffect } from 'react';
import { PDFTextElement } from '../ClearQRPDFEditor';

interface CanvaStyleTextEditorProps {
  textElement: PDFTextElement;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, updates: Partial<PDFTextElement>) => void;
}

export const CanvaStyleTextEditor: React.FC<CanvaStyleTextEditorProps> = ({
  textElement,
  scale,
  isSelected,
  onSelect,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(textElement.text);
  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditText(textElement.text);
  }, [textElement.text]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editText !== textElement.text) {
      onUpdate(textElement.id, { text: editText, isEdited: true });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditText(textElement.text);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`absolute cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: textElement.x * scale,
        top: textElement.y * scale,
        width: textElement.width * scale,
        height: textElement.height * scale,
        transform: `rotate(${textElement.rotation || 0}deg)`,
        opacity: textElement.opacity || 1,
        zIndex: isSelected ? 10 : 1
      }}
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <textarea
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full resize-none border-none outline-none bg-transparent"
          style={{
            fontSize: (textElement.fontSize || 16) * scale,
            fontFamily: textElement.fontFamily || 'Arial',
            fontWeight: textElement.fontWeight || 'normal',
            fontStyle: textElement.fontStyle || 'normal',
            textAlign: textElement.textAlign || 'left',
            color: textElement.color || '#000000',
            backgroundColor: textElement.backgroundColor === 'transparent' ? 'transparent' : textElement.backgroundColor
          }}
        />
      ) : (
        <div
          ref={textRef}
          className="w-full h-full flex items-center whitespace-pre-wrap"
          style={{
            fontSize: (textElement.fontSize || 16) * scale,
            fontFamily: textElement.fontFamily || 'Arial',
            fontWeight: textElement.fontWeight || 'normal',
            fontStyle: textElement.fontStyle || 'normal',
            textAlign: textElement.textAlign || 'left',
            color: textElement.color || '#000000',
            backgroundColor: textElement.backgroundColor === 'transparent' ? 'transparent' : textElement.backgroundColor
          }}
        >
          {textElement.text}
        </div>
      )}
      
      {/* Selection handles */}
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
