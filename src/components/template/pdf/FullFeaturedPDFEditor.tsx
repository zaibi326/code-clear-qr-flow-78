
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Type, 
  Highlighter, 
  Underline, 
  Strikethrough,
  MessageSquare,
  Square,
  Circle,
  Download,
  Upload,
  Save,
  Undo,
  Redo,
  PenTool,
  MousePointer,
  FileText,
  Edit
} from 'lucide-react';
import { useCanvaStylePDFEditor } from '@/hooks/canvas/useCanvaStylePDFEditor';
import { PDFTextEditor } from './components/PDFTextEditor';
import { PDFAnnotationTool } from './components/PDFAnnotationTool';
import { PDFFormFiller } from './components/PDFFormFiller';
import { PDFCanvas } from './components/PDFCanvas';
import { toast } from '@/hooks/use-toast';

interface FullFeaturedPDFEditorProps {
  template?: any;
  onSave?: (editedPDF: Blob) => void;
  onCancel?: () => void;
}

export const FullFeaturedPDFEditor: React.FC<FullFeaturedPDFEditorProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState('text');
  const [selectedTool, setSelectedTool] = useState<'select' | 'text' | 'highlight' | 'underline' | 'strikethrough' | 'comment' | 'draw' | 'shape'>('select');
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    pdfDocument,
    pdfPages,
    currentPage,
    setCurrentPage,
    isLoading,
    textElements,
    shapes,
    images,
    selectedElementId,
    setSelectedElementId,
    canUndo,
    canRedo,
    loadPDF,
    updateTextElement,
    addTextElement,
    addShape,
    deleteElement,
    undo,
    redo,
    exportPDF
  } = useCanvaStylePDFEditor();

  React.useEffect(() => {
    if (template?.file && template.file.type === 'application/pdf') {
      loadPDF(template.file);
    }
  }, [template, loadPDF]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      loadPDF(file);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please select a PDF file.',
        variant: 'destructive'
      });
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportPDF();
      toast({
        title: 'PDF Exported Successfully',
        description: 'Your edited PDF has been downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export PDF. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const currentPageData = pdfPages[currentPage];

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">PDF Editor Pro</h2>
          <p className="text-sm text-gray-600">Full-featured PDF editing with text, annotations, and forms</p>
        </div>

        {/* Tool Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4 mx-4 mt-4">
            <TabsTrigger value="text" className="text-xs">
              <Type className="w-3 h-3 mr-1" />
              Text
            </TabsTrigger>
            <TabsTrigger value="annotate" className="text-xs">
              <Highlighter className="w-3 h-3 mr-1" />
              Annotate
            </TabsTrigger>
            <TabsTrigger value="forms" className="text-xs">
              <FileText className="w-3 h-3 mr-1" />
              Forms
            </TabsTrigger>
            <TabsTrigger value="export" className="text-xs">
              <Download className="w-3 h-3 mr-1" />
              Export
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="text" className="p-4 space-y-4 mt-0">
              <PDFTextEditor
                selectedTool={selectedTool}
                onToolChange={setSelectedTool}
                selectedElementId={selectedElementId}
                textElements={textElements}
                onUpdateTextElement={updateTextElement}
              />
            </TabsContent>

            <TabsContent value="annotate" className="p-4 space-y-4 mt-0">
              <PDFAnnotationTool
                selectedTool={selectedTool}
                onToolChange={setSelectedTool}
                onAddAnnotation={(type, x, y) => {
                  if (type === 'shape') {
                    addShape(currentPage + 1, 'rectangle', x, y);
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="forms" className="p-4 space-y-4 mt-0">
              <PDFFormFiller
                currentPage={currentPage}
                pdfDocument={pdfDocument}
              />
            </TabsContent>

            <TabsContent value="export" className="p-4 space-y-4 mt-0">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Export Options</h3>
                <Button onClick={handleExportPDF} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Edited PDF
                </Button>
                <Button onClick={onSave} variant="outline" className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={undo} disabled={!canUndo} className="flex-1">
              <Undo className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button size="sm" variant="outline" onClick={redo} disabled={!canRedo} className="flex-1">
              <Redo className="w-4 h-4 mr-1" />
              Redo
            </Button>
          </div>
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Upload PDF
          </Button>
          {onCancel && (
            <Button onClick={onCancel} variant="outline" className="w-full">
              Back to Library
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}>
                -
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.1))}>
                +
              </Button>
            </div>

            {/* Tool Selection */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant={selectedTool === 'select' ? 'default' : 'outline'}
                onClick={() => setSelectedTool('select')}
              >
                <MousePointer className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={selectedTool === 'text' ? 'default' : 'outline'}
                onClick={() => setSelectedTool('text')}
              >
                <Type className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={selectedTool === 'highlight' ? 'default' : 'outline'}
                onClick={() => setSelectedTool('highlight')}
              >
                <Highlighter className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Page Navigation */}
          {pdfPages.length > 1 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {pdfPages.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(pdfPages.length - 1, currentPage + 1))}
                disabled={currentPage === pdfPages.length - 1}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 overflow-auto p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PDF for advanced editing...</p>
              </div>
            </div>
          ) : pdfPages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8 max-w-md">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Upload a PDF to Start Editing
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Full-featured PDF editor with text editing, annotations, and form filling.
                </p>
                <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose PDF File
                </Button>
              </div>
            </div>
          ) : (
            <PDFCanvas
              pageData={currentPageData}
              zoom={zoom}
              selectedTool={selectedTool}
              selectedElementId={selectedElementId}
              textElements={textElements}
              shapes={shapes}
              images={images}
              onSelectElement={setSelectedElementId}
              onUpdateTextElement={updateTextElement}
              onAddTextElement={addTextElement}
              onAddShape={addShape}
              currentPage={currentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
