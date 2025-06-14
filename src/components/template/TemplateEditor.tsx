
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Customizer</h1>
          <p className="text-lg text-gray-600">Customize your template with drag-and-drop tools</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Tools Panel - Left Side */}
          <div className="col-span-12 lg:col-span-3">
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

          {/* Canvas Area - Center */}
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <div className="relative">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-6 flex items-center justify-center min-h-[600px]">
                    <div className="bg-white rounded shadow-lg p-2">
                      <canvas
                        ref={canvasRef}
                        className="border border-gray-200 rounded max-w-full"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </div>
                  </div>
                  
                  {/* Canvas Info Bar */}
                  <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span>Zoom: {Math.round(zoom * 100)}%</span>
                    <span>•</span>
                    <span>Click and drag to move objects</span>
                    <span>•</span>
                    <span>Select objects to edit properties</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Panel - Right Side */}
          <div className="col-span-12 lg:col-span-3">
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
  );
};
