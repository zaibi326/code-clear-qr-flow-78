
import { useEffect, useCallback, useMemo, useRef } from 'react';
import { Canvas } from 'fabric';
import { toast } from '@/hooks/use-toast';
import { Template } from '@/types/template';
import { useCanvasState } from './canvas/useCanvasState';
import { useCanvasHistory } from './canvas/useCanvasHistory';
import { useBackgroundLoader } from './canvas/useBackgroundLoader';
import { useCanvasOperations } from './canvas/useCanvasOperations';

export const useCanvasEditor = (template: Template) => {
  const initializationRef = useRef<{ inProgress: boolean; templateId: string | null }>({
    inProgress: false,
    templateId: null
  });

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

  const templateId = useMemo(() => template.id, [template.id]);

  // Stable initialization function with improved error handling
  const initializeCanvas = useCallback(async () => {
    // Prevent multiple simultaneous initializations for same template
    if (initializationRef.current.inProgress && initializationRef.current.templateId === templateId) {
      console.log('Canvas initialization already in progress for this template');
      return;
    }

    if (!canvasRef.current) {
      console.log('Canvas ref not available');
      return;
    }

    console.log('Starting canvas initialization for template:', template.name);
    
    // Mark initialization as in progress
    initializationRef.current = { inProgress: true, templateId };
    setBackgroundLoaded(false);
    setBackgroundError(null);

    try {
      // Clear any existing timeout
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }

      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 150));

      if (!canvasRef.current) {
        throw new Error('Canvas element no longer available');
      }

      // Dispose any existing canvas
      if (fabricCanvasRef.current && !fabricCanvasRef.current.disposed) {
        try {
          fabricCanvasRef.current.dispose();
        } catch (error) {
          console.error('Error disposing previous canvas:', error);
        }
      }

      // Create canvas with proper dimensions
      console.log('Creating Fabric canvas...');
      const canvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
        selection: true,
        preserveObjectStacking: true
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
        try {
          if (e.selected && e.selected.length > 0) {
            setSelectedObject(e.selected[0]);
          }
        } catch (error) {
          console.error('Error in selection:created handler:', error);
        }
      });

      canvas.on('selection:updated', (e) => {
        try {
          if (e.selected && e.selected.length > 0) {
            setSelectedObject(e.selected[0]);
          }
        } catch (error) {
          console.error('Error in selection:updated handler:', error);
        }
      });

      canvas.on('selection:cleared', () => {
        try {
          setSelectedObject(null);
        } catch (error) {
          console.error('Error in selection:cleared handler:', error);
        }
      });

      canvas.on('object:modified', () => {
        try {
          if (!canvas.disposed) {
            canvas.renderAll();
            saveToHistory(canvas);
          }
        } catch (error) {
          console.error('Error in object:modified handler:', error);
        }
      });

      // Load background template FIRST with proper error handling
      console.log('Loading background template...');
      try {
        const loadSuccess = await loadBackgroundTemplate(canvas, template);
        console.log('Background loading result:', loadSuccess);
        
        if (!loadSuccess) {
          console.warn('Background loading failed');
          setBackgroundError('Failed to load template background');
        }
      } catch (error) {
        console.error('Background loading error:', error);
        setBackgroundError(`Background loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // THEN load existing JSON if available (so it appears on top of background)
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
          console.warn('Error loading JSON data:', jsonError);
        }
      }
      
      // Mark as loaded
      setBackgroundLoaded(true);
      if (!backgroundError) {
        setBackgroundError(null);
      }
      isInitializedRef.current = true;
      
      console.log('Canvas initialization completed successfully');
      
      // Save initial state
      saveToHistory(canvas);

      // Show success toast
      toast({
        title: 'Template loaded successfully',
        description: 'Your template is now ready for editing',
      });

    } catch (error) {
      console.error('Error during canvas initialization:', error);
      setBackgroundError(`Failed to initialize canvas: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setBackgroundLoaded(true);
      
      toast({
        title: 'Canvas initialization failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      // Mark initialization as complete
      initializationRef.current.inProgress = false;
    }
  }, [template, templateId, canvasRef, fabricCanvasRef, setZoom, setSelectedObject, setBackgroundLoaded, setBackgroundError, saveToHistory, loadBackgroundTemplate, isInitializedRef, backgroundError]);

  // Initialize canvas when template changes
  useEffect(() => {
    // Reset initialization state for new template
    if (initializationRef.current.templateId !== templateId) {
      console.log('Template changed, resetting initialization state');
      isInitializedRef.current = false;
      initializationRef.current.templateId = null;
      
      // Clear any existing canvas
      if (fabricCanvasRef.current && !fabricCanvasRef.current.disposed) {
        try {
          fabricCanvasRef.current.dispose();
        } catch (error) {
          console.error('Error disposing previous canvas:', error);
        }
      }
      fabricCanvasRef.current = null;
    }

    // Skip if already initialized for this template
    if (isInitializedRef.current && initializationRef.current.templateId === templateId) {
      console.log('Canvas already initialized for this template');
      return;
    }

    // Initialize canvas with a delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      initializeCanvas();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      console.log('Cleaning up canvas initialization for template:', templateId);
      
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
    };
  }, [templateId, initializeCanvas, isInitializedRef]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Canvas editor unmounting');
      if (fabricCanvasRef.current && !fabricCanvasRef.current.disposed) {
        try {
          fabricCanvasRef.current.dispose();
        } catch (error) {
          console.error('Error disposing canvas on unmount:', error);
        }
      }
      fabricCanvasRef.current = null;
      initializationRef.current = { inProgress: false, templateId: null };
    };
  }, []);

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
