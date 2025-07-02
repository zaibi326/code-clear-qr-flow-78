
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Download, 
  MousePointer, 
  Type, 
  Edit3,
  FileText,
  Target,
  Move,
  PlusCircle,
  Palette
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface PDFSidebarContentProps {
  selectedFile: File | null;
  editMode: 'select' | 'add-text';
  setEditMode: (mode: 'select' | 'add-text') => void;
  totalEditedBlocks: number;
  pdfPagesLength: number;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportPDF: () => void;
  pdfDocument: PDFDocument | null;
  hideFileUpload?: boolean;
}

export const PDFSidebarContent: React.FC<PDFSidebarContentProps> = ({
  selectedFile,
  editMode,
  setEditMode,
  totalEditedBlocks,
  pdfPagesLength,
  onFileUpload,
  onExportPDF,
  pdfDocument,
  hideFileUpload = false
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Upload Section - Only show if not hidden */}
      {!hideFileUpload && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Upload PDF Document</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <input
                type="file"
                accept=".pdf"
                onChange={onFileUpload}
                className="hidden"
                id="pdf-upload"
              />
              <Button
                onClick={() => document.getElementById('pdf-upload')?.click()}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              {selectedFile && (
                <div className="text-xs text-gray-600 truncate">
                  {selectedFile.name}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* How to Edit Instructions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            How to Edit:
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3 text-xs text-gray-600">
          <div className="flex items-start gap-2">
            <Target className="w-3 h-3 mt-0.5 text-blue-500 flex-shrink-0" />
            <div>
              <span className="font-medium">Edit existing text:</span> Double-click any text
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Move className="w-3 h-3 mt-0.5 text-green-500 flex-shrink-0" />
            <div>
              <span className="font-medium">Move text:</span> Drag text blocks around
            </div>
          </div>
          <div className="flex items-start gap-2">
            <PlusCircle className="w-3 h-3 mt-0.5 text-purple-500 flex-shrink-0" />
            <div>
              <span className="font-medium">Add new text:</span> Switch to "Add Text" mode, then click
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Palette className="w-3 h-3 mt-0.5 text-orange-500 flex-shrink-0" />
            <div>
              <span className="font-medium">Format text:</span> Use the floating toolbar when editing
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FileText className="w-3 h-3 mt-0.5 text-blue-600 flex-shrink-0" />
            <div>
              <span className="font-medium">Real PDF editing:</span> Changes modify the actual PDF content, not just overlays
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editing Mode Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Editing Mode</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <Button
            onClick={() => setEditMode('select')}
            variant={editMode === 'select' ? 'default' : 'outline'}
            size="sm"
            className="w-full justify-start"
          >
            <MousePointer className="w-4 h-4 mr-2" />
            Select & Edit
          </Button>
          <Button
            onClick={() => setEditMode('add-text')}
            variant={editMode === 'add-text' ? 'default' : 'outline'}
            size="sm"
            className="w-full justify-start"
          >
            <Type className="w-4 h-4 mr-2" />
            Add Text
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      {pdfDocument && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Document Stats</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Pages:</span>
              <Badge variant="secondary">{pdfPagesLength}</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Text Edits:</span>
              <Badge variant={totalEditedBlocks > 0 ? 'default' : 'secondary'}>
                {totalEditedBlocks}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Button
            onClick={onExportPDF}
            disabled={!pdfDocument}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Edited PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
