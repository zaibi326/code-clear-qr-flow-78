
import React, { useState, useCallback, useEffect } from 'react';
import { Template } from '@/types/template';
import { usePDFRenderer } from '@/hooks/usePDFRenderer';
import { PDFDocument, rgb } from 'pdf-lib';
import { toast } from '@/hooks/use-toast';
import { PDFEditorToolbar } from './components/PDFEditorToolbar';
import { PDFUploadZone } from './components/PDFUploadZone';
import { PDFCanvas } from './components/PDFCanvas';
import { InlineTextEditor } from './components/InlineTextEditor';

interface CanvaStylePDFEditorProps {
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

export const CanvaStylePDFEditor: React.FC<CanvaStylePDFEditorProps> = ({
  template: initialTemplate,
  onSave,
  onCancel
}) => {
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(initialTemplate || null);
  const [editableTexts, setEditableTexts] = useState<EditableText[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalPdfBytes, setOriginalPdfBytes] = useState<Uint8Array | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);

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

  // Trigger rendering after PDF is loaded and numPages is available
  useEffect(() => {
    if (numPages > 0 && !isLoading && pageRenders.length === 0) {
      console.log('PDF loaded with pages, triggering render...');
      renderAllPages({ scale: 1.5 }).then(() => {
        console.log('Pages rendered successfully');
      }).catch(error => {
        console.error('Error rendering pages:', error);
      });
    }
  }, [numPages, isLoading, pageRenders.length, renderAllPages]);

