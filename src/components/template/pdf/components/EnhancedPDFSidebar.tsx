
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Type, 
  Square, 
  Circle, 
  Triangle,
  Star,
  Image as ImageIcon,
  QrCode,
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  type: 'text' | 'shape' | 'image' | 'qr';
  visible: boolean;
  locked: boolean;
  pageNumber: number;
}

interface EnhancedPDFSidebarProps {
  selectedFile: File | null;
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  totalEditedBlocks: number;
  pdfPagesLength: number;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportPDF: () => void;
  pdfDocument: any;
  layers: Layer[];
  onLayerToggleVisibility: (layerId: string) => void;
  onLayerToggleLock: (layerId: string) => void;
  onLayerSelect: (layerId: string) => void;
  selectedLayerId?: string;
}

export const EnhancedPDFSidebar: React.FC<EnhancedPDFSidebarProps> = ({
  selectedFile,
  selectedTool,
  onToolSelect,
  totalEditedBlocks,
  pdfPagesLength,
  onFileUpload,
  onExportPDF,
  pdfDocument,
  layers,
  onLayerToggleVisibility,
  onLayerToggleLock,
  onLayerSelect,
  selectedLayerId
}) => {
  const tools = [
    { id: 'text', icon: Type, label: 'Add Text', color: 'bg-blue-500' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', color: 'bg-green-500' },
    { id: 'circle', icon: Circle, label: 'Circle', color: 'bg-purple-500' },
    { id: 'triangle', icon: Triangle, label: 'Triangle', color: 'bg-orange-500' },
    { id: 'star', icon: Star, label: 'Star', color: 'bg-yellow-500' },
    { id: 'image', icon: ImageIcon, label: 'Upload Image', color: 'bg-pink-500' },
    { id: 'qrcode', icon: QrCode, label: 'QR Code', color: 'bg-indigo-500' },
  ];

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'shape': return <Square className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'qr': return <QrCode className="w-4 h-4" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <FileText className="w-5 h-5" />
          Canva-Style PDF Editor
        </CardTitle>
        <p className="text-sm text-blue-700">
          Professional PDF editing with advanced tools
        </p>
      </CardHeader>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* File Upload */}
        <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <Label className="text-sm font-medium mb-2 block text-blue-900">Upload PDF Document</Label>
            <input
              type="file"
              accept=".pdf"
              onChange={onFileUpload}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
            {selectedFile && (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {selectedFile.name} loaded successfully
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tools */}
        {pdfPagesLength > 0 && (
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-medium mb-3 block">Design Tools</Label>
              <div className="grid grid-cols-2 gap-2">
                {tools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onToolSelect(tool.id)}
                    className="flex flex-col items-center justify-center h-16 p-2"
                  >
                    <div className={`w-8 h-8 rounded-full ${tool.color} flex items-center justify-center mb-1`}>
                      <tool.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs">{tool.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Layers Panel */}
        {layers.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Layers
                </Label>
                <Badge variant="secondary" className="text-xs">
                  {layers.length}
                </Badge>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className={`flex items-center justify-between p-2 rounded border cursor-pointer hover:bg-gray-50 ${
                      selectedLayerId === layer.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => onLayerSelect(layer.id)}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      {getLayerIcon(layer.type)}
                      <span className="text-xs font-medium truncate">{layer.name}</span>
                      <Badge variant="outline" className="text-xs">
                        P{layer.pageNumber}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLayerToggleVisibility(layer.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        {layer.visible ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLayerToggleLock(layer.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        {layer.locked ? (
                          <Lock className="w-3 h-3 text-gray-400" />
                        ) : (
                          <Unlock className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <h3 className="font-medium text-emerald-900 mb-2 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Enhanced Features:
            </h3>
            <ul className="text-xs text-emerald-800 space-y-1">
              <li>• <strong>Advanced Text:</strong> Underline, alignment, opacity</li>
              <li>• <strong>Shapes:</strong> Rectangles, circles, triangles, stars</li>
              <li>• <strong>Layers:</strong> Full layer management system</li>
              <li>• <strong>Styling:</strong> Colors, borders, shadows, rotation</li>
              <li>• <strong>Professional:</strong> Export to high-quality PDF</li>
            </ul>
          </CardContent>
        </Card>

        {/* Stats */}
        {totalEditedBlocks > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <h3 className="font-medium text-orange-900 mb-2">Edit Summary</h3>
              <div className="space-y-1 text-sm text-orange-800">
                <p>{totalEditedBlocks} elements modified</p>
                <p>{layers.length} layers total</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
