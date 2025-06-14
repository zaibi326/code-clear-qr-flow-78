
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Download, X } from 'lucide-react';
import { FabricObject } from 'fabric';

interface PropertiesPanelProps {
  selectedObject: FabricObject | null;
  onUpdateProperty: (property: string, value: any) => void;
  onSave: () => void;
  onDownload: () => void;
  onCancel: () => void;
}

export const PropertiesPanel = ({
  selectedObject,
  onUpdateProperty,
  onSave,
  onDownload,
  onCancel
}: PropertiesPanelProps) => {
  return (
    <div className="space-y-6">
      {/* Properties Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedObject ? (
            <div className="space-y-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Selected: {selectedObject.type || 'Object'}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-600">Width</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedObject.width || 0)}
                    onChange={(e) => onUpdateProperty('width', parseInt(e.target.value))}
                    className="mt-1 text-sm"
                  />
                </div>
                
                <div>
                  <Label className="text-xs text-gray-600">Height</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedObject.height || 0)}
                    onChange={(e) => onUpdateProperty('height', parseInt(e.target.value))}
                    className="mt-1 text-sm"
                  />
                </div>
              </div>
              
              {selectedObject.type === 'textbox' && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600">Font Size</Label>
                    <Input
                      type="number"
                      value={(selectedObject as any).fontSize || 20}
                      onChange={(e) => onUpdateProperty('fontSize', parseInt(e.target.value))}
                      className="mt-1 text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-600">Text Color</Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <input
                        type="color"
                        value={selectedObject.fill as string || '#000000'}
                        onChange={(e) => onUpdateProperty('fill', e.target.value)}
                        className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={selectedObject.fill as string || '#000000'}
                        onChange={(e) => onUpdateProperty('fill', e.target.value)}
                        className="flex-1 text-xs"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {(selectedObject.type === 'rect' || selectedObject.type === 'circle') && (
                <div>
                  <Label className="text-xs text-gray-600">Fill Color</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      type="color"
                      value={selectedObject.fill as string || '#000000'}
                      onChange={(e) => onUpdateProperty('fill', e.target.value)}
                      className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={selectedObject.fill as string || '#000000'}
                      onChange={(e) => onUpdateProperty('fill', e.target.value)}
                      className="flex-1 text-xs"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.121 2.122" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">Select an object to edit properties</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions Card */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <Button onClick={onSave} className="w-full bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
          
          <Button onClick={onDownload} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          
          <Button onClick={onCancel} variant="outline" className="w-full">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
