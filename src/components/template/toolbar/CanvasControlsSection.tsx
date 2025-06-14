
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  RotateCcw, 
  ZoomIn,
  ZoomOut,
  Trash2,
  Undo,
  Redo
} from 'lucide-react';

interface CanvasControlsSectionProps {
  onZoomCanvas: (direction: 'in' | 'out') => void;
  onResetCanvas: () => void;
  onDeleteSelected: () => void;
  hasSelectedObject: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const CanvasControlsSection = ({
  onZoomCanvas,
  onResetCanvas,
  onDeleteSelected,
  hasSelectedObject,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}: CanvasControlsSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Canvas</h4>
      </div>
      
      {/* Canvas control buttons in 2x2 grid */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onZoomCanvas('in')}
          className="flex flex-col items-center justify-center h-16 p-2 hover:bg-gray-50 border-gray-300 space-y-1"
        >
          <ZoomIn className="h-5 w-5 text-gray-600" />
          <span className="text-xs text-gray-700">Zoom In</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onZoomCanvas('out')}
          className="flex flex-col items-center justify-center h-16 p-2 hover:bg-gray-50 border-gray-300 space-y-1"
        >
          <ZoomOut className="h-5 w-5 text-gray-600" />
          <span className="text-xs text-gray-700">Zoom Out</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onResetCanvas}
          className="flex flex-col items-center justify-center h-16 p-2 hover:bg-gray-50 border-gray-300 space-y-1"
        >
          <RotateCcw className="h-5 w-5 text-gray-600" />
          <span className="text-xs text-gray-700">Reset</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onDeleteSelected}
          disabled={!hasSelectedObject}
          className="flex flex-col items-center justify-center h-16 p-2 hover:bg-gray-50 border-gray-300 space-y-1 disabled:opacity-50"
        >
          <Trash2 className="h-5 w-5 text-gray-600" />
          <span className="text-xs text-gray-700">Delete</span>
        </Button>
      </div>
    </div>
  );
};
