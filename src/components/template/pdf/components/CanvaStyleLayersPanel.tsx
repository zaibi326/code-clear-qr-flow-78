
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Type, 
  Square, 
  Image as ImageIcon,
  QrCode,
  Trash2,
  Copy,
  MoveUp,
  MoveDown
} from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  type: 'text' | 'shape' | 'image' | 'qr';
  visible: boolean;
  locked: boolean;
  pageNumber: number;
  zIndex: number;
}

interface CanvaStyleLayersPanelProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerToggleVisibility: (layerId: string) => void;
  onLayerToggleLock: (layerId: string) => void;
  onLayerDelete: (layerId: string) => void;
  onLayerDuplicate: (layerId: string) => void;
  onLayerMove: (layerId: string, direction: 'up' | 'down') => void;
}

export const CanvaStyleLayersPanel: React.FC<CanvaStyleLayersPanelProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  onLayerToggleVisibility,
  onLayerToggleLock,
  onLayerDelete,
  onLayerDuplicate,
  onLayerMove
}) => {
  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="w-4 h-4 text-blue-500" />;
      case 'shape': return <Square className="w-4 h-4 text-green-500" />;
      case 'image': return <ImageIcon className="w-4 h-4 text-purple-500" />;
      case 'qr': return <QrCode className="w-4 h-4 text-orange-500" />;
      default: return <Square className="w-4 h-4 text-gray-500" />;
    }
  };

  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          Layers ({layers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sortedLayers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Square className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No layers yet</p>
              <p className="text-xs">Add elements to create layers</p>
            </div>
          ) : (
            sortedLayers.map((layer) => (
              <div
                key={layer.id}
                className={`flex items-center space-x-2 p-2 rounded-md border transition-colors cursor-pointer ${
                  selectedLayerId === layer.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => onLayerSelect(layer.id)}
              >
                {/* Layer icon and name */}
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {getLayerIcon(layer.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {layer.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Page {layer.pageNumber}
                    </div>
                  </div>
                </div>

                {/* Layer controls */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerToggleVisibility(layer.id);
                    }}
                    title={layer.visible ? 'Hide layer' : 'Show layer'}
                  >
                    {layer.visible ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-gray-400" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerToggleLock(layer.id);
                    }}
                    title={layer.locked ? 'Unlock layer' : 'Lock layer'}
                  >
                    {layer.locked ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Unlock className="w-3 h-3 text-gray-400" />
                    )}
                  </Button>

                  {selectedLayerId === layer.id && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLayerMove(layer.id, 'up');
                        }}
                        title="Bring forward"
                      >
                        <MoveUp className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLayerMove(layer.id, 'down');
                        }}
                        title="Send backward"
                      >
                        <MoveDown className="w-3 h-3" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLayerDuplicate(layer.id);
                        }}
                        title="Duplicate layer"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLayerDelete(layer.id);
                        }}
                        title="Delete layer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
