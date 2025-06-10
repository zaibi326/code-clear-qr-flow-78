
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Canvas as FabricCanvas, FabricObject, Rect, Circle, Textbox, FabricImage } from 'fabric';
import { 
  Type, 
  Square, 
  Circle as CircleIcon, 
  Image as ImageIcon, 
  QrCode, 
  Undo, 
  Redo, 
  RotateCcw, 
  Save, 
  Download,
  ZoomIn,
  ZoomOut,
  Move,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { generateQRCode } from '@/utils/qrCodeGenerator';
import { Template } from '@/types/template';

interface TemplateCustomizerProps {
  template: Template;
  onSave: (customizedTemplate: Template) => void;
  onCancel: () => void;
}

interface CanvasElement {
  id: string;
  type: 'qr' | 'text' | 'shape' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, any>;
}

export const TemplateCustomizer = ({ template, onSave, onCancel }: TemplateCustomizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [qrUrl, setQrUrl] = useState('https://example.com');
  const [textContent, setTextContent] = useState('Sample Text');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(20);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
    });

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
        canvas.sendToBack(img);
      });
    }

    // Set up event listeners
    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected[0]);
    });

    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected[0]);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [template.preview]);

  const addQRCode = async () => {
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

  const addText = () => {
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

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
        fabricCanvas.sendToBack(img);
      });
    }
    
    toast.success('Canvas reset');
  };

  const saveTemplate = async () => {
    if (!fabricCanvas) return;

    try {
      // Generate canvas as image
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1,
      });

      // Create updated template with customizations
      const customizedTemplate: Template = {
        ...template,
        preview: dataURL,
        qrPosition: canvasElements.find(el => el.type === 'qr') || template.qrPosition,
        updatedAt: new Date()
      };

      onSave(customizedTemplate);
      toast.success('Template saved successfully');
    } catch (error) {
      toast.error('Failed to save template');
    }
  };

  const downloadTemplate = () => {
    if (!fabricCanvas) return;

    const link = document.createElement('a');
    link.download = `${template.name}-customized.png`;
    link.href = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
    });
    link.click();
    
    toast.success('Template downloaded');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Customizer</h1>
          <p className="text-gray-600">Customize your template with drag-and-drop tools</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Toolbar */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Elements */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Add Elements</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addQRCode}
                      className="flex flex-col h-16 p-2"
                    >
                      <QrCode className="h-4 w-4 mb-1" />
                      <span className="text-xs">QR Code</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addText}
                      className="flex flex-col h-16 p-2"
                    >
                      <Type className="h-4 w-4 mb-1" />
                      <span className="text-xs">Text</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addShape('rectangle')}
                      className="flex flex-col h-16 p-2"
                    >
                      <Square className="h-4 w-4 mb-1" />
                      <span className="text-xs">Rectangle</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addShape('circle')}
                      className="flex flex-col h-16 p-2"
                    >
                      <CircleIcon className="h-4 w-4 mb-1" />
                      <span className="text-xs">Circle</span>
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={uploadImage}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center gap-2"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Upload Image
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Canvas Controls */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Canvas</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => zoomCanvas('in')}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => zoomCanvas('out')}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetCanvas}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deleteSelected}
                      disabled={!selectedObject}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Quick Settings */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Quick Settings</Label>
                  
                  <div>
                    <Label className="text-xs">QR URL</Label>
                    <Input
                      value={qrUrl}
                      onChange={(e) => setQrUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Text Content</Label>
                    <Input
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Enter text"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Canvas Area */}
          <div className="col-span-8">
            <Card>
              <CardContent className="p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                  <canvas
                    ref={canvasRef}
                    className="border border-gray-200 rounded shadow-sm mx-auto block"
                  />
                  <div className="text-center mt-4 text-sm text-gray-500">
                    Zoom: {Math.round(zoom * 100)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Properties Panel */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedObject ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Width</Label>
                      <Input
                        type="number"
                        value={Math.round(selectedObject.width || 0)}
                        onChange={(e) => updateSelectedObjectProperty('width', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs">Height</Label>
                      <Input
                        type="number"
                        value={Math.round(selectedObject.height || 0)}
                        onChange={(e) => updateSelectedObjectProperty('height', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    
                    {selectedObject.type === 'textbox' && (
                      <>
                        <div>
                          <Label className="text-xs">Font Size</Label>
                          <Input
                            type="number"
                            value={selectedObject.fontSize || 20}
                            onChange={(e) => updateSelectedObjectProperty('fontSize', parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-xs">Color</Label>
                          <input
                            type="color"
                            value={selectedObject.fill as string || '#000000'}
                            onChange={(e) => updateSelectedObjectProperty('fill', e.target.value)}
                            className="mt-1 w-full h-8 rounded border"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 text-sm">
                    Select an object to edit properties
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="mt-4">
              <CardContent className="p-4 space-y-3">
                <Button onClick={saveTemplate} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
                
                <Button onClick={downloadTemplate} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                
                <Button onClick={onCancel} variant="outline" className="w-full">
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
