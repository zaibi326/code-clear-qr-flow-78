
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Download } from 'lucide-react';
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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedObject ? (
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Width</Label>
                <Input
                  type="number"
                  value={Math.round(selectedObject.width || 0)}
                  onChange={(e) => onUpdateProperty('width', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-xs">Height</Label>
                <Input
                  type="number"
                  value={Math.round(selectedObject.height || 0)}
                  onChange={(e) => onUpdateProperty('height', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              
              {selectedObject.type === 'textbox' && (
                <>
                  <div>
                    <Label className="text-xs">Font Size</Label>
                    <Input
                      type="number"
                      value={(selectedObject as any).fontSize || 20}
                      onChange={(e) => onUpdateProperty('fontSize', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Color</Label>
                    <input
                      type="color"
                      value={selectedObject.fill as string || '#000000'}
                      onChange={(e) => onUpdateProperty('fill', e.target.value)}
                      className="mt-1 w-full h-8 rounded border"
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-sm">
              Select an object to edit properties
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <Button onClick={onSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
          
          <Button onClick={onDownload} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          
          <Button onClick={onCancel} variant="outline" className="w-full">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
