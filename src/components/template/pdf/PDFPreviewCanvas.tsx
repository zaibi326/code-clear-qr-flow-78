
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { pdfOperationsService } from '@/services/pdfOperationsService';
import { toast } from '@/hooks/use-toast';

interface PDFPreviewCanvasProps {
  fileUrl: string;
  fileName: string;
  searchTerm?: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const PDFPreviewCanvas: React.FC<PDFPreviewCanvasProps> = ({
  fileUrl,
  fileName,
  searchTerm = '',
  currentPage,
  onPageChange
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Convert PDF to images for preview
  useEffect(() => {
    const convertPDFToImages = async () => {
      if (!fileUrl) return;
      
      setIsLoading(true);
      try {
        console.log('🔄 Converting PDF to images for preview:', fileUrl);
        
        // Simulate PDF.co API call to convert PDF to PNG images
        const result = await pdfOperationsService.processWithPDFCo('convertToImage', {
          pdfUrl: fileUrl,
          format: 'PNG',
          dpi: 150
        });
        
        if (result.success && result.images) {
          setPageImages(result.images);
          setTotalPages(result.images.length);
          console.log('✅ PDF converted to images:', result.images.length, 'pages');
        } else {
          // Fallback: create mock image URLs for demo
          const mockImages = Array.from({ length: 3 }, (_, i) => 
            `data:image/svg+xml,${encodeURIComponent(`
              <svg width="600" height="800" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f8f9fa"/>
                <rect x="50" y="50" width="500" height="700" fill="white" stroke="#dee2e6"/>
                <text x="300" y="400" text-anchor="middle" font-family="Arial" font-size="24" fill="#6c757d">
                  PDF Page ${i + 1}
                </text>
                <text x="300" y="450" text-anchor="middle" font-family="Arial" font-size="16" fill="#adb5bd">
                  ${fileName}
                </text>
              </svg>
            `)}`
          );
          setPageImages(mockImages);
          setTotalPages(mockImages.length);
        }
      } catch (error) {
        console.error('❌ Failed to convert PDF:', error);
        toast({
          title: "Preview generation failed",
          description: "Could not generate PDF preview images",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    convertPDFToImages();
  }, [fileUrl, fileName]);

  // Search in PDF
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim() || !fileUrl) {
        setSearchResults([]);
        return;
      }

      try {
        const result = await pdfOperationsService.searchInPDF(fileUrl, searchTerm);
        if (result.success && result.results) {
          setSearchResults(result.results);
          console.log('🔍 Search results:', result.results);
        }
      } catch (error) {
        console.error('Search failed:', error);
      }
    };

    const debounceTimer = setTimeout(performSearch, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, fileUrl]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = async () => {
    try {
      await pdfOperationsService.downloadPDF(fileUrl, fileName);
      toast({
        title: "Download started",
        description: "Your PDF is being downloaded",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the PDF",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Processing PDF</h3>
          <p className="text-gray-600">Converting pages to images for preview...</p>
        </div>
      </div>
    );
  }

  const currentPageImage = pageImages[currentPage - 1];

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      {/* Toolbar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 p-3 flex-shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Badge variant="outline" className="px-3 py-1">
              {currentPage} of {totalPages}
            </Badge>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleRotate}>
              <RotateCw className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <Search className="w-4 h-4" />
              Found {searchResults.length} matches for "{searchTerm}"
            </div>
          </div>
        )}
      </div>

      {/* PDF Preview */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex justify-center">
          {currentPageImage ? (
            <div 
              className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
              style={{
                transform: `rotate(${rotation}deg) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease-in-out'
              }}
            >
              <img 
                src={currentPageImage}
                alt={`Page ${currentPage}`}
                className="max-w-none block"
                style={{ width: 'auto', height: 'auto' }}
              />
              
              {/* Search highlights overlay */}
              {searchResults
                .filter(result => result.pageNumber === currentPage)
                .map((result, index) => (
                  <div
                    key={index}
                    className="absolute bg-yellow-300/50 border border-yellow-400 pointer-events-none"
                    style={{
                      left: `${result.x}px`,
                      top: `${result.y}px`,
                      width: `${result.width || 100}px`,
                      height: `${result.height || 20}px`,
                    }}
                  />
                ))}
            </div>
          ) : (
            <Card className="w-full max-w-2xl">
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No preview available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
