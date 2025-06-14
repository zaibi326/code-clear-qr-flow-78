
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FabricObject, Textbox } from 'fabric';
import { Template } from '@/types/template';
import { Save, Download, X, Settings, Type, Move, Palette } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'properties' | 'template'>('properties');

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
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-4 space-y-6">
        {/* Tab Selector */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'properties'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('properties')}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Properties
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'template'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('template')}
          >
            <Save className="w-4 h-4 inline mr-2" />
            Template
          </button>
        </div>

        {activeTab === 'properties' && (
          <div className="space-y-6">
            {hasSelectedObject ? (
              <>
                {/* Object Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Type className="w-4 h-4 mr-2" />
                      Object Properties
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-600 mb-2 block">Object Type</Label>
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {selectedObject?.type || 'Unknown'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Position & Size */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Move className="w-4 h-4 mr-2" />
                      Position & Size
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-600 mb-2 block">X Position</Label>
                        <Input
                          type="number"
                          value={Math.round(getObjectProperty('left', 0))}
                          onChange={(e) => handlePropertyChange('left', parseInt(e.target.value) || 0)}
                          className="text-sm h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-2 block">Y Position</Label>
                        <Input
                          type="number"
                          value={Math.round(getObjectProperty('top', 0))}
                          onChange={(e) => handlePropertyChange('top', parseInt(e.target.value) || 0)}
                          className="text-sm h-8"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-600 mb-2 block">Width</Label>
                        <Input
                          type="number"
                          value={Math.round(getObjectProperty('width', 0) * (getObjectProperty('scaleX', 1)))}
                          onChange={(e) => {
                            const newWidth = parseInt(e.target.value) || 0;
                            const currentWidth = getObjectProperty('width', 1);
                            const scaleX = newWidth / currentWidth;
                            handlePropertyChange('scaleX', scaleX);
                          }}
                          className="text-sm h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-2 block">Height</Label>
                        <Input
                          type="number"
                          value={Math.round(getObjectProperty('height', 0) * (getObjectProperty('scaleY', 1)))}
                          onChange={(e) => {
                            const newHeight = parseInt(e.target.value) || 0;
                            const currentHeight = getObjectProperty('height', 1);
                            const scaleY = newHeight / currentHeight;
                            handlePropertyChange('scaleY', scaleY);
                          }}
                          className="text-sm h-8"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600 mb-2 block">Rotation (degrees)</Label>
                      <Slider
                        value={[getObjectProperty('angle', 0)]}
                        onValueChange={([value]) => handlePropertyChange('angle', value)}
                        min={-180}
                        max={180}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500 text-center mt-1">
                        {Math.round(getObjectProperty('angle', 0))}°
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Appearance */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Palette className="w-4 h-4 mr-2" />
                      Appearance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-600 mb-2 block">Opacity</Label>
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
                        <Label className="text-xs text-gray-600 mb-2 block">Fill Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={getObjectProperty('fill', '#000000')}
                            onChange={(e) => handlePropertyChange('fill', e.target.value)}
                            className="w-12 h-8 rounded border border-gray-300"
                          />
                          <Input
                            value={getObjectProperty('fill', '#000000')}
                            onChange={(e) => handlePropertyChange('fill', e.target.value)}
                            className="text-sm h-8"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    )}

                    {selectedObject?.stroke && (
                      <div>
                        <Label className="text-xs text-gray-600 mb-2 block">Stroke Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={getObjectProperty('stroke', '#000000')}
                            onChange={(e) => handlePropertyChange('stroke', e.target.value)}
                            className="w-12 h-8 rounded border border-gray-300"
                          />
                          <Input
                            value={getObjectProperty('stroke', '#000000')}
                            onChange={(e) => handlePropertyChange('stroke', e.target.value)}
                            className="text-sm h-8"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Text Properties */}
                {isTextObject && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Text Properties</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-xs text-gray-600 mb-2 block">Text Content</Label>
                        <Input
                          value={getObjectProperty('text', '')}
                          onChange={(e) => handlePropertyChange('text', e.target.value)}
                          className="text-sm h-8"
                          placeholder="Enter text..."
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-600 mb-2 block">Font Size</Label>
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
                        <Label className="text-xs text-gray-600 mb-2 block">Font Family</Label>
                        <select
                          value={getObjectProperty('fontFamily', 'Arial')}
                          onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                          className="w-full text-sm h-8 border border-gray-300 rounded px-2"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Verdana">Verdana</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={getObjectProperty('fontWeight', 'normal') === 'bold'}
                            onChange={(e) => handlePropertyChange('fontWeight', e.target.checked ? 'bold' : 'normal')}
                            className="rounded"
                          />
                          <span className="text-xs text-gray-600">Bold</span>
                        </label>
                        
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={getObjectProperty('fontStyle', 'normal') === 'italic'}
                            onChange={(e) => handlePropertyChange('fontStyle', e.target.checked ? 'italic' : 'normal')}
                            className="rounded"
                          />
                          <span className="text-xs text-gray-600">Italic</span>
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Settings className="w-8 h-8 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600">Select an object to edit its properties</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'template' && (
          <div className="space-y-6">
            {/* Template Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Template Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={onSave}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={onDownload}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close Editor
                </Button>
              </CardContent>
            </Card>

            {/* Template Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Template Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-600 mb-2 block">Template Name</Label>
                  <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded">
                    {template.name}
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs text-gray-600 mb-2 block">Canvas Size</Label>
                  <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded">
                    800 × 600 pixels
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs text-gray-600 mb-2 block">Last Modified</Label>
                  <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded">
                    {template.updatedAt.toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
