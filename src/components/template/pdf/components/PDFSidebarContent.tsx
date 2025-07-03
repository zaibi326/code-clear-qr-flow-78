
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  Download, 
  MousePointer, 
  Type, 
  Edit3,
  Move
} from 'lucide-react';

type EditMode = 'select' | 'add-text' | 'pan';

interface PDFSidebarContentProps {
  selectedFile: File | null;
  editMode: EditMode;
  setEditMode: (mode: EditMode) => void;
  totalEditedBlocks: number;
  pdfPagesLength: number;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportPDF: () => void;
  pdfDocument: any;
  hideFileUpload?: boolean;
  onTriggerFileUpload: () => void;
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
  hideFileUpload = false,
  onTriggerFileUpload
}) => {
  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
      {/* File Upload Section */}
      {!hideFileUpload && !selectedFile && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">
                Upload a PDF file to start editing
              </p>
              <Button 
                onClick={onTriggerFileUpload}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose PDF File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Info */}
      {selectedFile && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Current File</h3>
              <p className="text-xs text-gray-600 break-all">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {pdfPagesLength} pages
              </p>
              {totalEditedBlocks > 0 && (
                <p className="text-xs text-blue-600 font-medium">
                  {totalEditedBlocks} text blocks edited
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Mode Controls */}
      {pdfPagesLength > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-sm mb-3">Edit Mode</h3>
            <div className="space-y-2">
              <Button
                variant={editMode === 'select' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEditMode('select')}
                className="w-full justify-start"
              >
                <MousePointer className="w-4 h-4 mr-2" />
                Select & Edit Text
              </Button>
              <Button
                variant={editMode === 'add-text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEditMode('add-text')}
                className="w-full justify-start"
              >
                <Type className="w-4 h-4 mr-2" />
                Add New Text
              </Button>
              <Button
                variant={editMode === 'pan' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEditMode('pan')}
                className="w-full justify-start"
              >
                <Move className="w-4 h-4 mr-2" />
                Pan & Navigate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {pdfDocument && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-sm mb-3">Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onExportPDF}
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              {!hideFileUpload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onTriggerFileUpload}
                  className="w-full justify-start"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Load Different PDF
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      {pdfPagesLength > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-sm text-blue-900 mb-2">How to Edit</h3>
            <div className="text-xs text-blue-800 space-y-1">
              <p>• <strong>Select Mode:</strong> Click on text to edit it</p>
              <p>• <strong>Add Text:</strong> Click anywhere to add new text</p>
              <p>• <strong>Pan Mode:</strong> Drag to move around the document</p>
              <p>• Use zoom controls to get a better view</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
