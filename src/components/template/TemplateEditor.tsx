
import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, RotateCcw, Move, FileImage } from 'lucide-react';
import { Template, QRPosition } from '@/types/template';

interface TemplateEditorProps {
  template: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

const TemplateEditor = ({ template, onSave, onCancel }: TemplateEditorProps) => {
  const [qrPosition, setQrPosition] = useState<QRPosition>(
    template.qrPosition || { x: 50, y: 50, width: 80, height: 80 }
  );
  const [isDragging, setIsDragging] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create PDF data URL when component mounts or template changes
  useEffect(() => {
    if (template.file && template.file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = function(e) {
        const result = e.target?.result;
        if (result && typeof result === 'string') {
          setPdfDataUrl(result);
          console.log('PDF data URL created for editor');
        }
      };
      reader.readAsDataURL(template.file);
    }
  }, [template.file]);

  const handleDrag = (e: any, data: any) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = (data.x / containerRect.width) * 100;
      const y = (data.y / containerRect.height) * 100;
      
      setQrPosition(prev => ({
        ...prev,
        x: Math.max(0, Math.min(100 - (prev.width / containerRect.width) * 100, x)),
        y: Math.max(0, Math.min(100 - (prev.height / containerRect.height) * 100, y))
      }));
    }
  };

  const resetPosition = () => {
    setQrPosition({ x: 50, y: 50, width: 80, height: 80 });
  };

  const handleSave = () => {
    const updatedTemplate: Template = {
      ...template,
      qrPosition,
      updatedAt: new Date()
    };
    onSave(updatedTemplate);
  };

  // Check if it's a PDF template
  const isPdfTemplate = template.file?.type === 'application/pdf';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Code Editor</h2>
        <p className="text-gray-600">
          {isPdfTemplate 
            ? 'Position the QR code on your PDF template' 
            : 'Drag the QR code to position it on your template'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Template Preview */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{template.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Position: {qrPosition.x.toFixed(0)}%, {qrPosition.y.toFixed(0)}%
                  </span>
                  {isPdfTemplate && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                      PDF Template
                    </span>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={containerRef}
                className="relative bg-gray-100 rounded-lg overflow-hidden mx-auto border-2 border-dashed border-gray-300"
                style={{ maxWidth: '800px', aspectRatio: '4/3', minHeight: '600px' }}
              >
                {isPdfTemplate && pdfDataUrl ? (
                  <div className="w-full h-full relative">
                    <embed
                      src={pdfDataUrl}
                      type="application/pdf"
                      className="w-full h-full"
                      title={`PDF Editor - ${template.name}`}
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs z-10">
                      PDF Template - {template.name}
                    </div>
                  </div>
                ) : isPdfTemplate ? (
                  <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center relative">
                    <div className="text-center">
                      <FileImage className="w-16 h-16 text-red-400 mx-auto mb-2" />
                      <span className="text-red-600 font-medium text-lg">PDF Template</span>
                      <p className="text-red-500 text-sm mt-1">Loading PDF...</p>
                    </div>
                  </div>
                ) : template.preview ? (
                  <img 
                    src={template.preview} 
                    alt={template.name}
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <span className="text-gray-600 font-medium">Template Preview</span>
                    </div>
                  </div>
                )}
                
                {/* Draggable QR Code */}
                <Draggable
                  position={{ 
                    x: (qrPosition.x / 100) * (containerRef.current?.clientWidth || 0),
                    y: (qrPosition.y / 100) * (containerRef.current?.clientHeight || 0)
                  }}
                  onDrag={handleDrag}
                  onStart={() => setIsDragging(true)}
                  onStop={() => setIsDragging(false)}
                  bounds="parent"
                >
                  <div 
                    className={`absolute cursor-move border-2 border-blue-500 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center transition-all z-20 ${
                      isDragging ? 'scale-110 shadow-xl' : 'hover:scale-105'
                    }`}
                    style={{ 
                      width: `${qrPosition.width}px`, 
                      height: `${qrPosition.height}px` 
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-md flex items-center justify-center">
                      <div className="grid grid-cols-8 gap-1 p-2">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div
                            key={i}
                            className={`aspect-square rounded-sm ${
                              Math.random() > 0.5 
                                ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                                : 'bg-white'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Drag Handle */}
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                      <Move className="w-3 h-3" />
                    </div>
                  </div>
                </Draggable>
              </div>
              
              {isPdfTemplate && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>PDF Template:</strong> You can now see and position the QR code on your actual PDF template. 
                    The QR code position will be applied when generating the final PDF output.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Controls Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Type Info */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Template Type</label>
                <div className={`text-sm px-3 py-2 rounded-lg ${
                  isPdfTemplate 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {isPdfTemplate ? 'PDF Template' : 'Image Template'}
                </div>
              </div>

              {/* Position Info */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Position</label>
                <div className="text-sm text-gray-600">
                  <div>X: {qrPosition.x.toFixed(1)}%</div>
                  <div>Y: {qrPosition.y.toFixed(1)}%</div>
                </div>
              </div>

              {/* Size Controls */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Size</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="40"
                    max="200"
                    value={qrPosition.width}
                    onChange={(e) => setQrPosition(prev => ({
                      ...prev,
                      width: parseInt(e.target.value),
                      height: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600 text-center">
                    {qrPosition.width}px
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={resetPosition}
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Position
                </Button>
                
                <Button 
                  onClick={handleSave}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>

              {/* Instructions */}
              <div className="text-xs text-gray-500 p-3 bg-blue-50 rounded-lg">
                <strong>Instructions:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Drag the QR code to position it</li>
                  <li>• Use the size slider to resize</li>
                  <li>• Save to store the position</li>
                  {isPdfTemplate && (
                    <li>• PDF shows actual uploaded content</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
