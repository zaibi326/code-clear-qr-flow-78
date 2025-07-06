
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Search,
  FileText,
  RotateCcw,
  Maximize2,
  Grid3X3
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

interface PDFPreviewCanvasProps {
  fileUrl: string;
  fileName: string;
  searchTerm: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const PDFPreviewCanvas: React.FC<PDFPreviewCanvasProps> = ({
  fileUrl,
  fileName,
  searchTerm,
  currentPage,
  onPageChange
}) => {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1.2);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize PDF.js worker
  useEffect(() => {
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
    }
  }, []);

  // Load PDF when fileUrl changes
  useEffect(() => {
    if (fileUrl) {
      loadPDF(fileUrl);
    }
  }, [fileUrl]);

  // Render current page when page or zoom changes
  useEffect(() => {
    if (pdfDoc && currentPage > 0) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, zoom]);

  // Search in PDF when searchTerm changes
  useEffect(() => {
    if (pdfDoc && searchTerm.trim()) {
      searchInPDF(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [pdfDoc, searchTerm]);

  const loadPDF = async (url: string) => {
    setIsLoading(true);
    try {
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
      onPageChange(1);
    } catch (error) {
      console.error('Error loading PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: zoom });
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // High DPI support
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = viewport.width * devicePixelRatio;
      canvas.height = viewport.height * devicePixelRatio;
      canvas.style.width = viewport.width + 'px';
      canvas.style.height = viewport.height + 'px';
      
      context.scale(devicePixelRatio, devicePixelRatio);

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };

  const searchInPDF = async (term: string) => {
    if (!pdfDoc) return;

    const results: any[] = [];
    
    for (let i = 1; i <= numPages; i++) {
      try {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        
        textContent.items.forEach((item: any, index: number) => {
          if (item.str && item.str.toLowerCase().includes(term.toLowerCase())) {
            results.push({
              pageNumber: i,
              text: item.str,
              index: index,
              x: item.transform[4],
              y: item.transform[5]
            });
          }
        });
      } catch (error) {
        console.error(`Error searching page ${i}:`, error);
      }
    }
    
    setSearchResults(results);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1.2);
    setPanOffset({ x: 0, y: 0 });
  };

  const handlePrevPage = () => {
    onPageChange(Math.max(currentPage - 1, 1));
  };

  const handleNextPage = () => {
    onPageChange(Math.min(currentPage + 1, numPages));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  // Drag to pan functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1 && zoom > 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setPanOffset({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading PDF</h3>
          <p className="text-gray-600">Please wait while we prepare your document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50/50 to-white/50">
      {/* Modern Toolbar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 p-3 md:p-4 flex-shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Page Navigation */}
          <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="h-8 w-8 p-0 hover:bg-white/80"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-3 py-1 bg-white/80 rounded text-center min-w-[80px]">
              {currentPage} / {numPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= numPages}
              className="h-8 w-8 p-0 hover:bg-white/80"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg p-1">
            <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0 hover:bg-white/80">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-3 py-1 bg-white/80 rounded text-center min-w-[60px]">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0 hover:bg-white/80">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleResetZoom} className="h-8 px-2 hover:bg-white/80">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Tools */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowGrid(!showGrid)}
              className={`h-8 w-8 p-0 hover:bg-white/80 ${showGrid ? 'bg-blue-100 text-blue-600' : ''}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            
            {/* Search Results */}
            {searchTerm && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50/80 px-3 py-1 rounded-lg border border-blue-200/60">
                <Search className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{searchResults.length} found</span>
              </div>
            )}

            <Button variant="ghost" size="sm" onClick={handleDownload} className="h-8 px-3 hover:bg-white/80">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Canvas with drag support */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-auto bg-gradient-to-br from-gray-100/30 to-gray-200/30"
      >
        <div 
          ref={containerRef}
          className="min-h-full flex items-center justify-center p-4 md:p-8 relative"
          style={{ 
            cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {pdfDoc ? (
            <div 
              className="bg-white shadow-2xl border border-gray-200/60 rounded-lg overflow-hidden relative"
              style={{
                transform: zoom > 1 ? `translate(${panOffset.x}px, ${panOffset.y}px)` : 'none',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
            >
              {/* Grid overlay */}
              {showGrid && (
                <div 
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                />
              )}
              
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto block"
                style={{ 
                  maxHeight: 'calc(100vh - 200px)',
                  filter: isDragging ? 'none' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'
                }}
              />
              
              {/* Search result highlights */}
              {searchResults
                .filter(result => result.pageNumber === currentPage)
                .map((result, index) => (
                  <div
                    key={index}
                    className="absolute bg-yellow-200/60 border border-yellow-400/40 rounded-sm pointer-events-none"
                    style={{
                      left: `${(result.x / (canvasRef.current?.width || 1)) * 100}%`,
                      top: `${100 - (result.y / (canvasRef.current?.height || 1)) * 100}%`,
                      width: '100px',
                      height: '20px',
                      transform: 'translateY(-50%)'
                    }}
                  />
                ))
              }
            </div>
          ) : (
            <Card className="max-w-md border-2 border-dashed border-gray-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No PDF Loaded
                </h3>
                <p className="text-sm text-gray-500">
                  Upload a PDF file to start editing with Canva-style tools
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Search Results Panel */}
      {searchResults.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200/60 p-4 flex-shrink-0">
          <h4 className="text-sm font-medium mb-3 text-gray-900">
            Search Results ({searchResults.length})
          </h4>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {searchResults.slice(0, 10).map((result, index) => (
              <div
                key={index}
                className="text-xs p-3 bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-lg cursor-pointer hover:from-blue-100/80 hover:to-purple-100/80 transition-all duration-200 border border-blue-200/40"
                onClick={() => onPageChange(result.pageNumber)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-blue-700">Page {result.pageNumber}</span>
                  <span className="text-gray-500">Match {index + 1}</span>
                </div>
                <p className="text-gray-700 truncate">{result.text.substring(0, 80)}...</p>
              </div>
            ))}
            {searchResults.length > 10 && (
              <div className="text-xs text-gray-500 text-center py-2 italic">
                ... and {searchResults.length - 10} more matches
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