  const loadExistingPDF = async () => {
    if (!currentTemplate) return;
    
    try {
      setIsProcessing(true);
      setLoadingError(null);
      
      let pdfUrl = currentTemplate.template_url || currentTemplate.preview;
      
      console.log('Loading existing PDF template:', {
        name: currentTemplate.name,
        hasTemplateUrl: !!currentTemplate.template_url,
        hasPreview: !!currentTemplate.preview,
        urlType: pdfUrl?.startsWith('data:') ? 'data-url' : pdfUrl?.startsWith('blob:') ? 'blob-url' : 'http-url',
        urlLength: pdfUrl?.length
      });
      
      if (!pdfUrl) {
        throw new Error('No PDF data available. Please upload the PDF file again.');
      }
      
      // Handle data URLs (base64 encoded PDFs)
      if (pdfUrl.startsWith('data:application/pdf')) {
        console.log('Loading PDF from data URL');
        // Convert data URL to blob, then to File for PDF.js
        const response = await fetch(pdfUrl);
        const blob = await response.blob();
        const file = new File([blob], currentTemplate.name || 'document.pdf', { type: 'application/pdf' });
        await loadPDF(file);
      } 
      // Handle blob URLs (temporary URLs)
      else if (pdfUrl.startsWith('blob:')) {
        console.log('Loading PDF from blob URL');
        try {
          const response = await fetch(pdfUrl);
          const blob = await response.blob();
          const file = new File([blob], currentTemplate.name || 'document.pdf', { type: 'application/pdf' });
          await loadPDF(file);
        } catch (blobError) {
          console.error('Blob URL expired:', blobError);
          throw new Error('PDF file is no longer available. Please upload the PDF file again.');
        }
      }
      // Handle HTTP URLs
      else {
        console.log('Loading PDF from HTTP URL');
        const response = await fetch(pdfUrl);
        const blob = await response.blob();
        const file = new File([blob], currentTemplate.name || 'document.pdf', { type: 'application/pdf' });
        await loadPDF(file);
      }
      
      console.log('PDF loaded successfully, rendering pages...');
      await renderAllPages({ scale: 1.5 });
      
      const textElements = await extractTextElements();
      console.log('Text elements extracted:', textElements.length);
      
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
      if (pdfUrl.startsWith('data:application/pdf')) {
        // Convert data URL to bytes
        const response = await fetch(pdfUrl);
        const arrayBuffer = await response.arrayBuffer();
        setOriginalPdfBytes(new Uint8Array(arrayBuffer));
      } else {
        // Load from URL
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        setOriginalPdfBytes(new Uint8Array(arrayBuffer));
      }
      
      toast({
        title: "PDF loaded successfully",
        description: `Ready to edit ${textElements.length} text elements`
      });
    } catch (error) {
      console.error('Error loading PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setLoadingError(errorMessage);
      
      toast({
        title: "Error loading PDF",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      
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
      
      await loadPDF(file);
      await renderAllPages({ scale: 1.5 });
      
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

  const handleTextUpdate = (textId: string, newText: string) => {
    setEditableTexts(prev => prev.map(text => 
      text.id === textId 
        ? { ...text, text: newText, isEdited: newText !== text.originalText }
        : text
    ));
  };

  const handleTextClick = (x: number, y: number) => {
    const clickedText = editableTexts
      .filter(text => text.pageNumber === currentPage)
      .find(text => 
        x >= text.x && x <= text.x + text.width &&
        y >= text.y && y <= text.y + text.height
      );
    
    if (clickedText) {
      setSelectedTextId(clickedText.id);
    } else {
      setSelectedTextId(null);
    }
  };

  const generateEditedPDF = async (): Promise<Uint8Array> => {
    if (!originalPdfBytes) {
      throw new Error('No PDF loaded');
    }

    const pdfDoc = await PDFDocument.load(originalPdfBytes);
    const pages = pdfDoc.getPages();
    
    const editsByPage: { [pageNum: number]: EditableText[] } = {};
    editableTexts.filter(text => text.isEdited).forEach(text => {
      if (!editsByPage[text.pageNumber]) {
        editsByPage[text.pageNumber] = [];
      }
      editsByPage[text.pageNumber].push(text);
    });

    for (const [pageNum, pageEdits] of Object.entries(editsByPage)) {
      const page = pages[parseInt(pageNum) - 1];
      if (!page) continue;

      for (const edit of pageEdits) {
        page.drawRectangle({
          x: edit.x,
          y: page.getHeight() - edit.y - edit.height,
          width: edit.width,
          height: edit.height,
          color: rgb(1, 1, 1),
        });

        page.drawText(edit.text, {
          x: edit.x,
          y: page.getHeight() - edit.y - edit.height / 2,
          size: edit.fontSize,
          color: rgb(0, 0, 0),
        });
      }
    }

    return await pdfDoc.save();
  };

  const handleSave = async () => {
    if (!currentTemplate) return;
    
    try {
      setIsProcessing(true);
      
      const editedPdfBytes = await generateEditedPDF();
      const editedPdfBlob = new Blob([editedPdfBytes], { type: 'application/pdf' });
      const editedPdfUrl = URL.createObjectURL(editedPdfBlob);
      
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

  const handleDownload = async () => {
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

  const hasChanges = editableTexts.some(text => text.isEdited);

  // Show error state if loading failed
  if (loadingError && !isLoading && !isProcessing) {
    return (
      <div className="h-screen w-full flex flex-col">
        <PDFEditorToolbar
          onBack={onCancel}
          onUploadNew={() => setCurrentTemplate(null)}
          onSave={() => {}}
          onDownload={() => {}}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          zoom={1}
        />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">Failed to Load PDF</h2>
            <p className="text-gray-600 mb-6">{loadingError}</p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setLoadingError(null);
                  if (currentTemplate) {
                    loadExistingPDF();
                  }
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => setCurrentTemplate(null)}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Upload New PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentTemplate) {
    return (
      <div className="h-screen w-full flex flex-col">
        <PDFEditorToolbar
          onBack={onCancel}
          onUploadNew={() => {}}
          onSave={() => {}}
          onDownload={() => {}}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          zoom={1}
        />
        <PDFUploadZone 
          onFileSelect={handleFileUpload}
          isUploading={isProcessing}
        />
      </div>
    );
  }

  if (isLoading || isProcessing) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isProcessing ? 'Processing PDF...' : 'Loading PDF...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      <PDFEditorToolbar
        templateName={currentTemplate.name}
        zoom={zoom}
        onZoomIn={() => setZoom(Math.min(2, zoom + 0.1))}
        onZoomOut={() => setZoom(Math.max(0.5, zoom - 0.1))}
        onSave={handleSave}
        onDownload={handleDownload}
        onBack={onCancel}
        onUploadNew={() => setCurrentTemplate(null)}
        isProcessing={isProcessing}
        hasChanges={hasChanges}
      />

      <div className="flex-1 overflow-auto">
        <div className="flex items-center justify-center min-h-full p-8">
          {pageRenders[currentPage - 1] && (
            <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
              <PDFCanvas
                pageRender={pageRenders[currentPage - 1]}
                zoom={zoom}
                onTextClick={handleTextClick}
              />

              {editableTexts
                .filter(text => text.pageNumber === currentPage)
                .map(text => (
                  <InlineTextEditor
                    key={text.id}
                    textElement={text}
                    scale={zoom}
                    isSelected={selectedTextId === text.id}
                    onUpdate={handleTextUpdate}
                    onSelect={() => setSelectedTextId(text.id)}
                    onDeselect={() => setSelectedTextId(null)}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {numPages > 1 && (
        <div className="bg-white border-t p-4 flex justify-center">
          <div className="flex items-center gap-2">
            {Array.from({ length: numPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
