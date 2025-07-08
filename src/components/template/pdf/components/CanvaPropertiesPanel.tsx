import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CanvaElement } from '../FullCanvaPDFEditor';
import { 
  Type, 
  Image, 
  Square, 
  MessageSquare, 
  Trash2, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  RotateCw,
  Move
} from 'lucide-react';

interface CanvaPropertiesPanelProps {
  selectedElements: CanvaElement[];
  onUpdateElement: (id: string, updates: Partial<CanvaElement>) => void;
  onDeleteElement: (id: string) => void;
}

export const CanvaPropertiesPanel: React.FC<CanvaPropertiesPanelProps> = ({
  selectedElements,
  onUpdateElement,
  onDeleteElement
}) => {
  if (selectedElements.length === 0) {
    return (
      <div className="h-full p-4 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Move className="w-8 h-8 text-gray-400" />
          </div>
          <p className="font-medium">No Element Selected</p>
          <p className="text-sm mt-1">Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const element = selectedElements[0]; // For now, handle single selection
  const isMultiSelect = selectedElements.length > 1;

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text': return Type;
      case 'image': return Image;
      case 'shape': return Square;
      case 'comment': return MessageSquare;
      default: return Square;
    }
  };

  const updateElement = (updates: Partial<CanvaElement>) => {
    selectedElements.forEach(el => {
      onUpdateElement(el.id, updates);
    });
  };

  const ElementIcon = getElementIcon(element.type);

  return (
    <div className="h-full overflow-y-auto bg-white/90 backdrop-blur-sm">
      <div className="p-4 space-y-4">
        {/* Element Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <ElementIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 capitalize">
                {isMultiSelect ? `${selectedElements.length} Elements` : element.type}
              </h3>
              <p className="text-xs text-gray-500">
                {isMultiSelect ? 'Multiple selection' : `Page ${element.pageNumber}`}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateElement({ visible: !element.visible })}
              title={element.visible ? 'Hide' : 'Show'}
            >
              {element.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateElement({ locked: !element.locked })}
              title={element.locked ? 'Unlock' : 'Lock'}
            >
              {element.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteElement(element.id)}
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Position & Size */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Position & Size</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="x-pos" className="text-xs">X Position</Label>
                <Input
                  id="x-pos"
                  type="number"
                  value={Math.round(element.x)}
                  onChange={(e) => updateElement({ x: parseInt(e.target.value) || 0 })}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="y-pos" className="text-xs">Y Position</Label>
                <Input
                  id="y-pos"
                  type="number"
                  value={Math.round(element.y)}
                  onChange={(e) => updateElement({ y: parseInt(e.target.value) || 0 })}
                  className="h-8"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="width" className="text-xs">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={Math.round(element.width)}
                  onChange={(e) => updateElement({ width: parseInt(e.target.value) || 1 })}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-xs">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={Math.round(element.height)}
                  onChange={(e) => updateElement({ height: parseInt(e.target.value) || 1 })}
                  className="h-8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Opacity */}
            <div>
              <Label className="text-xs">Opacity</Label>
              <div className="flex items-center gap-3 mt-1">
                <Slider
                  value={[element.opacity * 100]}
                  onValueChange={([value]) => updateElement({ opacity: value / 100 })}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-gray-500 w-10 text-right">
                  {Math.round(element.opacity * 100)}%
                </span>
              </div>
            </div>

            {/* Rotation */}
            <div>
              <Label className="text-xs">Rotation</Label>
              <div className="flex items-center gap-2 mt-1">
                <Slider
                  value={[element.rotation]}
                  onValueChange={([value]) => updateElement({ rotation: value })}
                  min={-180}
                  max={180}
                  step={1}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateElement({ rotation: element.rotation + 90 })}
                >
                  <RotateCw className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">{element.rotation}°</p>
            </div>
          </CardContent>
        </Card>

        {/* Type-specific Properties */}
        {element.type === 'text' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Text Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="text-content" className="text-xs">Text Content</Label>
                <Textarea
                  id="text-content"
                  value={element.text || ''}
                  onChange={(e) => updateElement({ text: e.target.value })}
                  className="min-h-20 resize-none"
                  placeholder="Enter text..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="font-size" className="text-xs">Font Size</Label>
                  <Input
                    id="font-size"
                    type="number"
                    value={element.fontSize || 16}
                    onChange={(e) => updateElement({ fontSize: parseInt(e.target.value) || 16 })}
                    className="h-8"
                    min="8"
                    max="72"
                  />
                </div>
                <div>
                  <Label htmlFor="text-color" className="text-xs">Color</Label>
                  <Input
                    id="text-color"
                    type="color"
                    value={element.color || '#000000'}
                    onChange={(e) => updateElement({ color: e.target.value })}
                    className="h-8"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="font-family" className="text-xs">Font Family</Label>
                <Select
                  value={element.fontFamily || 'Arial'}
                  onValueChange={(value) => updateElement({ fontFamily: value })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Verdana">Verdana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="bold"
                    checked={element.fontWeight === 'bold'}
                    onCheckedChange={(checked) => 
                      updateElement({ fontWeight: checked ? 'bold' : 'normal' })
                    }
                  />
                  <Label htmlFor="bold" className="text-xs">Bold</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="italic"
                    checked={element.fontStyle === 'italic'}
                    onCheckedChange={(checked) => 
                      updateElement({ fontStyle: checked ? 'italic' : 'normal' })
                    }
                  />
                  <Label htmlFor="italic" className="text-xs">Italic</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {element.type === 'shape' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Shape Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="fill-color" className="text-xs">Fill Color</Label>
                  <Input
                    id="fill-color"
                    type="color"
                    value={element.fill || '#3B82F6'}
                    onChange={(e) => updateElement({ fill: e.target.value })}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="stroke-color" className="text-xs">Stroke Color</Label>
                  <Input
                    id="stroke-color"
                    type="color"
                    value={element.stroke || '#1E40AF'}
                    onChange={(e) => updateElement({ stroke: e.target.value })}
                    className="h-8"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="stroke-width" className="text-xs">Stroke Width</Label>
                <Input
                  id="stroke-width"
                  type="number"
                  value={element.strokeWidth || 2}
                  onChange={(e) => updateElement({ strokeWidth: parseInt(e.target.value) || 1 })}
                  className="h-8"
                  min="0"
                  max="20"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {element.type === 'comment' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Comment Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="comment-text" className="text-xs">Comment Text</Label>
                <Textarea
                  id="comment-text"
                  value={element.commentText || ''}
                  onChange={(e) => updateElement({ commentText: e.target.value })}
                  className="min-h-20 resize-none"
                  placeholder="Enter comment..."
                />
              </div>
              
              <div>
                <Label htmlFor="comment-color" className="text-xs">Color</Label>
                <Input
                  id="comment-color"
                  type="color"
                  value={element.fill || '#F59E0B'}
                  onChange={(e) => updateElement({ fill: e.target.value })}
                  className="h-8"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Layer Controls */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Layer Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateElement({ zIndex: element.zIndex + 1 })}
              >
                Bring Forward
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateElement({ zIndex: Math.max(0, element.zIndex - 1) })}
              >
                Send Backward
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};