
import React, { useState, useCallback } from 'react';
import { Template } from '@/types/template';
import { useCanvasEditor } from '@/hooks/useCanvasEditor';
import { CanvasArea } from './CanvasArea';
import { CanvasToolbar } from './CanvasToolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface TemplateEditorProps {
  template: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export const TemplateEditor = ({ template, onSave, onCancel }: TemplateEditorProps) => {
  // Always call hooks in the same order
  const [qrUrl, setQrUrl] = useState('https://example.com');
  const [textContent, setTextContent] = useState('Sample Text');

  const canvasEditor = useCanvasEditor(template);

  const {
    canvasRef,
    fabricCanvas,
    selectedObject,
    canvasElements,
    zoom,
    backgroundLoaded,
    backgroundError,
    addQRCode,
    addText,
    addShape,
    uploadImage,
    deleteSelected,
    updateSelectedObjectProperty,
    zoomCanvas,
    resetCanvas,
    undoCanvas,
    redoCanvas,
    canUndo,
    canRedo
  } = canvasEditor;

  const handleAddQRCode = useCallback(() => {
    console.log('Adding QR code with URL:', qrUrl);
    if (!qrUrl || qrUrl.trim() === '') {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL for the QR code',
        variant: 'destructive'
      });
      return;
    }
    addQRCode(qrUrl.trim());
  }, [qrUrl, addQRCode]);

  const handleAddText = useCallback(() => {
    console.log('Adding text:', textContent);
    if (!textContent || textContent.trim() === '') {
      toast({
        title: 'Invalid text',
        description: 'Please enter some text content',
        variant: 'destructive'
      });
      return;
    }
    addText(textContent.trim(), 16, '#000000');
  }, [textContent, addText]);

  const handleUploadImage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Uploading image:', file.name, file.type);
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file (JPG, PNG, etc.)',
          variant: 'destructive'
        });
        return;
      }
      uploadImage(file);
    }
  }, [uploadImage]);

  const handleSave = useCallback(() => {
    if (!fabricCanvas) {
      toast({
        title: 'Canvas not ready',
        description: 'Please wait for the canvas to load',
        variant: 'destructive'
      });
      return;
    }
    
    const canvasData = fabricCanvas.toJSON();
    const updatedTemplate: Template = {
      ...template,
      customization: {
        canvasWidth: 800,
        canvasHeight: 600,
        backgroundColor: '#ffffff',
        elements: canvasElements,
        version: '1.0'
      },
      editable_json: canvasData,
      updatedAt: new Date()
    };
    
    onSave(updatedTemplate);
    toast({
      title: 'Template saved successfully',
      description: 'Your changes have been saved',
    });
  }, [fabricCanvas, template, canvasElements, onSave]);

  const handleDownload = useCallback(() => {
    if (!fabricCanvas) {
      toast({
        title: 'Canvas not ready',
        description: 'Please wait for the canvas to load',
        variant: 'destructive'
      });
      return;
    }
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    
    const link = document.createElement('a');
    link.download = `${template.name}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Template downloaded',
      description: 'Template has been downloaded as PNG',
    });
  }, [fabricCanvas, template.name]);

  const handleDelete = useCallback(() => {
    console.log('Delete button clicked, selected object:', selectedObject);
    deleteSelected();
  }, [deleteSelected, selectedObject]);

  // Show template file info
  const getTemplateFileInfo = useCallback(() => {
    if (template.file) {
      return `${template.file.type} - ${(template.file.size / 1024 / 1024).toFixed(2)} MB`;
    }
    return 'Built-in template';
  }, [template.file]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col min-w-[1024px]">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Template Editor</h1>
            <p className="text-xs text-gray-600 mt-1">
              Editing: {template.name} ({getTemplateFileInfo()})
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="text-gray-600 text-sm px-3 py-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Using CSS Grid for proper layout */}
      <div className="flex-1 grid grid-cols-[280px_1fr_320px] overflow-hidden min-h-0">
        {/* Left Sidebar - Tools - Fixed width, scrollable */}
        <div className="bg-white border-r border-gray-200 overflow-y-auto">
          <CanvasToolbar
            qrUrl={qrUrl}
            setQrUrl={setQrUrl}
            textContent={textContent}
            setTextContent={setTextContent}
            onAddQRCode={handleAddQRCode}
            onAddText={handleAddText}
            onAddShape={addShape}
            onUploadImage={handleUploadImage}
            onZoomCanvas={zoomCanvas}
            onResetCanvas={resetCanvas}
            onDeleteSelected={handleDelete}
            hasSelectedObject={!!selectedObject}
            onUndo={undoCanvas}
            onRedo={redoCanvas}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>

        {/* Center - Canvas Area - Flexible, centered */}
        <div className="bg-gray-100 relative overflow-auto min-w-0">
          <CanvasArea 
            canvasRef={canvasRef} 
            zoom={zoom}
            backgroundLoaded={backgroundLoaded}
            backgroundError={backgroundError}
          />
          
          {/* Zoom indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-white px-3 py-2 rounded-md shadow-sm border text-sm text-gray-600">
              Zoom: {Math.round(zoom * 100)}%
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties - Fixed width, scrollable */}
        <div className="bg-white border-l border-gray-200 overflow-y-auto">
          <PropertiesPanel
            selectedObject={selectedObject}
            onUpdateProperty={updateSelectedObjectProperty}
            onSave={handleSave}
            onDownload={handleDownload}
            onCancel={onCancel}
            template={template}
          />
        </div>
      </div>
    </div>
  );
};
