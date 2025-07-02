
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Square, 
  Circle, 
  Triangle, 
  Star,
  Trash2,
  Copy,
  RotateCw
} from 'lucide-react';

interface PDFShape {
  id: string;
  type: 'rectangle' | 'circle' | 'triangle' | 'star' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: { r: number; g: number; b: number };
  strokeColor: { r: number; g: number; b: number };
  strokeWidth: number;
  opacity: number;
  rotation: number;
  pageNumber: number;
}

interface ShapeToolbarProps {
  shape: PDFShape;
  onUpdate: (shapeId: string, updates: Partial<PDFShape>) => void;
  onDelete?: (shapeId: string) => void;
  onDuplicate?: (shapeId: string) => void;
}

export const ShapeToolbar: React.FC<ShapeToolbarProps> = ({
  shape,
  onUpdate,
  onDelete,
  onDuplicate
}) => {
  const handleFillColorChange = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    onUpdate(shape.id, { fillColor: { r, g, b } });
  };

  const handleStrokeColorChange = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    onUpdate(shape.id, { strokeColor: { r, g, b } });
  };

  const colorToHex = (color: { r: number; g: number; b: number }) => {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  const getShapeIcon = () => {
    switch (shape.type) {
      case 'rectangle': return <Square className="h-4 w-4" />;
      case 'circle': return <Circle className="h-4 w-4" />;
      case 'triangle': return <Triangle className="h-4 w-4" />;
      case 'star': return <Star className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  return (
    <div className="absolute -top-12 left-0 bg-white border rounded-lg shadow-xl p-3 flex items-center space-x-2 z-30 min-w-max">
      {/* Shape Type Indicator */}
      <div className="flex items-center space-x-2">
        {getShapeIcon()}
        <span className="text-sm font-medium capitalize">{shape.type}</span>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Size Controls */}
      <div className="flex items-center space-x-1">
        <Input
          type="number"
          value={Math.round(shape.width)}
          onChange={(e) => onUpdate(shape.id, { width: parseInt(e.target.value) || 50 })}
          className="w-16 h-8"
          min="10"
          max="500"
          placeholder="W"
        />
        <Input
          type="number"
          value={Math.round(shape.height)}
          onChange={(e) => onUpdate(shape.id, { height: parseInt(e.target.value) || 50 })}
          className="w-16 h-8"
          min="10"
          max="500"
          placeholder="H"
        />
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Colors */}
      <div className="flex items-center space-x-1">
        <input
          type="color"
          value={colorToHex(shape.fillColor)}
          onChange={(e) => handleFillColorChange(e.target.value)}
          className="w-8 h-8 border rounded cursor-pointer"
          title="Fill Color"
        />
        <input
          type="color"
          value={colorToHex(shape.strokeColor)}
          onChange={(e) => handleStrokeColorChange(e.target.value)}
          className="w-8 h-8 border rounded cursor-pointer"
          title="Stroke Color"
        />
      </div>

      {/* Stroke Width */}
      <Input
        type="number"
        value={shape.strokeWidth}
        onChange={(e) => onUpdate(shape.id, { strokeWidth: parseInt(e.target.value) || 1 })}
        className="w-16 h-8"
        min="0"
        max="10"
        title="Stroke Width"
      />

      {/* Opacity */}
      <Input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={shape.opacity}
        onChange={(e) => onUpdate(shape.id, { opacity: parseFloat(e.target.value) })}
        className="w-16 h-8"
        title="Opacity"
      />

      <Separator orientation="vertical" className="h-6" />

      {/* Actions */}
      {onDuplicate && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDuplicate(shape.id)}
          className="h-8 w-8 p-0"
          title="Duplicate"
        >
          <Copy className="h-4 w-4" />
        </Button>
      )}
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => onUpdate(shape.id, { rotation: (shape.rotation || 0) + 90 })}
        className="h-8 w-8 p-0"
        title="Rotate"
      >
        <RotateCw className="h-4 w-4" />
      </Button>

      {onDelete && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(shape.id)}
          className="h-8 w-8 p-0"
          title="Delete Shape"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
