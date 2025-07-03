
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
  Maximize2
} from 'lucide-react';
import { usePDFWordEditor } from '@/hooks/canvas/usePDFWordEditor';
import { EditableWord } from './EditableWord';
import { PDFSidebarContent } from './components/PDFSidebarContent';
import { PDFPageNavigation } from './components/PDFPageNavigation';
import { toast } from '@/hooks/use-toast';
import { Template } from '@/types/template';

interface PDFWord {
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
  spaceAfter?: boolean;
}

interface PDFWordEditorProps {
  onSave?: () => void;
  onCancel?: () => void;
  template?: Template;
  hideFileUpload?: boolean;
}

export const PDFWordEditor: React.FC<PDFWordEditorProps> = ({
  onSave,
  onCancel,
  template,
  hideFileUpload = false
}) => {
  const [zoom, setZoom] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(template?.file || null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  
  const {
    pdfDocument,
    pdfPages,
    currentPage,
    setCurrentPage,
    isLoading,
    editedWords,
    loadPDF,
    updateWord,
    deleteWord,
    exportPDF
  } = usePDFWordEditor();

  useEffect(() => {
    if (pdfPages.length > 0 && !isLoading) {
      toast({
        title: 'PDF Loaded Successfully',
        description: 'All text is now editable word by word. Double-click any word to edit it!',
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
    const fileInput = document.getElementById('pdf-word-file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFitToScreen = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const getUnifiedWords = (): PDFWord[] => {
    const currentPageData = pdfPages[currentPage];
    if (!currentPageData) return [];

    const originalWords = currentPageData.words || [];
    const editedWordsForPage = Array.from(editedWords.values()).filter(
      word => word.pageNumber === currentPage + 1
    );

    const editedWordsMap = new Map(editedWordsForPage.map(word => [word.id, word]));
    const unifiedWords: PDFWord[] = [];

    originalWords.forEach(originalWord => {
      const editedVersion = editedWordsMap.get(originalWord.id);
      if (editedVersion) {
        unifiedWords.push(editedVersion);
        editedWordsMap.delete(originalWord.id);
      } else {
        unifiedWords.push(originalWord);
      }
    });

    editedWordsMap.forEach(editedWord => {
      unifiedWords.push(editedWord);
    });

    return unifiedWords.filter(word => word.text.trim() !== '');
  };

  const currentPageData = pdfPages[currentPage];
  const unifiedWords = getUnifiedWords();
  const totalEditedWords = editedWords.size;

  return (
    <div className="h-screen bg-gray-50 flex">
      <input
        id="pdf-word-file-input"
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
            Word-Level PDF Editor
          </CardTitle>
          <p className="text-sm text-blue-700">
            Edit PDF text word by word with preserved formatting
          </p>
        </CardHeader>
        
        <PDFSidebarContent
          selectedFile={selectedFile}
          editMode="select" // Always in select mode for word editing
          setEditMode={() => {}} // No mode switching needed
          totalEditedBlocks={totalEditedWords}
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
                <p className="text-gray-600">Processing PDF for word-level editing...</p>
                <p className="text-sm text-gray-500">Extracting individual words with preserved formatting</p>
              </div>
            </div>
          ) : pdfPages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8 max-w-md">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Upload a PDF for Word-Level Editing
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Your PDF will be processed to enable word-by-word editing while preserving the original layout and formatting.
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
                className="bg-white rounded-lg shadow-lg relative"
                style={{
                  width: currentPageData.width * zoom,
                  height: currentPageData.height * zoom,
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                  minWidth: 'fit-content',
                  minHeight: 'fit-content'
                }}
              >
                {/* Background image */}
                <div 
                  className="w-full h-full relative overflow-hidden rounded-lg"
                  style={{
                    background: `url(${currentPageData.backgroundImage}) no-repeat center center`,
                    backgroundSize: 'cover'
                  }}
                >
                  {/* Word masks to hide background text */}
                  {unifiedWords.map((word) => (
                    <div
                      key={`mask-${word.id}`}
                      className="absolute bg-white"
                      style={{
                        left: word.x * zoom,
                        top: word.y * zoom,
                        width: word.width * zoom,
                        height: word.height * zoom,
                        zIndex: 0
                      }}
                    />
                  ))}
                </div>
                
                {/* Render editable words */}
                {unifiedWords.map((word) => (
                  <EditableWord
                    key={word.id}
                    word={word}
                    scale={zoom}
                    onUpdate={updateWord}
                    onDelete={deleteWord}
                  />
                ))}

                {/* Page info */}
                <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                  <span className="text-xs text-gray-500">
                    Page {currentPage + 1}/{pdfPages.length} • {unifiedWords.length} words
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
