import React, { useState, useEffect, useCallback } from 'react';
import { Template } from '@/types/template';
import { usePDFRenderer } from '@/hooks/usePDFRenderer';
import { pdfOperationsService } from '@/services/pdfOperationsService';
import { supabase } from '@/integrations/supabase/client';
import { CanvaUploadArea } from './components/CanvaUploadArea';
import { CanvaToolbar } from './components/CanvaToolbar';
import { CanvaCanvas } from './components/CanvaCanvas';
import { CanvaPropertiesPanel } from './components/CanvaPropertiesPanel';
import { CanvaPageThumbnails } from './components/CanvaPageThumbnails';
import { CanvaExportPanel } from './components/CanvaExportPanel';
import { toast } from '@/hooks/use-toast';

interface FullCanvaPDFEditorProps {
  template?: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export interface CanvaElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'annotation' | 'highlight' | 'comment';
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
  visible: boolean;
  locked: boolean;
  rotation: number;
  opacity: number;
  zIndex: number;
  
  // Text-specific properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  
  // Image-specific properties
  src?: string;
  originalSrc?: string;
  
  // Shape-specific properties
  shapeType?: 'rectangle' | 'circle' | 'line' | 'arrow';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  
  // Annotation-specific properties
  annotationType?: 'highlight' | 'freehand' | 'comment';
  points?: Array<{x: number, y: number}>;
  commentText?: string;
}

