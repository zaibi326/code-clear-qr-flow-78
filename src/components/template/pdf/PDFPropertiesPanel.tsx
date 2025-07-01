
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline,
  FileText
} from 'lucide-react';
import { ColorPicker } from '@/components/ui/color-picker';
import { FabricObject } from 'fabric';

interface PDFPropertiesPanelProps {
  selectedObject: FabricObject | null;
  textColor: string;
  setTextColor: (color: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFamily: string;
  setFontFamily: (family: string) => void;
  textAlign: 'left' | 'center' | 'right';
  setTextAlign: (align: 'left' | 'center' | 'right') => void;
  isBold: boolean;
  setIsBold: (bold: boolean) => void;
  isItalic: boolean;
  setIsItalic: (italic: boolean) => void;
  isUnderline: boolean;
  setIsUnderline: (underline: boolean) => void;
  fillColor: string;
  setFillColor: (color: string) => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  onUpdateSelectedObject: (property: string, value: any) => void;
}

export const PDFPropertiesPanel: React.FC<PDFPropertiesPanelProps> = ({
  selectedObject,
  textColor,
  setTextColor,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  textAlign,
  setTextAlign,
  isBold,
  setIsBold,
  isItalic,
  setIsItalic,
  isUnderline,
  setIsUnderline,
  fillColor,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  onUpdateSelectedObject
}) => {
  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Properties</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {selectedObject && (
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Position</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <Label className="text-xs">X</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedObject.left || 0)}
                      onChange={(e) => onUpdateSelectedObject('left', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Y</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedObject.top || 0)}
                      onChange={(e) => onUpdateSelectedObject('top', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Size</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <Label className="text-xs">Width</Label>
                    <Input
                      type="number"
                      value={Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1))}
                      onChange={(e) => {
                        const newWidth = parseInt(e.target.value);
                        onUpdateSelectedObject('scaleX', newWidth / (selectedObject.width || 1));
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Height</Label>
                    <Input
                      type="number"
                      value={Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1))}
                      onChange={(e) => {
                        const newHeight = parseInt(e.target.value);
                        onUpdateSelectedObject('scaleY', newHeight / (selectedObject.height || 1));
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Rotation</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Slider
                    value={[selectedObject.angle || 0]}
                    onValueChange={(value) => onUpdateSelectedObject('angle', value[0])}
                    max={360}
                    min={0}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm w-12">{Math.round(selectedObject.angle || 0)}°</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="style" className="space-y-4">
              {selectedObject.type === 'i-text' && (
                <>
                  <div>
                    <Label className="text-sm font-medium">Font</Label>
                    <Select
                      value={fontFamily}
                      onValueChange={(value) => {
                        setFontFamily(value);
                        onUpdateSelectedObject('fontFamily', value);
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Size</Label>
                    <Input
                      type="number"
                      value={fontSize}
                      onChange={(e) => {
                        const size = parseInt(e.target.value);
                        setFontSize(size);
                        onUpdateSelectedObject('fontSize', size);
                      }}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Color</Label>
                    <ColorPicker
                      value={textColor}
                      onChange={(color) => {
                        setTextColor(color);
                        onUpdateSelectedObject('fill', color);
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Alignment</Label>
                    <div className="flex space-x-1 mt-1">
                      <Button
                        variant={textAlign === 'left' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setTextAlign('left');
                          onUpdateSelectedObject('textAlign', 'left');
                        }}
                      >
                        <AlignLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={textAlign === 'center' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setTextAlign('center');
                          onUpdateSelectedObject('textAlign', 'center');
                        }}
                      >
                        <AlignCenter className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={textAlign === 'right' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setTextAlign('right');
                          onUpdateSelectedObject('textAlign', 'right');
                        }}
                      >
                        <AlignRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Style</Label>
                    <div className="flex space-x-1 mt-1">
                      <Button
                        variant={isBold ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setIsBold(!isBold);
                          onUpdateSelectedObject('fontWeight', !isBold ? 'bold' : 'normal');
                        }}
                      >
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={isItalic ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setIsItalic(!isItalic);
                          onUpdateSelectedObject('fontStyle', !isItalic ? 'italic' : 'normal');
                        }}
                      >
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={isUnderline ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setIsUnderline(!isUnderline);
                          onUpdateSelectedObject('underline', !isUnderline);
                        }}
                      >
                        <Underline className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
              
              {(selectedObject.type === 'rect' || selectedObject.type === 'circle') && (
                <>
                  <div>
                    <Label className="text-sm font-medium">Fill Color</Label>
                    <ColorPicker
                      value={fillColor}
                      onChange={(color) => {
                        setFillColor(color);
                        onUpdateSelectedObject('fill', color);
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Stroke Color</Label>
                    <ColorPicker
                      value={strokeColor}
                      onChange={(color) => {
                        setStrokeColor(color);
                        onUpdateSelectedObject('stroke', color);
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Stroke Width</Label>
                    <Input
                      type="number"
                      value={strokeWidth}
                      onChange={(e) => {
                        const width = parseInt(e.target.value);
                        setStrokeWidth(width);
                        onUpdateSelectedObject('strokeWidth', width);
                      }}
                      className="mt-1"
                    />
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        )}
        
        {!selectedObject && (
          <div className="text-center text-gray-500 py-8">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select an element to edit its properties</p>
            <p className="text-xs text-gray-400 mt-1">
              Use "Edit Text" mode to modify existing PDF text
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
