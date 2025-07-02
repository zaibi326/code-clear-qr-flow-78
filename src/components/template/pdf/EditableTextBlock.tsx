
import React, { useState, useRef, useEffect } from 'react';
import { Type } from 'lucide-react';
import { AdvancedTextToolbar } from './components/AdvancedTextToolbar';
import { TextBlockEditor } from './components/TextBlockEditor';

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
  textDecoration?: 'none' | 'underline';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  rotation?: number;
  opacity?: number;
  shadow?: boolean;
  borderColor?: { r: number; g: number; b: number };
  borderWidth?: number;
}

interface EditableTextBlockProps {
  textBlock: PDFTextBlock;
  scale: number;
  onUpdate: (blockId: string, updates: Partial<PDFTextBlock>) => void;
  onDelete?: (blockId: string) => void;
  onDuplicate?: (blockId: string) => void;
}

export const EditableTextBlock: React.FC<EditableTextBlockProps> = ({
  textBlock,
  scale,
  onUpdate,
  onDelete,
  onDuplicate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(textBlock.text);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showToolbar, setShowToolbar] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalText(textBlock.text);
  }, [textBlock.text]);

  const handleTextChange = (newText: string) => {
    setLocalText(newText);
    onUpdate(textBlock.id, { text: newText });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.detail === 2) { // Double click
      setIsEditing(true);
      setShowToolbar(true);
      return;
    }
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - textBlock.x * scale,
      y: e.clientY - textBlock.y * scale
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = (e.clientX - dragStart.x) / scale;
    const newY = (e.clientY - dragStart.y) / scale;
    
    onUpdate(textBlock.id, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
    setShowToolbar(false);
  };

  const colorToHex = (color: { r: number; g: number; b: number }) => {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontSize: textBlock.fontSize * scale,
      color: colorToHex(textBlock.color),
      fontFamily: textBlock.fontName || 'Arial',
      fontWeight: textBlock.fontWeight || 'normal',
      fontStyle: textBlock.fontStyle || 'normal',
      textDecoration: textBlock.textDecoration || 'none',
      textAlign: textBlock.textAlign || 'left',
      opacity: textBlock.opacity || 1,
      transform: `rotate(${textBlock.rotation || 0}deg)`,
    };

    if (textBlock.borderColor && textBlock.borderWidth) {
      return {
        ...baseStyle,
        border: `${textBlock.borderWidth}px solid ${colorToHex(textBlock.borderColor)}`,
        padding: '2px'
      };
    }

    return baseStyle;
  };

  return (
    <div
      ref={textRef}
      className={`absolute cursor-move border-2 transition-all group ${
        isEditing ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-transparent hover:border-blue-300 hover:bg-blue-50/50'
      } ${textBlock.isEdited ? 'bg-yellow-50/80' : ''}`}
      style={{
        left: textBlock.x * scale,
        top: textBlock.y * scale,
        width: Math.max(textBlock.width * scale, 50),
        minHeight: textBlock.height * scale,
        ...getTextStyle(),
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => setShowToolbar(true)}
      onMouseLeave={() => !isEditing && setShowToolbar(false)}
    >
      <TextBlockEditor
        textBlock={textBlock}
        scale={scale}
        isEditing={isEditing}
        localText={localText}
        onTextChange={handleTextChange}
        onFinishEditing={handleFinishEditing}
      />

      {/* Enhanced Floating Toolbar */}
      {showToolbar && (
        <AdvancedTextToolbar
          textBlock={textBlock}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      )}
      
      {/* Edit indicator */}
      {textBlock.isEdited && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
          <Type className="h-2 w-2 text-white" />
        </div>
      )}
    </div>
  );
};
