
import { useEffect, useCallback } from 'react';
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

  // Stable callback to prevent re-initialization
  const initializeCanvas = useCallback(async () => {
    if (!canvasRef.current || isInitializedRef.current) {
      console.log('Canvas ref not available or already initialized');
      return;
    }

    console.log('Starting canvas initialization for template:', template.name);
    isInitializedRef.current = true;
    setBackgroundLoaded(false);
    setBackgroundError(null);

    try {
      // Clear any existing timeout
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }

      // Create canvas with immediate feedback
      console.log('Creating Fabric canvas...');
      const canvas = new Canvas(canvasRef.current, {
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

      console.log('Setting up canvas event listeners...');
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
          await new Promise<void>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
              reject(new Error('JSON loading timeout'));
            }, 5000);

            canvas.loadFromJSON(template.editable_json, () => {
              clearTimeout(timeoutId);
              if (!canvas.disposed) {
                canvas.renderAll();
                console.log('Canvas JSON loaded successfully');
              }
              resolve();
            });
          });
        } catch (jsonError) {
          console.warn('Error loading JSON data:', jsonError);
          // Continue initialization even if JSON fails
        }
      }

      // Load background template with shorter timeout
      console.log('Loading background template...');
      const loadSuccess = await Promise.race([
        loadBackgroundTemplate(canvas, template),
        new Promise<boolean>((_, reject) => 
          setTimeout(() => reject(new Error('Background loading timeout')), 8000)
        )
      ]);

      console.log('Background loading result:', loadSuccess);
      
      // Mark as loaded regardless of background loading success
      setBackgroundLoaded(true);
      setBackgroundError(null);
      
      console.log('Canvas initialization completed successfully');
      
      // Save initial state
      saveToHistory(canvas);

      // Show success toast
      toast({
        title: 'Canvas ready',
        description: 'Template editor is now ready for editing',
      });

    } catch (error) {
      console.error('Error during canvas initialization:', error);
      setBackgroundError(`Failed to initialize canvas: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setBackgroundLoaded(true);
      
      toast({
        title: 'Canvas initialization failed',
        description: 'There was an issue setting up the editor. You can still try to use it.',
        variant: 'destructive'
      });
    }
  }, [template.name, template.editable_json, canvasRef, isInitializedRef, fabricCanvasRef, setZoom, setSelectedObject, setBackgroundLoaded, setBackgroundError, saveToHistory, loadBackgroundTemplate]);

  // Initialize canvas when template changes
  useEffect(() => {
    // Reset initialization state for new template
    isInitializedRef.current = false;
    
    // Clear any existing canvas
    if (fabricCanvasRef.current && !fabricCanvasRef.current.disposed) {
      try {
        fabricCanvasRef.current.dispose();
      } catch (error) {
        console.error('Error disposing previous canvas:', error);
      }
    }
    fabricCanvasRef.current = null;

    // Initialize new canvas
    const timeoutId = setTimeout(() => {
      initializeCanvas();
    }, 100); // Small delay to ensure DOM is ready

    return () => {
      clearTimeout(timeoutId);
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
  }, [template.id, initializeCanvas]);

  const resetCanvas = useCallback(() => {
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
  }, [fabricCanvasRef, setCanvasElements, setSelectedObject, loadBackgroundTemplate, template, saveToHistory]);

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
