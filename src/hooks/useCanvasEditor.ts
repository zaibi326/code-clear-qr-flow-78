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
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [zoom, setZoom] = useState(1); // Set default zoom to 100%
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [backgroundError, setBackgroundError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Stable references to prevent re-initialization
  const isMountedRef = useRef(true);
  const canvasInitializedRef = useRef(false);
  const templateIdRef = useRef(template.id);
  
  // Undo/Redo state
  const [history, setHistory] = useState<CanvasState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Save canvas state to history
  const saveToHistory = useCallback((canvas: Canvas) => {
    if (!canvas || canvas.disposed || !isMountedRef.current) return;
    
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

  // Load PDF as image using canvas rendering
  const loadPDFAsImage = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = function() {
        const typedarray = new Uint8Array(this.result as ArrayBuffer);
        
        // For now, show placeholder for PDF
        // In a real implementation, you'd use pdf.js here
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        
        if (ctx) {
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(0, 0, 800, 600);
          ctx.fillStyle = '#666';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('PDF Preview', 400, 280);
          ctx.fillText('(First Page)', 400, 320);
        }
        
        resolve(canvas.toDataURL());
      };
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(file);
    });
  }, []);

  // Load background template file
  const loadBackgroundTemplate = useCallback(async (canvas: Canvas) => {
    if (!canvas || canvas.disposed || !isMountedRef.current) {
      setBackgroundLoaded(true);
      return;
    }

    console.log('Loading background template for:', template.name);
    
    try {
      setBackgroundError(null);
      let imageUrl = '';

      // Handle different file sources
      if (template.file && template.file instanceof File) {
        if (template.file.type === 'application/pdf') {
          console.log('PDF template detected - converting to image');
          imageUrl = await loadPDFAsImage(template.file);
        } else if (template.file.type.startsWith('image/')) {
          imageUrl = URL.createObjectURL(template.file);
        } else {
          setBackgroundError('Unsupported file type');
          setBackgroundLoaded(true);
          return;
        }
      } else if (template.preview) {
        imageUrl = template.preview;
      } else if (template.template_url) {
        imageUrl = template.template_url;
      } else if (template.thumbnail_url) {
        imageUrl = template.thumbnail_url;
      } else {
        setBackgroundLoaded(true);
        return;
      }

      if (imageUrl && !canvas.disposed && isMountedRef.current) {
        console.log('Loading background image from URL:', imageUrl);
        
        const img = await FabricImage.fromURL(imageUrl);
        
        if (!canvas.disposed && img && isMountedRef.current) {
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();
          const imgWidth = img.width || canvasWidth;
          const imgHeight = img.height || canvasHeight;
          
          const scaleX = canvasWidth / imgWidth;
          const scaleY = canvasHeight / imgHeight;
          const scale = Math.min(scaleX, scaleY);

          img.set({
            left: 0,
            top: 0,
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            evented: false,
            excludeFromExport: false,
          });

          canvas.add(img);
          canvas.sendObjectToBack(img);
          canvas.renderAll();
          
          setBackgroundLoaded(true);
          console.log('Background template loaded successfully');
          
          toast({
            title: 'Template loaded',
            description: 'Background template loaded successfully',
          });
        } else {
          setBackgroundError('Canvas not available');
          setBackgroundLoaded(true);
        }
      } else {
        setBackgroundLoaded(true);
      }
    } catch (error) {
      console.error('Error loading background template:', error);
      setBackgroundError('Failed to load template file');
      setBackgroundLoaded(true);
      toast({
        title: 'Failed to load template',
        description: 'Could not load the background template file',
        variant: 'destructive'
      });
    }
  }, [template, loadPDFAsImage]);

  // Canvas initialization effect - only run once per template
  useEffect(() => {
    // Reset initialization state when template changes
    if (templateIdRef.current !== template.id) {
      templateIdRef.current = template.id;
      canvasInitializedRef.current = false;
      setIsInitializing(true);
      setBackgroundLoaded(false);
      setBackgroundError(null);
    }

    // Prevent multiple initializations
    if (canvasInitializedRef.current || !canvasRef.current) {
      return;
    }

    console.log('Initializing canvas for template:', template.name);
    canvasInitializedRef.current = true;
    isMountedRef.current = true;
    
    let canvas: Canvas | null = null;
    
    const initializeCanvas = async () => {
      try {
        canvas = new Canvas(canvasRef.current!, {
          width: 800,
          height: 600,
          backgroundColor: '#ffffff',
        });

        console.log('Canvas created successfully');

        // Set initial zoom to 100% (1.0)
        canvas.setZoom(1);

        // Initialize drawing brush
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = '#000000';
          canvas.freeDrawingBrush.width = 2;
        }

        // Set up event listeners
        canvas.on('selection:created', (e) => {
          if (e.selected && e.selected.length > 0 && isMountedRef.current) {
            setSelectedObject(e.selected[0]);
          }
        });

        canvas.on('selection:updated', (e) => {
          if (e.selected && e.selected.length > 0 && isMountedRef.current) {
            setSelectedObject(e.selected[0]);
          }
        });

        canvas.on('selection:cleared', () => {
          if (isMountedRef.current) {
            setSelectedObject(null);
          }
        });

        canvas.on('object:modified', () => {
          if (!canvas?.disposed && isMountedRef.current) {
            canvas.renderAll();
            saveToHistory(canvas);
          }
        });

        canvas.on('object:added', () => {
          if (!canvas?.disposed && isMountedRef.current) {
            canvas.renderAll();
          }
        });

        canvas.on('object:removed', () => {
          if (!canvas?.disposed && isMountedRef.current) {
            canvas.renderAll();
          }
        });

        if (isMountedRef.current) {
          setFabricCanvas(canvas);
        }
        
        // Load existing customization JSON if it exists
        if (template.editable_json && !canvas?.disposed && isMountedRef.current) {
          console.log('Loading existing canvas data');
          canvas.loadFromJSON(template.editable_json, async () => {
            if (!canvas?.disposed && isMountedRef.current) {
              console.log('Canvas JSON loaded, now loading background');
              canvas.renderAll();
              await loadBackgroundTemplate(canvas);
              saveToHistory(canvas);
            }
          });
        } else {
          console.log('No existing canvas data, loading background template');
          if (!canvas?.disposed && isMountedRef.current) {
            await loadBackgroundTemplate(canvas);
            saveToHistory(canvas);
          }
        }

        console.log('Canvas initialized successfully');
      } catch (error) {
        console.error('Error creating canvas:', error);
        if (isMountedRef.current) {
          setBackgroundError('Failed to create canvas');
          setBackgroundLoaded(true);
        }
      } finally {
        if (isMountedRef.current) {
          setIsInitializing(false);
        }
      }
    };

    initializeCanvas();

    return () => {
      console.log('Disposing canvas');
      isMountedRef.current = false;
      try {
        if (canvas && !canvas.disposed) {
          canvas.dispose();
        }
      } catch (error) {
        console.error('Error disposing canvas:', error);
      }
    };
  }, [template.id, loadBackgroundTemplate, saveToHistory]);

  const undoCanvas = () => {
    if (!fabricCanvas || !canUndo || fabricCanvas.disposed) return;

    const newIndex = historyIndex - 1;
    const stateToRestore = history[newIndex];

    if (stateToRestore) {
      fabricCanvas.off('object:modified');
      
      fabricCanvas.loadFromJSON(stateToRestore.json, () => {
        if (!fabricCanvas.disposed) {
          fabricCanvas.renderAll();
          setHistoryIndex(newIndex);
          
          fabricCanvas.on('object:modified', () => {
            if (!fabricCanvas.disposed) {
              fabricCanvas.renderAll();
              saveToHistory(fabricCanvas);
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
    if (!fabricCanvas || !canRedo || fabricCanvas.disposed) return;

    const newIndex = historyIndex + 1;
    const stateToRestore = history[newIndex];

    if (stateToRestore) {
      fabricCanvas.off('object:modified');
      
      fabricCanvas.loadFromJSON(stateToRestore.json, () => {
        if (!fabricCanvas.disposed) {
          fabricCanvas.renderAll();
          setHistoryIndex(newIndex);
          
          fabricCanvas.on('object:modified', () => {
            if (!fabricCanvas.disposed) {
              fabricCanvas.renderAll();
              saveToHistory(fabricCanvas);
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
    console.log('addQRCode called with URL:', qrUrl);
    
    if (!fabricCanvas || fabricCanvas.disposed) {
      console.error('Canvas not available');
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
      console.log('QR code generated:', qrResult);
      
      const qrImg = await FabricImage.fromURL(qrResult.dataURL);
      console.log('QR image created:', qrImg);
      
      if (qrImg && !fabricCanvas.disposed) {
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

        fabricCanvas.add(qrImg);
        fabricCanvas.setActiveObject(qrImg);
        fabricCanvas.renderAll();
        saveToHistory(fabricCanvas);
        
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
        console.log('QR code added successfully');
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
    if (!fabricCanvas || fabricCanvas.disposed) {
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

    fabricCanvas.add(textObj);
    fabricCanvas.setActiveObject(textObj);
    fabricCanvas.renderAll();
    saveToHistory(fabricCanvas);

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
    if (!fabricCanvas || fabricCanvas.disposed) {
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

    fabricCanvas.add(shape);
    fabricCanvas.setActiveObject(shape);
    fabricCanvas.renderAll();
    saveToHistory(fabricCanvas);

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
    if (!file || !fabricCanvas || fabricCanvas.disposed) {
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
        if (img && !fabricCanvas.disposed) {
          img.set({
            left: 150,
            top: 150,
            scaleX: 0.5,
            scaleY: 0.5,
            selectable: true,
            evented: true,
          });

          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.renderAll();
          saveToHistory(fabricCanvas);

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
    if (!fabricCanvas || fabricCanvas.disposed) {
      console.error('Canvas not available');
      return;
    }

    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject) {
      toast({
        title: 'No object selected',
        description: 'Please select an object to delete',
        variant: 'destructive'
      });
      return;
    }

    console.log('Deleting object:', activeObject);
    fabricCanvas.remove(activeObject);
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();
    saveToHistory(fabricCanvas);
    setSelectedObject(null);
    
    toast({
      title: 'Object deleted',
      description: 'Selected object has been removed from canvas',
    });
  };

  const updateSelectedObjectProperty = (property: string, value: any) => {
    if (!selectedObject || !fabricCanvas || fabricCanvas.disposed) return;

    console.log(`Updating property ${property} to ${value}`);
    selectedObject.set(property, value);
    fabricCanvas.renderAll();
  };

  const zoomCanvas = (direction: 'in' | 'out') => {
    if (!fabricCanvas || fabricCanvas.disposed) return;

    const newZoom = direction === 'in' ? zoom * 1.1 : zoom * 0.9;
    const clampedZoom = Math.max(0.1, Math.min(3, newZoom));
    
    fabricCanvas.setZoom(clampedZoom);
    fabricCanvas.renderAll();
    setZoom(clampedZoom);
  };

  const resetCanvas = () => {
    if (!fabricCanvas || fabricCanvas.disposed) return;

    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';
    setCanvasElements([]);
    setSelectedObject(null);
    
    loadBackgroundTemplate(fabricCanvas);
    
    fabricCanvas.renderAll();
    saveToHistory(fabricCanvas);
    
    toast({
      title: 'Canvas reset',
      description: 'Canvas has been cleared and reset',
    });
  };

  return {
    canvasRef,
    fabricCanvas,
    selectedObject,
    canvasElements,
    zoom,
    backgroundLoaded: backgroundLoaded && !isInitializing,
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
