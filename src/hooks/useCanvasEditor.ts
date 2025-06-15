import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, Rect, Circle, Textbox, FabricImage, FabricObject } from 'fabric';
import { toast } from '@/hooks/use-toast';
import { generateQRCode } from '@/utils/qrCodeGenerator';
import { Template } from '@/types/template';

interface CanvasElement {
  id: string;
  type: 'qr' | 'text' | 'shape' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, any>;
}

interface CanvasState {
  json: any;
  timestamp: number;
}

export const useCanvasEditor = (template: Template) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const isInitializedRef = useRef(false);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [zoom, setZoom] = useState(1);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [backgroundError, setBackgroundError] = useState<string | null>(null);
  const [history, setHistory] = useState<CanvasState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Stabilized save to history function
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

  // Stabilized background loading function
  const loadBackgroundTemplate = useCallback(async (canvas: Canvas): Promise<boolean> => {
    if (!canvas || canvas.disposed) {
      console.log('Canvas not available for background loading');
      return false;
    }

    console.log('Loading background template:', template.name);
    
    try {
      let imageUrl = '';

      // Handle different file sources
      if (template.file && template.file instanceof File) {
        console.log('Loading template file:', template.file.name, template.file.type);
        
        if (template.file.type === 'application/pdf') {
          // Create PDF placeholder
          console.log('PDF template detected - creating placeholder');
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = 800;
          tempCanvas.height = 600;
          const ctx = tempCanvas.getContext('2d');
          
          if (ctx) {
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, 800, 600);
            ctx.strokeStyle = '#dee2e6';
            ctx.lineWidth = 2;
            ctx.strokeRect(10, 10, 780, 580);
            ctx.fillStyle = '#dc3545';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('📄 PDF Template', 400, 280);
            ctx.fillStyle = '#6c757d';
            ctx.font = '18px Arial';
            ctx.fillText('Ready for editing and customization', 400, 320);
          }
          
          imageUrl = tempCanvas.toDataURL();
        } else if (template.file.type.startsWith('image/')) {
          console.log('Image template detected');
          imageUrl = URL.createObjectURL(template.file);
        }
      } else if (template.preview) {
        console.log('Loading from preview URL');
        imageUrl = template.preview;
      } else if (template.template_url) {
        console.log('Loading from template URL');
        imageUrl = template.template_url;
      } else if (template.thumbnail_url) {
        console.log('Loading from thumbnail URL');
        imageUrl = template.thumbnail_url;
      }

      if (imageUrl && !canvas.disposed) {
        console.log('Loading background image from URL');
        
        const img = await FabricImage.fromURL(imageUrl, {
          crossOrigin: 'anonymous'
        });
        
        if (!canvas.disposed && img) {
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();
          const imgWidth = img.width || canvasWidth;
          const imgHeight = img.height || canvasHeight;
          
          const scaleX = canvasWidth / imgWidth;
          const scaleY = canvasHeight / imgHeight;
          const scale = Math.min(scaleX, scaleY);

          img.set({
            left: (canvasWidth - imgWidth * scale) / 2,
            top: (canvasHeight - imgHeight * scale) / 2,
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            evented: false,
            excludeFromExport: false,
          });

          canvas.add(img);
          canvas.sendObjectToBack(img);
          canvas.renderAll();
          
          console.log('Background template loaded successfully');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error loading background template:', error);
      return false;
    }
  }, [template.file, template.preview, template.template_url, template.thumbnail_url, template.name]);

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
        await loadBackgroundTemplate(canvas);
        
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
  }, [template.id]); // Only depend on template.id to prevent infinite loops

  const undoCanvas = () => {
    const canvas = fabricCanvasRef.current;
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

  const redoCanvas = () => {
    const canvas = fabricCanvasRef.current;
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

  const addQRCode = async (qrUrl: string) => {
    const canvas = fabricCanvasRef.current;
    console.log('addQRCode called with URL:', qrUrl);
    
    if (!canvas || canvas.disposed) {
      console.error('Canvas not available for QR code addition');
      toast({
        title: 'Canvas not ready',
        description: 'Please wait for the canvas to load',
        variant: 'destructive'
      });
      return;
    }

    if (!qrUrl || qrUrl.trim() === '') {
      console.error('Invalid QR URL:', qrUrl);
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL for the QR code',
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log('Generating QR code for:', qrUrl);
      const qrResult = await generateQRCode(qrUrl, { size: 150 });
      console.log('QR code generated successfully');
      
      const qrImg = await FabricImage.fromURL(qrResult.dataURL);
      console.log('QR image created from data URL');
      
      if (qrImg && !canvas.disposed) {
        qrImg.set({
          left: 100,
          top: 100,
          width: 150,
          height: 150,
          selectable: true,
          evented: true,
        });
        
        qrImg.set('qrData', {
          url: qrUrl,
          type: 'qr'
        });

        canvas.add(qrImg);
        canvas.setActiveObject(qrImg);
        canvas.renderAll();
        saveToHistory(canvas);
        
        const newElement: CanvasElement = {
          id: `qr-${Date.now()}`,
          type: 'qr',
          x: 100,
          y: 100,
          width: 150,
          height: 150,
          properties: { url: qrUrl }
        };
        
        setCanvasElements(prev => [...prev, newElement]);
        console.log('QR code added successfully to canvas');
        toast({
          title: 'QR code added successfully',
          description: `QR code for ${qrUrl} has been added to the canvas`,
        });
      } else {
        console.error('Failed to create QR code image or canvas disposed');
        throw new Error('Failed to create QR code image');
      }
    } catch (error) {
      console.error('QR generation error:', error);
      toast({
        title: 'Failed to generate QR code',
        description: 'Please check the URL and try again',
        variant: 'destructive'
      });
    }
  };

  const addText = (textContent: string, fontSize: number, textColor: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || canvas.disposed) {
      toast({
        title: 'Canvas not ready',
        description: 'Please wait for the canvas to load',
        variant: 'destructive'
      });
      return;
    }

    const textObj = new Textbox(textContent, {
      left: 200,
      top: 200,
      width: 200,
      fontSize: fontSize,
      fill: textColor,
      fontFamily: 'Arial',
      selectable: true,
      evented: true,
    });

    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.renderAll();
    saveToHistory(canvas);

    const newElement: CanvasElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: 200,
      y: 200,
      width: 200,
      height: fontSize * 1.2,
      properties: { 
        text: textContent, 
        fontSize, 
        color: textColor,
        fontFamily: 'Arial'
      }
    };

    setCanvasElements(prev => [...prev, newElement]);
    toast({
      title: 'Text added to canvas',
    });
  };

  const addShape = (shapeType: 'rectangle' | 'circle') => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || canvas.disposed) {
      toast({
        title: 'Canvas not ready',
        description: 'Please wait for the canvas to load',
        variant: 'destructive'
      });
      return;
    }

    let shape: FabricObject;

    if (shapeType === 'rectangle') {
      shape = new Rect({
        left: 300,
        top: 300,
        width: 100,
        height: 60,
        fill: '#3B82F6',
        stroke: '#1E40AF',
        strokeWidth: 2,
        selectable: true,
        evented: true,
      });
    } else {
      shape = new Circle({
        left: 300,
        top: 300,
        radius: 50,
        fill: '#EF4444',
        stroke: '#DC2626',
        strokeWidth: 2,
        selectable: true,
        evented: true,
      });
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
    saveToHistory(canvas);

    const newElement: CanvasElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      x: 300,
      y: 300,
      width: shapeType === 'rectangle' ? 100 : 100,
      height: shapeType === 'rectangle' ? 60 : 100,
      properties: { shapeType, fill: shape.fill }
    };

    setCanvasElements(prev => [...prev, newElement]);
    toast({
      title: `${shapeType} added to canvas`,
    });
  };

  const uploadImage = (file: File) => {
    const canvas = fabricCanvasRef.current;
    if (!file || !canvas || canvas.disposed) {
      toast({
        title: 'Invalid file or canvas not ready',
        description: 'Please select a valid image file',
        variant: 'destructive'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      
      try {
        const img = await FabricImage.fromURL(imageUrl);
        if (img && !canvas.disposed) {
          img.set({
            left: 150,
            top: 150,
            scaleX: 0.5,
            scaleY: 0.5,
            selectable: true,
            evented: true,
          });

          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          saveToHistory(canvas);

          const newElement: CanvasElement = {
            id: `image-${Date.now()}`,
            type: 'image',
            x: 150,
            y: 150,
            width: (img.width || 0) * 0.5,
            height: (img.height || 0) * 0.5,
            properties: { src: imageUrl }
          };

          setCanvasElements(prev => [...prev, newElement]);
          toast({
            title: 'Image added to canvas',
          });
        }
      } catch (error) {
        console.error('Error loading image:', error);
        toast({
          title: 'Failed to load image',
          description: 'Please try a different image file',
          variant: 'destructive'
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const deleteSelected = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || canvas.disposed) {
      console.error('Canvas not available');
      return;
    }

    const activeObject = canvas.getActiveObject();
    if (!activeObject) {
      toast({
        title: 'No object selected',
        description: 'Please select an object to delete',
        variant: 'destructive'
      });
      return;
    }

    console.log('Deleting object:', activeObject);
    canvas.remove(activeObject);
    canvas.discardActiveObject();
    canvas.renderAll();
    saveToHistory(canvas);
    setSelectedObject(null);
    
    toast({
      title: 'Object deleted',
      description: 'Selected object has been removed from canvas',
    });
  };

  const updateSelectedObjectProperty = (property: string, value: any) => {
    if (!selectedObject || !fabricCanvasRef.current || fabricCanvasRef.current.disposed) return;

    console.log(`Updating property ${property} to ${value}`);
    selectedObject.set(property, value);
    fabricCanvasRef.current.renderAll();
  };

  const zoomCanvas = (direction: 'in' | 'out') => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || canvas.disposed) return;

    const newZoom = direction === 'in' ? zoom * 1.1 : zoom * 0.9;
    const clampedZoom = Math.max(0.1, Math.min(3, newZoom));
    
    canvas.setZoom(clampedZoom);
    canvas.renderAll();
    setZoom(clampedZoom);
  };

  const resetCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || canvas.disposed) return;

    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    setCanvasElements([]);
    setSelectedObject(null);
    
    loadBackgroundTemplate(canvas);
    
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
    updateSelectedObjectProperty,
    zoomCanvas,
    resetCanvas,
    undoCanvas,
    redoCanvas,
    canUndo,
    canRedo
  };
};
