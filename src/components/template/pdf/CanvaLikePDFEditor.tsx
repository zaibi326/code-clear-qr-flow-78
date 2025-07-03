import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Save,
  Upload,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Triangle,
  Star,
  ArrowRight,
  Highlighter,
  Maximize2,
  Move,
  RotateCw,
  Copy,
  Trash2,
  QrCode
} from 'lucide-react';
import { usePDFWordEditor } from '@/hooks/canvas/usePDFWordEditor';
import { EditableWord } from './EditableWord';
import { EnhancedPDFSidebar } from './components/EnhancedPDFSidebar';
import { PDFPageNavigation } from './components/PDFPageNavigation';
import { QRCodeGenerator } from './components/QRCodeGenerator';
import { toast } from '@/hooks/use-toast';
import { Template } from '@/types/template';
import { generateQRCode } from '@/utils/qrCodeGenerator';

interface PDFWord {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
  color: { r: number; g: number; b: number };
  pageNumber: number;
  isEdited: boolean;
  originalText?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  spaceAfter?: boolean;
}

interface CanvaElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'annotation';
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
  properties: any;
  rotation?: number;
  visible: boolean;
  locked: boolean;
}

interface Layer {
  id: string;
  name: string;
  type: 'text' | 'shape' | 'image' | 'qr';
  visible: boolean;
  locked: boolean;
  pageNumber: number;
}

interface CanvaLikePDFEditorProps {
  onSave?: () => void;
  onCancel?: () => void;
  template?: Template;
  hideFileUpload?: boolean;
}

