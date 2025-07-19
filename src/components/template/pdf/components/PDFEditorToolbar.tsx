
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download, 
  Save, 
  ZoomIn, 
  ZoomOut, 
  Upload,
  AlertCircle 
} from 'lucide-react';

interface PDFEditorToolbarProps {
  templateName?: string;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
  onDownload: () => void;
  onBack: () => void;
  onUploadNew: () => void;
  isProcessing?: boolean;
  hasChanges?: boolean;
}

export const PDFEditorToolbar: React.FC<PDFEditorToolbarProps> = ({
  templateName,
  zoom,
  onZoomIn,
  onZoomOut,
  onSave,
  onDownload,
  onBack,
  onUploadNew,
  isProcessing = false,
  hasChanges = false
}) => {
  return (
    <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        {templateName && (
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold truncate max-w-xs">
              {templateName}
            </h1>
            {hasChanges && (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Unsaved changes</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <Button variant="ghost" size="sm" onClick={onZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center px-2">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="sm" onClick={onZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Action Buttons */}
        <Button variant="outline" size="sm" onClick={onUploadNew}>
          <Upload className="w-4 h-4 mr-2" />
          New PDF
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDownload} 
          disabled={isProcessing}
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        
        <Button 
          size="sm" 
          onClick={onSave} 
          disabled={isProcessing || !hasChanges}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {isProcessing ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};
