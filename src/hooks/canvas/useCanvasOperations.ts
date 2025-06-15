
import { useCallback } from 'react';
import { Canvas, Rect, Circle, Textbox, FabricImage, FabricObject } from 'fabric';
import { toast } from '@/hooks/use-toast';
import { generateQRCode } from '@/utils/qrCodeGenerator';
import { CanvasElement } from './useCanvasState';

export const useCanvasOperations = (
  fabricCanvasRef: React.MutableRefObject<Canvas | null>,
  saveToHistory: (canvas: Canvas) => void,
  setCanvasElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>,
  setSelectedObject: React.Dispatch<React.SetStateAction<FabricObject | null>>
) => {
  const addQRCode = useCallback(async (qrUrl: string) => {
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
  }, [fabricCanvasRef, saveToHistory, setCanvasElements]);

  const addText = useCallback((textContent: string, fontSize: number, textColor: string) => {
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
  }, [fabricCanvasRef, saveToHistory, setCanvasElements]);

  const addShape = useCallback((shapeType: 'rectangle' | 'circle') => {
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
  }, [fabricCanvasRef, saveToHistory, setCanvasElements]);

  const uploadImage = useCallback((file: File) => {
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
  }, [fabricCanvasRef, saveToHistory, setCanvasElements]);

  const deleteSelected = useCallback(() => {
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
  }, [fabricCanvasRef, saveToHistory, setSelectedObject]);

  const updateSelectedObjectProperty = useCallback((property: string, value: any, selectedObject: FabricObject | null) => {
    if (!selectedObject || !fabricCanvasRef.current || fabricCanvasRef.current.disposed) return;

    console.log(`Updating property ${property} to ${value}`);
    selectedObject.set(property, value);
    fabricCanvasRef.current.renderAll();
  }, [fabricCanvasRef]);

  const zoomCanvas = useCallback((direction: 'in' | 'out', zoom: number, setZoom: (zoom: number) => void) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || canvas.disposed) return;

    const newZoom = direction === 'in' ? zoom * 1.1 : zoom * 0.9;
    const clampedZoom = Math.max(0.1, Math.min(3, newZoom));
    
    canvas.setZoom(clampedZoom);
    canvas.renderAll();
    setZoom(clampedZoom);
  }, [fabricCanvasRef]);

  return {
    addQRCode,
    addText,
    addShape,
    uploadImage,
    deleteSelected,
    updateSelectedObjectProperty,
    zoomCanvas
  };
};
