import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, FabricObject, IText, Rect, Circle, FabricImage } from 'fabric';
import * as pdfjsLib from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Type, 
  Image, 
  Square, 
  Circle as CircleIcon, 
  QrCode, 
  Download, 
  Save, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline,
  Trash2,
  Upload,
  FileText,
  ChevronLeft,
  ChevronRight,
  Edit3,
  MousePointer,
  Highlighter
} from 'lucide-react';
import { ColorPicker } from '@/components/ui/color-picker';
import { toast } from '@/hooks/use-toast';
import { Template } from '@/types/template';

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

interface CanvasPDFEditorProps {
  template?: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

interface PDFPage {
  pageNumber: number;
  canvas: Canvas;
  thumbnail: string;
  originalImage: string;
  textContent: any[];
}

interface TextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontName: string;
  fontSize: number;
}

export const CanvasPDFEditor: React.FC<CanvasPDFEditorProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPages, setPdfPages] = useState<PDFPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [zoom, setZoom] = useState(1);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [editMode, setEditMode] = useState<'select' | 'text' | 'highlight'>('select');

  // Text editing properties
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // Shape properties
  const [fillColor, setFillColor] = useState('#3b82f6');
  const [strokeColor, setStrokeColor] = useState('#1e40af');
  const [strokeWidth, setStrokeWidth] = useState(2);

  // Initialize canvas
  useEffect(() => {
    if (mainCanvasRef.current && !fabricCanvas) {
      const canvas = new Canvas(mainCanvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff'
      });

      // Event listeners
      canvas.on('selection:created', (e) => {
        const obj = e.selected?.[0];
        setSelectedObject(obj || null);
        updatePropertyPanel(obj || null);
      });

      canvas.on('selection:updated', (e) => {
        const obj = e.selected?.[0];
        setSelectedObject(obj || null);
        updatePropertyPanel(obj || null);
      });

      canvas.on('selection:cleared', () => {
        setSelectedObject(null);
      });

      canvas.on('object:modified', () => {
        saveState();
      });

      // Double-click to edit text
      canvas.on('mouse:dblclick', (e) => {
        if (editMode === 'text' && e.target && e.target.type === 'i-text') {
          const textObj = e.target as IText;
          textObj.enterEditing();
          textObj.selectAll();
        }
      });

      // Click to add text in text mode
      canvas.on('mouse:down', (e) => {
        if (editMode === 'text' && !e.target) {
          const pointer = canvas.getPointer(e.e);
          addTextAtPosition(pointer.x, pointer.y);
        }
      });

      setFabricCanvas(canvas);

      return () => {
        canvas.dispose();
      };
    }
  }, [editMode]);

  // Load PDF from template
  useEffect(() => {
    if (template?.file && template.file.type === 'application/pdf') {
      setPdfFile(template.file);
      loadPDF(template.file);
    }
  }, [template]);

  const updatePropertyPanel = (obj: FabricObject | null) => {
    if (!obj) return;

    if (obj.type === 'i-text') {
      const textObj = obj as IText;
      setTextColor(textObj.fill as string || '#000000');
      setFontSize(textObj.fontSize || 16);
      setFontFamily(textObj.fontFamily || 'Arial');
      setTextAlign((textObj.textAlign as 'left' | 'center' | 'right') || 'left');
      setIsBold(textObj.fontWeight === 'bold');
      setIsItalic(textObj.fontStyle === 'italic');
      setIsUnderline(textObj.underline || false);
    } else if (obj.type === 'rect' || obj.type === 'circle') {
      setFillColor(obj.fill as string || '#3b82f6');
      setStrokeColor(obj.stroke as string || '#1e40af');
      setStrokeWidth(obj.strokeWidth || 2);
    }
  };

  const loadPDF = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages: PDFPage[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        
        // Render page to canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Extract text content
        const textContent = await page.getTextContent();
        const textItems: TextItem[] = textContent.items.map((item: any) => {
          const transform = item.transform;
          return {
            str: item.str,
            x: transform[4],
            y: viewport.height - transform[5], // Flip Y coordinate
            width: item.width,
            height: item.height,
            fontName: item.fontName,
            fontSize: transform[0] || 12
          };
        });

        const imageData = canvas.toDataURL('image/png');
        const thumbnailData = canvas.toDataURL('image/png', 0.3);

        pages.push({
          pageNumber: pageNum,
          canvas: new Canvas(canvas),
          thumbnail: thumbnailData,
          originalImage: imageData,
          textContent: textItems
        });
      }

      setPdfPages(pages);
      if (pages.length > 0) {
        loadPageToCanvas(0);
      }
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({
        title: 'Error loading PDF',
        description: 'Failed to load PDF file. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const loadPageToCanvas = async (pageIndex: number) => {
    if (!fabricCanvas || !pdfPages[pageIndex]) return;

    fabricCanvas.clear();
    const page = pdfPages[pageIndex];
    
    try {
      // Load background image
      const img = await FabricImage.fromURL(page.originalImage);
      img.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
        scaleX: 800 / img.width!,
        scaleY: 600 / img.height!
      });
      
      fabricCanvas.add(img);
      fabricCanvas.sendObjectToBack(img);

      // Add editable text objects from PDF text content
      const scaleX = 800 / img.width!;
      const scaleY = 600 / img.height!;

      page.textContent.forEach((textItem: TextItem) => {
        const text = new IText(textItem.str, {
          left: textItem.x * scaleX,
          top: textItem.y * scaleY,
          fontSize: textItem.fontSize * scaleX,
          fill: '#000000',
          fontFamily: 'Arial',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: 4,
          cornerSize: 6,
          transparentCorners: false,
          borderColor: '#2196F3',
          cornerColor: '#2196F3'
        });
        
        fabricCanvas.add(text);
      });
      
      fabricCanvas.renderAll();
      setCurrentPage(pageIndex);
      saveState();
    } catch (error) {
      console.error('Error loading page:', error);
    }
  };

  const addTextAtPosition = (x: number, y: number) => {
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
      padding: 4
    });
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    saveState();
  };

  const saveState = () => {
    if (!fabricCanvas) return;
    const state = JSON.stringify(fabricCanvas.toJSON());
    setUndoStack(prev => [...prev.slice(-19), state]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length > 1 && fabricCanvas) {
      const currentState = undoStack[undoStack.length - 1];
      const previousState = undoStack[undoStack.length - 2];
      
      setRedoStack(prev => [...prev, currentState]);
      setUndoStack(prev => prev.slice(0, -1));
      
      fabricCanvas.loadFromJSON(previousState, () => {
        fabricCanvas.renderAll();
      });
    }
  };

  const redo = () => {
    if (redoStack.length > 0 && fabricCanvas) {
      const nextState = redoStack[redoStack.length - 1];
      
      setUndoStack(prev => [...prev, nextState]);
      setRedoStack(prev => prev.slice(0, -1));
      
      fabricCanvas.loadFromJSON(nextState, () => {
        fabricCanvas.renderAll();
      });
    }
  };

  // Tool functions
  const addNewText = () => {
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
  };

  const addRectangle = () => {
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
  };

  const addCircle = () => {
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
  };

  const addQRCode = async () => {
    if (!fabricCanvas) return;
    
    try {
      // Create a simple QR code placeholder
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
  };

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const deleteSelected = () => {
    if (!fabricCanvas || !selectedObject) return;
    
    fabricCanvas.remove(selectedObject);
    setSelectedObject(null);
    saveState();
  };

  const updateSelectedObject = (property: string, value: any) => {
    if (!selectedObject || !fabricCanvas) return;
    
    selectedObject.set(property, value);
    fabricCanvas.renderAll();
    saveState();
  };

  const zoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 3);
    setZoom(newZoom);
    fabricCanvas?.setZoom(newZoom);
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 0.3);
    setZoom(newZoom);
    fabricCanvas?.setZoom(newZoom);
  };

  const resetZoom = () => {
    setZoom(1);
    fabricCanvas?.setZoom(1);
  };

  const exportAsPDF = () => {
    toast({
      title: 'Export PDF',
      description: 'PDF export functionality coming soon!',
    });
  };

  const exportAsImage = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    
    const link = document.createElement('a');
    link.download = `page-${currentPage + 1}.png`;
    link.href = dataURL;
    link.click();
  };

  const handleSave = () => {
    if (!fabricCanvas) return;
    
    const canvasData = fabricCanvas.toJSON();
    const updatedTemplate: Template = {
      ...template,
      id: template?.id || Date.now().toString(),
      name: template?.name || 'Edited PDF',
      type: 'pdf',
      editable_json: canvasData,
      updatedAt: new Date()
    };
    
    onSave(updatedTemplate);
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Sidebar - Tools */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">PDF Editor</h2>
          <p className="text-sm text-gray-600">Edit text directly in your PDF</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* File Upload */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-medium mb-2 block">Upload PDF</Label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPdfFile(file);
                    loadPDF(file);
                  }
                }}
                className="w-full text-sm"
              />
            </CardContent>
          </Card>

          {/* Edit Mode */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-medium mb-2 block">Edit Mode</Label>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant={editMode === 'select' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEditMode('select')}
                  className="justify-start"
                >
                  <MousePointer className="w-4 h-4 mr-2" />
                  Select
                </Button>
                <Button
                  variant={editMode === 'text' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEditMode('text')}
                  className="justify-start"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Text
                </Button>
              </div>
              {editMode === 'text' && (
                <p className="text-xs text-gray-500 mt-2">
                  Click on existing text to edit, or click anywhere to add new text
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tools */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-medium mb-2 block">Add Elements</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={addNewText}>
                  <Type className="w-4 h-4 mr-1" />
                  Text
                </Button>
                <Button variant="outline" size="sm" onClick={addRectangle}>
                  <Square className="w-4 h-4 mr-1" />
                  Rectangle
                </Button>
                <Button variant="outline" size="sm" onClick={addCircle}>
                  <CircleIcon className="w-4 h-4 mr-1" />
                  Circle
                </Button>
                <Button variant="outline" size="sm" onClick={addQRCode}>
                  <QrCode className="w-4 h-4 mr-1" />
                  QR Code
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                  className="hidden"
                  id="image-upload"
                />
                <Button variant="outline" size="sm" onClick={() => document.getElementById('image-upload')?.click()}>
                  <Image className="w-4 h-4 mr-1" />
                  Image
                </Button>
                <Button variant="outline" size="sm" onClick={deleteSelected} disabled={!selectedObject}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Page Navigation */}
          {pdfPages.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <Label className="text-sm font-medium mb-2 block">Pages</Label>
                <div className="flex items-center justify-between mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadPageToCanvas(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">
                    {currentPage + 1} / {pdfPages.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadPageToCanvas(Math.min(pdfPages.length - 1, currentPage + 1))}
                    disabled={currentPage === pdfPages.length - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {pdfPages.map((page, index) => (
                    <button
                      key={index}
                      onClick={() => loadPageToCanvas(index)}
                      className={`border-2 rounded p-1 ${
                        currentPage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={page.thumbnail}
                        alt={`Page ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={undo} disabled={undoStack.length <= 1}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={redo} disabled={redoStack.length === 0}>
              <Redo className="w-4 h-4" />
            </Button>
            <div className="h-4 w-px bg-gray-300" />
            <Button variant="outline" size="sm" onClick={zoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={zoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetZoom}>
              Reset
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportAsImage}>
              <Download className="w-4 h-4 mr-1" />
              Export PNG
            </Button>
            <Button variant="outline" onClick={exportAsPDF}>
              <FileText className="w-4 h-4 mr-1" />
              Export PDF
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-100">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <canvas
              ref={mainCanvasRef}
              className="border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Properties</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {selectedObject && (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Position</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <Label className="text-xs">X</Label>
                      <Input
                        type="number"
                        value={Math.round(selectedObject.left || 0)}
                        onChange={(e) => updateSelectedObject('left', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Y</Label>
                      <Input
                        type="number"
                        value={Math.round(selectedObject.top || 0)}
                        onChange={(e) => updateSelectedObject('top', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Size</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <Label className="text-xs">Width</Label>
                      <Input
                        type="number"
                        value={Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1))}
                        onChange={(e) => {
                          const newWidth = parseInt(e.target.value);
                          updateSelectedObject('scaleX', newWidth / (selectedObject.width || 1));
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Height</Label>
                      <Input
                        type="number"
                        value={Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1))}
                        onChange={(e) => {
                          const newHeight = parseInt(e.target.value);
                          updateSelectedObject('scaleY', newHeight / (selectedObject.height || 1));
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Rotation</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Slider
                      value={[selectedObject.angle || 0]}
                      onValueChange={(value) => updateSelectedObject('angle', value[0])}
                      max={360}
                      min={0}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm w-12">{Math.round(selectedObject.angle || 0)}°</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="style" className="space-y-4">
                {selectedObject.type === 'i-text' && (
                  <>
                    <div>
                      <Label className="text-sm font-medium">Font</Label>
                      <Select
                        value={fontFamily}
                        onValueChange={(value) => {
                          setFontFamily(value);
                          updateSelectedObject('fontFamily', value);
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          <SelectItem value="Helvetica">Helvetica</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Size</Label>
                      <Input
                        type="number"
                        value={fontSize}
                        onChange={(e) => {
                          const size = parseInt(e.target.value);
                          setFontSize(size);
                          updateSelectedObject('fontSize', size);
                        }}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Color</Label>
                      <ColorPicker
                        value={textColor}
                        onChange={(color) => {
                          setTextColor(color);
                          updateSelectedObject('fill', color);
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Alignment</Label>
                      <div className="flex space-x-1 mt-1">
                        <Button
                          variant={textAlign === 'left' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setTextAlign('left');
                            updateSelectedObject('textAlign', 'left');
                          }}
                        >
                          <AlignLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={textAlign === 'center' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setTextAlign('center');
                            updateSelectedObject('textAlign', 'center');
                          }}
                        >
                          <AlignCenter className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={textAlign === 'right' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setTextAlign('right');
                            updateSelectedObject('textAlign', 'right');
                          }}
                        >
                          <AlignRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Style</Label>
                      <div className="flex space-x-1 mt-1">
                        <Button
                          variant={isBold ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setIsBold(!isBold);
                            updateSelectedObject('fontWeight', !isBold ? 'bold' : 'normal');
                          }}
                        >
                          <Bold className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={isItalic ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setIsItalic(!isItalic);
                            updateSelectedObject('fontStyle', !isItalic ? 'italic' : 'normal');
                          }}
                        >
                          <Italic className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={isUnderline ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setIsUnderline(!isUnderline);
                            updateSelectedObject('underline', !isUnderline);
                          }}
                        >
                          <Underline className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                
                {(selectedObject.type === 'rect' || selectedObject.type === 'circle') && (
                  <>
                    <div>
                      <Label className="text-sm font-medium">Fill Color</Label>
                      <ColorPicker
                        value={fillColor}
                        onChange={(color) => {
                          setFillColor(color);
                          updateSelectedObject('fill', color);
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Stroke Color</Label>
                      <ColorPicker
                        value={strokeColor}
                        onChange={(color) => {
                          setStrokeColor(color);
                          updateSelectedObject('stroke', color);
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Stroke Width</Label>
                      <Input
                        type="number"
                        value={strokeWidth}
                        onChange={(e) => {
                          const width = parseInt(e.target.value);
                          setStrokeWidth(width);
                          updateSelectedObject('strokeWidth', width);
                        }}
                        className="mt-1"
                      />
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          )}
          
          {!selectedObject && (
            <div className="text-center text-gray-500 py-8">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select an element to edit its properties</p>
              <p className="text-xs text-gray-400 mt-1">
                Use "Edit Text" mode to modify existing PDF text
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
