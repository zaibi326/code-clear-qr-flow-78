
import { useState, useRef, useEffect } from 'react';
import { Canvas, Rect, Circle, Textbox, FabricImage, FabricObject } from 'fabric';
import { toast } from 'sonner';
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

    // Initialize the freeDrawingBrush properly for Fabric.js v6
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = '#000000';
      canvas.freeDrawingBrush.width = 2;
    }

    // Load template background if available
    if (template.preview) {
      FabricImage.fromURL(template.preview).then((img) => {
        img.set({
          left: 0,
          top: 0,
          selectable: false,
          evented: false,
        });
        img.scaleToWidth(800);
        canvas.add(img);
        canvas.sendObjectToBack(img);
      });
    }

    // Set up event listeners
    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [template.preview]);

  const addQRCode = async (qrUrl: string) => {
    if (!fabricCanvas) return;

    try {
      const qrResult = await generateQRCode(qrUrl, { size: 100 });
      
      FabricImage.fromURL(qrResult.dataURL).then((qrImg) => {
        qrImg.set({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
        });
        
        // Store QR metadata
        qrImg.set('qrData', {
          url: qrUrl,
          type: 'qr'
        });

        fabricCanvas.add(qrImg);
        fabricCanvas.setActiveObject(qrImg);
        
        const newElement: CanvasElement = {
          id: `qr-${Date.now()}`,
          type: 'qr',
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          properties: { url: qrUrl }
        };
        
        setCanvasElements(prev => [...prev, newElement]);
        toast.success('QR code added to canvas');
      });
    } catch (error) {
      toast.error('Failed to generate QR code');
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
    });

    fabricCanvas.add(textObj);
    fabricCanvas.setActiveObject(textObj);

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
    toast.success('Text added to canvas');
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
      });
    } else {
      shape = new Circle({
        left: 300,
        top: 300,
        radius: 50,
        fill: '#EF4444',
        stroke: '#DC2626',
        strokeWidth: 2,
      });
    }

    fabricCanvas.add(shape);
    fabricCanvas.setActiveObject(shape);

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
    toast.success(`${shapeType} added to canvas`);
  };

  const uploadImage = (file: File) => {
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      FabricImage.fromURL(imageUrl).then((img) => {
        img.set({
          left: 150,
          top: 150,
          scaleX: 0.5,
          scaleY: 0.5,
        });

        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);

        const newElement: CanvasElement = {
          id: `image-${Date.now()}`,
          type: 'image',
          x: 150,
          y: 150,
          width: img.width! * 0.5,
          height: img.height! * 0.5,
          properties: { src: imageUrl }
        };

        setCanvasElements(prev => [...prev, newElement]);
        toast.success('Image added to canvas');
      });
    };
    reader.readAsDataURL(file);
  };

  const deleteSelected = () => {
    if (!fabricCanvas || !selectedObject) return;

    fabricCanvas.remove(selectedObject);
    setSelectedObject(null);
    toast.success('Object deleted');
  };

  const updateSelectedObjectProperty = (property: string, value: any) => {
    if (!selectedObject) return;

    selectedObject.set(property, value);
    fabricCanvas?.renderAll();
  };

  const zoomCanvas = (direction: 'in' | 'out') => {
    if (!fabricCanvas) return;

    const newZoom = direction === 'in' ? zoom * 1.1 : zoom * 0.9;
    const clampedZoom = Math.max(0.1, Math.min(3, newZoom));
    
    fabricCanvas.setZoom(clampedZoom);
    setZoom(clampedZoom);
  };

  const resetCanvas = () => {
    if (!fabricCanvas) return;

    fabricCanvas.clear();
    setCanvasElements([]);
    setSelectedObject(null);
    
    // Reload template background
    if (template.preview) {
      FabricImage.fromURL(template.preview).then((img) => {
        img.set({
          left: 0,
          top: 0,
          selectable: false,
          evented: false,
        });
        img.scaleToWidth(800);
        fabricCanvas.add(img);
        fabricCanvas.sendObjectToBack(img);
      });
    }
    
    toast.success('Canvas reset');
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
