import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  MousePointer,
  Type,
  Square,
  Circle,
  Image,
  Highlighter,
  Edit3,
  MessageSquare,
  Search,
  Replace,
  Layers,
  Settings,
  FileImage,
  Droplets
} from 'lucide-react';
import { Template } from '@/types/template';

interface CanvaToolbarProps {
  currentTemplate: Template;
  tool: string;
  onToolChange: (tool: string) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  replaceTerm: string;
  onReplaceChange: (term: string) => void;
  onSearchAndReplace: () => void;
  onAddWatermark: (text: string, options?: any) => void;
  onSave: () => void;
  onExport: () => void;
  onCancel: () => void;
  showPropertiesPanel: boolean;
  onToggleProperties: () => void;
  showThumbnails: boolean;
  onToggleThumbnails: () => void;
}

export const CanvaToolbar: React.FC<CanvaToolbarProps> = ({
  currentTemplate,
  tool,
  onToolChange,
  zoom,
  onZoomChange,
  searchTerm,
  onSearchChange,
  replaceTerm,
  onReplaceChange,
  onSearchAndReplace,
  onAddWatermark,
  onSave,
  onExport,
  onCancel,
  showPropertiesPanel,
  onToggleProperties,
  showThumbnails,
  onToggleThumbnails
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [watermarkText, setWatermarkText] = useState('');

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select', shortcut: 'V' },
    { id: 'text', icon: Type, label: 'Text', shortcut: 'T' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', shortcut: 'R' },
    { id: 'circle', icon: Circle, label: 'Circle', shortcut: 'C' },
    { id: 'image', icon: Image, label: 'Image', shortcut: 'I' },
    { id: 'highlight', icon: Highlighter, label: 'Highlight', shortcut: 'H' },
    { id: 'draw', icon: Edit3, label: 'Draw', shortcut: 'D' },
    { id: 'comment', icon: MessageSquare, label: 'Comment', shortcut: 'M' }
  ];

  const handleZoomIn = () => onZoomChange(Math.min(zoom + 0.25, 5));
  const handleZoomOut = () => onZoomChange(Math.max(zoom - 0.25, 0.1));

  const handleWatermark = () => {
    if (watermarkText.trim()) {
      onAddWatermark(watermarkText, {
        opacity: 0.3,
        rotation: -45,
        fontSize: 32,
        color: '#666666'
      });
      setWatermarkText('');
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/60 flex-shrink-0">
      {/* Main Toolbar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Back & File Info */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileImage className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h2 className="font-medium text-gray-900 text-sm truncate max-w-40">
                {currentTemplate.name}
              </h2>
              <p className="text-xs text-gray-600">PDF Editor</p>
            </div>
          </div>
        </div>

        {/* Center Section - Tools */}
        <div className="flex items-center gap-2">
          {tools.map((toolItem) => (
            <Button
              key={toolItem.id}
              variant={tool === toolItem.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolChange(toolItem.id)}
              className="flex items-center gap-1 h-10 px-3"
              title={`${toolItem.label} (${toolItem.shortcut})`}
            >
              <toolItem.icon className="w-4 h-4" />
              <span className="hidden md:inline text-xs">{toolItem.label}</span>
            </Button>
          ))}
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Badge variant="outline" className="px-2 py-1 min-w-16 text-center">
              {Math.round(zoom * 100)}%
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className={showSearch ? "bg-blue-100 text-blue-700" : ""}
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline ml-1">Search</span>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onToggleThumbnails}>
            <Layers className="w-4 h-4" />
            <span className="hidden md:inline ml-1">Pages</span>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onToggleProperties}>
            <Settings className="w-4 h-4" />
            <span className="hidden md:inline ml-1">Properties</span>
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button variant="outline" size="sm" onClick={onSave}>
            <Save className="w-4 h-4" />
            <span className="hidden md:inline ml-1">Save</span>
          </Button>
          
          <Button variant="default" size="sm" onClick={onExport}>
            <Download className="w-4 h-4" />
            <span className="hidden md:inline ml-1">Export</span>
          </Button>
        </div>
      </div>

      {/* Extended Toolbar - Search & Watermark */}
      {showSearch && (
        <div className="border-t border-gray-200/60 px-4 py-3 bg-gray-50/50">
          <div className="flex items-center gap-4 max-w-4xl">
            {/* Search & Replace */}
            <div className="flex items-center gap-2">
              <Label htmlFor="search" className="text-xs whitespace-nowrap">Find:</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search text..."
                className="h-8 w-40"
              />
              <Label htmlFor="replace" className="text-xs whitespace-nowrap">Replace:</Label>
              <Input
                id="replace"
                value={replaceTerm}
                onChange={(e) => onReplaceChange(e.target.value)}
                placeholder="Replace with..."
                className="h-8 w-40"
              />
              <Button
                size="sm"
                onClick={onSearchAndReplace}
                disabled={!searchTerm.trim()}
                className="h-8"
              >
                <Replace className="w-3 h-3 mr-1" />
                Replace All
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Watermark */}
            <div className="flex items-center gap-2">
              <Label htmlFor="watermark" className="text-xs whitespace-nowrap">Watermark:</Label>
              <Input
                id="watermark"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Watermark text..."
                className="h-8 w-40"
              />
              <Button
                size="sm"
                onClick={handleWatermark}
                disabled={!watermarkText.trim()}
                className="h-8"
              >
                <Droplets className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};