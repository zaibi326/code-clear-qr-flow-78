
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Highlighter, 
  Underline, 
  Strikethrough,
  MessageSquare,
  Square,
  Circle,
  PenTool,
  Palette,
  Eraser
} from 'lucide-react';

interface PDFAnnotationToolProps {
  selectedTool: string;
  onToolChange: (tool: string) => void;
  onAddAnnotation: (type: string, x: number, y: number, data?: any) => void;
}

export const PDFAnnotationTool: React.FC<PDFAnnotationToolProps> = ({
  selectedTool,
  onToolChange,
  onAddAnnotation
}) => {
  const [annotationColor, setAnnotationColor] = useState('#ffff00');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [commentText, setCommentText] = useState('');

  const annotationTools = [
    { id: 'highlight', icon: Highlighter, label: 'Highlight', color: '#ffff00' },
    { id: 'underline', icon: Underline, label: 'Underline', color: '#ff0000' },
    { id: 'strikethrough', icon: Strikethrough, label: 'Strike', color: '#ff0000' },
    { id: 'comment', icon: MessageSquare, label: 'Comment', color: '#0066cc' },
    { id: 'draw', icon: PenTool, label: 'Draw', color: '#000000' },
    { id: 'shape', icon: Square, label: 'Shape', color: '#00cc00' },
  ];

  const handleToolSelect = (toolId: string) => {
    onToolChange(toolId);
    // Set default color for the tool
    const tool = annotationTools.find(t => t.id === toolId);
    if (tool) {
      setAnnotationColor(tool.color);
    }
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddAnnotation('comment', 100, 100, { text: commentText, color: annotationColor });
      setCommentText('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Annotation Tools</Label>
        <div className="grid grid-cols-2 gap-2">
          {annotationTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Button
                key={tool.id}
                size="sm"
                variant={selectedTool === tool.id ? 'default' : 'outline'}
                onClick={() => handleToolSelect(tool.id)}
                className="flex items-center justify-center gap-2"
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-xs">{tool.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Annotation Settings</Label>
        
        {/* Color Picker */}
        <div>
          <Label className="text-xs text-gray-600">Color</Label>
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={annotationColor}
              onChange={(e) => setAnnotationColor(e.target.value)}
              className="h-8 w-12 p-1"
            />
            <Input
              type="text"
              value={annotationColor}
              onChange={(e) => setAnnotationColor(e.target.value)}
              className="h-8 flex-1 text-xs"
            />
          </div>
        </div>

        {/* Stroke Width */}
        <div>
          <Label className="text-xs text-gray-600">Stroke Width</Label>
          <Input
            type="range"
            min="1"
            max="10"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
            className="h-8"
          />
          <div className="text-xs text-gray-500 mt-1">{strokeWidth}px</div>
        </div>
      </div>

      <Separator />

      {/* Quick Comment Tool */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Quick Comment</Label>
        <Textarea
          placeholder="Type your comment here..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="min-h-[80px] text-sm"
        />
        <Button
          onClick={handleAddComment}
          disabled={!commentText.trim()}
          className="w-full"
          size="sm"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Add Comment
        </Button>
      </div>

      <Separator />

      {/* Annotation Presets */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Quick Actions</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setAnnotationColor('#ffff00');
              onToolChange('highlight');
            }}
            className="text-xs"
          >
            Yellow Highlight
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setAnnotationColor('#ff0000');
              onToolChange('underline');
            }}
            className="text-xs"
          >
            Red Underline
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setAnnotationColor('#00ff00');
              onToolChange('highlight');
            }}
            className="text-xs"
          >
            Green Highlight
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setAnnotationColor('#0066cc');
              onToolChange('comment');
            }}
            className="text-xs"
          >
            Blue Comment
          </Button>
        </div>
      </div>
    </div>
  );
};
