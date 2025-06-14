
import React from 'react';
import { Template } from '@/types/template';
import { useCanvasEditor } from '@/hooks/useCanvasEditor';
import { CanvasArea } from './CanvasArea';
import { CanvasToolbar } from './CanvasToolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Save, Download, Play, FileImage, X } from 'lucide-react';

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

  const handleExportPDF = () => {
    if (!fabricCanvas) return;
    
    // Create a higher resolution version for PDF
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 3
    });
    
    const link = document.createElement('a');
    link.download = `${template.name}.pdf.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "PDF Export ready",
      description: "High-resolution image exported for PDF conversion",
    });
  };

  const handleLaunchCampaign = () => {
    if (!fabricCanvas) return;
    
    const canvasData = fabricCanvas.toJSON();
    const exportUrl = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    
    // Save campaign data (this would typically go to your backend)
    const campaignData = {
      templateId: template.id,
      templateName: template.name,
      canvasData,
      exportUrl,
      elements: canvasElements,
      createdAt: new Date()
    };
    
    console.log('Launching campaign:', campaignData);
    
    toast({
      title: "Campaign launched!",
      description: "Your template has been prepared for campaign use",
    });
  };

  const handleSaveAsMyTemplate = () => {
    if (!fabricCanvas) return;
    
    const canvasData = fabricCanvas.toJSON();
    const previewUrl = fabricCanvas.toDataURL({
      format: 'png',
      quality: 0.8,
      multiplier: 1
    });
    
    const newTemplate: Template = {
      ...template,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${template.name} (Custom)`,
      preview: previewUrl,
      customization: {
        canvasWidth: 800,
        canvasHeight: 600,
        backgroundColor: '#ffffff',
        elements: canvasElements,
        version: '1.0'
      },
      editable_json: canvasData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    onSave(newTemplate);
    toast({
      title: "Saved as My Template",
      description: "Your custom template has been saved to your library",
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
                <h1 className="text-2xl font-bold text-gray-900">Template Editor</h1>
                <p className="text-sm text-gray-600 mt-1">Drag, drop, and customize your template elements</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveAsMyTemplate}
                  className="text-purple-600 border-purple-300 hover:bg-purple-50"
                >
                  <FileImage className="w-4 h-4 mr-2" />
                  Save as My Template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button
                  size="sm"
                  onClick={handleLaunchCampaign}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Launch Campaign
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-120px)]">
          {/* Left Sidebar - Tools */}
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
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
    </div>
  );
};
