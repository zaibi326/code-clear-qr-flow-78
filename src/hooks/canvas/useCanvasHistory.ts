
import { useState, useCallback } from 'react';
import { Canvas } from 'fabric';
import { toast } from '@/hooks/use-toast';

interface CanvasState {
  json: any;
  timestamp: number;
}

export const useCanvasHistory = () => {
  const [history, setHistory] = useState<CanvasState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const saveToHistory = useCallback((canvas: Canvas) => {
    if (!canvas || canvas.disposed) return;
    
    try {
      const canvasJson = canvas.toJSON();
      const newState: CanvasState = {
        json: canvasJson,
        timestamp: Date.now()
      };

      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newState);
        
        if (newHistory.length > 50) {
          newHistory.shift();
          return newHistory;
        }
        return newHistory;
      });
      
      setHistoryIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error saving canvas to history:', error);
    }
  }, [historyIndex]);

  const undoCanvas = (canvas: Canvas | null) => {
    if (!canvas || !canUndo || canvas.disposed) return;

    const newIndex = historyIndex - 1;
    const stateToRestore = history[newIndex];

    if (stateToRestore) {
      canvas.off('object:modified');
      
      canvas.loadFromJSON(stateToRestore.json, () => {
        if (!canvas.disposed) {
          canvas.renderAll();
          setHistoryIndex(newIndex);
          
          canvas.on('object:modified', () => {
            if (!canvas.disposed) {
              canvas.renderAll();
              saveToHistory(canvas);
            }
          });
          
          toast({
            title: 'Undo successful',
            description: 'Canvas state restored',
          });
        }
      });
    }
  };

  const redoCanvas = (canvas: Canvas | null) => {
    if (!canvas || !canRedo || canvas.disposed) return;

    const newIndex = historyIndex + 1;
    const stateToRestore = history[newIndex];

    if (stateToRestore) {
      canvas.off('object:modified');
      
      canvas.loadFromJSON(stateToRestore.json, () => {
        if (!canvas.disposed) {
          canvas.renderAll();
          setHistoryIndex(newIndex);
          
          canvas.on('object:modified', () => {
            if (!canvas.disposed) {
              canvas.renderAll();
              saveToHistory(canvas);
            }
          });
          
          toast({
            title: 'Redo successful',
            description: 'Canvas state restored',
          });
        }
      });
    }
  };

  return {
    saveToHistory,
    undoCanvas,
    redoCanvas,
    canUndo,
    canRedo
  };
};
