import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PDFPageRender } from '@/services/pdfRenderingService';
import { FileText, Plus, Copy, Trash2 } from 'lucide-react';

interface CanvaPageThumbnailsProps {
  pageRenders: PDFPageRender[];
  currentPage: number;
  onPageChange: (page: number) => void;
  numPages: number;
}

export const CanvaPageThumbnails: React.FC<CanvaPageThumbnailsProps> = ({
  pageRenders,
  currentPage,
  onPageChange,
  numPages
}) => {
  const renderThumbnail = (pageRender: PDFPageRender) => {
    // Create a thumbnail canvas
    const thumbnailCanvas = document.createElement('canvas');
    const thumbnailCtx = thumbnailCanvas.getContext('2d');
    if (!thumbnailCtx) return '';

    // Set thumbnail dimensions
    const maxWidth = 120;
    const maxHeight = 160;
    const scale = Math.min(maxWidth / pageRender.width, maxHeight / pageRender.height);
    
    thumbnailCanvas.width = pageRender.width * scale;
    thumbnailCanvas.height = pageRender.height * scale;

    // Draw the page to thumbnail
    thumbnailCtx.drawImage(
      pageRender.canvas,
      0, 0, pageRender.width, pageRender.height,
      0, 0, thumbnailCanvas.width, thumbnailCanvas.height
    );

    return thumbnailCanvas.toDataURL();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200/60">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Pages</h3>
          <Badge variant="outline" className="text-xs">
            {numPages} pages
          </Badge>
        </div>
        
        {/* Page Actions */}
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" title="Add Page" disabled>
            <Plus className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" title="Duplicate Page" disabled>
            <Copy className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" title="Delete Page" disabled>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Thumbnails */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {Array.from({ length: numPages }, (_, index) => {
            const pageNumber = index + 1;
            const pageRender = pageRenders[index];
            const isActive = pageNumber === currentPage;

            return (
              <Card
                key={pageNumber}
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isActive 
                    ? 'ring-2 ring-blue-500 bg-blue-50/50' 
                    : 'hover:ring-1 hover:ring-gray-300'
                }`}
                onClick={() => onPageChange(pageNumber)}
              >
                <div className="p-2">
                  {/* Thumbnail Image */}
                  <div className="relative bg-white rounded border border-gray-200 overflow-hidden">
                    {pageRender ? (
                      <img
                        src={renderThumbnail(pageRender)}
                        alt={`Page ${pageNumber}`}
                        className="w-full h-auto"
                        style={{ aspectRatio: '210/297' }} // A4 aspect ratio
                      />
                    ) : (
                      <div 
                        className="w-full flex items-center justify-center bg-gray-100"
                        style={{ aspectRatio: '210/297' }}
                      >
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Page Number Overlay */}
                    <div className="absolute top-1 left-1">
                      <Badge 
                        variant={isActive ? "default" : "secondary"}
                        className="text-xs h-5"
                      >
                        {pageNumber}
                      </Badge>
                    </div>
                  </div>

                  {/* Page Label */}
                  <p className="text-xs text-center text-gray-600 mt-1 truncate">
                    Page {pageNumber}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer Info */}
      <div className="p-3 border-t border-gray-200/60 bg-gray-50/50">
        <p className="text-xs text-gray-500 text-center">
          Current: Page {currentPage} of {numPages}
        </p>
      </div>
    </div>
  );
};