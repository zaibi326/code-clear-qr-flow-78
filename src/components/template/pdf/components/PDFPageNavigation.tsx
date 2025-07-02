
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PDFPageNavigationProps {
  pdfPages: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const PDFPageNavigation: React.FC<PDFPageNavigationProps> = ({
  pdfPages,
  currentPage,
  setCurrentPage
}) => {
  if (pdfPages.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <Label className="text-sm font-medium mb-2 block">
          Pages ({pdfPages.length})
        </Label>
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">
            {currentPage + 1} / {pdfPages.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(pdfPages.length - 1, currentPage + 1))}
            disabled={currentPage === pdfPages.length - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Page thumbnails */}
        <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
          {pdfPages.map((page, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`border-2 rounded p-1 transition-colors aspect-[3/4] ${
                currentPage === index 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs text-gray-600">{index + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
