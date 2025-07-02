
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
  Edit3,
  MousePointer
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
  const [selectedFile, setSelectedFile] = useState<File | null>(template?.file || null);
  const [editMode, setEditMode] = useState<'select' | 'add-text'>('select');
  
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
    deleteTextBlock,
    exportPDF
  } = usePDFTextEditor();

  // Auto-enable text editing mode when PDF is loaded
  useEffect(() => {
    if (pdfPages.length > 0 && !isLoading) {
      setEditMode('select');
      
      toast({
        title: 'PDF Loaded Successfully',
        description: 'You can now click on any text to edit it directly!',
      });
    }
  }, [pdfPages.length, isLoading]);

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

  const triggerFileUpload = () => {
    const fileInput = document.getElementById('pdf-file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleAddText = (event: React.MouseEvent<HTMLDivElement>) => {
    if (pdfPages.length === 0 || editMode !== 'add-text') return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom;
    const y = (event.clientY - rect.top) / zoom;
    
    addTextBlock(currentPage + 1, x, y, 'Click to edit');
    setEditMode('select');
    
    toast({
      title: 'Text Added',
      description: 'Double-click the new text to edit it.',
    });
  };

  // Create unified text blocks that show either original OR edited version, never both
  const getUnifiedTextBlocks = (): PDFTextBlock[] => {
    const currentPageData = pdfPages[currentPage];
    if (!currentPageData) return [];

    const originalTextBlocks = currentPageData.textBlocks || [];
    const editedBlocks = Array.from(editedTextBlocks.values()).filter(
      block => block.pageNumber === currentPage + 1
    );

    // Create a map of edited blocks by their ID for quick lookup
    const editedBlocksMap = new Map(editedBlocks.map(block => [block.id, block]));

    // Start with original blocks, but replace with edited versions if they exist
    const unifiedBlocks: PDFTextBlock[] = [];

    // Add original blocks that haven't been edited
    originalTextBlocks.forEach(originalBlock => {
      const editedVersion = editedBlocksMap.get(originalBlock.id);
      if (editedVersion) {
        // Use the edited version instead of the original
        unifiedBlocks.push(editedVersion);
        editedBlocksMap.delete(originalBlock.id); // Remove from map to avoid duplicates
      } else {
        // Use the original block
        unifiedBlocks.push(originalBlock);
      }
    });

    // Add any new text blocks that were created (not replacements of originals)
    editedBlocksMap.forEach(editedBlock => {
      unifiedBlocks.push(editedBlock);
    });

    return unifiedBlocks;
  };

  const currentPageData = pdfPages[currentPage];
  const unifiedTextBlocks = getUnifiedTextBlocks();
  const totalEditedBlocks = editedTextBlocks.size;

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
            Edit PDF text directly like Canva - True PDF editing, not overlays
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
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setZoom(1)}>
              Reset Zoom
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
        <div className="flex-1 bg-gray-100 overflow-auto p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading and parsing PDF...</p>
                <p className="text-sm text-gray-500">Extracting editable text blocks</p>
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
                  Edit PDF text directly like in Canva. Changes are applied to the actual PDF content, not just overlays.
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
            <div className="flex justify-center">
              <div 
                className={`bg-white rounded-lg shadow-lg relative ${
                  editMode === 'add-text' ? 'cursor-crosshair' : 'cursor-default'
                }`}
                style={{
                  width: currentPageData.width * zoom,
                  height: currentPageData.height * zoom
                }}
                onClick={editMode === 'add-text' ? handleAddText : undefined}
              >
                <img
                  src={currentPageData.backgroundImage}
                  alt={`Page ${currentPage + 1}`}
                  className="w-full h-full object-contain rounded-lg"
                  style={{ width: '100%', height: '100%' }}
                />
                
                {/* Render unified text blocks - no more doubling! */}
                {unifiedTextBlocks.map((textBlock) => (
                  <EditableTextBlock
                    key={textBlock.id}
                    textBlock={textBlock}
                    scale={zoom}
                    onUpdate={updateTextBlock}
                    onDelete={deleteTextBlock}
                  />
                ))}

                {/* Floating Page Editing Options */}
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
                  <div className="h-6 w-px bg-gray-300"></div>
                  <span className="text-xs text-gray-500">
                    Page {currentPage + 1}/{pdfPages.length}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <div className="text-red-500 text-lg mb-4">Error Loading PDF Page</div>
                <p className="text-gray-600 mb-4">There was an issue loading the PDF page data.</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Reload Page
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
