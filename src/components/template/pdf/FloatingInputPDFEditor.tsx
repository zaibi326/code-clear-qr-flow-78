
import React, { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { Download, Upload, ZoomIn, ZoomOut, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FloatingInput {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  pageNumber: number;
}

interface FloatingInputPDFEditorProps {
  onSave?: () => void;
  onCancel?: () => void;
  template?: any;
  hideFileUpload?: boolean;
}

export const FloatingInputPDFEditor: React.FC<FloatingInputPDFEditorProps> = ({
  onSave,
  onCancel,
  template,
  hideFileUpload = false
}) => {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1.5);
  const [isLoading, setIsLoading] = useState(false);
  const [floatingInputs, setFloatingInputs] = useState<FloatingInput[]>([]);
  const [activeInputId, setActiveInputId] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load PDF from template or file upload
  useEffect(() => {
    if (template?.preview && template.preview.startsWith('data:application/pdf')) {
      loadPDFFromDataURL(template.preview);
    } else if (template?.file) {
      loadPDFFromFile(template.file);
    }
  }, [template]);

  const loadPDFFromDataURL = async (dataURL: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(dataURL);
      const arrayBuffer = await response.arrayBuffer();
      await loadPDFDocument(new Uint8Array(arrayBuffer));
    } catch (error) {
      console.error('Error loading PDF from data URL:', error);
      toast({
        title: 'Error loading PDF',
        description: 'Failed to load PDF from template data.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPDFFromFile = async (file: File) => {
    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      await loadPDFDocument(new Uint8Array(arrayBuffer));
    } catch (error) {
      console.error('Error loading PDF from file:', error);
      toast({
        title: 'Error loading PDF',
        description: 'Failed to load PDF file.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPDFDocument = async (data: Uint8Array) => {
    try {
      const loadingTask = pdfjsLib.getDocument({ data });
      const pdfDocument = await loadingTask.promise;
      
      setPdfDoc(pdfDocument);
      setTotalPages(pdfDocument.numPages);
      setCurrentPage(1);
      
      toast({
        title: 'PDF Loaded Successfully',
        description: `Loaded ${pdfDocument.numPages} pages ready for editing.`,
      });
    } catch (error) {
      throw error;
    }
  };

  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: zoom });
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      if (showOriginal) {
        // Render PDF page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
      } else {
        // Show white background only
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Update overlay dimensions
      if (overlayRef.current) {
        overlayRef.current.style.width = `${viewport.width}px`;
        overlayRef.current.style.height = `${viewport.height}px`;
      }
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };

  // Re-render when page or zoom changes
  useEffect(() => {
    if (pdfDoc) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, zoom, showOriginal]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!overlayRef.current) return;

    const rect = overlayRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Create new floating input
    const newInput: FloatingInput = {
      id: `input-${Date.now()}-${Math.random()}`,
      x: x,
      y: y,
      width: 200,
      height: 30,
      value: '',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif',
      color: '#000000',
      pageNumber: currentPage
    };

    setFloatingInputs(prev => [...prev, newInput]);
    setActiveInputId(newInput.id);
  };

  const updateFloatingInput = (id: string, updates: Partial<FloatingInput>) => {
    setFloatingInputs(prev => 
      prev.map(input => 
        input.id === id ? { ...input, ...updates } : input
      )
    );
  };

  const deleteFloatingInput = (id: string) => {
    setFloatingInputs(prev => prev.filter(input => input.id !== id));
    if (activeInputId === id) {
      setActiveInputId(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      loadPDFFromFile(file);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please select a PDF file.',
        variant: 'destructive'
      });
    }
  };

  const handleExport = () => {
    // Export functionality can be implemented here
    toast({
      title: 'Export functionality',
      description: 'Export with floating inputs will be implemented.',
    });
  };

  const currentPageInputs = floatingInputs.filter(input => input.pageNumber === currentPage);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          {!hideFileUpload && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-1" />
              Upload PDF
            </Button>
          )}
          
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.2))}>
            <ZoomIn className="w-4 h-4" />
          </Button>

          <Button
            variant={showOriginal ? "default" : "outline"}
            size="sm"
            onClick={() => setShowOriginal(!showOriginal)}
          >
            {showOriginal ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
            {showOriginal ? 'Hide' : 'Show'} Original
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {pdfDoc && (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          )}
          
          <Button variant="outline" onClick={handleExport} disabled={!pdfDoc}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          
          {onSave && (
            <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-1" />
              Save
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
              <p className="text-gray-600">Loading PDF with original layout...</p>
            </div>
          </div>
        ) : !pdfDoc ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 max-w-md">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Upload PDF for Inline Editing
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Your PDF will be rendered with floating input editing capabilities.
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose PDF File
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-full p-8">
            <div className="bg-white rounded-lg shadow-lg relative">
              {/* PDF Canvas */}
              <canvas
                ref={canvasRef}
                className="block max-w-full max-h-full rounded-lg"
                style={{ display: 'block' }}
              />
              
              {/* Floating Input Overlay */}
              <div
                ref={overlayRef}
                className="absolute top-0 left-0 cursor-crosshair"
                onClick={handleCanvasClick}
                style={{ zIndex: 10 }}
              >
                {/* Render floating inputs for current page */}
                {currentPageInputs.map((input) => (
                  <div
                    key={input.id}
                    className="absolute"
                    style={{
                      left: input.x,
                      top: input.y,
                      width: input.width,
                      height: input.height,
                    }}
                  >
                    <input
                      type="text"
                      value={input.value}
                      onChange={(e) => updateFloatingInput(input.id, { value: e.target.value })}
                      onFocus={() => setActiveInputId(input.id)}
                      onBlur={() => setActiveInputId(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Delete' && e.ctrlKey) {
                          deleteFloatingInput(input.id);
                        }
                        e.stopPropagation();
                      }}
                      className="w-full h-full border border-blue-400 bg-white bg-opacity-95 text-black px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{
                        fontSize: `${input.fontSize}px`,
                        fontFamily: input.fontFamily,
                        color: input.color,
                      }}
                      placeholder="Click to edit..."
                      autoFocus={activeInputId === input.id}
                    />
                    
                    {/* Delete button when active */}
                    {activeInputId === input.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFloatingInput(input.id);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Status indicator */}
              <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3" style={{ zIndex: 30 }}>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    Page {currentPage}/{totalPages} • {currentPageInputs.length} inputs
                  </span>
                  {!showOriginal && (
                    <span className="text-xs text-green-600 font-medium">
                      ✓ Clean Mode
                    </span>
                  )}
                  {showOriginal && (
                    <span className="text-xs text-blue-600 font-medium">
                      📄 Original Layout
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
