
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Trash2,
  RotateCw,
  Copy,
  Layers
} from 'lucide-react';

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

interface AdvancedTextToolbarProps {
  textBlock: PDFTextBlock;
  onUpdate: (blockId: string, updates: Partial<PDFTextBlock>) => void;
  onDelete?: (blockId: string) => void;
  onDuplicate?: (blockId: string) => void;
}

export const AdvancedTextToolbar: React.FC<AdvancedTextToolbarProps> = ({
  textBlock,
  onUpdate,
  onDelete,
  onDuplicate
}) => {
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

  const handleBorderColorChange = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    onUpdate(textBlock.id, { borderColor: { r, g, b } });
  };

  const toggleBold = () => {
    const newWeight = textBlock.fontWeight === 'bold' ? 'normal' : 'bold';
    onUpdate(textBlock.id, { fontWeight: newWeight });
  };

  const toggleItalic = () => {
    const newStyle = textBlock.fontStyle === 'italic' ? 'normal' : 'italic';
    onUpdate(textBlock.id, { fontStyle: newStyle });
  };

  const toggleUnderline = () => {
    const newDecoration = textBlock.textDecoration === 'underline' ? 'none' : 'underline';
    onUpdate(textBlock.id, { textDecoration: newDecoration });
  };

  const setAlignment = (align: 'left' | 'center' | 'right' | 'justify') => {
    onUpdate(textBlock.id, { textAlign: align });
  };

  const colorToHex = (color: { r: number; g: number; b: number }) => {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  return (
    <div className="absolute -top-16 left-0 bg-white border rounded-lg shadow-xl p-3 flex items-center space-x-2 z-30 min-w-max">
      {/* Font Family */}
      <Select value={textBlock.fontName} onValueChange={(value) => onUpdate(textBlock.id, { fontName: value })}>
        <SelectTrigger className="w-32 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Helvetica">Helvetica</SelectItem>
          <SelectItem value="Times-Roman">Times</SelectItem>
          <SelectItem value="Courier">Courier</SelectItem>
          <SelectItem value="Arial">Arial</SelectItem>
          <SelectItem value="Georgia">Georgia</SelectItem>
          <SelectItem value="Verdana">Verdana</SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6" />

      {/* Font Size */}
      <Input
        type="number"
        value={textBlock.fontSize}
        onChange={(e) => handleFontSizeChange(parseInt(e.target.value) || 12)}
        className="w-16 h-8"
        min="8"
        max="72"
      />

      <Separator orientation="vertical" className="h-6" />

      {/* Text Formatting */}
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
      <Button
        size="sm"
        variant={textBlock.textDecoration === 'underline' ? 'default' : 'outline'}
        onClick={toggleUnderline}
        className="h-8 w-8 p-0"
      >
        <Underline className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Alignment */}
      <Button
        size="sm"
        variant={textBlock.textAlign === 'left' ? 'default' : 'outline'}
        onClick={() => setAlignment('left')}
        className="h-8 w-8 p-0"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={textBlock.textAlign === 'center' ? 'default' : 'outline'}
        onClick={() => setAlignment('center')}
        className="h-8 w-8 p-0"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={textBlock.textAlign === 'right' ? 'default' : 'outline'}
        onClick={() => setAlignment('right')}
        className="h-8 w-8 p-0"
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Colors */}
      <div className="flex items-center space-x-1">
        <input
          type="color"
          value={colorToHex(textBlock.color)}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-8 h-8 border rounded cursor-pointer"
          title="Text Color"
        />
        <input
          type="color"
          value={colorToHex(textBlock.borderColor || { r: 0, g: 0, b: 0 })}
          onChange={(e) => handleBorderColorChange(e.target.value)}
          className="w-8 h-8 border rounded cursor-pointer"
          title="Border Color"
        />
      </div>

      {/* Opacity */}
      <Input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={textBlock.opacity || 1}
        onChange={(e) => onUpdate(textBlock.id, { opacity: parseFloat(e.target.value) })}
        className="w-16 h-8"
        title="Opacity"
      />

      <Separator orientation="vertical" className="h-6" />

      {/* Actions */}
      {onDuplicate && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDuplicate(textBlock.id)}
          className="h-8 w-8 p-0"
          title="Duplicate"
        >
          <Copy className="h-4 w-4" />
        </Button>
      )}
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => onUpdate(textBlock.id, { rotation: (textBlock.rotation || 0) + 90 })}
        className="h-8 w-8 p-0"
        title="Rotate"
      >
        <RotateCw className="h-4 w-4" />
      </Button>

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
  );
};
