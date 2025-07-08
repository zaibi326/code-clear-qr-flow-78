
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Template } from '@/types/template';
import { usePDFRenderer } from '@/hooks/usePDFRenderer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PDFUploadZone } from './components/PDFUploadZone';
import { PDFEditorToolbar } from './components/PDFEditorToolbar';
import { PDFEditorCanvas } from './components/PDFEditorCanvas';
import { PDFEditorSidebar } from './components/PDFEditorSidebar';
import { PDFExportDialog } from './components/PDFExportDialog';

interface ClearQRPDFEditorProps {
  template?: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export interface PDFTextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  color: string;
  backgroundColor: string;
  opacity: number;
  rotation: number;
  pageNumber: number;
  isEdited: boolean;
  originalText?: string;
}

export interface PDFElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
  properties?: Record<string, any>; // Add properties field for CanvasElement compatibility
  // Text properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  backgroundColor?: string;
  // Image properties
  src?: string;
  // Shape properties
  shapeType?: 'rectangle' | 'circle' | 'line';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  // Common properties
  opacity?: number;
  rotation?: number;
  isEdited?: boolean;
}

export const ClearQRPDFEditor: React.FC<ClearQRPDFEditorProps> = ({
  template: initialTemplate,
  onSave,
  onCancel
}) => {
  // Core state
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(initialTemplate || null);
  const [elements, setElements] = useState<PDFElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'image' | 'shape'>('select');
  
  // UI state
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // PDF rendering hook
  const {
    isLoading,
    pageRenders,
    numPages,
    documentInfo,
    error,
    loadPDF,
    renderAllPages,
    searchInPDF,
    extractTextElements
  } = usePDFRenderer();

  // Handle PDF upload
  const handlePDFUpload = useCallback(async (file: File) => {
    try {
      console.log('📄 Starting PDF upload for ClearQR editor:', file.name);
      setIsProcessing(true);
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('pdf')
        .upload(`clearqr-pdfs/${Date.now()}-${file.name}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('pdf')
        .getPublicUrl(data.path);

      console.log('✅ PDF uploaded successfully:', publicUrl);

      // Load PDF for rendering and text extraction
      await loadPDF(file);
      await renderAllPages({ scale: 1.5, enableTextLayer: true });

      // Extract text elements for direct editing
      const textElements = await extractTextElements();
      const convertedElements: PDFElement[] = textElements.map((textEl, index) => ({
        id: `text-${index}-${Date.now()}`,
        type: 'text' as const,
        x: textEl.x,
        y: textEl.y,
        width: textEl.width,
        height: textEl.height,
        pageNumber: textEl.pageNumber,
        text: textEl.text,
        fontSize: textEl.fontSize,
        fontFamily: textEl.fontFamily || 'Arial',
        fontWeight: textEl.fontWeight || 'normal',
        fontStyle: textEl.fontStyle || 'normal',
        textAlign: textEl.textAlign || 'left',
        color: textEl.color || '#000000',
        backgroundColor: 'transparent',
        opacity: 1,
        rotation: 0,
        isEdited: false,
        properties: {} // Initialize properties for CanvasElement compatibility
      }));

      setElements(convertedElements);
      
      const template: Template = {
        id: `clearqr-pdf-${Date.now()}`,
        name: file.name.replace('.pdf', ''),
        template_url: publicUrl,
        preview: '',
        thumbnail_url: '',
        category: 'pdf-editor',
        tags: ['pdf', 'clearqr', 'editable'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        customization: {
          canvasWidth: 800,
          canvasHeight: 1000,
          backgroundColor: '#ffffff',
          elements: convertedElements,
          version: '3.0'
        }
      };
      
      setCurrentTemplate(template);
      setCurrentPage(1);
      
      toast({
        title: "PDF loaded successfully",
        description: `${file.name} with ${numPages} pages is ready for editing`,
      });
    } catch (error) {
      console.error('PDF upload failed:', error);
      toast({
        title: "Upload failed",  
        description: "Failed to load PDF file",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [loadPDF, renderAllPages, extractTextElements, numPages]);

  // Element management
  const addElement = useCallback((element: Omit<PDFElement, 'id'>) => {
    const id = `${element.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newElement: PDFElement = { 
      ...element, 
      id,
      properties: element.properties || {} // Ensure properties exist
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElementId(id);
    return id;
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<PDFElement>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates, isEdited: true } : el
    ));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  // Save template  
  const handleSave = useCallback(() => {
    if (!currentTemplate) return;
    
    const updatedTemplate: Template = {
      ...currentTemplate,
      customization: {
        ...currentTemplate.customization,
        elements: elements,
        version: '3.0'
      },
      updated_at: new Date().toISOString()
    };
    
    setCurrentTemplate(updatedTemplate);
    onSave(updatedTemplate);
    
    toast({
      title: "Project saved",
      description: "Your PDF edits have been saved successfully",
    });
  }, [currentTemplate, elements, onSave]);

  // Show upload screen if no PDF is loaded
  if (!currentTemplate) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <PDFUploadZone
          onUpload={handlePDFUpload}
          onCancel={onCancel}
          isLoading={isProcessing || isLoading}
        />
      </div>
    );
  }

  const selectedElement = selectedElementId ? elements.find(el => el.id === selectedElementId) : null;
  const currentPageElements = elements.filter(el => el.pageNumber === currentPage);

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      {/* Header Toolbar */}
      <PDFEditorToolbar
        currentTemplate={currentTemplate}
        activeTool={activeTool}
        onToolChange={setActiveTool}
        zoom={zoom}
        onZoomChange={setZoom}
        currentPage={currentPage}
        totalPages={numPages}
        onPageChange={setCurrentPage}
        onSave={handleSave}
        onExport={() => setShowExportDialog(true)}
        onCancel={onCancel}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools and Properties */}
        <PDFEditorSidebar
          activeTool={activeTool}
          selectedElement={selectedElement}
          onUpdateElement={updateElement}
          onDeleteElement={deleteElement}
          onAddElement={addElement}
          currentPage={currentPage}
        />

        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-auto bg-gray-100">
          <PDFEditorCanvas
            pageRender={pageRenders[currentPage - 1]}
            elements={currentPageElements}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElement={updateElement}
            onAddElement={addElement}
            zoom={zoom}
            activeTool={activeTool}
            currentPage={currentPage}
          />
        </div>
      </div>

      {/* Export Dialog */}
      {showExportDialog && (
        <PDFExportDialog
          template={currentTemplate}
          elements={elements}
          onClose={() => setShowExportDialog(false)}
          onExport={(format) => {
            console.log(`Exporting as ${format}`);
            setShowExportDialog(false);
          }}
        />
      )}
    </div>
  );
};
