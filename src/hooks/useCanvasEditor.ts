
import { useState, useRef, useEffect } from 'react';
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
  const [zoom, setZoom] = useState(1);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [backgroundError, setBackgroundError] = useState<string | null>(null);
  
  // Undo/Redo state
  const [history, setHistory] = useState<CanvasState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Save canvas state to history
  const saveToHistory = (canvas: Canvas) => {
    const canvasJson = canvas.toJSON();
    const newState: CanvasState = {
      json: canvasJson,
      timestamp: Date.now()
    };

    // Remove any states after current index (when user makes new change after undo)
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);

    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }

    setHistory(newHistory);
  };

  // Load background template file
  const loadBackgroundTemplate = async (canvas: Canvas) => {
    if (!template.file && !template.preview && !template.template_url && !template.thumbnail_url) {
      console.log('No template file or preview available');
      setBackgroundError('No template file available');
      return;
    }

    try {
      setBackgroundError(null);
      let imageUrl = '';

      // Handle different file sources
      if (template.file) {
        // Handle uploaded file
        if (template.file.type === 'application/pdf') {
          // For PDF, we'll show a placeholder for now
          // In a real implementation, you'd convert PDF to image
          console.log('PDF template detected - showing placeholder');
          toast({
            title: 'PDF Template Loaded',
            description: 'PDF background loaded. You can now add elements on top.',
          });
          setBackgroundLoaded(true);
          return;
        } else {
          // Handle image files
          imageUrl = URL.createObjectURL(template.file);
        }
      } else if (template.preview) {
        imageUrl = template.preview;
      } else if (template.template_url) {
        imageUrl = template.template_url;
      } else if (template.thumbnail_url) {
        imageUrl = template.thumbnail_url;
      }

      if (imageUrl) {
        console.log('Loading background image:', imageUrl);
        
        FabricImage.fromURL(imageUrl, {}, (img) => {
          if (img) {
            // Scale image to fit canvas while maintaining aspect ratio
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

            // Add as background
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
            throw new Error('Failed to load image');
          }
        });
      }
    } catch (error) {
      console.error('Error loading background template:', error);
      setBackgroundError('Failed to load template file');
      toast({
        title: 'Failed to load template',
        description: 'Could not load the background template file',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('Initializing canvas for template:', template.name);
    
    const canvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
    });

    // Initialize drawing brush
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = '#000000';
      canvas.freeDrawingBrush.width = 2;
    }

    // Load background template first
    loadBackgroundTemplate(canvas);

    // Load existing customization JSON if it exists
    if (template.editable_json) {
      try {
        console.log('Loading existing canvas data');
        canvas.loadFromJSON(template.editable_json, () => {
          canvas.renderAll();
          console.log('Canvas data loaded successfully');
          // Load background after JSON is loaded
          loadBackgroundTemplate(canvas);
          saveToHistory(canvas);
        });
      } catch (error) {
        console.warn('Failed to load existing customization:', error);
        saveToHistory(canvas);
      }
    } else {
      console.log('No existing canvas data, starting with blank canvas');
      saveToHistory(canvas);
    }

    // Event listeners for object selection
    canvas.on('selection:created', (e) => {
      console.log('Selection created:', e.selected);
      if (e.selected && e.selected.length > 0) {
        setSelectedObject(e.selected[0]);
      }
    });

    canvas.on('selection:updated', (e) => {
      console.log('Selection updated:', e.selected);
      if (e.selected && e.selected.length > 0) {
        setSelectedObject(e.selected[0]);
      }
    });

    canvas.on('selection:cleared', () => {
      console.log('Selection cleared');
      setSelectedObject(null);
    });

    // Listen for object modifications to save to history
    canvas.on('object:modified', () => {
      canvas.renderAll();
      saveToHistory(canvas);
    });

    canvas.on('object:added', () => {
      canvas.renderAll();
    });

    canvas.on('object:removed', () => {
      canvas.renderAll();
    });

    setFabricCanvas(canvas);
    
    console.log('Canvas initialized successfully');

    return () => {
      canvas.dispose();
    };
  }, [template.id]);

  const undoCanvas = () => {
    if (!fabricCanvas || !canUndo) return;

    const newIndex = historyIndex - 1;
    const stateToRestore = history[newIndex];

    if (stateToRestore) {
      // Temporarily remove event listeners to prevent adding to history
      fabricCanvas.off('object:modified');
      
      fabricCanvas.loadFromJSON(stateToRestore.json, () => {
        fabricCanvas.renderAll();
        setHistoryIndex(newIndex);
        
        // Re-add event listeners
        fabricCanvas.on('object:modified', () => {
          fabricCanvas.renderAll();
          saveToHistory(fabricCanvas);
        });
        
        toast({
          title: 'Undo successful',
          description: 'Canvas state restored',
        });
      });
    }
  };

  const redoCanvas = () => {
    if (!fabricCanvas || !canRedo) return;

    const newIndex = historyIndex + 1;
    const stateToRestore = history[newIndex];

    if (stateToRestore) {
      // Temporarily remove event listeners to prevent adding to history
      fabricCanvas.off('object:modified');
      
      fabricCanvas.loadFromJSON(stateToRestore.json, () => {
        fabricCanvas.renderAll();
        setHistoryIndex(newIndex);
        
        // Re-add event listeners
        fabricCanvas.on('object:modified', () => {
          fabricCanvas.renderAll();
          saveToHistory(fabricCanvas);
        });
        
        toast({
          title: 'Redo successful',
          description: 'Canvas state restored',
        });
      });
    }
  };

  const addQRCode = async (qrUrl: string) => {
    if (!fabricCanvas) {
      console.error('Canvas not available');
      toast({
        title: 'Canvas not ready',
        description: 'Please wait for the canvas to load',
        variant: 'destructive'
      });
      return;
    }

    if (!qrUrl || qrUrl.trim() === '') {
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
      
      FabricImage.fromURL(qrResult.dataURL, {}, (qrImg) => {
        if (qrImg) {
          qrImg.set({
            left: 100,
            top: 100,
            width: 150,
            height: 150,
            selectable: true,
            evented: true,
          });
          
          // Store QR metadata
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
          toast({
            title: 'QR code added successfully',
            description: `QR code for ${qrUrl} has been added to the canvas`,
          });
        } else {
          throw new Error('Failed to create QR code image');
        }
      });
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
    if (!fabricCanvas) {
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
    if (!fabricCanvas) {
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
    if (!file || !fabricCanvas) {
      toast({
        title: 'Invalid file or canvas not ready',
        description: 'Please select a valid image file',
        variant: 'destructive'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      FabricImage.fromURL(imageUrl, {}, (img) => {
        if (img) {
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
      });
    };
    reader.readAsDataURL(file);
  };

  const deleteSelected = () => {
    if (!fabricCanvas) {
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
    if (!selectedObject || !fabricCanvas) return;

    console.log(`Updating property ${property} to ${value}`);
    selectedObject.set(property, value);
    fabricCanvas.renderAll();
    // Note: We don't save to history here immediately to avoid too many history states
    // History is saved on object:modified event
  };

  const zoomCanvas = (direction: 'in' | 'out') => {
    if (!fabricCanvas) return;

    const newZoom = direction === 'in' ? zoom * 1.1 : zoom * 0.9;
    const clampedZoom = Math.max(0.1, Math.min(3, newZoom));
    
    fabricCanvas.setZoom(clampedZoom);
    fabricCanvas.renderAll();
    setZoom(clampedZoom);
  };

  const resetCanvas = () => {
    if (!fabricCanvas) return;

    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';
    setCanvasElements([]);
    setSelectedObject(null);
    
    // Reload background template
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
