
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  ArrowUp, 
  ArrowDown, 
  Trash2,
  QrCode,
  Type,
  Square,
  Image as ImageIcon
} from 'lucide-react';

interface CanvasLayer {
  id: string;
  name: string;
  type: 'qr' | 'text' | 'shape' | 'image';
  visible: boolean;
  locked: boolean;
  zIndex: number;
}

interface CanvasLayerManagerProps {
  layers: CanvasLayer[];
  selectedLayerId?: string;
  onLayerSelect: (layerId: string) => void;
  onLayerToggleVisibility: (layerId: string) => void;
  onLayerToggleLock: (layerId: string) => void;
  onLayerMoveUp: (layerId: string) => void;
  onLayerMoveDown: (layerId: string) => void;
  onLayerDelete: (layerId: string) => void;
}

export const CanvasLayerManager = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  onLayerToggleVisibility,
  onLayerToggleLock,
  onLayerMoveUp,
  onLayerMoveDown,
  onLayerDelete
}: CanvasLayerManagerProps) => {
  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'qr':
        return <QrCode className="h-4 w-4" />;
      case 'text':
        return <Type className="h-4 w-4" />;
      case 'shape':
        return <Square className="h-4 w-4" />;
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      default:
        return <Square className="h-4 w-4" />;
    }
  };

  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Layers
          <Badge variant="secondary">{layers.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedLayers.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-4">
            No layers yet. Add elements to the canvas.
          </div>
        ) : (
          sortedLayers.map((layer) => (
            <div
              key={layer.id}
              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                selectedLayerId === layer.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onLayerSelect(layer.id)}
            >
              {/* Layer Icon & Name */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="text-gray-600">
                  {getLayerIcon(layer.type)}
                </div>
                <span className="text-sm font-medium truncate">
                  {layer.name}
                </span>
                <Badge variant="outline" className="text-xs">
                  {layer.type}
                </Badge>
              </div>

              {/* Layer Controls */}
              <div className="flex items-center gap-1">
                {/* Visibility Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerToggleVisibility(layer.id);
                  }}
                >
                  {layer.visible ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3 text-gray-400" />
                  )}
                </Button>

                {/* Lock Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerToggleLock(layer.id);
                  }}
                >
                  {layer.locked ? (
                    <Lock className="h-3 w-3 text-red-500" />
                  ) : (
                    <Unlock className="h-3 w-3" />
                  )}
                </Button>

                {/* Move Up */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerMoveUp(layer.id);
                  }}
                  disabled={layer.zIndex === Math.max(...layers.map(l => l.zIndex))}
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>

                {/* Move Down */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerMoveDown(layer.id);
                  }}
                  disabled={layer.zIndex === Math.min(...layers.map(l => l.zIndex))}
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerDelete(layer.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
