
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Type, AlignLeft, AlignCenter, AlignRight, Check, X, Bold, Italic, Palette } from 'lucide-react';

interface InlinePDFTextEditorProps {
  element: {
    id: string;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
    fontWeight: 'normal' | 'bold';
    color: string;
    textAlign: 'left' | 'center' | 'right';
  };
  scale: number;
  isEditing: boolean;
  onStartEdit: () => void;
  onFinishEdit: (updates: any) => void;
  onCancel: () => void;
}

export const InlinePDFTextEditor: React.FC<InlinePDFTextEditorProps> = ({
  element,
  scale,
  isEditing,
  onStartEdit,
  onFinishEdit,
  onCancel
}) => {
  const [editedText, setEditedText] = useState(element.text);
  const [fontSize, setFontSize] = useState(element.fontSize);
  const [fontFamily, setFontFamily] = useState(element.fontFamily);
  const [fontWeight, setFontWeight] = useState(element.fontWeight);
  const [color, setColor] = useState(element.color);
  const [textAlign, setTextAlign] = useState(element.textAlign);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset state when element changes
  useEffect(() => {
    setEditedText(element.text);
    setFontSize(element.fontSize);
    setFontFamily(element.fontFamily);
    setFontWeight(element.fontWeight);
    setColor(element.color);
    setTextAlign(element.textAlign);
  }, [element.id, element.text, element.fontSize, element.fontFamily, element.fontWeight, element.color, element.textAlign]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    onFinishEdit({
      text: editedText,
      fontSize,
      fontFamily,
      fontWeight,
      color,
      textAlign
    });
  }, [editedText, fontSize, fontFamily, fontWeight, color, textAlign, onFinishEdit]);

  const handleCancel = useCallback(() => {
    setEditedText(element.text);
    setFontSize(element.fontSize);
    setFontFamily(element.fontFamily);
    setFontWeight(element.fontWeight);
    setColor(element.color);
    setTextAlign(element.textAlign);
    onCancel();
  }, [element, onCancel]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
    e.stopPropagation();
  }, [handleSave, handleCancel]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isEditing) {
      onStartEdit();
    }
  }, [isEditing, onStartEdit]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isEditing) {
      onStartEdit();
    }
  }, [isEditing, onStartEdit]);

  if (isEditing) {
    return (
      <div
        ref={containerRef}
        className="absolute z-50 bg-white border-2 border-blue-500 rounded-lg shadow-lg"
        style={{
          left: element.x * scale,
          top: element.y * scale,
          width: Math.max(element.width * scale, 200),
          minHeight: element.height * scale,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Editing Toolbar */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-t-lg p-2 border-b">
          <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(parseInt(value))}>
            <SelectTrigger className="w-16 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map(size => (
                <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectTrigger className="w-20 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="Times">Times</SelectItem>
              <SelectItem value="Courier">Courier</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={fontWeight === 'bold' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold')}
            className="h-7 w-7 p-0"
          >
            <Bold className="w-3 h-3" />
          </Button>

          <div className="relative">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-7 h-7 rounded border cursor-pointer"
            />
          </div>

          <div className="flex gap-1">
            <Button
              variant={textAlign === 'left' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTextAlign('left')}
              className="h-7 w-7 p-0"
            >
              <AlignLeft className="w-3 h-3" />
            </Button>
            <Button
              variant={textAlign === 'center' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTextAlign('center')}
              className="h-7 w-7 p-0"
            >
              <AlignCenter className="w-3 h-3" />
            </Button>
            <Button
              variant={textAlign === 'right' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTextAlign('right')}
              className="h-7 w-7 p-0"
            >
              <AlignRight className="w-3 h-3" />
            </Button>
          </div>

          <div className="flex gap-1 ml-auto">
            <Button variant="default" size="sm" onClick={handleSave} className="h-7 w-7 p-0">
              <Check className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel} className="h-7 w-7 p-0">
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Text Editor */}
        <textarea
          ref={textareaRef}
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full resize-none border-0 bg-white rounded-b-lg px-3 py-2 focus:outline-none"
          style={{
            fontSize: Math.max(fontSize * scale * 0.8, 12),
            fontFamily,
            fontWeight,
            color,
            textAlign,
            minHeight: Math.max(element.height * scale - 40, 60),
          }}
          placeholder="Enter your text here..."
          autoFocus
        />
      </div>
    );
  }

  return (
    <div
      className="absolute cursor-pointer hover:bg-blue-100/30 hover:border hover:border-blue-300 rounded transition-all group select-none"
      style={{
        left: element.x * scale,
        top: element.y * scale,
        width: element.width * scale,
        height: element.height * scale,
        fontSize: fontSize * scale,
        fontFamily,
        fontWeight,
        color,
        textAlign,
        display: 'flex',
        alignItems: 'flex-start',
        padding: '4px',
        lineHeight: '1.2',
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      title="Click to edit text"
    >
      <span className="w-full break-words whitespace-pre-wrap">{element.text || 'Click to edit'}</span>
      
      {/* Hover edit indicator */}
      <div className="absolute -top-6 -right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-blue-500 text-white rounded-full p-1 shadow-lg">
          <Type className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
