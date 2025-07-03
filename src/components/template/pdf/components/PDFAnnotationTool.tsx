
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Highlighter, Square, Circle, Triangle, Star } from 'lucide-react';

interface PDFAnnotationToolProps {
  selectedTool: string;
  onToolChange: (tool: string) => void;
  onAddAnnotation: (type: string, x: number, y: number) => void;
}

export const PDFAnnotationTool: React.FC<PDFAnnotationToolProps> = ({
  selectedTool,
  onToolChange,
  onAddAnnotation
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">Annotation Tools</Label>
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant={selectedTool === 'highlight' ? 'default' : 'outline'}
          onClick={() => onToolChange('highlight')}
          className="h-12 flex flex-col items-center justify-center gap-1"
        >
          <Highlighter className="w-4 h-4" />
          <span className="text-xs">Highlight</span>
        </Button>
        
        <Button
          size="sm"
          variant={selectedTool === 'shape' ? 'default' : 'outline'}
          onClick={() => onToolChange('shape')}
          className="h-12 flex flex-col items-center justify-center gap-1"
        >
          <Square className="w-4 h-4" />
          <span className="text-xs">Shape</span>
        </Button>
      </div>
    </div>
  );
};
