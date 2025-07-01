
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Save, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  FileText
} from 'lucide-react';

interface PDFToolbarProps {
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onExportImage: () => void;
  onExportPDF: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const PDFToolbar: React.FC<PDFToolbarProps> = ({
  zoom,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onExportImage,
  onExportPDF,
  onSave,
  onCancel
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo}>
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onRedo} disabled={!canRedo}>
          <Redo className="w-4 h-4" />
        </Button>
        <div className="h-4 w-px bg-gray-300" />
        <Button variant="outline" size="sm" onClick={onZoomOut}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
        <Button variant="outline" size="sm" onClick={onZoomIn}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onResetZoom}>
          Reset
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onExportImage}>
          <Download className="w-4 h-4 mr-1" />
          Export PNG
        </Button>
        <Button variant="outline" onClick={onExportPDF}>
          <FileText className="w-4 h-4 mr-1" />
          Export PDF
        </Button>
        <Button onClick={onSave}>
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
