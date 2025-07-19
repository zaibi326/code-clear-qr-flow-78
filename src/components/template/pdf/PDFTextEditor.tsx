
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Save,
  Upload,
  Type,
  MousePointer,
  Maximize2,
  Move,
  AlertCircle
} from 'lucide-react';
import { usePDFTextEditor } from '@/hooks/canvas/usePDFTextEditor';
import { EditableTextBlock } from './EditableTextBlock';
import { PDFSidebarContent } from './components/PDFSidebarContent';
import { PDFPageNavigation } from './components/PDFPageNavigation';
import { toast } from '@/hooks/use-toast';
import { Template } from '@/types/template';

interface PDFTextBlock {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
  color: { r: number; g: number; b: number };
  pageNumber: number;
  isEdited: boolean;
  originalText?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
}

type EditMode = 'select' | 'add-text' | 'pan';

interface PDFTextEditorProps {
  onSave?: () => void;
  onCancel?: () => void;
  template?: Template;
  hideFileUpload?: boolean;
}

export const PDFTextEditor: React.FC<PDFTextEditorProps> = ({
  onSave,
  onCancel,
  template,
  hideFileUpload = false
}) => {
  const [zoom, setZoom] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editMode, setEditMode] = useState<EditMode>('select');
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const {
    pdfDocument,
    pdfPages,
    currentPage,
    setCurrentPage,
    isLoading,
    error,
    editedTextBlocks,
    loadPDF,
    updateTextBlock,
    addTextBlock,
    deleteTextBlock,
    exportPDF
  } = usePDFTextEditor();

  // Convert template data to File object for loading
  const convertTemplateToFile = async (template: Template): Promise<File | null> => {
    try {
      if (template.file && template.file instanceof File) {
        return template.file;
      }

      let blob: Blob;
      const fileName = template.name || 'document.pdf';

      if (template.preview && template.preview.startsWith('data:application/pdf')) {
        console.log('Converting data URL to file');
        const response = await fetch(template.preview);
        blob = await response.blob();
      } else if (template.template_url && template.template_url.startsWith('data:application/pdf')) {
        console.log('Converting template_url data to file');
        const response = await fetch(template.template_url);
        blob = await response.blob();
      } else if (template.template_url && template.template_url.startsWith('blob:')) {
        console.log('Converting blob URL to file');
        const response = await fetch(template.template_url);
        blob = await response.blob();
      } else {
        console.error('No valid PDF data found in template');
        return null;
      }

      return new File([blob], fileName, { type: 'application/pdf' });
    } catch (error) {
      console.error('Error converting template to file:', error);
      return null;
    }
  };

  // Auto-load PDF from template with better error handling
  useEffect(() => {
    const loadTemplateFile = async () => {
      if (template && !selectedFile && !isLoading) {
        console.log('Loading PDF from template:', template.name);
        setLoadError(null);
        
        try {
          const file = await convertTemplateToFile(template);
          if (file) {
            console.log('Template converted to file successfully:', file.name, file.size);
            setSelectedFile(file);
            await loadPDF(file);
          } else {
            const errorMsg = 'Could not convert template to file. The PDF data may be corrupted.';
            setLoadError(errorMsg);
            toast({
              title: 'PDF Load Error',
              description: errorMsg,
              variant: 'destructive'
            });
          }
        } catch (error) {
          console.error('Error loading template:', error);
          const errorMsg = 'Failed to load PDF template. Please try re-uploading the file.';
          setLoadError(errorMsg);
          toast({
            title: 'PDF Load Error',
            description: errorMsg,
            variant: 'destructive'
          });
        }
      }
    };

    loadTemplateFile();
  }, [template, loadPDF, selectedFile, isLoading]);

  // Auto-enable text editing mode when PDF is loaded
  useEffect(() => {
    if (pdfPages.length > 0 && !isLoading && !error) {
      setEditMode('select');
      setLoadError(null);
      
      toast({
        title: 'PDF Loaded Successfully',
        description: 'Click on any text to edit it, or use "Add Text" to create new text.',
      });
    }
  }, [pdfPages.length, isLoading, error]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Please select a PDF file.',
          variant: 'destructive'
        });
        return;
      }

      setSelectedFile(file);
      setLoadError(null);
      
      try {
        await loadPDF(file);
      } catch (error) {
        console.error('Error loading uploaded file:', error);
        setLoadError('Failed to load the uploaded PDF file.');
      }
    }
  };

  const triggerFileUpload = () => {
    const fileInput = document.getElementById('pdf-file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleRetryLoad = async () => {
    if (template) {
      setLoadError(null);
      setSelectedFile(null);
      
      try {
        const file = await convertTemplateToFile(template);
        if (file) {
          setSelectedFile(file);
          await loadPDF(file);
        }
      } catch (error) {
        console.error('Retry failed:', error);
        setLoadError('Retry failed. Please try uploading the PDF again.');
      }
    }
  };

  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (editMode === 'pan') {
      setIsPanning(true);
      setLastPanPoint({ x: event.clientX, y: event.clientY });
      return;
    }

    if (pdfPages.length === 0 || editMode !== 'add-text') return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - panOffset.x) / zoom;
    const y = (event.clientY - rect.top - panOffset.y) / zoom;
    
    addTextBlock(currentPage + 1, x, y, 'Click to edit');
    setEditMode('select');
    
    toast({
      title: 'Text Added',
      description: 'Double-click the new text to edit it.',
    });
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || editMode !== 'pan') return;

    const deltaX = event.clientX - lastPanPoint.x;
    const deltaY = event.clientY - lastPanPoint.y;
    
    setPanOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setLastPanPoint({ x: event.clientX, y: event.clientY });
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
  };

  const handleFitToScreen = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Create unified text blocks showing only editable version (no duplication)
  const getUnifiedTextBlocks = (): PDFTextBlock[] => {
    const currentPageData = pdfPages[currentPage];
    if (!currentPageData) return [];

    const originalTextBlocks = (currentPageData.textBlocks || []) as PDFTextBlock[];
    const editedBlocks = Array.from(editedTextBlocks.values()).filter(
      (block: PDFTextBlock) => block.pageNumber === currentPage + 1
    );

    // Create a map of edited blocks by their ID for quick lookup
    const editedBlocksMap = new Map(editedBlocks.map(block => [block.id, block]));

    // Start with original blocks, but replace with edited versions if they exist
    const unifiedBlocks: PDFTextBlock[] = [];

    // Add original blocks that haven't been edited OR their edited versions
    originalTextBlocks.forEach(originalBlock => {
      const editedVersion = editedBlocksMap.get(originalBlock.id);
      if (editedVersion) {
        unifiedBlocks.push(editedVersion);
        editedBlocksMap.delete(originalBlock.id);
      } else {
        unifiedBlocks.push(originalBlock);
      }
    });

    // Add any new text blocks that were created
    editedBlocksMap.forEach(editedBlock => {
      unifiedBlocks.push(editedBlock);
    });

    return unifiedBlocks;
  };

  const currentPageData = pdfPages[currentPage];
  const unifiedTextBlocks = getUnifiedTextBlocks();
  const totalEditedBlocks = editedTextBlocks.size;

  // Show error state if there's a load error or PDF error
  if (loadError || error) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to Load PDF
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {loadError || error || 'Unable to load PDF file. Please check your internet connection and try again.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleRetryLoad} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
            <Button variant="outline" onClick={triggerFileUpload}>
              Upload New PDF
            </Button>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Hidden file input */}
      <input
        id="pdf-file-input"
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <FileText className="w-5 h-5" />
            PDF Text Editor
          </CardTitle>
          <p className="text-sm text-blue-700">
            Click on text to edit inline - just like Canva
          </p>
        </CardHeader>
        
        <PDFSidebarContent
          selectedFile={selectedFile}
          editMode={editMode}
          setEditMode={setEditMode}
          totalEditedBlocks={totalEditedBlocks}
          pdfPagesLength={pdfPages.length}
          onFileUpload={handleFileUpload}
          onExportPDF={exportPDF}
          pdfDocument={pdfDocument}
          hideFileUpload={hideFileUpload}
          onTriggerFileUpload={triggerFileUpload}
        />

        <PDFPageNavigation
          pdfPages={pdfPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.1))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleFitToScreen}>
              <Maximize2 className="w-4 h-4 mr-1" />
              Fit Screen
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportPDF} disabled={!pdfDocument}>
              <Download className="w-4 h-4 mr-1" />
              Export PDF
            </Button>
            {onSave && (
              <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-1" />
                Save Changes
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
        <div className="flex-1 bg-gray-100 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PDF for editing...</p>
                <p className="text-sm text-gray-500">Setting up Canva-style text editing</p>
              </div>
            </div>
          ) : pdfPages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8 max-w-md">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Upload a PDF to Get Started
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Experience Canva-style PDF editing with inline text editing and easy exports.
                </p>
                <Button
                  onClick={triggerFileUpload}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose PDF File
                </Button>
              </div>
            </div>
          ) : currentPageData ? (
            <div className="flex items-center justify-center min-h-full p-8">
              <div 
                className={`bg-white rounded-lg shadow-lg relative ${
                  editMode === 'add-text' ? 'cursor-crosshair' : 
                  editMode === 'pan' ? 'cursor-move' : 'cursor-default'
                }`}
                style={{
                  width: currentPageData.width * zoom,
                  height: currentPageData.height * zoom,
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                  minWidth: 'fit-content',
                  minHeight: 'fit-content'
                }}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
              >
                {/* Background image - PDF rendered WITHOUT text layer */}
                <div 
                  className="w-full h-full relative overflow-hidden rounded-lg"
                  style={{
                    background: `url(${currentPageData.backgroundImage}) no-repeat center center`,
                    backgroundSize: 'cover'
                  }}
                />
                
                {/* Editable text overlay - ONLY source of visible text */}
                {unifiedTextBlocks.map((textBlock) => (
                  <EditableTextBlock
                    key={textBlock.id}
                    textBlock={textBlock}
                    scale={zoom}
                    onUpdate={updateTextBlock}
                    onDelete={deleteTextBlock}
                  />
                ))}

                {/* Floating Page Controls */}
                <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={editMode === 'select' ? 'default' : 'outline'}
                    onClick={() => setEditMode('select')}
                    className="h-8 px-3"
                  >
                    <MousePointer className="w-4 h-4 mr-1" />
                    Select
                  </Button>
                  <Button
                    size="sm"
                    variant={editMode === 'add-text' ? 'default' : 'outline'}
                    onClick={() => setEditMode('add-text')}
                    className="h-8 px-3"
                  >
                    <Type className="w-4 h-4 mr-1" />
                    Add Text
                  </Button>
                  <Button
                    size="sm"
                    variant={editMode === 'pan' ? 'default' : 'outline'}
                    onClick={() => setEditMode('pan')}
                    className="h-8 px-3"
                  >
                    <Move className="w-4 h-4 mr-1" />
                    Pan
                  </Button>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <span className="text-xs text-gray-500">
                    Page {currentPage + 1}/{pdfPages.length}
                  </span>
                  <span className="text-xs text-green-600 font-medium">
                    ✓ Ready
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <div className="text-red-500 text-lg mb-4">Error Loading PDF Page</div>
                <p className="text-gray-600 mb-4">There was an issue loading the PDF page data.</p>
                <Button variant="outline" onClick={handleRetryLoad}>
                  Retry Loading
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
