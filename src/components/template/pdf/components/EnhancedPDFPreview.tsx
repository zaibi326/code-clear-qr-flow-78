
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Search,
  Eye,
  Grid3X3,
  Maximize2
} from 'lucide-react';
import { usePDFRenderer } from '@/hooks/usePDFRenderer';
import { Input } from '@/components/ui/input';

interface EnhancedPDFPreviewProps {
  fileUrl?: string;
  file?: File;
  onSearchResults?: (results: any[]) => void;
}

export const EnhancedPDFPreview: React.FC<EnhancedPDFPreviewProps> = ({
  fileUrl,
  file,
  onSearchResults
}) => {
  const [zoom, setZoom] = useState(1.2);
  const [rotation, setRotation] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTextLayer, setShowTextLayer] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const {
    isLoading,
    pageRenders,
    currentPage,
    setCurrentPage,
    numPages,
    documentInfo,
    error,
    loadPDF,
    renderAllPages,
    searchInPDF,
    convertToImages
  } = usePDFRenderer();

  // Load PDF when source changes
  useEffect(() => {
    if (file) {
      loadPDF(file);
    } else if (fileUrl) {
      loadPDF(fileUrl);
    }
  }, [file, fileUrl, loadPDF]);

  // Render pages when PDF is loaded
  useEffect(() => {
    if (numPages > 0) {
      renderAllPages({
        scale: zoom,
        rotation: rotation,
        enableTextLayer: showTextLayer,
        enableAnnotations: true
      });
    }
  }, [numPages, zoom, rotation, showTextLayer, renderAllPages]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      const results = await searchInPDF(searchTerm);
      onSearchResults?.(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleResetView = () => {
    setZoom(1.2);
    setRotation(0);
  };

  const handleDownloadImages = async () => {
    try {
      const images = await convertToImages({
        format: 'PNG',
        quality: 0.95,
        dpi: 300
      });
      
      // Download each image
      images.forEach((imageData, index) => {
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `page-${index + 1}.png`;
        link.click();
      });
    } catch (error) {
      console.error('Failed to download images:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading PDF</h3>
          <p className="text-gray-600">Rendering with full preview support...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-8">
          <div className="text-red-500 text-lg mb-4">Error Loading PDF</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50/50 to-white/50">
      {/* Enhanced Toolbar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 p-4 flex-shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg p-1">
            <Input
              placeholder="Search in PDF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="h-8 w-48 bg-white/80 border-none"
            />
            <Button size="sm" onClick={handleSearch} className="h-8 px-3">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg p-1">
            <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-3 py-1 bg-white/80 rounded text-center min-w-[60px]">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRotate} className="h-8 w-8 p-0">
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleResetView} className="h-8 px-2">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Display Options */}
          <div className="flex items-center gap-2 bg-gray-50/80 rounded-lg p-1">
            <Button 
              variant={showTextLayer ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowTextLayer(!showTextLayer)}
              className="h-8 px-3"
            >
              <Eye className="w-4 h-4 mr-1" />
              Text
            </Button>
            <Button 
              variant={showGrid ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowGrid(!showGrid)}
              className="h-8 px-3"
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              Grid
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownloadImages} className="h-8 px-3">
              <Download className="w-4 h-4 mr-1" />
              Images
            </Button>
          </div>
        </div>

        {/* Document Info */}
        {documentInfo && (
          <div className="mt-3 text-sm text-gray-600 bg-blue-50/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {documentInfo.title || 'PDF Document'} • {numPages} pages
              </span>
              <span className="text-xs">
                {documentInfo.author && `by ${documentInfo.author}`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* PDF Preview Area */}
      <div 
        ref={previewRef}
        className="flex-1 overflow-auto bg-gradient-to-br from-gray-100/30 to-gray-200/30 p-4"
      >
        <div className="space-y-4">
          {pageRenders.map((pageRender, index) => (
            <div
              key={pageRender.pageNumber}
              className="bg-white shadow-xl border border-gray-200/60 rounded-lg overflow-hidden mx-auto relative"
              style={{
                width: 'fit-content',
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center center'
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
              
              {/* Page Canvas */}
              <div className="relative">
                {pageRender.canvas && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<canvas width="${pageRender.canvas.width}" height="${pageRender.canvas.height}" style="width: ${pageRender.width}px; height: ${pageRender.height}px; display: block;">${pageRender.canvas.outerHTML}</canvas>`
                    }}
                  />
                )}
                
                {/* Text Layer */}
                {showTextLayer && pageRender.textLayer && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    dangerouslySetInnerHTML={{ __html: pageRender.textLayer.innerHTML }}
                  />
                )}
              </div>

              {/* Page Number */}
              <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg shadow-lg border border-gray-200 px-3 py-1">
                <span className="text-xs font-medium text-gray-700">
                  Page {pageRender.pageNumber}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
