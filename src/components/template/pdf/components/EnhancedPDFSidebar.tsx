
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Download, 
  Upload,
  Type,
  Image as ImageIcon,
  Square,
  Circle as CircleIcon,
  Triangle,
  Star,
  ArrowRight,
  Highlighter,
  MousePointer,
  Edit3,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  QrCode,
  Layers
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
  selectedLayerId: string | null;
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
  const [activeSection, setActiveSection] = useState<'tools' | 'layers'>('tools');

  const tools = [
    { id: 'select', label: 'Select', icon: MousePointer },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'image', label: 'Image', icon: ImageIcon },
    { id: 'qr', label: 'QR Code', icon: QrCode },
    { id: 'rectangle', label: 'Rectangle', icon: Square },
    { id: 'circle', label: 'Circle', icon: CircleIcon },
    { id: 'triangle', label: 'Triangle', icon: Triangle },
    { id: 'star', label: 'Star', icon: Star },
    { id: 'arrow', label: 'Arrow', icon: ArrowRight },
    { id: 'highlight', label: 'Highlight', icon: Highlighter }
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Canva PDF Editor</h2>
        </div>
        <p className="text-sm text-gray-600">
          Professional PDF editing with word-level precision
        </p>
      </div>

      {/* File Status */}
      {selectedFile && (
        <div className="p-4 bg-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-blue-800">
              {selectedFile.name.length > 25 
                ? selectedFile.name.substring(0, 25) + '...' 
                : selectedFile.name}
            </span>
            <span className="text-blue-600">{pdfPagesLength} pages</span>
          </div>
          <div className="mt-1 text-xs text-blue-600">
            {totalEditedBlocks} elements edited
          </div>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveSection('tools')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeSection === 'tools'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Tools & Elements
        </button>
        <button
          onClick={() => setActiveSection('layers')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeSection === 'layers'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Layers className="w-4 h-4 inline mr-1" />
          Layers ({layers.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === 'tools' ? (
          <div className="p-4 space-y-6">
            {/* File Upload */}
            {!selectedFile && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Upload PDF</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={onFileUpload}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('pdf-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose PDF File
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Upload a PDF to start editing with Canva-style tools
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Tools Grid */}
            {selectedFile && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Design Tools</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    {tools.map((tool) => {
                      const IconComponent = tool.icon;
                      return (
                        <Button
                          key={tool.id}
                          variant={selectedTool === tool.id ? 'default' : 'outline'}
                          size="sm"
                          className={`flex flex-col items-center justify-center h-16 p-2 text-xs ${
                            selectedTool === tool.id 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => onToolSelect(tool.id)}
                        >
                          <IconComponent className="w-5 h-5 mb-1" />
                          <span>{tool.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                  
                  {selectedTool !== 'select' && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-md">
                      <p className="text-xs text-blue-700">
                        {selectedTool === 'qr' 
                          ? 'Click anywhere on the canvas to add a QR code'
                          : selectedTool === 'image'
                          ? 'Click anywhere on the canvas to upload an image'
                          : `Click anywhere on the canvas to add a ${selectedTool}`
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            {selectedFile && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={onExportPDF}
                    disabled={!pdfDocument}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="p-4">
            {/* Layers Panel */}
            <div className="space-y-2">
              {layers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No layers yet</p>
                  <p className="text-xs">Add text, images, or shapes to create layers</p>
                </div>
              ) : (
                layers.map((layer) => (
                  <div
                    key={layer.id}
                    className={`flex items-center space-x-2 p-2 rounded-md border transition-colors cursor-pointer ${
                      selectedLayerId === layer.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => onLayerSelect(layer.id)}
                  >
                    <div className="flex items-center space-x-1">
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
                      >
                        {layer.locked ? (
                          <Lock className="w-3 h-3" />
                        ) : (
                          <Unlock className="w-3 h-3 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {layer.type === 'text' && <Type className="w-3 h-3 text-gray-500 flex-shrink-0" />}
                        {layer.type === 'image' && <ImageIcon className="w-3 h-3 text-gray-500 flex-shrink-0" />}
                        {layer.type === 'shape' && <Square className="w-3 h-3 text-gray-500 flex-shrink-0" />}
                        {layer.type === 'qr' && <QrCode className="w-3 h-3 text-gray-500 flex-shrink-0" />}
                        <span className="text-sm font-medium truncate">
                          {layer.name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Page {layer.pageNumber}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
