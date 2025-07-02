
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

interface TextBlockEditorProps {
  textBlock: PDFTextBlock;
  scale: number;
  isEditing: boolean;
  localText: string;
  onTextChange: (text: string) => void;
  onFinishEditing: () => void;
}

export const TextBlockEditor: React.FC<TextBlockEditorProps> = ({
  textBlock,
  scale,
  isEditing,
  localText,
  onTextChange,
  onFinishEditing
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const getFontFamily = () => {
    let family = textBlock.fontName || 'Arial';
    if (textBlock.fontWeight === 'bold' && textBlock.fontStyle === 'italic') {
      return `${family}, bold italic`;
    } else if (textBlock.fontWeight === 'bold') {
      return `${family}, bold`;
    } else if (textBlock.fontStyle === 'italic') {
      return `${family}, italic`;
    }
    return family;
  };

  const getFontWeight = () => {
    return textBlock.fontWeight === 'bold' ? 'bold' : 'normal';
  };

  const getFontStyle = () => {
    return textBlock.fontStyle === 'italic' ? 'italic' : 'normal';
  };

  const colorToHex = (color: { r: number; g: number; b: number }) => {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  if (isEditing) {
    return (
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={localText}
          onChange={(e) => onTextChange(e.target.value)}
          onBlur={onFinishEditing}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onFinishEditing();
            } else if (e.key === 'Escape') {
              onFinishEditing();
            }
          }}
          className="w-full h-full resize-none border-none outline-none bg-transparent p-1 min-h-[20px]"
          style={{
            fontSize: textBlock.fontSize * scale,
            fontFamily: getFontFamily(),
            fontWeight: getFontWeight(),
            fontStyle: getFontStyle(),
            color: colorToHex(textBlock.color)
          }}
          rows={Math.max(1, Math.ceil(localText.length / 20))}
        />
      </div>
    );
  }

  return (
    <div
      className="p-1 w-full h-full whitespace-pre-wrap"
      style={{
        fontSize: textBlock.fontSize * scale,
        fontFamily: getFontFamily(),
        fontWeight: getFontWeight(),
        fontStyle: getFontStyle(),
        color: colorToHex(textBlock.color),
      }}
    >
      {localText}
    </div>
  );
};