export const CanvaLikePDFEditor: React.FC<CanvaLikePDFEditorProps> = ({
  onSave,
  onCancel,
  template,
  hideFileUpload = false
}) => {
  const [zoom, setZoom] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(template?.file || null);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [canvaElements, setCanvaElements] = useState<Map<string, CanvaElement>>(new Map());
  const [layers, setLayers] = useState<Layer[]>([]);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    startPos: { x: number; y: number };
    elementId?: string;
  }>({ isDragging: false, startPos: { x: 0, y: 0 } });
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    pdfDocument,
    pdfPages,
    currentPage,
    setCurrentPage,
    isLoading,
    editedWords,
    loadPDF,
    updateWord,
    deleteWord,
    exportPDF
  } = usePDFWordEditor();

  useEffect(() => {
    if (pdfPages.length > 0 && !isLoading) {
      toast({
        title: 'PDF Loaded Successfully',
        description: 'Ready for Canva-style editing! Add text, images, shapes, and annotations.',
      });
    }
  }, [pdfPages.length, isLoading]);

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

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    setSelectedElement(null);
    
    if (tool === 'qr') {
      setShowQRGenerator(true);
    }
  };

  const handleQRCodeGeneration = async (url: string, size: number = 150) => {
    try {
      const qrResult = await generateQRCode(url, { size });
      
      const elementId = `qr-${Date.now()}`;
      const newElement: CanvaElement = {
        id: elementId,
        type: 'image',
        x: 100,
        y: 100,
        width: size,
        height: size,
        pageNumber: currentPage + 1,
        properties: {
          src: qrResult.dataURL,
          qrUrl: url,
          isQRCode: true,
          opacity: 1
        },
        rotation: 0,
        visible: true,
        locked: false
      };

      setCanvaElements(prev => {
        const newMap = new Map(prev);
        newMap.set(elementId, newElement);
        return newMap;
      });

      const newLayer: Layer = {
        id: elementId,
        name: `QR Code (${url.substring(0, 20)}...)`,
        type: 'qr',
        visible: true,
        locked: false,
        pageNumber: currentPage + 1
      };

      setLayers(prev => [...prev, newLayer]);
      setSelectedElement(elementId);
      setSelectedTool('select');
      setShowQRGenerator(false);

      toast({
        title: 'QR Code Added',
        description: `QR code for ${url} has been added to the PDF.`,
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: 'QR Code Generation Failed',
        description: 'Please try again with a valid URL.',
        variant: 'destructive'
      });
    }
  };

  const addCanvaElement = (type: string, x: number, y: number) => {
    if (type === 'qr') {
      setShowQRGenerator(true);
      return;
    }

    const elementId = `${type}-${Date.now()}`;
    let properties = {};
    let width = 100;
    let height = 100;

    switch (type) {
      case 'text':
        properties = {
          text: 'Double-click to edit',
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#000000',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textAlign: 'left',
          textDecoration: 'none'
        };
        width = 200;
        height = 30;
        break;
      case 'rectangle':
        properties = {
          fill: '#3B82F6',
          stroke: '#1E40AF',
          strokeWidth: 2,
          cornerRadius: 0
        };
        break;
      case 'circle':
        properties = {
          fill: '#10B981',
          stroke: '#047857',
          strokeWidth: 2
        };
        break;
      case 'triangle':
        properties = {
          fill: '#F59E0B',
          stroke: '#D97706',
          strokeWidth: 2
        };
        break;
      case 'star':
        properties = {
          fill: '#EF4444',
          stroke: '#DC2626',
          strokeWidth: 2,
          points: 5
        };
        break;
      case 'arrow':
        properties = {
          stroke: '#6B7280',
          strokeWidth: 3,
          fill: 'none'
        };
        width = 150;
        height = 50;
        break;
      case 'highlight':
        properties = {
          fill: '#FEF08A',
          opacity: 0.5
        };
        width = 200;
        height = 20;
        break;
    }

    const newElement: CanvaElement = {
      id: elementId,
      type: type as any,
      x,
      y,
      width,
      height,
      pageNumber: currentPage + 1,
      properties,
      rotation: 0,
      visible: true,
      locked: false
    };

    setCanvaElements(prev => {
      const newMap = new Map(prev);
      newMap.set(elementId, newElement);
      return newMap;
    });

    // Add to layers
    const newLayer: Layer = {
      id: elementId,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${layers.length + 1}`,
      type: type as any,
      visible: true,
      locked: false,
      pageNumber: currentPage + 1
    };

    setLayers(prev => [...prev, newLayer]);
    setSelectedElement(elementId);
    setSelectedTool('select');

    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Added`,
      description: 'Click and drag to reposition, or use the properties panel to customize.',
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const elementId = `image-${Date.now()}`;
        
        const newElement: CanvaElement = {
          id: elementId,
          type: 'image',
          x: 100,
          y: 100,
          width: 200,
          height: 150,
          pageNumber: currentPage + 1,
          properties: {
            src: imageUrl,
            opacity: 1,
            filters: {}
          },
          rotation: 0,
          visible: true,
          locked: false
        };

        setCanvaElements(prev => {
          const newMap = new Map(prev);
          newMap.set(elementId, newElement);
          return newMap;
        });

        const newLayer: Layer = {
          id: elementId,
          name: `Image ${layers.length + 1}`,
          type: 'image',
          visible: true,
          locked: false,
          pageNumber: currentPage + 1
        };

        setLayers(prev => [...prev, newLayer]);
        setSelectedElement(elementId);

        toast({
          title: 'Image Added',
          description: 'Image uploaded and added to the PDF. Resize and reposition as needed.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (selectedTool === 'select') return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - panOffset.x) / zoom;
    const y = (event.clientY - rect.top - panOffset.y) / zoom;

    if (selectedTool === 'image') {
      // Trigger file upload for images
      const imageInput = document.createElement('input');
      imageInput.type = 'file';
      imageInput.accept = 'image/*';
      imageInput.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files?.[0]) {
          handleImageUpload({ target } as any);
        }
      };
      imageInput.click();
    } else if (selectedTool === 'qr') {
      setShowQRGenerator(true);
    } else {
      addCanvaElement(selectedTool, x, y);
    }
  };

  const handleElementMouseDown = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedElement(elementId);
    setDragState({
      isDragging: true,
      startPos: { x: event.clientX, y: event.clientY },
      elementId
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.elementId) return;

    const deltaX = (event.clientX - dragState.startPos.x) / zoom;
    const deltaY = (event.clientY - dragState.startPos.y) / zoom;

    setCanvaElements(prev => {
      const newMap = new Map(prev);
      const element = newMap.get(dragState.elementId!);
      if (element) {
        newMap.set(dragState.elementId!, {
          ...element,
          x: element.x + deltaX,
          y: element.y + deltaY
        });
      }
      return newMap;
    });

    setDragState(prev => ({
      ...prev,
      startPos: { x: event.clientX, y: event.clientY }
    }));
  };

  const handleMouseUp = () => {
    setDragState({ isDragging: false, startPos: { x: 0, y: 0 } });
  };

  const handleElementDelete = (elementId: string) => {
    setCanvaElements(prev => {
      const newMap = new Map(prev);
      newMap.delete(elementId);
      return newMap;
    });

    setLayers(prev => prev.filter(layer => layer.id !== elementId));
    setSelectedElement(null);

    toast({
      title: 'Element Deleted',
      description: 'The selected element has been removed.',
    });
  };

  const regenerateQRCode = async (elementId: string, newUrl: string) => {
    const element = canvaElements.get(elementId);
    if (!element || !element.properties.isQRCode) return;

    try {
      const qrResult = await generateQRCode(newUrl, { size: element.width });
      
      setCanvaElements(prev => {
        const newMap = new Map(prev);
        const updatedElement = { ...element };
        updatedElement.properties = {
          ...updatedElement.properties,
          src: qrResult.dataURL,
          qrUrl: newUrl
        };
        newMap.set(elementId, updatedElement);
        return newMap;
      });

      // Update layer name
      setLayers(prev => prev.map(layer => 
        layer.id === elementId 
          ? { ...layer, name: `QR Code (${newUrl.substring(0, 20)}...)` }
          : layer
      ));

      toast({
        title: 'QR Code Updated',
        description: `QR code updated with new URL: ${newUrl}`,
      });
    } catch (error) {
      toast({
        title: 'QR Code Update Failed',
        description: 'Please try again with a valid URL.',
        variant: 'destructive'
      });
    }
  };

  const handleLayerToggleVisibility = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));

    setCanvaElements(prev => {
      const newMap = new Map(prev);
      const element = newMap.get(layerId);
      if (element) {
        newMap.set(layerId, { ...element, visible: !element.visible });
      }
      return newMap;
    });
  };

  const handleLayerToggleLock = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
    ));

    setCanvaElements(prev => {
      const newMap = new Map(prev);
      const element = newMap.get(layerId);
      if (element) {
        newMap.set(layerId, { ...element, locked: !element.locked });
      }
      return newMap;
    });
  };

  const handleLayerSelect = (layerId: string) => {
    setSelectedElement(layerId);
  };

  const handleFitToScreen = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const getUnifiedWords = (): PDFWord[] => {
    const currentPageData = pdfPages[currentPage];
    if (!currentPageData) return [];

    const originalWords = currentPageData.words || [];
    const editedWordsForPage = Array.from(editedWords.values()).filter(
      word => word.pageNumber === currentPage + 1
    );

    const editedWordsMap = new Map(editedWordsForPage.map(word => [word.id, word]));
    const unifiedWords: PDFWord[] = [];

    originalWords.forEach(originalWord => {
      const editedVersion = editedWordsMap.get(originalWord.id);
      if (editedVersion) {
        unifiedWords.push(editedVersion);
        editedWordsMap.delete(originalWord.id);
      } else {
        unifiedWords.push(originalWord);
      }
    });

    editedWordsMap.forEach(editedWord => {
      unifiedWords.push(editedWord);
    });

    return unifiedWords.filter(word => word.text.trim() !== '');
  };

  const renderCanvaElement = (element: CanvaElement) => {
    if (!element.visible || element.pageNumber !== currentPage + 1) return null;

    const isSelected = selectedElement === element.id;
    const isQRCode = element.properties.isQRCode;
    const baseStyle = {
      position: 'absolute' as const,
      left: element.x * zoom,
      top: element.y * zoom,
      width: element.width * zoom,
      height: element.height * zoom,
      transform: `rotate(${element.rotation || 0}deg)`,
      cursor: element.locked ? 'default' : 'move',
      border: isSelected ? '2px solid #3B82F6' : 'none',
      zIndex: 20
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              fontSize: (element.properties.fontSize || 16) * zoom,
              fontFamily: element.properties.fontFamily || 'Arial',
              color: element.properties.color || '#000000',
              fontWeight: element.properties.fontWeight || 'normal',
              fontStyle: element.properties.fontStyle || 'normal',
              textAlign: element.properties.textAlign || 'left',
              textDecoration: element.properties.textDecoration || 'none',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
            }}
            onMouseDown={(e) => !element.locked && handleElementMouseDown(element.id, e)}
          >
            {element.properties.text}
          </div>
        );

      case 'image':
        return (
          <div
            key={element.id}
            style={baseStyle}
            onMouseDown={(e) => !element.locked && handleElementMouseDown(element.id, e)}
          >
            <img
              src={element.properties.src}
              alt={isQRCode ? 'QR Code' : 'Uploaded'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: element.properties.opacity || 1
              }}
            />
            {isSelected && isQRCode && (
              <div className="absolute -top-8 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                QR: {element.properties.qrUrl?.substring(0, 20)}...
              </div>
            )}
          </div>
        );

      case 'shape':
        const shapeStyle = {
          ...baseStyle,
          backgroundColor: element.properties.fill || 'transparent',
          border: `${element.properties.strokeWidth || 0}px solid ${element.properties.stroke || 'transparent'}`,
          borderRadius: element.properties.cornerRadius || 0
        };

        return (
          <div
            key={element.id}
            style={shapeStyle}
            onMouseDown={(e) => !element.locked && handleElementMouseDown(element.id, e)}
          />
        );

      default:
        return null;
    }
  };

  const currentPageData = pdfPages[currentPage];
  const unifiedWords = getUnifiedWords();
  const currentPageElements = Array.from(canvaElements.values()).filter(
    el => el.pageNumber === currentPage + 1
  );

  return (
    <div className="h-screen bg-gray-50 flex">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* QR Code Generator Modal */}
      {showQRGenerator && (
        <QRCodeGenerator
          onGenerate={handleQRCodeGeneration}
          onClose={() => setShowQRGenerator(false)}
          selectedElement={selectedElement}
          onRegenerate={regenerateQRCode}
          currentQRUrl={selectedElement ? canvaElements.get(selectedElement)?.properties.qrUrl : undefined}
        />
      )}

      {/* Enhanced Sidebar */}
      <EnhancedPDFSidebar
        selectedFile={selectedFile}
        selectedTool={selectedTool}
        onToolSelect={handleToolSelect}
        totalEditedBlocks={editedWords.size + canvaElements.size}
        pdfPagesLength={pdfPages.length}
        onFileUpload={handleFileUpload}
        onExportPDF={exportPDF}
        pdfDocument={pdfDocument}
        layers={layers}
        onLayerToggleVisibility={handleLayerToggleVisibility}
        onLayerToggleLock={handleLayerToggleLock}
        onLayerSelect={handleLayerSelect}
        selectedLayerId={selectedElement}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.1))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleFitToScreen}>
              <Maximize2 className="w-4 h-4 mr-1" />
              Fit Screen
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedElement && (
              <>
                {canvaElements.get(selectedElement)?.properties.isQRCode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQRGenerator(true)}
                  >
                    <QrCode className="w-4 h-4 mr-1" />
                    Edit QR
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleElementDelete(selectedElement)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
            <Button variant="outline" onClick={exportPDF} disabled={!pdfDocument}>
              <Download className="w-4 h-4 mr-1" />
              Export PDF
            </Button>
            {onSave && (
              <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-1" />
                Save Changes
              </Button>
            )}
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Processing PDF for advanced editing...</p>
                <p className="text-sm text-gray-500">Preparing Canva-style editor with word-level editing</p>
              </div>
            </div>
          ) : pdfPages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8 max-w-md">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Upload a PDF for Canva-Style Editing
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Your PDF will be processed to enable advanced editing with text, images, shapes, QR codes, and annotations.
                </p>
                <Button
                  onClick={triggerFileUpload}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose PDF File
                </Button>
              </div>
            </div>
          ) : currentPageData ? (
            <div className="flex items-center justify-center min-h-full p-8">
              <div 
                className="bg-white rounded-lg shadow-lg relative"
                style={{
                  width: currentPageData.width * zoom,
                  height: currentPageData.height * zoom,
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                  minWidth: 'fit-content',
                  minHeight: 'fit-content',
                  cursor: selectedTool !== 'select' ? 'crosshair' : 'default'
                }}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Background image with text masking */}
                <div 
                  className="w-full h-full relative overflow-hidden rounded-lg"
                  style={{
                    background: `url(${currentPageData.backgroundImage}) no-repeat center center`,
                    backgroundSize: 'cover'
                  }}
                >
                  {/* White masks to hide original text areas - this prevents doubling */}
                  {unifiedWords.map((word) => (
                    <div
                      key={`mask-${word.id}`}
                      className="absolute bg-white"
                      style={{
                        left: Math.max(0, word.x * zoom - 1), // Slight padding to ensure complete coverage
                        top: Math.max(0, word.y * zoom - 1),
                        width: (word.width * zoom) + 2, // Slight padding to ensure complete coverage
                        height: (word.height * zoom) + 2,
                        zIndex: 1, // Above background, below editable text
                        pointerEvents: 'none' // Don't interfere with text editing
                      }}
                    />
                  ))}
                </div>
                
                {/* Editable words - rendered above masks */}
                {unifiedWords.map((word) => (
                  <div key={`word-container-${word.id}`} style={{ zIndex: 10 }}>
                    <EditableWord
                      key={word.id}
                      word={word}
                      scale={zoom}
                      onUpdate={updateWord}
                      onDelete={deleteWord}
                    />
                  </div>
                ))}

                {/* Canva elements - rendered at top level */}
                <div style={{ zIndex: 20 }}>
                  {currentPageElements.map(element => renderCanvaElement(element))}
                </div>

                {/* Page info */}
                <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3" style={{ zIndex: 30 }}>
                  <span className="text-xs text-gray-500">
                    Page {currentPage + 1}/{pdfPages.length} • {unifiedWords.length} words • {currentPageElements.length} elements
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <div className="text-red-500 text-lg mb-4">Error Loading PDF Page</div>
                <p className="text-gray-600 mb-4">There was an issue loading the PDF page data.</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Reload Page
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Page Navigation */}
        <div className="bg-white border-t border-gray-200 p-2">
          <PDFPageNavigation
            pdfPages={pdfPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};
