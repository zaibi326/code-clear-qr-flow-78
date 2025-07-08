import React, { useState, useEffect, useCallback } from 'react';
import { Template } from '@/types/template';
import { usePDFRenderer } from '@/hooks/usePDFRenderer';
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
      await loadPDF(file);
      await renderAllPages({ scale: 1.5, enableTextLayer: true });
      
      const template: Template = {
        id: `pdf-editor-${Date.now()}`,
        name: file.name,
        template_url: URL.createObjectURL(file),
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
      
      // If replace term is provided, perform replacement
      if (replaceTerm.trim() && searchResults.length > 0) {
        // This would typically call PDF.co API for actual text replacement
        toast({
          title: "Replace functionality",
          description: "Text replacement will be implemented with PDF.co API",
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search failed",
        description: "Could not search PDF content",
        variant: "destructive"
      });
    }
  }, [searchTerm, replaceTerm, currentTemplate, searchInPDF, addElement]);

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
      if (format === 'pdf') {
        // Export as PDF with modifications
        const modifiedPDF = await generateModifiedPDF();
        downloadFile(modifiedPDF, `${currentTemplate.name}-edited.pdf`, 'application/pdf');
      } else if (format === 'png' || format === 'jpg') {
        // Convert to images
        const images = await convertToImages({ format: format.toUpperCase() as any });
        images.forEach((image, index) => {
          downloadFile(image, `${currentTemplate.name}-page-${index + 1}.${format}`, `image/${format}`);
        });
      } else if (format === 'docx') {
        // Convert to DOCX (would use PDF.co API)
        toast({
          title: "DOCX export",
          description: "DOCX export will be implemented with PDF.co API",
        });
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
    // This would generate a new PDF with all modifications
    // For now, return the original template URL
    return currentTemplate?.template_url || '';
  };

  const downloadFile = (data: string, filename: string, mimeType: string) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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