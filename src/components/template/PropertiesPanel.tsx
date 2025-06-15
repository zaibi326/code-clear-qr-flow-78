
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FabricObject, Textbox } from 'fabric';
import { Template } from '@/types/template';
import { Save, Download } from 'lucide-react';

interface PropertiesPanelProps {
  selectedObject: FabricObject | null;
  onUpdateProperty: (property: string, value: any) => void;
  onSave: () => void;
  onDownload: () => void;
  onCancel: () => void;
  template: Template;
}

export const PropertiesPanel = ({
  selectedObject,
  onUpdateProperty,
  onSave,
  onDownload,
  onCancel,
  template
}: PropertiesPanelProps) => {
  const isTextObject = selectedObject instanceof Textbox || selectedObject?.type === 'textbox';
  const hasSelectedObject = !!selectedObject;

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedObject) {
      onUpdateProperty(property, value);
    }
  };

  const getObjectProperty = (property: string, defaultValue: any = '') => {
    if (!selectedObject) return defaultValue;
    return selectedObject.get(property) || defaultValue;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Properties</h3>
          <p className="text-xs text-gray-600">
            {hasSelectedObject ? 'Edit object properties' : 'Select an object to edit properties'}
          </p>
        </div>

        {hasSelectedObject ? (
          <div className="space-y-4">
            {/* Object Properties */}
            <Card className="border-gray-200">
              <CardContent className="p-3 space-y-3">
                <div>
                  <Label className="text-xs font-medium text-gray-700 mb-1 block">Object Type</Label>
                  <div className="text-xs text-gray-900 capitalize bg-gray-50 p-2 rounded">
                    {selectedObject?.type || 'Unknown'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-medium text-gray-700 mb-1 block">X Position</Label>
                    <Input
                      type="number"
                      value={Math.round(getObjectProperty('left', 0))}
                      onChange={(e) => handlePropertyChange('left', parseInt(e.target.value) || 0)}
                      className="text-xs h-6"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700 mb-1 block">Y Position</Label>
                    <Input
                      type="number"
                      value={Math.round(getObjectProperty('top', 0))}
                      onChange={(e) => handlePropertyChange('top', parseInt(e.target.value) || 0)}
                      className="text-xs h-6"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-700 mb-2 block">Opacity</Label>
                  <Slider
                    value={[getObjectProperty('opacity', 1) * 100]}
                    onValueChange={([value]) => handlePropertyChange('opacity', value / 100)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-center mt-1">
                    {Math.round(getObjectProperty('opacity', 1) * 100)}%
                  </div>
                </div>

                {selectedObject?.type !== 'image' && (
                  <div>
                    <Label className="text-xs font-medium text-gray-700 mb-2 block">Fill Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={getObjectProperty('fill', '#000000')}
                        onChange={(e) => handlePropertyChange('fill', e.target.value)}
                        className="w-8 h-6 rounded border border-gray-300"
                      />
                      <Input
                        value={getObjectProperty('fill', '#000000')}
                        onChange={(e) => handlePropertyChange('fill', e.target.value)}
                        className="text-xs h-6"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Text Properties */}
            {isTextObject && (
              <Card className="border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Text Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-700 mb-1 block">Text Content</Label>
                    <Input
                      value={getObjectProperty('text', '')}
                      onChange={(e) => handlePropertyChange('text', e.target.value)}
                      className="text-xs h-6"
                      placeholder="Enter text..."
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-gray-700 mb-2 block">Font Size</Label>
                    <Slider
                      value={[getObjectProperty('fontSize', 16)]}
                      onValueChange={([value]) => handlePropertyChange('fontSize', value)}
                      min={8}
                      max={72}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 text-center mt-1">
                      {getObjectProperty('fontSize', 16)}px
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-gray-700 mb-1 block">Font Family</Label>
                    <select
                      value={getObjectProperty('fontFamily', 'Arial')}
                      onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                      className="w-full text-xs h-6 border border-gray-300 rounded px-2"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Verdana">Verdana</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-gray-400 mb-2">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg">✋</span>
              </div>
            </div>
            <p className="text-xs text-gray-600">Select an object to edit its properties</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-3 border-t">
          <Button 
            onClick={onSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-sm py-2"
          >
            <Save className="w-3 h-3 mr-2" />
            Save Template
          </Button>
          
          <Button 
            variant="outline"
            onClick={onDownload}
            className="w-full text-sm py-2"
          >
            <Download className="w-3 h-3 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};
