
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Type, Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

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
  const selectedElement = selectedElementId ? textElements.get(selectedElementId) : null;

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">Text Tools</Label>
      
      <Button
        size="sm"
        variant={selectedTool === 'text' ? 'default' : 'outline'}
        onClick={() => onToolChange('text')}
        className="w-full h-12 flex items-center justify-center gap-2"
      >
        <Type className="w-4 h-4" />
        Add Text
      </Button>

      {selectedElement && 'text' in selectedElement && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Text Properties</Label>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-600">Font Size</Label>
              <Input
                type="number"
                value={selectedElement.fontSize}
                onChange={(e) => onUpdateTextElement(selectedElementId!, { fontSize: parseInt(e.target.value) || 16 })}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Color</Label>
              <Input
                type="color"
                value={selectedElement.color}
                onChange={(e) => onUpdateTextElement(selectedElementId!, { color: e.target.value })}
                className="h-8"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-600">Font Family</Label>
            <Select
              value={selectedElement.fontFamily}
              onValueChange={(value) => onUpdateTextElement(selectedElementId!, { fontFamily: value })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedElement.fontWeight === 'bold' ? 'default' : 'outline'}
              onClick={() => onUpdateTextElement(selectedElementId!, { 
                fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' 
              })}
              className="flex-1"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
              onClick={() => onUpdateTextElement(selectedElementId!, { 
                fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' 
              })}
              className="flex-1"
            >
              <Italic className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedElement.textAlign === 'left' ? 'default' : 'outline'}
              onClick={() => onUpdateTextElement(selectedElementId!, { textAlign: 'left' })}
              className="flex-1"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={selectedElement.textAlign === 'center' ? 'default' : 'outline'}
              onClick={() => onUpdateTextElement(selectedElementId!, { textAlign: 'center' })}
              className="flex-1"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={selectedElement.textAlign === 'right' ? 'default' : 'outline'}
              onClick={() => onUpdateTextElement(selectedElementId!, { textAlign: 'right' })}
              className="flex-1"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
