
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Type, 
  Square, 
  Circle, 
  Triangle,
  Star,
  Image as ImageIcon,
  QrCode,
  MousePointer,
  Hand,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Save,
  Download
} from 'lucide-react';

interface CanvaLikeToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
}

export const CanvaLikeToolbar: React.FC<CanvaLikeToolbarProps> = ({
  selectedTool,
  onToolSelect,
  onZoomIn,
  onZoomOut,
  onUndo,
  onRedo,
  onSave,
  onExport,
  canUndo,
  canRedo,
  zoom
}) => {
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'pan', icon: Hand, label: 'Pan' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'triangle', icon: Triangle, label: 'Triangle' },
    { id: 'star', icon: Star, label: 'Star' },
    { id: 'image', icon: ImageIcon, label: 'Image' },
    { id: 'qrcode', icon: QrCode, label: 'QR Code' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between shadow-sm">
      {/* Left side - Tools */}
      <div className="flex items-center space-x-2">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            size="sm"
            variant={selectedTool === tool.id ? 'default' : 'outline'}
            onClick={() => onToolSelect(tool.id)}
            className="h-10 w-10 p-0"
            title={tool.label}
          >
            <tool.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Center - History Controls */}
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-10 px-3"
        >
          <Undo className="h-4 w-4 mr-1" />
          Undo
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-10 px-3"
        >
          <Redo className="h-4 w-4 mr-1" />
          Redo
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Zoom Controls */}
        <Button
          size="sm"
          variant="outline"
          onClick={onZoomOut}
          className="h-10 w-10 p-0"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={onZoomIn}
          className="h-10 w-10 p-0"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onSave}
          className="h-10 px-4"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
        <Button
          size="sm"
          onClick={onExport}
          className="h-10 px-4 bg-blue-600 hover:bg-blue-700"
        >
          <Download className="h-4 w-4 mr-1" />
          Export PDF
        </Button>
      </div>
    </div>
  );
};
