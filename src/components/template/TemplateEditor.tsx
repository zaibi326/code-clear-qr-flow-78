
import React from 'react';
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
  const {
    canvasRef,
    fabricCanvas,
    selectedObject,
    canvasElements,
    zoom,
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
  } = useCanvasEditor(template);

  const [qrUrl, setQrUrl] = React.useState('https://example.com');
  const [textContent, setTextContent] = React.useState('Sample Text');

  const handleAddQRCode = () => {
    console.log('Adding QR code with URL:', qrUrl);
    addQRCode(qrUrl);
  };

  const handleAddText = () => {
    console.log('Adding text:', textContent);
    addText(textContent, 16, '#000000');
  };

  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Uploading image:', file.name, file.type);
      uploadImage(file);
    }
  };

  const handleSave = () => {
    if (!fabricCanvas) return;
    
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
      title: "Template saved successfully",
      description: "Your changes have been saved",
    });
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    
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
      title: "Template downloaded",
      description: "Template has been downloaded as PNG",
    });
  };

  const handleDelete = () => {
    console.log('Delete button clicked, selected object:', selectedObject);
    deleteSelected();
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Template Customizer</h1>
            <p className="text-xs text-gray-600 mt-1">Customize your template with drag-and-drop tools</p>
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

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-60 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
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

        {/* Center - Canvas Area */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden">
          <CanvasArea 
            canvasRef={canvasRef} 
            zoom={zoom}
          />
          
          {/* Zoom indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-white px-2 py-1 rounded-md shadow-sm border text-xs text-gray-600">
              Zoom: {Math.round(zoom * 100)}%
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-72 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto">
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
