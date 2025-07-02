
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bold, Italic, Trash2, Type } from 'lucide-react';

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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showToolbar, setShowToolbar] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalText(textBlock.text);
  }, [textBlock.text]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

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

  const handleFontSizeChange = (newSize: number) => {
    onUpdate(textBlock.id, { fontSize: newSize, height: newSize });
  };

  const handleColorChange = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    onUpdate(textBlock.id, { color: { r, g, b } });
  };

  const toggleBold = () => {
    const newWeight = textBlock.fontWeight === 'bold' ? 'normal' : 'bold';
    onUpdate(textBlock.id, { fontWeight: newWeight });
  };

  const toggleItalic = () => {
    const newStyle = textBlock.fontStyle === 'italic' ? 'normal' : 'italic';
    onUpdate(textBlock.id, { fontStyle: newStyle });
  };

  const colorToHex = (color: { r: number; g: number; b: number }) => {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

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

  const handleFinishEditing = () => {
    setIsEditing(false);
    setShowToolbar(false);
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
        fontSize: textBlock.fontSize * scale,
        color: colorToHex(textBlock.color),
        fontFamily: getFontFamily(),
        fontWeight: getFontWeight(),
        fontStyle: getFontStyle(),
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => setShowToolbar(true)}
      onMouseLeave={() => !isEditing && setShowToolbar(false)}
    >
      {isEditing ? (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={localText}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={handleFinishEditing}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleFinishEditing();
              } else if (e.key === 'Escape') {
                handleFinishEditing();
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
      ) : (
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
      )}

      {/* Floating Toolbar */}
      {showToolbar && (
        <div className="absolute -top-12 left-0 bg-white border rounded-lg shadow-lg p-2 flex items-center space-x-2 z-20 min-w-max">
          <Button
            size="sm"
            variant={textBlock.fontWeight === 'bold' ? 'default' : 'outline'}
            onClick={toggleBold}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={textBlock.fontStyle === 'italic' ? 'default' : 'outline'}
            onClick={toggleItalic}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={textBlock.fontSize}
            onChange={(e) => handleFontSizeChange(parseInt(e.target.value) || 12)}
            className="w-16 h-8"
            min="8"
            max="72"
          />
          <input
            type="color"
            value={colorToHex(textBlock.color)}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-8 h-8 border rounded cursor-pointer"
            title="Text Color"
          />
          <Select value={textBlock.fontName} onValueChange={(value) => onUpdate(textBlock.id, { fontName: value })}>
            <SelectTrigger className="w-24 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="Times-Roman">Times</SelectItem>
              <SelectItem value="Courier">Courier</SelectItem>
            </SelectContent>
          </Select>
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(textBlock.id)}
              className="h-8 w-8 p-0"
              title="Delete Text"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
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
