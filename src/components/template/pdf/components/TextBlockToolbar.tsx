
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bold, Italic, Trash2 } from 'lucide-react';

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

interface TextBlockToolbarProps {
  textBlock: PDFTextBlock;
  onUpdate: (blockId: string, updates: Partial<PDFTextBlock>) => void;
  onDelete?: (blockId: string) => void;
}

export const TextBlockToolbar: React.FC<TextBlockToolbarProps> = ({
  textBlock,
  onUpdate,
  onDelete
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

  return (
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
  );
};
