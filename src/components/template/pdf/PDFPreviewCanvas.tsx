
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { pdfOperationsService } from '@/services/pdfOperationsService';
import { toast } from '@/hooks/use-toast';

interface PDFPreviewCanvasProps {
  fileUrl: string;
  fileName?: string;
  searchTerm?: string;
  onPageChange?: (pageNumber: number) => void;
  currentPage?: number;
}

interface PDFPageData {
  pageNumber: number;
  imageUrl: string;
  width: number;
  height: number;
  textBlocks?: any[];
}

export const PDFPreviewCanvas: React.FC<PDFPreviewCanvasProps> = ({
  fileUrl,
  fileName = 'PDF Document',
  searchTerm,
  onPageChange,
  currentPage = 1
}) => {
  const [pages, setPages] = useState<PDFPageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadPDFPreview();
  }, [fileUrl]);

  const loadPDFPreview = async () => {
    if (!fileUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Loading PDF preview for:', fileName);

      // First, try to extract text with enhanced formatting to get page count
      const textResult = await pdfOperationsService.extractTextEnhanced(fileUrl, {
        preserveFormatting: true,
        includeBoundingBoxes: true,
        detectTables: true
      });

      if (!textResult.success) {
        throw new Error(textResult.error || 'Failed to load PDF');
      }

      // For now, create mock page data since pdf.co doesn't have direct PNG conversion
      // In a real implementation, you'd use pdf.co's convert-to-png endpoint
      const pageCount = textResult.pages || 1;
      const mockPages: PDFPageData[] = [];

      for (let i = 1; i <= Math.min(pageCount, 20); i++) {
        mockPages.push({
          pageNumber: i,
          imageUrl: fileUrl, // Use PDF URL as placeholder
          width: 595, // Standard A4 width in points
          height: 842, // Standard A4 height in points
          textBlocks: textResult.textBlocks || []
        });
      }

      setPages(mockPages);
      console.log('✅ PDF preview loaded:', mockPages.length, 'pages');

    } catch (error: any) {
      console.error('❌ Failed to load PDF preview:', error);
      setError(error.message || 'Failed to load PDF preview');
      toast({
        title: 'Preview Error',
        description: 'Failed to load PDF preview. The file might be corrupted or expired.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages.length) {
      onPageChange?.(newPage);
    }
  };

  const currentPageData = pages.find(p => p.pageNumber === currentPage) || pages[0];

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading PDF preview...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <p className="text-red-600 font-medium mb-2">Preview Error</p>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <Button onClick={loadPDFPreview} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{pages.length} pages</Badge>
          <span className="text-sm text-gray-600">{fileName}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <Button size="sm" variant="outline" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button size="sm" variant="outline" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>

          {/* Rotate */}
          <Button size="sm" variant="outline" onClick={handleRotate}>
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Page Navigation */}
      {pages.length > 1 && (
        <div className="flex items-center justify-center gap-4 p-3 border-b bg-gray-50">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <span className="text-sm font-medium">
            Page {currentPage} of {pages.length}
          </span>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= pages.length}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* PDF Preview */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div className="flex justify-center">
          <div 
            className="bg-white shadow-lg border relative"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center',
              width: currentPageData?.width || 595,
              height: currentPageData?.height || 842,
              minHeight: '600px'
            }}
          >
            {/* PDF Background */}
            <div className="absolute inset-0 bg-white">
              {currentPageData ? (
                <iframe
                  src={currentPageData.imageUrl}
                  className="w-full h-full border-none"
                  title={`PDF Page ${currentPage}`}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Page {currentPage}</p>
                </div>
              )}
            </div>

            {/* Search Highlights */}
            {searchTerm && currentPageData?.textBlocks && (
              <div className="absolute inset-0 pointer-events-none">
                {currentPageData.textBlocks
                  .filter(block => 
                    block.text?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((block, index) => (
                    <div
                      key={index}
                      className="absolute bg-yellow-200 opacity-50 border border-yellow-400"
                      style={{
                        left: block.x || 0,
                        top: block.y || 0,
                        width: block.width || 100,
                        height: block.height || 20
                      }}
                    />
                  ))}
              </div>
            )}

            {/* Canvas for additional annotations */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none"
              width={currentPageData?.width || 595}
              height={currentPageData?.height || 842}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
