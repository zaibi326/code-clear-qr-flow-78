
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
    <div className="flex-1 p-4 space-y-6 overflow-y-auto">
      {/* File Upload Section */}
      {!hideFileUpload && !selectedFile && (
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload PDF Document</h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose a PDF file to start editing and customization
              </p>
              <Button 
                onClick={onTriggerFileUpload}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                size="lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Select PDF File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Information */}
      {selectedFile && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Type className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Current Document</h3>
                  <p className="text-sm text-gray-600">Ready for editing</p>
                </div>
              </div>
              <div className="space-y-2 pl-13">
                <p className="text-sm font-medium text-gray-800 truncate">{selectedFile.name}</p>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  <span>•</span>
                  <span>{pdfPagesLength} pages</span>
                </div>
                {totalEditedBlocks > 0 && (
                  <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    <Edit3 className="w-3 h-3" />
                    {totalEditedBlocks} edits made
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Edit Mode Controls */}
      {pdfPagesLength > 0 && (
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MousePointer className="w-5 h-5 text-gray-600" />
              Editing Tools
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant={editMode === 'select' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setEditMode('select')}
                className="justify-start h-12 font-medium"
              >
                <MousePointer className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div>Select & Edit</div>
                  <div className="text-xs opacity-70">Click text to modify</div>
                </div>
              </Button>
              <Button
                variant={editMode === 'add-text' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setEditMode('add-text')}
                className="justify-start h-12 font-medium"
              >
                <Type className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div>Add New Text</div>
                  <div className="text-xs opacity-70">Click anywhere to add</div>
                </div>
              </Button>
              <Button
                variant={editMode === 'pan' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setEditMode('pan')}
                className="justify-start h-12 font-medium"
              >
                <Move className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div>Pan & Navigate</div>
                  <div className="text-xs opacity-70">Drag to move around</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Actions */}
      {pdfDocument && (
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-gray-600" />
              Document Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="default"
                size="lg"
                onClick={onExportPDF}
                className="w-full justify-start h-12 bg-green-600 hover:bg-green-700"
              >
                <Download className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div>Export PDF</div>
                  <div className="text-xs opacity-90">Save your changes</div>
                </div>
              </Button>
              {!hideFileUpload && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onTriggerFileUpload}
                  className="w-full justify-start h-12"
                >
                  <Upload className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div>Load Different PDF</div>
                    <div className="text-xs opacity-70">Choose another file</div>
                  </div>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Help Guide */}
      {pdfPagesLength > 0 && (
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <Type className="w-5 h-5" />
              Quick Guide
            </h3>
            <div className="space-y-3 text-sm text-amber-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">1</span>
                </div>
                <div>
                  <div className="font-medium">Select Mode</div>
                  <div className="text-xs">Click on existing text to edit content, font, or styling</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">2</span>
                </div>
                <div>
                  <div className="font-medium">Add Text Mode</div>
                  <div className="text-xs">Click anywhere on the document to insert new text</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">3</span>
                </div>
                <div>
                  <div className="font-medium">Pan Mode</div>
                  <div className="text-xs">Drag to navigate around large documents</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-amber-100 rounded-lg">
                <div className="text-xs font-medium text-amber-800">
                  💡 Tip: Use zoom controls for precise editing and better visibility
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
