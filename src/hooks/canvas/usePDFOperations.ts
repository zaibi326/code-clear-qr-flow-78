
import { useCallback } from 'react';
import { Canvas, IText, Rect, Circle, FabricImage } from 'fabric';

interface UsePDFOperationsProps {
  fabricCanvas: Canvas | null;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  saveState: () => void;
}

export const usePDFOperations = ({
  fabricCanvas,
  textColor,
  fontSize,
  fontFamily,
  textAlign,
  isBold,
  isItalic,
  isUnderline,
  fillColor,
  strokeColor,
  strokeWidth,
  saveState
}: UsePDFOperationsProps) => {
  const addTextAtPosition = useCallback((x: number, y: number) => {
    if (!fabricCanvas) return;
    
    const text = new IText('Click to edit text', {
      left: x,
      top: y,
      fontSize: fontSize,
      fill: textColor,
      fontFamily: fontFamily,
      textAlign: textAlign,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      underline: isUnderline,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: 4,
      cornerSize: 6,
      transparentCorners: false,
      borderColor: '#2196F3',
      cornerColor: '#2196F3'
    });
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    saveState();
  }, [fabricCanvas, fontSize, textColor, fontFamily, textAlign, isBold, isItalic, isUnderline, saveState]);

  const addNewText = useCallback(() => {
    if (!fabricCanvas) return;
    
    const text = new IText('Click to edit text', {
      left: 100,
      top: 100,
      fontSize: fontSize,
      fill: textColor,
      fontFamily: fontFamily,
      textAlign: textAlign,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      underline: isUnderline,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: 4
    });
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    saveState();
  }, [fabricCanvas, fontSize, textColor, fontFamily, textAlign, isBold, isItalic, isUnderline, saveState]);

  const addRectangle = useCallback(() => {
    if (!fabricCanvas) return;
    
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth
    });
    
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    saveState();
  }, [fabricCanvas, fillColor, strokeColor, strokeWidth, saveState]);

  const addCircle = useCallback(() => {
    if (!fabricCanvas) return;
    
    const circle = new Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth
    });
    
    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
    saveState();
  }, [fabricCanvas, fillColor, strokeColor, strokeWidth, saveState]);

  const addQRCode = useCallback(async () => {
    if (!fabricCanvas) return;
    
    try {
      const qrRect = new Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fill: '#000000',
        stroke: '#333333',
        strokeWidth: 2
      });
      
      const qrText = new IText('QR', {
        left: 120,
        top: 120,
        fontSize: 24,
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        selectable: false
      });
      
      fabricCanvas.add(qrRect);
      fabricCanvas.add(qrText);
      fabricCanvas.setActiveObject(qrRect);
      saveState();
    } catch (error) {
      console.error('Error adding QR code:', error);
    }
  }, [fabricCanvas, saveState]);

  const uploadImage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const img = await FabricImage.fromURL(e.target?.result as string);
        img.set({
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5
        });
        
        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);
        saveState();
      } catch (error) {
        console.error('Error adding image:', error);
      }
    };
    reader.readAsDataURL(file);
  }, [fabricCanvas, saveState]);

  return {
    addTextAtPosition,
    addNewText,
    addRectangle,
    addCircle,
    addQRCode,
    uploadImage
  };
};
