
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Highlighter, 
  Square, 
  Circle, 
  Edit3, 
  MessageSquare,
  Search,
  Replace,
  Type
} from 'lucide-react';

interface AnnotationToolsProps {
  selectedTool: string;
  onToolChange: (tool: string) => void;
  searchTerm: string;
  replaceTerm: string;
  onSearchChange: (term: string) => void;
  onReplaceChange: (term: string) => void;
  onSearchAndReplace: () => void;
  annotationColor: string;
  onColorChange: (color: string) => void;
}

export const AnnotationTools: React.FC<AnnotationToolsProps> = ({
  selectedTool,
  onToolChange,
  searchTerm,
  replaceTerm,
  onSearchChange,
  onReplaceChange,
  onSearchAndReplace,
  annotationColor,
  onColorChange
}) => {
  const tools = [
    { id: 'select', icon: Type, label: 'Select Text', description: 'Click text to edit directly' },
    { id: 'highlight', icon: Highlighter, label: 'Highlight', description: 'Highlight text selections' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', description: 'Draw rectangles' },
    { id: 'circle', icon: Circle, label: 'Circle', description: 'Draw circles' },
    { id: 'freehand', icon: Edit3, label: 'Draw', description: 'Freehand drawing' },
    { id: 'comment', icon: MessageSquare, label: 'Comment', description: 'Add sticky notes' }
  ];

  return (
    <div className="space-y-4">
      {/* Search and Replace */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Search className="w-4 h-4" />
            Search & Replace
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="search-input" className="text-xs">Find:</Label>
            <Input
              id="search-input"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search text..."
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="replace-input" className="text-xs">Replace with:</Label>
            <Input
              id="replace-input"
              value={replaceTerm}
              onChange={(e) => onReplaceChange(e.target.value)}
              placeholder="Replacement text..."
              className="h-8"
            />
          </div>
          <Button 
            onClick={onSearchAndReplace}
            disabled={!searchTerm.trim()}
            className="w-full h-8"
            size="sm"
          >
            <Replace className="w-4 h-4 mr-1" />
            Replace All
          </Button>
        </CardContent>
      </Card>

      {/* Annotation Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Annotation Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "outline"}
              onClick={() => onToolChange(tool.id)}
              className="w-full justify-start h-12"
            >
              <tool.icon className="w-4 h-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">{tool.label}</div>
                <div className="text-xs text-gray-500">{tool.description}</div>
              </div>
            </Button>
          ))}
          
          <Separator className="my-3" />
          
          {/* Color Picker */}
          <div className="space-y-2">
            <Label className="text-xs">Annotation Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={annotationColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <span className="text-xs text-gray-600">{annotationColor}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
