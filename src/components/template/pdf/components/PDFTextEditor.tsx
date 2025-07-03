
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Type, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Edit
} from 'lucide-react';

interface PDFTextEditorProps {
  selectedTool: string;
  onToolChange: (tool: string) => void;
  selectedElementId: string | null;
  textElements: Map<string, any>;
  onUpdateTextElement: (id: string, updates: any) => void;
}

export const PDFTextEditor: React.FC<PDFTextEditorProps> = ({
  selectedTool,
  onToolChange,
  selectedElementId,
  textElements,
  onUpdateTextElement
}) => {
  const [isWordEditMode, setIsWordEditMode] = useState(false);
  
  const selectedElement = selectedElementId ? textElements.get(selectedElementId) : null;

  const handleFontSizeChange = (fontSize: number) => {
    if (selectedElementId) {
      onUpdateTextElement(selectedElementId, { fontSize });
    }
  };

  const handleColorChange = (color: string) => {
    if (selectedElementId) {
      onUpdateTextElement(selectedElementId, { color });
    }
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    if (selectedElementId) {
      onUpdateTextElement(selectedElementId, { fontFamily });
    }
  };

  const toggleBold = () => {
    if (selectedElementId && selectedElement) {
      onUpdateTextElement(selectedElementId, { 
        fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' 
      });
    }
  };

  const toggleItalic = () => {
    if (selectedElementId && selectedElement) {
      onUpdateTextElement(selectedElementId, { 
        fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' 
      });
    }
  };

  const handleTextAlign = (textAlign: 'left' | 'center' | 'right') => {
    if (selectedElementId) {
      onUpdateTextElement(selectedElementId, { textAlign });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Text Editing Tools</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant={selectedTool === 'select' ? 'default' : 'outline'}
            onClick={() => onToolChange('select')}
            className="flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Select
          </Button>
          <Button
            size="sm"
            variant={selectedTool === 'text' ? 'default' : 'outline'}
            onClick={() => onToolChange('text')}
            className="flex items-center justify-center gap-2"
          >
            <Type className="w-4 h-4" />
            Add Text
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">Word-by-Word Editing</Label>
        <Button
          size="sm"
          variant={isWordEditMode ? 'default' : 'outline'}
          onClick={() => setIsWordEditMode(!isWordEditMode)}
          className="w-full"
        >
          {isWordEditMode ? 'Exit Word Edit Mode' : 'Enable Word Edit Mode'}
        </Button>
        <p className="text-xs text-gray-500 mt-1">
          Click on individual words to edit them when enabled
        </p>
      </div>

      {selectedElement && (
        <>
          <Separator />
          
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Text Properties</Label>
            
            {/* Font Size and Color */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-600">Font Size</Label>
                <Input
                  type="number"
                  value={selectedElement.fontSize || 16}
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value) || 16)}
                  className="h-8"
                  min="8"
                  max="72"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={selectedElement.color || '#000000'}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="h-8 w-12 p-1"
                  />
                  <Input
                    type="text"
                    value={selectedElement.color || '#000000'}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="h-8 flex-1 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Font Family */}
            <div>
              <Label className="text-xs text-gray-600">Font Family</Label>
              <Select
                value={selectedElement.fontFamily || 'Arial'}
                onValueChange={handleFontFamilyChange}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Text Style Controls */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedElement.fontWeight === 'bold' ? 'default' : 'outline'}
                onClick={toggleBold}
                className="flex-1"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
                onClick={toggleItalic}
                className="flex-1"
              >
                <Italic className="w-4 h-4" />
              </Button>
            </div>

            {/* Text Alignment */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedElement.textAlign === 'left' ? 'default' : 'outline'}
                onClick={() => handleTextAlign('left')}
                className="flex-1"
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={selectedElement.textAlign === 'center' ? 'default' : 'outline'}
                onClick={() => handleTextAlign('center')}
                className="flex-1"
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={selectedElement.textAlign === 'right' ? 'default' : 'outline'}
                onClick={() => handleTextAlign('right')}
                className="flex-1"
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
