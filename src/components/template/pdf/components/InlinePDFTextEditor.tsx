
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Type, Palette, AlignLeft, AlignCenter, AlignRight, Check, X } from 'lucide-react';

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
  const [color, setColor] = useState(element.color);
  const [textAlign, setTextAlign] = useState(element.textAlign);
  const [showToolbar, setShowToolbar] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      color,
      textAlign
    });
    setShowToolbar(false);
  }, [editedText, fontSize, fontFamily, color, textAlign, onFinishEdit]);

  const handleCancel = useCallback(() => {
    setEditedText(element.text);
    setFontSize(element.fontSize);
    setColor(element.color);
    setTextAlign(element.textAlign);
    onCancel();
    setShowToolbar(false);
  }, [element, onCancel]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  if (isEditing) {
    return (
      <div
        ref={containerRef}
        className="absolute z-50"
        style={{
          left: element.x * scale,
          top: element.y * scale,
          width: element.width * scale,
          minHeight: element.height * scale,
        }}
      >
        {/* Editing Toolbar */}
        <div className="absolute -top-12 left-0 flex items-center gap-2 bg-white rounded-lg shadow-lg border p-2 z-60">
          <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(parseInt(value))}>
            <SelectTrigger className="w-16 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map(size => (
                <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectTrigger className="w-24 h-8">
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

          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded border cursor-pointer"
          />

          <div className="flex gap-1">
            <Button
              variant={textAlign === 'left' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTextAlign('left')}
              className="h-8 w-8 p-0"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant={textAlign === 'center' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTextAlign('center')}
              className="h-8 w-8 p-0"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant={textAlign === 'right' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTextAlign('right')}
              className="h-8 w-8 p-0"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-1 ml-2">
            <Button variant="default" size="sm" onClick={handleSave} className="h-8 w-8 p-0">
              <Check className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Text Editor */}
        <textarea
          ref={textareaRef}
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full resize-none border border-blue-500 bg-white/95 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            fontSize: fontSize * scale,
            fontFamily,
            color,
            textAlign,
            minHeight: element.height * scale,
          }}
          autoFocus
        />
      </div>
    );
  }

  return (
    <div
      className="absolute cursor-text hover:bg-blue-100/30 rounded transition-colors group"
      style={{
        left: element.x * scale,
        top: element.y * scale,
        width: element.width * scale,
        height: element.height * scale,
        fontSize: fontSize * scale,
        fontFamily,
        color,
        textAlign,
        display: 'flex',
        alignItems: 'center',
        padding: '2px',
      }}
      onClick={onStartEdit}
    >
      <span className="w-full break-words">{element.text}</span>
      
      {/* Hover edit indicator */}
      <div className="absolute -top-6 -right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-blue-500 text-white rounded-full">
          <Type className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
