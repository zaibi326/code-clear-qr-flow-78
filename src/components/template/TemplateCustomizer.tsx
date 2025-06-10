
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useCanvasEditor } from '@/hooks/useCanvasEditor';
import { CanvasToolbar } from './CanvasToolbar';
import { CanvasArea } from './CanvasArea';
import { PropertiesPanel } from './PropertiesPanel';
import { Template } from '@/types/template';

interface TemplateCustomizerProps {
  template: Template;
  onSave: (customizedTemplate: Template) => void;
  onCancel: () => void;
}

export const TemplateCustomizer = ({ template, onSave, onCancel }: TemplateCustomizerProps) => {
  const [qrUrl, setQrUrl] = useState('https://example.com');
  const [textContent, setTextContent] = useState('Sample Text');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(20);

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

  const handleAddQRCode = () => addQRCode(qrUrl);
  const handleAddText = () => addText(textContent, fontSize, textColor);
  
  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const saveTemplate = async () => {
    if (!fabricCanvas) return;

    try {
      // Generate canvas as image
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1,
      });

      // Create updated template with customizations
      const customizedTemplate: Template = {
        ...template,
        preview: dataURL,
        qrPosition: canvasElements.find(el => el.type === 'qr') || template.qrPosition,
        updatedAt: new Date()
      };

      onSave(customizedTemplate);
      toast.success('Template saved successfully');
    } catch (error) {
      toast.error('Failed to save template');
    }
  };

  const downloadTemplate = () => {
    if (!fabricCanvas) return;

    const link = document.createElement('a');
    link.download = `${template.name}-customized.png`;
    link.href = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });
    link.click();
    
    toast.success('Template downloaded');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Customizer</h1>
          <p className="text-gray-600">Customize your template with drag-and-drop tools</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Toolbar */}
          <div className="col-span-2">
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
              onDeleteSelected={deleteSelected}
              hasSelectedObject={!!selectedObject}
            />
          </div>

          {/* Canvas Area */}
          <div className="col-span-8">
            <CanvasArea canvasRef={canvasRef} zoom={zoom} />
          </div>

          {/* Properties Panel */}
          <div className="col-span-2">
            <PropertiesPanel
              selectedObject={selectedObject}
              onUpdateProperty={updateSelectedObjectProperty}
              onSave={saveTemplate}
              onDownload={downloadTemplate}
              onCancel={onCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
