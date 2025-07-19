import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Template } from '@/types/template';
import { usePDFRenderer } from '@/hooks/usePDFRenderer';
import { PDFDocument, rgb } from 'pdf-lib';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Upload, 
  Save, 
  ZoomIn, 
  ZoomOut, 
  ArrowLeft,
  Type,
  MousePointer,
  Search,
  Replace
} from 'lucide-react';

interface CanvaPDFEditorProps {
  template?: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

interface EditableText {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  pageNumber: number;
  originalText: string;
  isEdited: boolean;
}

export const CanvaPDFEditor: React.FC<CanvaPDFEditorProps> = ({
  template: initialTemplate,
  onSave,
  onCancel
}) => {
  // Core state
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(initialTemplate || null);
  const [editableTexts, setEditableTexts] = useState<EditableText[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [tool, setTool] = useState<'select' | 'text'>('select');
  
  // Search and replace
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  
  // PDF processing
  const [originalPdfBytes, setOriginalPdfBytes] = useState<Uint8Array | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PDF rendering hook
  const {
    isLoading,
    pageRenders,
    numPages,
    loadPDF,
    renderAllPages,
    extractTextElements
  } = usePDFRenderer();

  // Load existing PDF if template is provided
  useEffect(() => {
    if (currentTemplate && (currentTemplate.template_url || currentTemplate.preview)) {
      loadExistingPDF();
    }
  }, [currentTemplate]);

  const loadExistingPDF = async () => {
    if (!currentTemplate) return;
    
    try {
      setIsProcessing(true);
      const pdfUrl = currentTemplate.template_url || currentTemplate.preview;
      
      if (pdfUrl) {
        // Load PDF for rendering
        await loadPDF(pdfUrl);
        await renderAllPages({ scale: 1.5 });
        
        // Extract text elements
        const textElements = await extractTextElements();
        const editableTexts: EditableText[] = textElements.map((text, index) => ({
          id: `text-${index}`,
          text: text.text,
          x: text.x,
          y: text.y,
          width: text.width,
          height: text.height,
          fontSize: text.fontSize,
          pageNumber: text.pageNumber,
          originalText: text.text,
          isEdited: false
        }));
        
        setEditableTexts(editableTexts);
        
        // Load original PDF bytes for editing
        const response = await fetch(pdfUrl);
        const arrayBuffer = await response.arrayBuffer();
        setOriginalPdfBytes(new Uint8Array(arrayBuffer));
        
        toast({
          title: "PDF loaded successfully",
          description: `Ready to edit ${textElements.length} text elements`
        });
      }
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({
        title: "Error loading PDF",
        description: "Please try uploading the PDF again",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      toast({
        title: "Invalid file",
        description: "Please select a PDF file",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Create template from uploaded file
      const fileUrl = URL.createObjectURL(file);
      const newTemplate: Template = {
        id: `pdf-editor-${Date.now()}`,
        name: file.name,
        template_url: fileUrl,
        preview: fileUrl,
        thumbnail_url: '',
        category: 'pdf',
        tags: ['pdf-editor'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setCurrentTemplate(newTemplate);
      
      // Load PDF for editing
      await loadPDF(file);
      await renderAllPages({ scale: 1.5 });
      
      // Extract text elements
      const textElements = await extractTextElements();
      const editableTexts: EditableText[] = textElements.map((text, index) => ({
        id: `text-${index}`,
        text: text.text,
        x: text.x,
        y: text.y,
        width: text.width,
        height: text.height,
        fontSize: text.fontSize,
        pageNumber: text.pageNumber,
        originalText: text.text,
        isEdited: false
      }));
      
      setEditableTexts(editableTexts);
      
      // Store original PDF bytes
      const arrayBuffer = await file.arrayBuffer();
      setOriginalPdfBytes(new Uint8Array(arrayBuffer));
      
      toast({
        title: "PDF uploaded successfully",
        description: `Ready to edit ${textElements.length} text elements`
      });
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast({
        title: "Upload failed",
        description: "Please try again with a different PDF",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextEdit = (textId: string, newText: string) => {
    setEditableTexts(prev => prev.map(text => 
      text.id === textId 
        ? { ...text, text: newText, isEdited: newText !== text.originalText }
        : text
    ));
  };

  const handleTextClick = (textId: string) => {
    if (tool === 'select') {
      setSelectedTextId(textId);
    }
  };

  const handleSearchAndReplace = () => {
    if (!searchTerm.trim()) return;
    
    let replacedCount = 0;
    setEditableTexts(prev => prev.map(text => {
      if (text.text.toLowerCase().includes(searchTerm.toLowerCase())) {
        replacedCount++;
        return {
          ...text,
          text: text.text.replace(new RegExp(searchTerm, 'gi'), replaceTerm),
          isEdited: true
        };
      }
      return text;
    }));
    
    toast({
      title: "Search and replace completed",
      description: `Replaced ${replacedCount} instances of "${searchTerm}"`
    });
  };

  const generateEditedPDF = async (): Promise<Uint8Array> => {
    if (!originalPdfBytes) {
      throw new Error('No PDF loaded');
    }

    const pdfDoc = await PDFDocument.load(originalPdfBytes);
    const pages = pdfDoc.getPages();
    
    // Group edits by page
    const editsByPage: { [pageNum: number]: EditableText[] } = {};
    editableTexts.filter(text => text.isEdited).forEach(text => {
      if (!editsByPage[text.pageNumber]) {
        editsByPage[text.pageNumber] = [];
      }
      editsByPage[text.pageNumber].push(text);
    });

    // Apply edits to each page
    for (const [pageNum, pageEdits] of Object.entries(editsByPage)) {
      const page = pages[parseInt(pageNum) - 1];
      if (!page) continue;

      for (const edit of pageEdits) {
        // Remove original text by drawing a white rectangle over it
        page.drawRectangle({
          x: edit.x,
          y: page.getHeight() - edit.y - edit.height,
          width: edit.width,
          height: edit.height,
          color: rgb(1, 1, 1), // White background
        });

        // Draw new text
        page.drawText(edit.text, {
          x: edit.x,
          y: page.getHeight() - edit.y - edit.height / 2,
          size: edit.fontSize,
          color: rgb(0, 0, 0), // Black text
        });
      }
    }

    return await pdfDoc.save();
  };

  const handleSaveTemplate = async () => {
    if (!currentTemplate) return;
    
    try {
      setIsProcessing(true);
      
      // Generate edited PDF
      const editedPdfBytes = await generateEditedPDF();
      const editedPdfBlob = new Blob([editedPdfBytes], { type: 'application/pdf' });
      const editedPdfUrl = URL.createObjectURL(editedPdfBlob);
      
      // Update template with edited PDF and proper customization structure
      const updatedTemplate: Template = {
        ...currentTemplate,
        template_url: editedPdfUrl,
        preview: editedPdfUrl,
        updated_at: new Date().toISOString(),
        customization: {
          canvasWidth: 800,
          canvasHeight: 1200,
          backgroundColor: '#ffffff',
          elements: [],
          version: '1.0',
          editedTexts: editableTexts.filter(text => text.isEdited),
          totalEdits: editableTexts.filter(text => text.isEdited).length
        }
      };
      
      onSave(updatedTemplate);
      
      toast({
        title: "Template saved",
        description: "Your PDF edits have been saved successfully"
      });
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Save failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsProcessing(true);
      
      const editedPdfBytes = await generateEditedPDF();
      const blob = new Blob([editedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentTemplate?.name || 'edited-pdf'}.pdf`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "PDF downloaded",
        description: "Your edited PDF has been downloaded"
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Show upload screen if no PDF is loaded
  if (!currentTemplate) {
    return (
      <div className="h-screen w-full bg-gray-50 flex flex-col">
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
            <h1 className="text-xl font-semibold">PDF Editor</h1>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-2">Upload PDF to Edit</h2>
            <p className="text-gray-600 mb-6">
              Upload a PDF file to start editing text inline like Canva
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Choose PDF File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      {/* Header Toolbar */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">{currentTemplate.name}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Tool Selection */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={tool === 'select' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTool('select')}
            >
              <MousePointer className="w-4 h-4" />
            </Button>
            <Button
              variant={tool === 'text' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTool('text')}
            >
              <Type className="w-4 h-4" />
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Zoom Controls */}
          <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Actions */}
          <Button variant="outline" onClick={handleDownloadPDF} disabled={isProcessing}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={handleSaveTemplate} disabled={isProcessing}>
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Search & Replace */}
        <div className="w-80 bg-white border-r p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-3">Search & Replace</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="search">Search for:</Label>
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter text to find..."
                  />
                </div>
                <div>
                  <Label htmlFor="replace">Replace with:</Label>
                  <Input
                    id="replace"
                    value={replaceTerm}
                    onChange={(e) => setReplaceTerm(e.target.value)}
                    placeholder="Enter replacement text..."
                  />
                </div>
                <Button onClick={handleSearchAndReplace} className="w-full">
                  <Replace className="w-4 h-4 mr-2" />
                  Replace All
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-3">Edited Texts</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {editableTexts.filter(text => text.isEdited).map(text => (
                  <div
                    key={text.id}
                    className="p-2 bg-blue-50 rounded border cursor-pointer hover:bg-blue-100"
                    onClick={() => {
                      setCurrentPage(text.pageNumber);
                      setSelectedTextId(text.id);
                    }}
                  >
                    <div className="text-xs text-gray-500">Page {text.pageNumber}</div>
                    <div className="text-sm font-medium truncate">{text.text}</div>
                    <div className="text-xs text-gray-400 truncate">
                      Original: {text.originalText}
                    </div>
                  </div>
                ))}
                {editableTexts.filter(text => text.isEdited).length === 0 && (
                  <p className="text-sm text-gray-500">No edits made yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 overflow-auto bg-gray-100">
          <div className="flex items-center justify-center min-h-full p-8">
            {pageRenders[currentPage - 1] && (
              <div
                className="relative bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden"
                style={{
                  width: pageRenders[currentPage - 1].width * zoom,
                  height: pageRenders[currentPage - 1].height * zoom,
                }}
              >
                {/* PDF Background */}
                <canvas
                  width={pageRenders[currentPage - 1].canvas.width}
                  height={pageRenders[currentPage - 1].canvas.height}
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                  ref={(canvas) => {
                    if (canvas) {
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.drawImage(pageRenders[currentPage - 1].canvas, 0, 0);
                      }
                    }
                  }}
                />

                {/* Editable Text Overlays */}
                {editableTexts
                  .filter(text => text.pageNumber === currentPage)
                  .map(text => (
                    <EditableTextOverlay
                      key={text.id}
                      text={text}
                      isSelected={selectedTextId === text.id}
                      scale={zoom}
                      onTextChange={(newText) => handleTextEdit(text.id, newText)}
                      onClick={() => handleTextClick(text.id)}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Page Navigation */}
        {numPages > 1 && (
          <div className="w-48 bg-white border-l p-4">
            <h3 className="font-medium mb-3">Pages</h3>
            <div className="space-y-2">
              {Array.from({ length: numPages }, (_, i) => i + 1).map(pageNum => (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-full justify-start"
                >
                  Page {pageNum}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Editable Text Overlay Component
interface EditableTextOverlayProps {
  text: EditableText;
  isSelected: boolean;
  scale: number;
  onTextChange: (newText: string) => void;
  onClick: () => void;
}

const EditableTextOverlay: React.FC<EditableTextOverlayProps> = ({
  text,
  isSelected,
  scale,
  onTextChange,
  onClick
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text.text);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(text.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onTextChange(editValue);
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setEditValue(text.text);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    onTextChange(editValue);
    setIsEditing(false);
  };

  return (
    <div
      className={`absolute cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      } ${text.isEdited ? 'bg-yellow-100 bg-opacity-50' : ''}`}
      style={{
        left: text.x * scale,
        top: text.y * scale,
        width: text.width * scale,
        height: text.height * scale,
        fontSize: text.fontSize * scale,
        lineHeight: `${text.height * scale}px`,
      }}
      onClick={onClick}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full h-full resize-none border-0 bg-white p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            fontSize: text.fontSize * scale,
            fontFamily: 'inherit',
          }}
          autoFocus
        />
      ) : (
        <div
          className="w-full h-full p-1 hover:bg-blue-100 hover:bg-opacity-30 flex items-center"
          style={{
            fontSize: text.fontSize * scale,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {text.text}
        </div>
      )}
    </div>
  );
};
