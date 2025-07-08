
import React, { useState } from 'react';
import { Template } from '@/types/template';
import { PDFOperationsPanel } from './PDFOperationsPanel';
import { AnnotationTools } from './components/AnnotationTools';
import { HighlightTool } from './components/HighlightTool';
import { ShapeTools } from './components/ShapeTools';
import { FreehandDrawing } from './components/FreehandDrawing';
import { CommentTool } from './components/CommentTool';
import { EnhancedTextEditor } from './components/EnhancedTextEditor';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Save, Download } from 'lucide-react';
import { useAnnotations } from '@/hooks/useAnnotations';
import { toast } from '@/hooks/use-toast';

interface EnhancedPDFEditorProps {
  template: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export const EnhancedPDFEditor: React.FC<EnhancedPDFEditorProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const [currentTemplate, setCurrentTemplate] = useState<Template>(template);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [selectedTool, setSelectedTool] = useState('select');
  const [annotationColor, setAnnotationColor] = useState('#FFFF00');
  const [textElements, setTextElements] = useState<Map<string, any>>(new Map());
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const {
    highlights,
    shapes,
    drawingPaths,
    comments,
    addHighlight,
    removeHighlight,
    addShape,
    removeShape,
    addDrawingPath,
    removeDrawingPath,
    addComment,
    removeComment,
    clearAllAnnotations
  } = useAnnotations();

  const handleTemplateUpdate = (updatedTemplate: Template) => {
    console.log('Template updated:', updatedTemplate);
    setCurrentTemplate(updatedTemplate);
    onSave(updatedTemplate);
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleSearchAndReplace = () => {
    if (!searchTerm.trim() || !replaceTerm.trim()) {
      toast({
        title: "Search and Replace",
        description: "Please enter both search and replace terms",
        variant: "destructive"
      });
      return;
    }

    // Update text elements with replacements
    let replacementCount = 0;
    const updatedElements = new Map(textElements);
    
    updatedElements.forEach((element, id) => {
      if (element.text && element.text.includes(searchTerm)) {
        const newText = element.text.replace(new RegExp(searchTerm, 'g'), replaceTerm);
        updatedElements.set(id, {
          ...element,
          text: newText,
          isEdited: true
        });
        replacementCount++;
      }
    });

    setTextElements(updatedElements);

    toast({
      title: "Search and Replace Complete",
      description: `${replacementCount} replacements made`,
    });
  };

  const handleAddTextElement = (pageNumber: number, x: number, y: number) => {
    const id = `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newElement = {
      id,
      text: 'Click to edit',
      x,
      y,
      width: 100,
      height: 20,
      fontSize: 16,
      fontFamily: 'Arial',
      fontWeight: 'normal' as const,
      fontStyle: 'normal' as const,
      textAlign: 'left' as const,
      color: '#000000',
      backgroundColor: 'transparent',
      opacity: 1,
      rotation: 0,
      pageNumber,
      isEdited: true
    };

    setTextElements(prev => new Map(prev).set(id, newElement));
    setSelectedElementId(id);
  };

  const handleUpdateTextElement = (id: string, updates: any) => {
    setTextElements(prev => {
      const updated = new Map(prev);
      const existing = updated.get(id);
      if (existing) {
        updated.set(id, { ...existing, ...updates });
      }
      return updated;
    });
  };

  const handleDeleteTextElement = (id: string) => {
    setTextElements(prev => {
      const updated = new Map(prev);
      updated.delete(id);
      return updated;
    });
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const handleSaveAnnotations = () => {
    const annotationData = {
      highlights: highlights,
      shapes: shapes,
      drawings: drawingPaths,
      comments: comments,
      textElements: Array.from(textElements.values())
    };

    // Save to template metadata or as separate annotation file
    const updatedTemplate = {
      ...currentTemplate,
      annotations: annotationData
    };

    handleTemplateUpdate(updatedTemplate);
    
    toast({
      title: "Annotations Saved",
      description: "All annotations and edits have been saved",
    });
  };

  const getPDFUrl = () => {
    return currentTemplate.template_url || currentTemplate.preview;
  };

  return (
    <div className="h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h1 className="text-lg font-semibold">Enhanced PDF Editor - {currentTemplate.name}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={clearAllAnnotations}>
              Clear All
            </Button>
            <Button onClick={handleSaveAnnotations}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Annotation Tools */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <AnnotationTools
            selectedTool={selectedTool}
            onToolChange={setSelectedTool}
            searchTerm={searchTerm}
            replaceTerm={replaceTerm}
            onSearchChange={handleSearchTermChange}
            onReplaceChange={setReplaceTerm}
            onSearchAndReplace={handleSearchAndReplace}
            annotationColor={annotationColor}
            onColorChange={setAnnotationColor}
          />
        </div>

        {/* Main Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full relative">
            {getPDFUrl() ? (
              <div className="relative w-full h-full">
                {/* PDF Background */}
                <iframe
                  src={getPDFUrl()}
                  className="w-full h-full rounded-lg"
                  title="PDF Preview"
                />
                
                {/* Annotation Overlays */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="relative w-full h-full pointer-events-auto">
                    {/* Text Elements */}
                    {Array.from(textElements.values()).map((element) => (
                      <EnhancedTextEditor
                        key={element.id}
                        textElement={element}
                        scale={1}
                        isSelected={selectedElementId === element.id}
                        onSelect={() => setSelectedElementId(element.id)}
                        onUpdate={handleUpdateTextElement}
                        onDelete={handleDeleteTextElement}
                        searchTerm={searchTerm}
                      />
                    ))}

                    {/* Highlights */}
                    <HighlightTool
                      highlights={highlights}
                      onAddHighlight={addHighlight}
                      onRemoveHighlight={removeHighlight}
                      currentPage={0}
                      scale={1}
                      color={annotationColor}
                      isActive={selectedTool === 'highlight'}
                    />

                    {/* Shapes */}
                    <ShapeTools
                      shapes={shapes}
                      onAddShape={addShape}
                      onRemoveShape={removeShape}
                      currentPage={0}
                      scale={1}
                      color={annotationColor}
                      activeTool={selectedTool}
                    />

                    {/* Freehand Drawing */}
                    <FreehandDrawing
                      paths={drawingPaths}
                      onAddPath={addDrawingPath}
                      onRemovePath={removeDrawingPath}
                      currentPage={0}
                      scale={1}
                      color={annotationColor}
                      isActive={selectedTool === 'freehand'}
                    />

                    {/* Comments */}
                    <CommentTool
                      comments={comments}
                      onAddComment={addComment}
                      onRemoveComment={removeComment}
                      currentPage={0}
                      scale={1}
                      color={annotationColor}
                      isActive={selectedTool === 'comment'}
                    />

                    {/* Click handler for adding text */}
                    {selectedTool === 'select' && (
                      <div
                        className="absolute inset-0"
                        onClick={(e) => {
                          if (e.target === e.currentTarget) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            handleAddTextElement(1, x, y);
                          }
                        }}
                        style={{ zIndex: 995 }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No PDF loaded</p>
                  <p className="text-sm">Upload a PDF to start editing and annotating</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Operations Panel */}
        <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
          <PDFOperationsPanel
            template={currentTemplate}
            onTemplateUpdate={handleTemplateUpdate}
            searchTerm={searchTerm}
            onSearchTermChange={handleSearchTermChange}
          />
        </div>
      </div>
    </div>
  );
};
