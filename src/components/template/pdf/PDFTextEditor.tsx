import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Download, 
  Plus, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight,
  Save,
  Upload
} from 'lucide-react';
import { usePDFTextEditor } from '@/hooks/canvas/usePDFTextEditor';
import { EditableTextBlock } from './EditableTextBlock';
import { toast } from '@/hooks/use-toast';

interface PDFTextEditorProps {
  onSave?: () => void;
  onCancel?: () => void;
}

export const PDFTextEditor: React.FC<PDFTextEditorProps> = ({
  onSave,
  onCancel
}) => {
  const [zoom, setZoom] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const {
    pdfDocument,
    pdfPages,
    currentPage,
    setCurrentPage,
    isLoading,
    editedTextBlocks,
    loadPDF,
    updateTextBlock,
    addTextBlock,
    exportPDF
  } = usePDFTextEditor();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      loadPDF(file);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please select a PDF file.',
        variant: 'destructive'
      });
    }
  };

  const handleAddText = (event: React.MouseEvent<HTMLDivElement>) => {
    if (pdfPages.length === 0) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom;
    const y = (event.clientY - rect.top) / zoom;
    
    addTextBlock(currentPage + 1, x, y);
  };

  const handleDeleteTextBlock = (blockId: string) => {
    const newMap = new Map(editedTextBlocks);
    newMap.delete(blockId);
    // This would need to be handled in the hook, but for now we'll just update it
  };

  const currentPageData = pdfPages[currentPage];
  const currentPageTextBlocks = currentPageData?.textBlocks || [];
  const currentPageEdits = Array.from(editedTextBlocks.values()).filter(
    block => block.pageNumber === currentPage + 1
  );

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            PDF Text Editor
          </CardTitle>
          <p className="text-sm text-gray-600">
            Edit PDF text directly like Canva
          </p>
        </CardHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* File Upload */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-medium mb-2 block">Upload PDF</Label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="w-full text-sm"
              />
              {selectedFile && (
                <p className="text-xs text-green-600 mt-2">
                  ✓ {selectedFile.name} loaded
                </p>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <h3 className="font-medium text-blue-900 mb-2">How to Edit:</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Double-click any text to edit</li>
                <li>• Drag text to move position</li>
                <li>• Click canvas to add new text</li>
                <li>• Yellow dot = edited text</li>
                <li>• Export saves real PDF changes</li>
              </ul>
            </CardContent>
          </Card>

          {/* Tools */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-medium mb-2 block">Tools</Label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => toast({ title: 'Click on the canvas to add text' })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Text
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={exportPDF}
                  disabled={!pdfDocument}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Page Navigation */}
          {pdfPages.length > 0 && (
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
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setZoom(1)}>
              Reset
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportPDF} disabled={!pdfDocument}>
              <Download className="w-4 h-4 mr-1" />
              Export PDF
            </Button>
            {onSave && (
              <Button onClick={onSave}>
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            )}
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 overflow-auto p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            </div>
          ) : pdfPages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Upload a PDF to Get Started
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Edit PDF text directly like in Canva
                </p>
                <Button
                  onClick={() => document.querySelector('input[type="file"]')?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Choose PDF File
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div 
                className="bg-white rounded-lg shadow-lg relative cursor-crosshair" 
                style={{
                  width: currentPageData.width * zoom,
                  height: currentPageData.height * zoom
                }}
                onClick={handleAddText}
              >
                {/* Background Image */}
                <img
                  src={currentPageData.backgroundImage}
                  alt={`Page ${currentPage + 1}`}
                  className="w-full h-full object-contain"
                  style={{ width: '100%', height: '100%' }}
                />
                
                {/* Original Text Blocks */}
                {currentPageTextBlocks.map((textBlock) => (
                  <EditableTextBlock
                    key={textBlock.id}
                    textBlock={textBlock}
                    scale={zoom}
                    onUpdate={updateTextBlock}
                  />
                ))}
                
                {/* Edited/Added Text Blocks */}
                {currentPageEdits.map((textBlock) => (
                  <EditableTextBlock
                    key={textBlock.id}
                    textBlock={textBlock}
                    scale={zoom}
                    onUpdate={updateTextBlock}
                    onDelete={handleDeleteTextBlock}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
