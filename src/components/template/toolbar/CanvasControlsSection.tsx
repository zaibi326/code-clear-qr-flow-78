
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
    <div className="space-y-3">
      <div className="pb-1">
        <h4 className="text-sm font-medium text-gray-700">Canvas Controls</h4>
      </div>
      
      {/* Undo/Redo Row */}
      {(onUndo || onRedo) && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center justify-center gap-2 text-xs border-gray-200 h-9 disabled:opacity-50"
          >
            <Undo className="h-3 w-3" />
            <span>Undo</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="flex items-center justify-center gap-2 text-xs border-gray-200 h-9 disabled:opacity-50"
          >
            <Redo className="h-3 w-3" />
            <span>Redo</span>
          </Button>
        </div>
      )}
      
      {/* Zoom Controls */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onZoomCanvas('in')}
          className="flex items-center justify-center gap-2 text-xs border-gray-200 h-9"
        >
          <ZoomIn className="h-3 w-3" />
          <span>Zoom In</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onZoomCanvas('out')}
          className="flex items-center justify-center gap-2 text-xs border-gray-200 h-9"
        >
          <ZoomOut className="h-3 w-3" />
          <span>Zoom Out</span>
        </Button>
      </div>
      
      {/* Action Controls */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onResetCanvas}
          className="flex items-center justify-center gap-2 text-xs border-gray-200 h-9"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onDeleteSelected}
          disabled={!hasSelectedObject}
          className="flex items-center justify-center gap-2 text-xs border-gray-200 h-9 disabled:opacity-50"
        >
          <Trash2 className="h-3 w-3" />
          <span>Delete</span>
        </Button>
      </div>
    </div>
  );
};
