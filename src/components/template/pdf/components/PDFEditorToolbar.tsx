
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  MousePointer, 
  Type, 
  Image, 
  Square,
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight,
  Save,
  Download,
  X
} from 'lucide-react';
import { Template } from '@/types/template';

interface PDFEditorToolbarProps {
  currentTemplate: Template;
  activeTool: 'select' | 'text' | 'image' | 'shape';
  onToolChange: (tool: 'select' | 'text' | 'image' | 'shape') => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSave: () => void;
  onExport: () => void;
  onCancel: () => void;
}

export const PDFEditorToolbar: React.FC<PDFEditorToolbarProps> = ({
  currentTemplate,
  activeTool,
  onToolChange,
  zoom,
  onZoomChange,
  currentPage,
  totalPages,
  onPageChange,
  onSave,
  onExport,
  onCancel
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Left section - Template info and tools */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold text-gray-900">
            {currentTemplate.name}
          </h1>
          <span className="text-sm text-gray-500">PDF Editor</span>
        </div>
        
        <div className="w-px h-6 bg-gray-300" />
        
        {/* Tools */}
        <div className="flex items-center space-x-2">
          <Button
            variant={activeTool === 'select' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToolChange('select')}
          >
            <MousePointer className="w-4 h-4 mr-1" />
            Select
          </Button>
          <Button
            variant={activeTool === 'text' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToolChange('text')}
          >
            <Type className="w-4 h-4 mr-1" />
            Text
          </Button>
          <Button
            variant={activeTool === 'image' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToolChange('image')}
          >
            <Image className="w-4 h-4 mr-1" />
            Image
          </Button>
          <Button
            variant={activeTool === 'shape' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToolChange('shape')}
          >
            <Square className="w-4 h-4 mr-1" />
            Shape
          </Button>
        </div>
      </div>

      {/* Center section - Page navigation and zoom */}
      <div className="flex items-center space-x-4">
        {/* Page Navigation */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onZoomChange(Math.max(0.25, zoom - 0.25))}
            disabled={zoom <= 0.25}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onZoomChange(Math.min(3, zoom + 0.25))}
            disabled={zoom >= 3}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onSave}>
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
        <Button onClick={onExport}>
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" />
          Close
        </Button>
      </div>
    </div>
  );
};
