
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface Highlight {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  pageNumber: number;
}

interface Shape {
  id: string;
  type: 'rectangle' | 'circle';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  pageNumber: number;
}

interface DrawingPath {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
  pageNumber: number;
}

interface Comment {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  pageNumber: number;
  timestamp: Date;
}

export const useAnnotations = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [drawingPaths, setDrawingPaths] = useState<DrawingPath[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const addHighlight = useCallback((highlight: Omit<Highlight, 'id'>) => {
    const newHighlight = {
      ...highlight,
      id: `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setHighlights(prev => [...prev, newHighlight]);
    
    toast({
      title: "Highlight Added",
      description: "Text has been highlighted successfully",
    });
  }, []);

  const removeHighlight = useCallback((id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
    
    toast({
      title: "Highlight Removed",
      description: "Highlight has been removed",
    });
  }, []);

  const addShape = useCallback((shape: Omit<Shape, 'id'>) => {
    const newShape = {
      ...shape,
      id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setShapes(prev => [...prev, newShape]);
    
    toast({
      title: "Shape Added",
      description: `${shape.type} shape has been added`,
    });
  }, []);

  const removeShape = useCallback((id: string) => {
    setShapes(prev => prev.filter(s => s.id !== id));
    
    toast({
      title: "Shape Removed",
      description: "Shape has been removed",
    });
  }, []);

  const addDrawingPath = useCallback((path: Omit<DrawingPath, 'id'>) => {
    const newPath = {
      ...path,
      id: `path-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setDrawingPaths(prev => [...prev, newPath]);
    
    toast({
      title: "Drawing Added",
      description: "Freehand drawing has been added",
    });
  }, []);

  const removeDrawingPath = useCallback((id: string) => {
    setDrawingPaths(prev => prev.filter(p => p.id !== id));
    
    toast({
      title: "Drawing Removed",
      description: "Drawing has been removed",
    });
  }, []);

  const addComment = useCallback((comment: Omit<Comment, 'id' | 'timestamp'>) => {
    const newComment = {
      ...comment,
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    setComments(prev => [...prev, newComment]);
    
    toast({
      title: "Comment Added",
      description: "Comment has been added successfully",
    });
  }, []);

  const removeComment = useCallback((id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
    
    toast({
      title: "Comment Removed",
      description: "Comment has been removed",
    });
  }, []);

  const clearAllAnnotations = useCallback(() => {
    setHighlights([]);
    setShapes([]);
    setDrawingPaths([]);
    setComments([]);
    
    toast({
      title: "All Annotations Cleared",
      description: "All annotations have been removed",
    });
  }, []);

  return {
    highlights,
    shapes,
    drawingPaths,
    comments,
    addHighlight,
    removeHighlight,
    addShape,
    removeShape,
    addDrawingPath,
    removeDrawingPath,
    addComment,
    removeComment,
    clearAllAnnotations
  };
};
