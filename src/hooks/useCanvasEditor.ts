
import { useEffect } from 'react';
import { Canvas } from 'fabric';
import { toast } from '@/hooks/use-toast';
import { Template } from '@/types/template';
import { useCanvasState } from './canvas/useCanvasState';
import { useCanvasHistory } from './canvas/useCanvasHistory';
import { useBackgroundLoader } from './canvas/useBackgroundLoader';
import { useCanvasOperations } from './canvas/useCanvasOperations';

export const useCanvasEditor = (template: Template) => {
  const {
    canvasRef,
    fabricCanvasRef,
    isInitializedRef,
    initTimeoutRef,
    selectedObject,
    setSelectedObject,
    canvasElements,
    setCanvasElements,
    zoom,
    setZoom,
    backgroundLoaded,
    setBackgroundLoaded,
    backgroundError,
    setBackgroundError
  } = useCanvasState();

  const {
    saveToHistory,
    undoCanvas,
    redoCanvas,
    canUndo,
    canRedo
  } = useCanvasHistory();

  const { loadBackgroundTemplate } = useBackgroundLoader();

  const {
    addQRCode,
    addText,
    addShape,
    uploadImage,
    deleteSelected,
    updateSelectedObjectProperty,
    zoomCanvas
  } = useCanvasOperations(fabricCanvasRef, saveToHistory, setCanvasElements, setSelectedObject);

  // Initialize canvas with proper cleanup and timeout
  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current || !canvasRef.current) {
      return;
    }

    console.log('Starting canvas initialization for template:', template.name);
    isInitializedRef.current = true;
    setBackgroundLoaded(false);
    setBackgroundError(null);

    const initializeCanvas = async () => {
      try {
        // Set timeout fallback
        initTimeoutRef.current = setTimeout(() => {
          console.warn('Canvas initialization timeout');
          setBackgroundError('Canvas initialization timed out');
          setBackgroundLoaded(true);
        }, 10000);

        const canvas = new Canvas(canvasRef.current!, {
          width: 800,
          height: 600,
          backgroundColor: '#ffffff',
        });

        fabricCanvasRef.current = canvas;
        setZoom(1);

        // Initialize drawing brush
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = '#000000';
          canvas.freeDrawingBrush.width = 2;
        }

        // Set up event listeners
        canvas.on('selection:created', (e) => {
          if (e.selected && e.selected.length > 0) {
            setSelectedObject(e.selected[0]);
          }
        });

        canvas.on('selection:updated', (e) => {
          if (e.selected && e.selected.length > 0) {
            setSelectedObject(e.selected[0]);
          }
        });

        canvas.on('selection:cleared', () => {
          setSelectedObject(null);
        });

        canvas.on('object:modified', () => {
          if (!canvas.disposed) {
            canvas.renderAll();
            saveToHistory(canvas);
          }
        });

        // Load existing JSON if available
        if (template.editable_json && !canvas.disposed) {
          console.log('Loading existing canvas JSON data');
          try {
            await new Promise<void>((resolve) => {
              canvas.loadFromJSON(template.editable_json, () => {
                if (!canvas.disposed) {
                  canvas.renderAll();
                  console.log('Canvas JSON loaded successfully');
                }
                resolve();
              });
            });
          } catch (jsonError) {
            console.error('Error loading JSON data:', jsonError);
          }
        }

        // Load background template
        console.log('Loading background template');
        await loadBackgroundTemplate(canvas, template);
        
        // Clear timeout and set success state
        if (initTimeoutRef.current) {
          clearTimeout(initTimeoutRef.current);
          initTimeoutRef.current = null;
        }
        
        console.log('Canvas initialization completed successfully');
        setBackgroundLoaded(true);
        setBackgroundError(null);
        
        // Save initial state
        saveToHistory(canvas);

      } catch (error) {
        console.error('Error during canvas initialization:', error);
        setBackgroundError('Failed to initialize canvas editor');
        setBackgroundLoaded(true);
        
        if (initTimeoutRef.current) {
          clearTimeout(initTimeoutRef.current);
          initTimeoutRef.current = null;
        }
      }
    };

    initializeCanvas();

    return () => {
      console.log('Cleaning up canvas');
      isInitializedRef.current = false;
      
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
      
      if (fabricCanvasRef.current && !fabricCanvasRef.current.disposed) {
        try {
          fabricCanvasRef.current.dispose();
        } catch (error) {
          console.error('Error disposing canvas:', error);
        }
      }
      fabricCanvasRef.current = null;
    };
  }, [template.id]);

  const resetCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || canvas.disposed) return;

    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    setCanvasElements([]);
    setSelectedObject(null);
    
    loadBackgroundTemplate(canvas, template);
    
    canvas.renderAll();
    saveToHistory(canvas);
    
    toast({
      title: 'Canvas reset',
      description: 'Canvas has been cleared and reset',
    });
  };

  return {
    canvasRef,
    fabricCanvas: fabricCanvasRef.current,
    selectedObject,
    canvasElements,
    zoom,
    backgroundLoaded,
    backgroundError,
    addQRCode,
    addText,
    addShape,
    uploadImage,
    deleteSelected,
    updateSelectedObjectProperty: (property: string, value: any) => 
      updateSelectedObjectProperty(property, value, selectedObject),
    zoomCanvas: (direction: 'in' | 'out') => zoomCanvas(direction, zoom, setZoom),
    resetCanvas,
    undoCanvas: () => undoCanvas(fabricCanvasRef.current),
    redoCanvas: () => redoCanvas(fabricCanvasRef.current),
    canUndo,
    canRedo
  };
};
