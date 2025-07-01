
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Type, 
  Image, 
  Square, 
  Circle as CircleIcon, 
  QrCode, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Edit3,
  MousePointer
} from 'lucide-react';
import { FabricObject } from 'fabric';

interface PDFPage {
  pageNumber: number;
  thumbnail: string;
}

interface PDFSidebarProps {
  editMode: 'select' | 'text' | 'highlight';
  setEditMode: (mode: 'select' | 'text' | 'highlight') => void;
  pdfPages: PDFPage[];
  currentPage: number;
  selectedObject: FabricObject | null;
  onFileUpload: (file: File) => void;
  onAddText: () => void;
  onAddRectangle: () => void;
  onAddCircle: () => void;
  onAddQRCode: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteSelected: () => void;
  onPageChange: (pageIndex: number) => void;
}

export const PDFSidebar: React.FC<PDFSidebarProps> = ({
  editMode,
  setEditMode,
  pdfPages,
  currentPage,
  selectedObject,
  onFileUpload,
  onAddText,
  onAddRectangle,
  onAddCircle,
  onAddQRCode,
  onImageUpload,
  onDeleteSelected,
  onPageChange
}) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">PDF Editor</h2>
        <p className="text-sm text-gray-600">Edit text directly in your PDF</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* File Upload */}
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-medium mb-2 block">Upload PDF</Label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onFileUpload(file);
                }
              }}
              className="w-full text-sm"
            />
          </CardContent>
        </Card>

        {/* Edit Mode */}
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-medium mb-2 block">Edit Mode</Label>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant={editMode === 'select' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEditMode('select')}
                className="justify-start"
              >
                <MousePointer className="w-4 h-4 mr-2" />
                Select
              </Button>
              <Button
                variant={editMode === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEditMode('text')}
                className="justify-start"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Text
              </Button>
            </div>
            {editMode === 'text' && (
              <p className="text-xs text-gray-500 mt-2">
                Click on existing text to edit, or click anywhere to add new text
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tools */}
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-medium mb-2 block">Add Elements</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={onAddText}>
                <Type className="w-4 h-4 mr-1" />
                Text
              </Button>
              <Button variant="outline" size="sm" onClick={onAddRectangle}>
                <Square className="w-4 h-4 mr-1" />
                Rectangle
              </Button>
              <Button variant="outline" size="sm" onClick={onAddCircle}>
                <CircleIcon className="w-4 h-4 mr-1" />
                Circle
              </Button>
              <Button variant="outline" size="sm" onClick={onAddQRCode}>
                <QrCode className="w-4 h-4 mr-1" />
                QR Code
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button variant="outline" size="sm" onClick={() => document.getElementById('image-upload')?.click()}>
                <Image className="w-4 h-4 mr-1" />
                Image
              </Button>
              <Button variant="outline" size="sm" onClick={onDeleteSelected} disabled={!selectedObject}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Page Navigation */}
        {pdfPages.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-medium mb-2 block">Pages</Label>
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">
                  {currentPage + 1} / {pdfPages.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(Math.min(pdfPages.length - 1, currentPage + 1))}
                  disabled={currentPage === pdfPages.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {pdfPages.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => onPageChange(index)}
                    className={`border-2 rounded p-1 ${
                      currentPage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={page.thumbnail}
                      alt={`Page ${index + 1}`}
                      className="w-full h-auto"
                    />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
