
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Type,
  Palette,
  X
} from 'lucide-react';

interface RichTextEditorProps {
  initialText: string;
  onSave: (text: string, formatting: any) => void;
  onCancel: () => void;
  position: { x: number; y: number };
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialText,
  onSave,
  onCancel,
  position
}) => {
  const [text, setText] = useState(initialText);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  const handleSave = () => {
    const formatting = {
      fontSize,
      fontFamily,
      color: textColor,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textDecoration: isUnderline ? 'underline' : 'none',
      textAlign
    };
    onSave(text, formatting);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <Card 
      className="absolute z-50 w-80 shadow-lg border-2 border-blue-500"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <CardContent className="p-4 space-y-3">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant={isBold ? 'default' : 'outline'}
              onClick={() => setIsBold(!isBold)}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={isItalic ? 'default' : 'outline'}
              onClick={() => setIsItalic(!isItalic)}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={isUnderline ? 'default' : 'outline'}
              onClick={() => setIsUnderline(!isUnderline)}
            >
              <Underline className="w-4 h-4" />
            </Button>
          </div>
          <Button size="sm" variant="ghost" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant={textAlign === 'left' ? 'default' : 'outline'}
            onClick={() => setTextAlign('left')}
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={textAlign === 'center' ? 'default' : 'outline'}
            onClick={() => setTextAlign('center')}
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={textAlign === 'right' ? 'default' : 'outline'}
            onClick={() => setTextAlign('right')}
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Font Controls */}
        <div className="flex items-center space-x-2">
          <select 
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-16 text-sm border rounded px-2 py-1"
            min="8"
            max="72"
          />
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-8 h-8 border rounded cursor-pointer"
          />
        </div>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-20 text-sm border rounded px-2 py-1 resize-none"
          style={{
            fontSize: `${fontSize}px`,
            fontFamily,
            color: textColor,
            fontWeight: isBold ? 'bold' : 'normal',
            fontStyle: isItalic ? 'italic' : 'normal',
            textDecoration: isUnderline ? 'underline' : 'none',
            textAlign: textAlign as any
          }}
          placeholder="Enter your text..."
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save Text
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          Ctrl+Enter to save • Esc to cancel
        </div>
      </CardContent>
    </Card>
  );
};
