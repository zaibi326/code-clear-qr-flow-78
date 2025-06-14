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

export const useCanvasEditor = (template: Template) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!canvasRef.current) return;

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

    // Only load existing customization JSON if it exists, don't load preview images
    if (template.editable_json) {
      try {
        canvas.loadFromJSON(template.editable_json, () => {
          canvas.renderAll();
        });
      } catch (error) {
        console.warn('Failed to load existing customization:', error);
      }
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

    // Listen for object modifications
    canvas.on('object:modified', () => {
      canvas.renderAll();
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [template.editable_json]);

  const addQRCode = async (qrUrl: string) => {
    if (!fabricCanvas) {
      console.error('Canvas not available');
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
    if (!fabricCanvas) return;

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
    if (!fabricCanvas) return;

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
    if (!file || !fabricCanvas) return;

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
    fabricCanvas.renderAll();
    
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
    addQRCode,
    addText,
    addShape,
    uploadImage,
    deleteSelected,
    updateSelectedObjectProperty,
    zoomCanvas,
    resetCanvas
  };
};
