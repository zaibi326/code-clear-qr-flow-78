
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Type, 
  Move, 
  Trash2, 
  RotateCw, 
  Palette,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  rotation: number;
  isSelected: boolean;
}

interface DragDropTextEditorProps {
  onTextAdd: (element: Omit<TextElement, 'id'>) => void;
  onTextUpdate: (id: string, updates: Partial<TextElement>) => void;
  onTextDelete: (id: string) => void;
  selectedElementId?: string;
}

export const DragDropTextEditor: React.FC<DragDropTextEditorProps> = ({
  onTextAdd,
  onTextUpdate,
  onTextDelete,
  selectedElementId
}) => {
  const [newText, setNewText] = useState('New Text');
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState('#000000');
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal');
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [rotation, setRotation] = useState(0);

  const handleAddText = () => {
    if (!newText.trim()) return;

    const textElement: Omit<TextElement, 'id'> = {
      text: newText,
      x: Math.random() * 300 + 50, // Random position
      y: Math.random() * 200 + 50,
      fontSize,
      fontFamily: 'Arial, sans-serif',
      color: textColor,
      fontWeight,
      fontStyle,
      textAlign,
      rotation,
      isSelected: false
    };

    onTextAdd(textElement);
    setNewText('New Text');
  };

  const handleStyleUpdate = (property: string, value: any) => {
    if (selectedElementId) {
      onTextUpdate(selectedElementId, { [property]: value });
    }
  };

  return (
    <div className="space-y-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Type className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Text Editor</h3>
      </div>

      {/* Add New Text */}
      <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-lg border border-blue-200/40">
        <h4 className="font-medium text-gray-800">Add New Text</h4>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="new-text" className="text-sm font-medium text-gray-700">
              Text Content
            </Label>
            <Input
              id="new-text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Enter your text..."
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="font-size" className="text-sm font-medium text-gray-700">
                Size
              </Label>
              <Input
                id="font-size"
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                min="8"
                max="72"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="text-color" className="text-sm font-medium text-gray-700">
                Color
              </Label>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  id="text-color"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-9 p-1 border rounded"
                />
                <span className="text-xs text-gray-500 font-mono">{textColor}</span>
              </div>
            </div>
          </div>
          
          {/* Text Formatting */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Formatting</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={fontWeight === 'bold' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold')}
                className="h-8 w-8 p-0"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant={fontStyle === 'italic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')}
                className="h-8 w-8 p-0"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant={textAlign === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTextAlign('left')}
                className="h-8 w-8 p-0"
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant={textAlign === 'center' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTextAlign('center')}
                className="h-8 w-8 p-0"
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant={textAlign === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTextAlign('right')}
                className="h-8 w-8 p-0"
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Button onClick={handleAddText} className="w-full" disabled={!newText.trim()}>
            <Type className="w-4 h-4 mr-2" />
            Add Text Element
          </Button>
        </div>
      </div>

      {/* Selected Element Controls */}
      {selectedElementId && (
        <div className="space-y-4 p-4 bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-lg border border-green-200/40">
          <h4 className="font-medium text-gray-800 flex items-center gap-2">
            <Move className="w-4 h-4" />
            Selected Element
          </h4>
          
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">Font Size</Label>
              <Input
                type="number"
                min="8"
                max="72"
                onChange={(e) => handleStyleUpdate('fontSize', Number(e.target.value))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700">Color</Label>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  type="color"
                  onChange={(e) => handleStyleUpdate('color', e.target.value)}
                  className="w-12 h-9 p-1 border rounded"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStyleUpdate('color', '#000000')}
                  className="text-xs"
                >
                  Reset
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700">Rotation</Label>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  type="range"
                  min="0"
                  max="360"
                  step="15"
                  value={rotation}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setRotation(value);
                    handleStyleUpdate('rotation', value);
                  }}
                  className="flex-1"
                />
                <span className="text-xs text-gray-500 min-w-[40px]">{rotation}°</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStyleUpdate('rotation', 0)}
                className="flex-1"
              >
                <RotateCw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onTextDelete(selectedElementId)}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200/60">
        <p className="text-sm text-amber-800">
          <strong>Drag & Drop:</strong> Click and drag text elements to reposition them. 
          Double-click to edit text inline. Use the controls above to customize styling.
        </p>
      </div>
    </div>
  );
};