export const FullCanvaPDFEditor: React.FC<FullCanvaPDFEditorProps> = ({
  template: initialTemplate,
  onSave,
  onCancel
}) => {
  // Core state
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(initialTemplate || null);
  const [elements, setElements] = useState<Map<string, CanvaElement>>(new Map());
  const [selectedElementIds, setSelectedElementIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [tool, setTool] = useState<string>('select');
  
  // UI state
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  
  // PDF rendering
  const {
    isLoading,
    pageRenders,
    currentPage: rendererCurrentPage,
    setCurrentPage: setRendererCurrentPage,
    numPages,
    documentInfo,
    error,
    loadPDF,
    renderAllPages,
    searchInPDF,
    convertToImages
  } = usePDFRenderer();

  // Handle PDF upload
  const handlePDFUpload = useCallback(async (file: File) => {
    try {
      console.log('📄 Starting PDF upload process for:', file.name);
      
      // Upload to Supabase storage first
      const { data, error } = await supabase.storage
        .from('pdf')
        .upload(`pdfs/${Date.now()}-${file.name}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pdf')
        .getPublicUrl(data.path);

      console.log('✅ PDF uploaded to storage:', publicUrl);

      // Load PDF for rendering
      await loadPDF(file);
      await renderAllPages({ scale: 1.5, enableTextLayer: true });

      // Convert to images via PDF.co for better editing experience
      try {
        const imageResult = await pdfOperationsService.convertPDFToImages(publicUrl);
        if (imageResult.success && imageResult.images) {
          console.log('✅ PDF converted to images for editing');
        }
      } catch (conversionError) {
        console.warn('⚠️ PDF.co conversion failed, using PDF.js rendering');
      }
      
      const template: Template = {
        id: `pdf-editor-${Date.now()}`,
        name: file.name,
        template_url: publicUrl, // Use the Supabase URL
        preview: '',
        thumbnail_url: '',
        category: 'pdf',
        tags: ['pdf', 'canva-editor'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        customization: {
          canvasWidth: 800,
          canvasHeight: 1000,
          backgroundColor: '#ffffff',
          elements: [],
          version: '2.0'
        }
      };
      
      setCurrentTemplate(template);
      setCurrentPage(1);
      setRendererCurrentPage(1);
      
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
    }
  }, [loadPDF, renderAllPages, numPages]);

  // Element management
  const addElement = useCallback((element: Omit<CanvaElement, 'id' | 'zIndex'>) => {
    const id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const maxZ = Math.max(0, ...Array.from(elements.values()).map(e => e.zIndex));
    
    const newElement: CanvaElement = {
      ...element,
      id,
      zIndex: maxZ + 1
    };
    
    setElements(prev => new Map(prev.set(id, newElement)));
    setSelectedElementIds(new Set([id]));
    
    return id;
  }, [elements]);

  const updateElement = useCallback((id: string, updates: Partial<CanvaElement>) => {
    setElements(prev => {
      const element = prev.get(id);
      if (!element) return prev;
      
      const updated = { ...element, ...updates };
      return new Map(prev.set(id, updated));
    });
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
    setSelectedElementIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const selectElements = useCallback((ids: string[]) => {
    setSelectedElementIds(new Set(ids));
  }, []);

  // Search and replace functionality
  const handleSearchAndReplace = useCallback(async () => {
    if (!searchTerm.trim() || !currentTemplate) return;
    
    try {
      console.log('🔍 Starting search and replace:', { searchTerm, replaceTerm });

      // Search in PDF first
      const searchResults = await searchInPDF(searchTerm);
      
      // Create highlight elements for search results
      const highlightElements = searchResults.map((result, index) => ({
        type: 'highlight' as const,
        x: result.x,
        y: result.y,
        width: result.width,
        height: result.height,
        pageNumber: result.pageNumber,
        visible: true,
        locked: false,
        rotation: 0,
        opacity: 0.3,
        annotationType: 'highlight' as const,
        fill: '#FFFF00'
      }));
      
      // Add highlight elements
      highlightElements.forEach(element => addElement(element));
      
      toast({
        title: "Search completed",
        description: `Found ${searchResults.length} matches for "${searchTerm}"`,
      });
      
      // If replace term is provided, perform replacement via PDF.co
      if (replaceTerm.trim() && searchResults.length > 0) {
        try {
          const replaceResult = await pdfOperationsService.editTextEnhanced(
            currentTemplate.template_url!,
            [searchTerm],
            [replaceTerm],
            { preserveFormatting: true, maintainLayout: true }
          );

          if (replaceResult.success && replaceResult.url) {
            // Update template with new URL
            const updatedTemplate = {
              ...currentTemplate,
              template_url: replaceResult.url,
              updated_at: new Date().toISOString()
            };
            setCurrentTemplate(updatedTemplate);

            // Reload PDF with changes
            await loadPDF(replaceResult.url);
            await renderAllPages({ scale: 1.5, enableTextLayer: true });

            toast({
              title: "Text replacement completed",
              description: `Replaced ${replaceResult.replacements} instances of "${searchTerm}" with "${replaceTerm}"`,
            });
          }
        } catch (replaceError) {
          console.error('Replace operation failed:', replaceError);
          toast({
            title: "Replace failed",
            description: "Could not complete text replacement",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search failed",
        description: "Could not search PDF content",
        variant: "destructive"
      });
    }
  }, [searchTerm, replaceTerm, currentTemplate, searchInPDF, addElement, loadPDF, renderAllPages]);

  // Watermark functionality
  const addWatermark = useCallback((text: string, options: any = {}) => {
    if (!currentTemplate) return;
    
    for (let page = 1; page <= numPages; page++) {
      addElement({
        type: 'text',
        x: options.x || 100,
        y: options.y || 100,
        width: 200,
        height: 40,
        pageNumber: page,
        visible: true,
        locked: false,
        rotation: options.rotation || -45,
        opacity: options.opacity || 0.3,
        text: text,
        fontSize: options.fontSize || 24,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        color: options.color || '#666666'
      });
    }
    
    toast({
      title: "Watermark added",
      description: `Added "${text}" watermark to all pages`,
    });
  }, [currentTemplate, numPages, addElement]);

  // Export functionality
  const handleExport = useCallback(async (format: 'pdf' | 'png' | 'jpg' | 'docx') => {
    if (!currentTemplate) return;
    
    try {
      console.log('📦 Starting export process:', { format, template: currentTemplate.name });

      if (format === 'pdf') {
        // Export current PDF with all modifications
        const modifiedPDF = await generateModifiedPDF();
        await downloadFile(modifiedPDF, `${currentTemplate.name}-edited.pdf`, 'application/pdf');
      } else if (format === 'png' || format === 'jpg') {
        // Convert to images via PDF.co or PDF.js
        try {
          const imageResult = await pdfOperationsService.convertPDFToImages(
            currentTemplate.template_url!,
            { format: format.toUpperCase() }
          );
          
          if (imageResult.success && imageResult.images) {
            imageResult.images.forEach((image, index) => {
              downloadFile(image, `${currentTemplate.name}-page-${index + 1}.${format}`, `image/${format}`);
            });
          } else {
            // Fallback to PDF.js rendering
            const images = await convertToImages({ format: format.toUpperCase() as any });
            images.forEach((image, index) => {
              downloadFile(image, `${currentTemplate.name}-page-${index + 1}.${format}`, `image/${format}`);
            });
          }
        } catch (conversionError) {
          console.warn('PDF.co conversion failed, using PDF.js fallback');
          const images = await convertToImages({ format: format.toUpperCase() as any });
          images.forEach((image, index) => {
            downloadFile(image, `${currentTemplate.name}-page-${index + 1}.${format}`, `image/${format}`);
          });
        }
      } else if (format === 'docx') {
        // Convert to DOCX via PDF.co
        try {
          const exportResult = await pdfOperationsService.exportPDF(
            currentTemplate.template_url!,
            'docx'
          );
          
          if (exportResult.success && exportResult.downloadUrl) {
            await downloadFile(exportResult.downloadUrl, `${currentTemplate.name}.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          }
        } catch (docxError) {
          toast({
            title: "DOCX export not available",
            description: "DOCX export requires PDF.co API configuration",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export failed",
        description: "Could not export the document",
        variant: "destructive"
      });
    }
  }, [currentTemplate, convertToImages]);

  const generateModifiedPDF = async () => {
    if (!currentTemplate) return '';
    
    try {
      // Compile all modifications into PDF.co format
      const modifications = {
        annotations: Array.from(elements.values()).filter(e => e.type === 'annotation'),
        textBoxes: Array.from(elements.values()).filter(e => e.type === 'text'),
        shapes: Array.from(elements.values()).filter(e => e.type === 'shape'),
        images: Array.from(elements.values()).filter(e => e.type === 'image')
      };

      // Use PDF.co to finalize the PDF with all modifications
      const finalizeResult = await pdfOperationsService.finalizePDF(
        currentTemplate.template_url!,
        modifications
      );

      if (finalizeResult.success && finalizeResult.url) {
        return finalizeResult.url;
      }
    } catch (error) {
      console.error('PDF finalization failed:', error);
    }
    
    // Fallback to original PDF
    return currentTemplate.template_url || '';
  };

  const downloadFile = async (url: string, filename: string, mimeType: string) => {
    try {
      if (url.startsWith('data:')) {
        // Handle data URLs
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Handle regular URLs - fetch and download
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(downloadUrl);
      }
      
      toast({
        title: "Download started",
        description: `${filename} is being downloaded`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download failed",
        description: "Could not download the file",
        variant: "destructive"
      });
    }
  };

  // Save template
  const handleSave = useCallback(() => {
    if (!currentTemplate) return;
    
    const updatedTemplate: Template = {
      ...currentTemplate,
        customization: {
          ...currentTemplate.customization,
          elements: Array.from(elements.values()) as any,
          version: '2.0'
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
      <CanvaUploadArea
        onUpload={handlePDFUpload}
        onCancel={onCancel}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 flex flex-col">
      {/* Header Toolbar */}
      <CanvaToolbar
        currentTemplate={currentTemplate}
        tool={tool}
        onToolChange={setTool}
        zoom={zoom}
        onZoomChange={setZoom}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        replaceTerm={replaceTerm}
        onReplaceChange={setReplaceTerm}
        onSearchAndReplace={handleSearchAndReplace}
        onAddWatermark={addWatermark}
        onSave={handleSave}
        onExport={() => setShowExportPanel(true)}
        onCancel={onCancel}
        showPropertiesPanel={showPropertiesPanel}
        onToggleProperties={() => setShowPropertiesPanel(!showPropertiesPanel)}
        showThumbnails={showThumbnails}
        onToggleThumbnails={() => setShowThumbnails(!showThumbnails)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Page Thumbnails */}
        {showThumbnails && (
          <div className="w-64 bg-white/90 backdrop-blur-sm border-r border-gray-200/60 flex flex-col">
            <CanvaPageThumbnails
              pageRenders={pageRenders}
              currentPage={currentPage}
              onPageChange={(page) => {
                setCurrentPage(page);
                setRendererCurrentPage(page);
              }}
              numPages={numPages}
            />
          </div>
        )}

        {/* Center Panel - Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <CanvaCanvas
            pageRender={pageRenders[currentPage - 1]}
            elements={elements}
            selectedElementIds={selectedElementIds}
            currentPage={currentPage}
            zoom={zoom}
            tool={tool}
            onSelectElements={selectElements}
            onAddElement={addElement}
            onUpdateElement={updateElement}
            onDeleteElement={deleteElement}
            searchTerm={searchTerm}
          />
        </div>

        {/* Right Panel - Properties */}
        {showPropertiesPanel && (
          <div className="w-80 bg-white/90 backdrop-blur-sm border-l border-gray-200/60 flex flex-col">
            <CanvaPropertiesPanel
              selectedElements={Array.from(selectedElementIds).map(id => elements.get(id)).filter(Boolean) as CanvaElement[]}
              onUpdateElement={updateElement}
              onDeleteElement={deleteElement}
            />
          </div>
        )}
      </div>

      {/* Export Panel Modal */}
      {showExportPanel && (
        <CanvaExportPanel
          onExport={handleExport}
          onClose={() => setShowExportPanel(false)}
          documentInfo={documentInfo}
        />
      )}
    </div>
  );
};