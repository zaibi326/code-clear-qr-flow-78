
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Type, Image, Square } from 'lucide-react';
import { PDFElement } from '../ClearQRPDFEditor';

interface PDFEditorSidebarProps {
  activeTool: 'select' | 'text' | 'image' | 'shape';
  selectedElement: PDFElement | null;
  onUpdateElement: (id: string, updates: Partial<PDFElement>) => void;
  onDeleteElement: (id: string) => void;
  onAddElement: (element: Omit<PDFElement, 'id'>) => void;
  currentPage: number;
}

export const PDFEditorSidebar: React.FC<PDFEditorSidebarProps> = ({
  activeTool,
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onAddElement,
  currentPage
}) => {
  const handleAddText = () => {
    onAddElement({
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 40,
      pageNumber: currentPage,
      text: 'New text box',
      fontSize: 16,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#000000',
      backgroundColor: 'transparent',
      opacity: 1,
      rotation: 0
    });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Tools Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Tools</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleAddText}
          >
            <Type className="w-4 h-4 mr-2" />
            Add Text Box
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled
          >
            <Image className="w-4 h-4 mr-2" />
            Add Image
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled
          >
            <Square className="w-4 h-4 mr-2" />
            Add Shape
          </Button>
        </div>
      </div>

      {/* Properties Section */}
      <div className="flex-1 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Properties</h3>
        
        {selectedElement ? (
          <div className="space-y-4">
            {/* Position and Size */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Position & Size</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-600">X</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedElement.x)}
                    onChange={(e) => onUpdateElement(selectedElement.id, { 
                      x: parseInt(e.target.value) || 0 
                    })}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Y</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedElement.y)}
                    onChange={(e) => onUpdateElement(selectedElement.id, { 
                      y: parseInt(e.target.value) || 0 
                    })}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Width</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedElement.width)}
                    onChange={(e) => onUpdateElement(selectedElement.id, { 
                      width: parseInt(e.target.value) || 100 
                    })}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Height</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedElement.height)}
                    onChange={(e) => onUpdateElement(selectedElement.id, { 
                      height: parseInt(e.target.value) || 40 
                    })}
                    className="h-8"
                  />
                </div>
              </div>
            </div>

            {/* Text Properties */}
            {selectedElement.type === 'text' && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Text</Label>
                  <Input
                    value={selectedElement.text || ''}
                    onChange={(e) => onUpdateElement(selectedElement.id, { 
                      text: e.target.value 
                    })}
                    placeholder="Enter text..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-600">Font Size</Label>
                    <Input
                      type="number"
                      value={selectedElement.fontSize || 16}
                      onChange={(e) => onUpdateElement(selectedElement.id, { 
                        fontSize: parseInt(e.target.value) || 16 
                      })}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Color</Label>
                    <Input
                      type="color"
                      value={selectedElement.color || '#000000'}
                      onChange={(e) => onUpdateElement(selectedElement.id, { 
                        color: e.target.value 
                      })}
                      className="h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Font Family</Label>
                  <Select
                    value={selectedElement.fontFamily || 'Arial'}
                    onValueChange={(value) => onUpdateElement(selectedElement.id, { 
                      fontFamily: value 
                    })}
                  >
                    <SelectTrigger className="h-8">
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
                </div>

                <div>
                  <Label className="text-xs text-gray-600">Text Align</Label>
                  <Select
                    value={selectedElement.textAlign || 'left'}
                    onValueChange={(value: 'left' | 'center' | 'right') => onUpdateElement(selectedElement.id, { 
                      textAlign: value 
                    })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDeleteElement(selectedElement.id)}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Element
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">Select an element to edit its properties</p>
          </div>
        )}
      </div>
    </div>
  );
};
