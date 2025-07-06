
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
  FileText
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

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
              index: index
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

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[100px] text-center">
              Page {currentPage} of {numPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= numPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {/* Search Results */}
          {searchTerm && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Search className="w-4 h-4" />
              <span>{searchResults.length} results found</span>
            </div>
          )}

          {/* Download */}
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* PDF Canvas */}
      <div className="flex-1 overflow-auto bg-gray-100 rounded-lg">
        <div 
          ref={containerRef}
          className="min-h-full flex items-center justify-center p-8"
        >
          {pdfDoc ? (
            <div className="bg-white shadow-xl border">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto"
                style={{ display: 'block' }}
              />
            </div>
          ) : (
            <Card className="max-w-md">
              <CardContent className="text-center p-8">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No PDF Loaded
                </h3>
                <p className="text-sm text-gray-500">
                  Upload a PDF file to start editing
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Search Results Panel */}
      {searchResults.length > 0 && (
        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2">Search Results ({searchResults.length})</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {searchResults.slice(0, 10).map((result, index) => (
              <div
                key={index}
                className="text-xs p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => onPageChange(result.pageNumber)}
              >
                <span className="font-medium">Page {result.pageNumber}:</span>
                <span className="ml-1">{result.text.substring(0, 50)}...</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
