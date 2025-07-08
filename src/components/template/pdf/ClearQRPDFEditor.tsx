
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Template } from '@/types/template';
import { usePDFRenderer } from '@/hooks/usePDFRenderer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PDFUploadZone } from './components/PDFUploadZone';
import { EnhancedPDFCanvas } from './components/EnhancedPDFCanvas';
import { PDFExportDialog } from './components/PDFExportDialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
  properties: Record<string, any>;
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
    extractTextElements
  } = usePDFRenderer();

  // Handle PDF upload
  const handlePDFUpload = useCallback(async (file: File) => {
    try {
      console.log('📄 Starting PDF upload for enhanced ClearQR editor:', file.name);
      setIsProcessing(true);
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('pdf')
        .upload(`enhanced-pdfs/${Date.now()}-${file.name}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('pdf')
        .getPublicUrl(data.path);

      console.log('✅ PDF uploaded successfully:', publicUrl);

      // Load PDF for rendering and text extraction
      const pdfDoc = await loadPDF(file);
      if (!pdfDoc) {
        throw new Error('Failed to load PDF document');
      }

      // Render all pages with proper scale
      const renders = await renderAllPages({ scale: 1.5, enableTextLayer: true });
      console.log('✅ Pages rendered:', renders.length);

      // Extract text elements for direct editing
      const textElements = await extractTextElements();
      console.log('✅ Text elements extracted:', textElements.length);

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
        properties: {}
      }));

      setElements(convertedElements);
      
      const template: Template = {
        id: `enhanced-pdf-${Date.now()}`,
        name: file.name.replace('.pdf', ''),
        template_url: publicUrl,
        preview: '',
        thumbnail_url: '',
        category: 'pdf-editor',
        tags: ['pdf', 'enhanced', 'editable'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        customization: {
          canvasWidth: renders[0]?.width || 800,
          canvasHeight: renders[0]?.height || 1000,
          backgroundColor: '#ffffff',
          elements: convertedElements,
          version: '4.0'
        }
      };
      
      setCurrentTemplate(template);
      setCurrentPage(1);
      
      toast({
        title: "PDF loaded successfully",
        description: `${file.name} with ${numPages} pages is ready for enhanced editing`,
      });
    } catch (error) {
      console.error('PDF upload failed:', error);
      toast({
        title: "Upload failed",  
        description: error instanceof Error ? error.message : "Failed to load PDF file",
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
      properties: element.properties || {}
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
        version: '4.0'
      },
      updated_at: new Date().toISOString()
    };
    
    setCurrentTemplate(updatedTemplate);
    onSave(updatedTemplate);
    
    toast({
      title: "Project saved",
      description: "Your enhanced PDF edits have been saved successfully",
    });
  }, [currentTemplate, elements, onSave]);

  // Handle export
  const handleExport = useCallback(() => {
    console.log('Exporting enhanced PDF with', elements.length, 'elements');
    setShowExportDialog(true);
  }, [elements]);

  // Show upload screen if no PDF is loaded
  if (!currentTemplate || pageRenders.length === 0) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="absolute top-4 left-4">
          <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </Button>
        </div>
        
        <PDFUploadZone
          onUpload={handlePDFUpload}
          onCancel={onCancel}
          isLoading={isProcessing || isLoading}
        />
      </div>
    );
  }

  const currentPageElements = elements.filter(el => el.pageNumber === currentPage);

  return (
    <div className="h-screen w-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{currentTemplate.name}</h1>
            <p className="text-sm text-gray-600">Enhanced PDF Editor • {numPages} pages</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{elements.length} elements</span>
        </div>
      </div>

      {/* Main Canvas */}
      <EnhancedPDFCanvas
        pageRender={pageRenders[currentPage - 1]}
        elements={currentPageElements}
        selectedElementId={selectedElementId}
        onSelectElement={setSelectedElementId}
        onUpdateElement={updateElement}
        onAddElement={addElement}
        onDeleteElement={deleteElement}
        zoom={zoom}
        onZoomChange={setZoom}
        activeTool={activeTool}
        onToolChange={setActiveTool}
        currentPage={currentPage}
        totalPages={numPages}
        onPageChange={setCurrentPage}
        onSave={handleSave}
        onExport={handleExport}
      />

      {/* Export Dialog */}
      {showExportDialog && (
        <PDFExportDialog
          template={currentTemplate}
          elements={elements}
          onClose={() => setShowExportDialog(false)}
          onExport={(format) => {
            console.log(`Exporting enhanced PDF as ${format}`);
            setShowExportDialog(false);
            toast({
              title: "Export started",
              description: `Exporting PDF as ${format}...`,
            });
          }}
        />
      )}
    </div>
  );
};
