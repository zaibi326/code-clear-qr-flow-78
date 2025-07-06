
import React, { useState, useRef, useEffect } from 'react';
import { Template } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, FileText, Type, Square, Circle, Image, 
  Highlighter, Download, Search, Replace, ZoomIn, ZoomOut,
  ChevronLeft, ChevronRight, Upload, Save, Undo, Redo,
  MousePointer, Palette, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, Plus, Trash2, Move, RotateCw
} from 'lucide-react';
import { useCanvaStylePDFEditor } from '@/hooks/canvas/useCanvaStylePDFEditor';
import { toast } from '@/hooks/use-toast';

interface CanvaFullFeaturedEditorProps {
  template?: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export const CanvaFullFeaturedEditor: React.FC<CanvaFullFeaturedEditorProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState('text');
  const [selectedTool, setSelectedTool] = useState<'select' | 'text' | 'shape' | 'image' | 'highlight'>('select');
  const [zoom, setZoom] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const {
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
    addImage,
    deleteElement,
    undo,
    redo,
    exportPDF
  } = useCanvaStylePDFEditor();

  useEffect(() => {
    if (template?.file && template.file.type === 'application/pdf') {
      loadPDF(template.file);
    }
  }, [template, loadPDF]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please select a PDF file.',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        title: 'File too large',
        description: 'Please select a PDF file smaller than 100MB.',
        variant: 'destructive'
      });
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    try {
      await loadPDF(file);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const pageCenter = pdfPages[currentPage];
      if (pageCenter) {
        addImage(currentPage + 1, file, pageCenter.width / 2 - 100, pageCenter.height / 2 - 75);
      }
    }
  };

  const handleSearchAndReplace = () => {
    if (!searchText) {
      toast({
        title: 'Search text required',
        description: 'Please enter text to search for.',
        variant: 'destructive'
      });
      return;
    }

    // Find and replace text in current page text elements
    const currentPageElements = Array.from(textElements.values())
      .filter(el => el.pageNumber === currentPage + 1);

    let replacedCount = 0;
    currentPageElements.forEach(element => {
      if (element.text.toLowerCase().includes(searchText.toLowerCase())) {
        const newText = element.text.replace(
          new RegExp(searchText, 'gi'), 
          replaceText || searchText
        );
        updateTextElement(element.id, { text: newText });
        replacedCount++;
      }
    });

    toast({
      title: 'Search and Replace Complete',
      description: `Replaced ${replacedCount} instances on current page.`,
    });
  };

  const handleExportPDF = async () => {
    try {
      const editedPDF = await exportPDF();
      if (editedPDF) {
        const url = URL.createObjectURL(editedPDF);
        const a = document.createElement('a');
        a.href = url;
        a.download = `edited-${template?.name || 'document'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: 'PDF Exported Successfully',
          description: 'Your edited PDF has been downloaded.',
        });
      }
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export PDF. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSave = async () => {
    try {
      const editedPDF = await exportPDF();
      if (onSave && editedPDF && template) {
        // Create updated template with new PDF data
        const updatedTemplate: Template = {
          ...template,
          // In a real implementation, you'd upload the blob to storage and get a new URL
          preview: URL.createObjectURL(editedPDF),
          file: new File([editedPDF], template.name, { type: 'application/pdf' })
        };
        onSave(updatedTemplate);
        
        toast({
          title: 'Changes Saved',
          description: 'Your PDF changes have been saved.',
        });
      }
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Failed to save PDF. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const selectedElement = selectedElementId ? 
    textElements.get(selectedElementId) || shapes.get(selectedElementId) || images.get(selectedElementId) 
    : null;

  const currentPageData = pdfPages[currentPage];

  return (
    <div className="h-screen bg-gray-50 flex">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Left Sidebar - Canva Style */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">PDF Editor</h2>
          </div>
          
          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            variant="outline" 
            className="w-full mb-4"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload New PDF
          </Button>
        </div>

        {/* Tool Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4 mx-4 mt-4">
            <TabsTrigger value="text" className="text-xs">
              <Type className="w-3 h-3 mr-1" />
              Text
            </TabsTrigger>
            <TabsTrigger value="elements" className="text-xs">
              <Square className="w-3 h-3 mr-1" />
              Elements
            </TabsTrigger>
            <TabsTrigger value="images" className="text-xs">
              <Image className="w-3 h-3 mr-1" />
              Images
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-xs">
              <Highlighter className="w-3 h-3 mr-1" />
              Tools
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            {/* Text Tab */}
            <TabsContent value="text" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Add Text</h3>
                <Button
                  onClick={() => {
                    const pageData = pdfPages[currentPage];
                    if (pageData) {
                      addTextElement(currentPage + 1, 100, 100, 'Click to edit');
                      setSelectedTool('text');
                    }
                  }}
                  className="w-full mb-3"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Text Box
                </Button>
              </div>

              {/* Search and Replace */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Search & Replace</h3>
                <div className="space-y-2">
                  <Input
                    placeholder="Search for text..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="h-8"
                  />
                  <Input
                    placeholder="Replace with..."
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    className="h-8"
                  />
                  <Button onClick={handleSearchAndReplace} size="sm" className="w-full">
                    <Replace className="w-3 h-3 mr-1" />
                    Replace All
                  </Button>
                </div>
              </div>

              {/* Text Formatting - Show when text element is selected */}
              {selectedElement && 'text' in selectedElement && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Text Formatting</h3>
                  <div className="space-y-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Bold className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Italic className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Underline className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="flex-1">
                        <AlignLeft className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <AlignCenter className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <AlignRight className="w-3 h-3" />
                      </Button>
                    </div>
                    <Input
                      type="number"
                      placeholder="Font size"
                      value={selectedElement.fontSize || 16}
                      onChange={(e) => updateTextElement(selectedElement.id, { 
                        fontSize: parseInt(e.target.value) || 16 
                      })}
                      className="h-8"
                    />
                    <Input
                      type="color"
                      value={selectedElement.color || '#000000'}
                      onChange={(e) => updateTextElement(selectedElement.id, { 
                        color: e.target.value 
                      })}
                      className="h-8"
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Elements Tab */}
            <TabsContent value="elements" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Shapes</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const pageData = pdfPages[currentPage];
                      if (pageData) {
                        addShape(currentPage + 1, 'rectangle', 100, 100);
                        setSelectedTool('shape');
                      }
                    }}
                    className="h-16 flex flex-col items-center gap-1"
                  >
                    <Square className="w-6 h-6" />
                    <span className="text-xs">Rectangle</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const pageData = pdfPages[currentPage];
                      if (pageData) {
                        addShape(currentPage + 1, 'circle', 100, 100);
                        setSelectedTool('shape');
                      }
                    }}
                    className="h-16 flex flex-col items-center gap-1"
                  >
                    <Circle className="w-6 h-6" />
                    <span className="text-xs">Circle</span>
                  </Button>
                </div>
              </div>

              {/* Element Properties - Show when element is selected */}
              {selectedElement && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Element Properties</h3>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Move className="w-3 h-3 mr-1" />
                        Move
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <RotateCw className="w-3 h-3 mr-1" />
                        Rotate
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => selectedElementId && deleteElement(selectedElementId)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete Element
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Add Images</h3>
                <Button
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full mb-3"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Watermark</h3>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // Add watermark functionality
                    toast({
                      title: 'Watermark Feature',
                      description: 'Watermark functionality coming soon!',
                    });
                  }}
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Add Watermark
                </Button>
              </div>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Annotation Tools</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setSelectedTool('highlight')}
                  >
                    <Highlighter className="w-4 h-4 mr-2" />
                    Highlight Text
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Export Options</h3>
                <div className="space-y-2">
                  <Button onClick={handleExportPDF} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button onClick={handleSave} variant="outline" className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Action Buttons */}
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
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
                variant={selectedTool === 'shape' ? 'default' : 'outline'}
                onClick={() => setSelectedTool('shape')}
              >
                <Square className="w-4 h-4" />
              </Button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.1))}>
                <ZoomIn className="w-4 h-4" />
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
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600 min-w-[100px] text-center">
                Page {currentPage + 1} of {pdfPages.length}
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
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 overflow-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            </div>
          ) : pdfPages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Card className="max-w-md">
                <CardContent className="text-center p-8">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Upload a PDF to Start Editing
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload a PDF file up to 100MB to begin editing with our full-featured editor.
                  </p>
                  <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose PDF File
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex justify-center">
              <div 
                className="bg-white shadow-xl border relative"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center top',
                  width: currentPageData?.width || 595,
                  height: currentPageData?.height || 842,
                  minHeight: '600px'
                }}
              >
                {/* PDF Background */}
                {currentPageData?.backgroundImage ? (
                  <img 
                    src={currentPageData.backgroundImage}
                    alt={`Page ${currentPage + 1}`}
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-lg font-medium mb-2">PDF Page {currentPage + 1}</div>
                      <div className="text-sm">Click to add elements</div>
                    </div>
                  </div>
                )}

                {/* Overlay for text elements, shapes, etc. would be rendered here */}
                {/* This would integrate with the PDF canvas implementation */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
