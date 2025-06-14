
import React from 'react';
import { Template } from '@/types/template';
import { useCanvasEditor } from '@/hooks/useCanvasEditor';
import { CanvasArea } from './CanvasArea';
import { CanvasToolbar } from './CanvasToolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { toast } from '@/hooks/use-toast';

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
    resetCanvas
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
      multiplier: 1
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Template Customizer</h1>
                <p className="text-sm text-gray-600 mt-1">Customize your template with drag-and-drop tools</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Save Template
                </button>
                <button
                  onClick={onCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-120px)]">
          {/* Left Sidebar - Tools */}
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
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
              />
            </div>
          </div>

          {/* Center - Canvas Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6">
              <CanvasArea 
                canvasRef={canvasRef} 
                zoom={zoom}
              />
            </div>
          </div>

          {/* Right Sidebar - Properties */}
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-6">
              <PropertiesPanel
                selectedObject={selectedObject}
                onUpdateProperty={updateSelectedObjectProperty}
                onSave={handleSave}
                onDownload={handleDownload}
                onCancel={onCancel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
