import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Type, 
  Square, 
  Circle, 
  MousePointer, 
  Upload,
  Download,
  Undo,
  Redo,
  Trash2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  QrCode,
  Layers,
  Settings,
  Triangle,
  Star,
  Palette
} from 'lucide-react';
import { useCanvaStylePDFEditor } from '@/hooks/canvas/useCanvaStylePDFEditor';
import { CanvaStyleTextEditor } from './components/CanvaStyleTextEditor';
import { CanvaStyleShapeRenderer } from './components/CanvaStyleShapeRenderer';
import { CanvaStyleImageRenderer } from './components/CanvaStyleImageRenderer';
import { CanvaStyleQRCodeRenderer } from './components/CanvaStyleQRCodeRenderer';
import { CanvaStyleLayersPanel } from './components/CanvaStyleLayersPanel';
import { CanvaStyleExportPanel } from './components/CanvaStyleExportPanel';
import { toast } from '@/hooks/use-toast';

interface CanvaStylePDFEditorProps {
  template?: any;
  onSave?: () => void;
  onCancel?: () => void;
}

export const CanvaStylePDFEditor: React.FC<CanvaStylePDFEditorProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const [zoom, setZoom] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(template?.file || null);
  const [activeSidebarTab, setActiveSidebarTab] = useState('tools');
  const [selectedTool, setSelectedTool] = useState<'select' | 'text' | 'rectangle' | 'circle' | 'image' | 'qr' | 'triangle' | 'star'>('select');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    pdfDocument,
    pdfPages,
    currentPage,
    setCurrentPage,
    isLoading,
    textElements,
    shapes,
    images,
    selectedElementId,
    setSelectedElementId,
    canUndo,
    canRedo,
    loadPDF,
    updateTextElement,
    addTextElement,
    addShape,
    addImage,
    deleteElement,
    undo,
    redo,
    exportPDF,
    qrCodes,
    layers,
    isExporting,
    addQRCode,
    updateQRCode,
    handleLayerToggleVisibility,
    handleLayerToggleLock,
    handleLayerMove,
    duplicateElement,
    exportWithOptions
  } = useCanvaStylePDFEditor();

  // Auto-load PDF from template
  React.useEffect(() => {
    if (template?.file && template.file.type === 'application/pdf') {
      console.log('Auto-loading PDF from template:', template.name || 'Unnamed PDF');
      loadPDF(template.file);
      setSelectedFile(template.file);
    }
  }, [template, loadPDF]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      loadPDF(file);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please select a PDF file.',
        variant: 'destructive'
      });
    }
  };

  // ENHANCED: Better canvas click handler with improved delegation
  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only handle clicks on the canvas background, not on text elements
    if (event.target !== event.currentTarget) {
      console.log('Click intercepted by child element, not handling canvas click');
      return;
    }

    console.log('Canvas background clicked - tool:', selectedTool);
    
    if (pdfPages.length === 0) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom;
    const y = (event.clientY - rect.top) / zoom;
    
    console.log('Canvas click coordinates:', { x, y, zoom });
    
    if (selectedTool === 'text') {
      console.log('Adding new text element at:', x, y);
      const newTextId = addTextElement(currentPage + 1, x, y, 'Click to edit');
      setSelectedTool('select');
      console.log('Created new text element:', newTextId);
    } else if (selectedTool === 'rectangle') {
      addShape(currentPage + 1, 'rectangle', x, y);
      setSelectedTool('select');
    } else if (selectedTool === 'circle') {
      addShape(currentPage + 1, 'circle', x, y);
      setSelectedTool('select');
    } else if (selectedTool === 'qr') {
      addQRCode(currentPage + 1, x, y, 'https://example.com');
      setSelectedTool('select');
    } else if (selectedTool === 'select') {
      // Deselect when clicking on empty canvas
      console.log('Deselecting element - clicking on empty canvas');
      setSelectedElementId(null);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      addImage(currentPage + 1, file, 100, 100);
      event.target.value = '';
    }
  };

  // Enhanced selected element detection with proper type checking
  const selectedElement = selectedElementId ? 
    textElements.get(selectedElementId) || 
    shapes.get(selectedElementId) || 
    images.get(selectedElementId) ||
    qrCodes.get(selectedElementId) : null;

  const currentPageData = pdfPages[currentPage];
  const currentPageTextElements = Array.from(textElements.values()).filter((el: any) => el.pageNumber === currentPage + 1);
  const currentPageShapes = Array.from(shapes.values()).filter((shape: any) => shape.pageNumber === currentPage + 1);
  const currentPageImages = Array.from(images.values()).filter((img: any) => img.pageNumber === currentPage + 1);
  const currentPageQRCodes = Array.from(qrCodes.values()).filter((qr: any) => qr.pageNumber === currentPage + 1);

  // ENHANCED: Better debug logging
  React.useEffect(() => {
    console.log('=== CANVA PDF EDITOR STATE ===');
    console.log('Total text elements in state:', textElements.size);
    console.log('Current page text elements:', currentPageTextElements.length);
    console.log('Selected element ID:', selectedElementId);
    console.log('Selected element:', selectedElement);
    console.log('Current tool:', selectedTool);
    console.log('PDF pages loaded:', pdfPages.length);
    if (currentPageTextElements.length > 0) {
      console.log('Sample text elements:', currentPageTextElements.slice(0, 3).map(el => ({
        id: el.id,
        text: el.text.substring(0, 20),
        x: el.x,
        y: el.y
      })));
    }
    console.log('=============================');
  }, [textElements.size, currentPageTextElements.length, selectedElementId, selectedTool, pdfPages.length]);

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Left Sidebar - Enhanced with Tabs */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Canva-Style PDF Editor</h2>
          <p className="text-sm text-gray-600">Professional PDF editing with selectable text</p>
          {/* ENHANCED Debug info */}
          <div className="text-xs text-gray-500 mt-2 space-y-1 bg-gray-50 p-2 rounded">
            <div className="font-semibold">Debug Info:</div>
            <div>Total Text Elements: {textElements.size}</div>
            <div>Current Page Elements: {currentPageTextElements.length}</div>
            <div>Selected Tool: <span className="font-medium text-blue-600">{selectedTool}</span></div>
            <div>Selected Element: {selectedElementId ? 'Yes' : 'None'}</div>
            <div>PDF Loaded: {pdfPages.length > 0 ? 'Yes' : 'No'}</div>
          </div>
        </div>

        {/* Sidebar Tabs */}
        <Tabs value={activeSidebarTab} onValueChange={setActiveSidebarTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="tools" className="text-xs">
              <Settings className="w-3 h-3 mr-1" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="layers" className="text-xs">
              <Layers className="w-3 h-3 mr-1" />
              Layers
            </TabsTrigger>
            <TabsTrigger value="export" className="text-xs">
              <Download className="w-3 h-3 mr-1" />
              Export
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="tools" className="p-4 space-y-4 mt-0">
              {/* Enhanced Tool Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Design Tools</Label>
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    size="sm"
                    variant={selectedTool === 'select' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('select')}
                    className="h-12 flex flex-col items-center justify-center gap-1"
                  >
                    <MousePointer className="w-4 h-4" />
                    <span className="text-xs">Select</span>
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedTool === 'text' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('text')}
                    className="h-12 flex flex-col items-center justify-center gap-1"
                  >
                    <Type className="w-4 h-4" />
                    <span className="text-xs">Text</span>
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedTool === 'qr' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('qr')}
                    className="h-12 flex flex-col items-center justify-center gap-1"
                  >
                    <QrCode className="w-4 h-4" />
                    <span className="text-xs">QR Code</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="h-12 flex flex-col items-center justify-center gap-1"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-xs">Image</span>
                  </Button>
                </div>
                
                {/* Shape Tools */}
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <Button
                    size="sm"
                    variant={selectedTool === 'rectangle' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('rectangle')}
                    className="h-12 flex flex-col items-center justify-center gap-1"
                  >
                    <Square className="w-4 h-4" />
                    <span className="text-xs">Rect</span>
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedTool === 'circle' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('circle')}
                    className="h-12 flex flex-col items-center justify-center gap-1"
                  >
                    <Circle className="w-4 h-4" />
                    <span className="text-xs">Circle</span>
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedTool === 'triangle' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('triangle')}
                    className="h-12 flex flex-col items-center justify-center gap-1"
                  >
                    <Triangle className="w-4 h-4" />
                    <span className="text-xs">Triangle</span>
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedTool === 'star' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('star')}
                    className="h-12 flex flex-col items-center justify-center gap-1"
                  >
                    <Star className="w-4 h-4" />
                    <span className="text-xs">Star</span>
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Enhanced Element Properties */}
              {selectedElement && 'text' in selectedElement && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Text Properties</Label>
                  
                  {/* Font Size and Color Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-600">Font Size</Label>
                      <Input
                        type="number"
                        value={selectedElement.fontSize}
                        onChange={(e) => updateTextElement(selectedElementId!, { fontSize: parseInt(e.target.value) || 16 })}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={selectedElement.color}
                          onChange={(e) => updateTextElement(selectedElementId!, { color: e.target.value })}
                          className="h-8 w-12 p-1"
                        />
                        <Input
                          type="text"
                          value={selectedElement.color}
                          onChange={(e) => updateTextElement(selectedElementId!, { color: e.target.value })}
                          className="h-8 flex-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Font Family */}
                  <div>
                    <Label className="text-xs text-gray-600">Font Family</Label>
                    <Select
                      value={selectedElement.fontFamily}
                      onValueChange={(value) => updateTextElement(selectedElementId!, { fontFamily: value })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Courier New">Courier New</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Text Style Controls */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedElement.fontWeight === 'bold' ? 'default' : 'outline'}
                      onClick={() => updateTextElement(selectedElementId!, { 
                        fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' 
                      })}
                      className="flex-1"
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
                      onClick={() => updateTextElement(selectedElementId!, { 
                        fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' 
                      })}
                      className="flex-1"
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Text Alignment */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedElement.textAlign === 'left' ? 'default' : 'outline'}
                      onClick={() => updateTextElement(selectedElementId!, { textAlign: 'left' })}
                      className="flex-1"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedElement.textAlign === 'center' ? 'default' : 'outline'}
                      onClick={() => updateTextElement(selectedElementId!, { textAlign: 'center' })}
                      className="flex-1"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedElement.textAlign === 'right' ? 'default' : 'outline'}
                      onClick={() => updateTextElement(selectedElementId!, { textAlign: 'right' })}
                      className="flex-1"
                    >
                      <AlignRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* QR Code Properties */}
              {selectedElement && 'content' in selectedElement && 'foregroundColor' in selectedElement && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">QR Code Properties</Label>
                  <div>
                    <Label className="text-xs text-gray-600">Content</Label>
                    <Input
                      type="text"
                      value={String(selectedElement.content)}
                      onChange={(e) => updateQRCode(selectedElementId!, { content: e.target.value })}
                      className="h-8"
                      placeholder="Enter URL or text"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-600">Foreground</Label>
                      <Input
                        type="color"
                        value={selectedElement.foregroundColor}
                        onChange={(e) => updateQRCode(selectedElementId!, { foregroundColor: e.target.value })}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Background</Label>
                      <Input
                        type="color"
                        value={selectedElement.backgroundColor}
                        onChange={(e) => updateQRCode(selectedElementId!, { backgroundColor: e.target.value })}
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Actions */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={undo} disabled={!canUndo} className="flex-1">
                    <Undo className="w-4 h-4 mr-1" />
                    Undo
                  </Button>
                  <Button size="sm" variant="outline" onClick={redo} disabled={!canRedo} className="flex-1">
                    <Redo className="w-4 h-4 mr-1" />
                    Redo
                  </Button>
                </div>
                
                {selectedElementId && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => duplicateElement(selectedElementId)}
                      className="flex-1"
                    >
                      Duplicate
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteElement(selectedElementId)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="layers" className="p-4 mt-0">
              <CanvaStyleLayersPanel
                layers={layers}
                selectedLayerId={selectedElementId}
                onLayerSelect={setSelectedElementId}
                onLayerToggleVisibility={handleLayerToggleVisibility}
                onLayerToggleLock={handleLayerToggleLock}
                onLayerDelete={deleteElement}
                onLayerDuplicate={duplicateElement}
                onLayerMove={handleLayerMove}
              />
            </TabsContent>

            <TabsContent value="export" className="p-4 mt-0">
              <CanvaStyleExportPanel
                onExport={exportWithOptions}
                isExporting={isExporting}
                currentPage={currentPage}
                totalPages={pdfPages.length}
              />
            </TabsContent>
          </div>
        </Tabs>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200">
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full mb-2">
            <Upload className="w-4 h-4 mr-2" />
            Upload PDF
          </Button>
          {onSave && (
            <Button onClick={onSave} variant="outline" className="w-full">
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.1))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setZoom(1)}>
              <Maximize2 className="w-4 h-4 mr-1" />
              Fit
            </Button>
          </div>
          
          {pdfPages.length > 1 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {pdfPages.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(pdfPages.length - 1, currentPage + 1))}
                disabled={currentPage === pdfPages.length - 1}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 overflow-auto p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Processing PDF for Canva-style editing...</p>
                <p className="text-sm text-gray-500">Rendering background without text layer...</p>
                <p className="text-sm text-gray-500">Extracting selectable text elements...</p>
              </div>
            </div>
          ) : pdfPages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8 max-w-md">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Upload a PDF to Get Started
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Experience true Canva-style editing with selectable text elements overlay.
                </p>
                <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose PDF File
                </Button>
              </div>
            </div>
          ) : currentPageData ? (
            <div className="flex items-center justify-center min-h-full">
              <div 
                className="bg-white rounded-lg shadow-lg relative pdf-canvas"
                style={{
                  width: currentPageData.width * zoom,
                  height: currentPageData.height * zoom,
                  minWidth: 'fit-content',
                  minHeight: 'fit-content',
                  cursor: selectedTool === 'select' ? 'default' : 'crosshair'
                }}
                onClick={handleCanvasClick}
              >
                {/* FIXED: Background image - PDF rendered WITHOUT text layer */}
                <div 
                  className="w-full h-full relative overflow-hidden rounded-lg"
                  style={{
                    background: `url(${currentPageData.backgroundImage}) no-repeat center center`,
                    backgroundSize: 'cover',
                    pointerEvents: 'none'
                  }}
                />
                
                {/* ENHANCED: Debug overlay for development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white p-2 rounded text-xs z-50">
                    Page {currentPage + 1} | Elements: {currentPageTextElements.length} | Tool: {selectedTool}
                  </div>
                )}
                
                {/* CRITICAL: Editable text overlay - ONLY source of visible text */}
                {currentPageTextElements.map((textElement) => (
                  <CanvaStyleTextEditor
                    key={textElement.id}
                    textElement={textElement}
                    scale={zoom}
                    isSelected={selectedElementId === textElement.id}
                    onSelect={() => {
                      console.log('Text element selected via onSelect:', textElement.id, textElement.text);
                      setSelectedElementId(textElement.id);
                    }}
                    onUpdate={updateTextElement}
                  />
                ))}

                {/* Shape overlay */}
                {currentPageShapes.map((shape) => (
                  <CanvaStyleShapeRenderer
                    key={shape.id}
                    shape={shape}
                    scale={zoom}
                    isSelected={selectedElementId === shape.id}
                    onSelect={() => setSelectedElementId(shape.id)}
                  />
                ))}

                {/* Image overlay */}
                {currentPageImages.map((image) => (
                  <CanvaStyleImageRenderer
                    key={image.id}
                    image={image}
                    scale={zoom}
                    isSelected={selectedElementId === image.id}
                    onSelect={() => setSelectedElementId(image.id)}
                  />
                ))}

                {/* QR Code overlay */}
                {currentPageQRCodes.map((qr) => (
                  <CanvaStyleQRCodeRenderer
                    key={qr.id}
                    qrCode={qr}
                    scale={zoom}
                    isSelected={selectedElementId === qr.id}
                    onSelect={() => setSelectedElementId(qr.id)}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
