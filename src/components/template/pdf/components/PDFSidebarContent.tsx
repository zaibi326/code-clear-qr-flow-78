
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileText, Edit3, MousePointer, Type, Download } from 'lucide-react';

interface PDFSidebarContentProps {
  selectedFile: File | null;
  editMode: 'select' | 'add-text';
  setEditMode: (mode: 'select' | 'add-text') => void;
  totalEditedBlocks: number;
  pdfPagesLength: number;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportPDF: () => void;
  pdfDocument: any;
}

export const PDFSidebarContent: React.FC<PDFSidebarContentProps> = ({
  selectedFile,
  editMode,
  setEditMode,
  totalEditedBlocks,
  pdfPagesLength,
  onFileUpload,
  onExportPDF,
  pdfDocument
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* File Upload */}
      <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <Label className="text-sm font-medium mb-2 block text-blue-900">Upload PDF Document</Label>
          <input
            type="file"
            accept=".pdf"
            onChange={onFileUpload}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
          {selectedFile && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {selectedFile.name} loaded successfully
            </p>
          )}
        </CardContent>
      </Card>

      {/* Edit Mode Selector */}
      {pdfPagesLength > 0 && (
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-medium mb-3 block">Edit Mode</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={editMode === 'select' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEditMode('select')}
                className="flex items-center gap-2"
              >
                <MousePointer className="w-4 h-4" />
                Select & Edit
              </Button>
              <Button
                variant={editMode === 'add-text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEditMode('add-text')}
                className="flex items-center gap-2"
              >
                <Type className="w-4 h-4" />
                Add Text
              </Button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {editMode === 'select' 
                ? 'Double-click any text to edit. Drag to move.' 
                : 'Click anywhere on the PDF to add new text.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="p-4">
          <h3 className="font-medium text-emerald-900 mb-2 flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            How to Edit:
          </h3>
          <ul className="text-xs text-emerald-800 space-y-1">
            <li>• <strong>Edit existing text:</strong> Double-click any text</li>
            <li>• <strong>Move text:</strong> Drag text blocks around</li>
            <li>• <strong>Add new text:</strong> Switch to "Add Text" mode, then click</li>
            <li>• <strong>Format text:</strong> Use the floating toolbar</li>
            <li>• <strong>Real PDF editing:</strong> Changes modify the actual PDF</li>
          </ul>
        </CardContent>
      </Card>

      {/* Stats */}
      {totalEditedBlocks > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <h3 className="font-medium text-orange-900 mb-2">Edit Summary</h3>
            <p className="text-sm text-orange-800">
              {totalEditedBlocks} text block{totalEditedBlocks !== 1 ? 's' : ''} modified
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tools */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium mb-2 block">Actions</Label>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={onExportPDF}
              disabled={!pdfDocument}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Edited PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
