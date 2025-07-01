
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Settings, Bold, Italic, Underline } from 'lucide-react';

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
    onUpdate(textBlock.id, { fontSize: newSize });
  };

  const handleColorChange = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    onUpdate(textBlock.id, { color: { r, g, b } });
  };

  const colorToHex = (color: { r: number; g: number; b: number }) => {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  return (
    <div
      ref={textRef}
      className={`absolute cursor-move border-2 transition-all ${
        isEditing ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-blue-300'
      } ${textBlock.isEdited ? 'bg-yellow-50' : ''}`}
      style={{
        left: textBlock.x * scale,
        top: textBlock.y * scale,
        width: textBlock.width * scale,
        minHeight: textBlock.height * scale,
        fontSize: textBlock.fontSize * scale,
        color: colorToHex(textBlock.color),
        fontFamily: textBlock.fontName
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {isEditing ? (
        <div className="relative">
          <textarea
            value={localText}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                setIsEditing(false);
              }
            }}
            className="w-full h-full resize-none border-none outline-none bg-transparent p-1"
            style={{
              fontSize: textBlock.fontSize * scale,
              fontFamily: textBlock.fontName,
              color: colorToHex(textBlock.color)
            }}
            autoFocus
          />
          
          {/* Formatting toolbar */}
          <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 flex items-center space-x-2 z-10">
            <Input
              type="number"
              value={textBlock.fontSize}
              onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
              className="w-16 h-8"
              min="8"
              max="72"
            />
            <input
              type="color"
              value={colorToHex(textBlock.color)}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-8 h-8 border rounded cursor-pointer"
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
                className="h-8"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className="p-1 w-full h-full"
          style={{
            fontSize: textBlock.fontSize * scale,
            fontFamily: textBlock.fontName,
            color: colorToHex(textBlock.color),
            whiteSpace: 'pre-wrap'
          }}
        >
          {localText}
        </div>
      )}
      
      {/* Edit indicator */}
      {textBlock.isEdited && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white" />
      )}
    </div>
  );
};
