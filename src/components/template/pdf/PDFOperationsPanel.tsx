import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { pdfOperationsService } from '@/services/pdfOperationsService';
import { FileText, Edit, MessageSquare, FormInput, QrCode, Download, Palette, Square } from 'lucide-react';
import { RichTextEditor } from './components/RichTextEditor';
import { PDFAnnotationTool } from './components/PDFAnnotationTool';
import { QRCodeGenerator } from './components/QRCodeGenerator';
import { PDFFormFiller } from './components/PDFFormFiller';

interface PDFOperationsPanelProps {
  fileUrl?: string;
  onOperationComplete?: (result: any) => void;
}

export const PDFOperationsPanel: React.FC<PDFOperationsPanelProps> = ({
  fileUrl,
  onOperationComplete
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [textToReplace, setTextToReplace] = useState('');
  const [replacementText, setReplacementText] = useState('');
  const [qrCodeText, setQrCodeText] = useState('');
  const [qrPosition, setQrPosition] = useState({ x: 100, y: 100, size: 100 });
  const [showRichEditor, setShowRichEditor] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [richEditorPosition, setRichEditorPosition] = useState({ x: 400, y: 300 });
  const [selectedAnnotationTool, setSelectedAnnotationTool] = useState('');
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [shapes, setShapes] = useState<any[]>([]);
  const [formFields, setFormFields] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleExtractText = async () => {
    if (!fileUrl) {
      toast({
        title: "No PDF file",
        description: "Please select a PDF file first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await pdfOperationsService.extractText(fileUrl, {
        pages: "1-",
        ocrLanguage: "eng"
      });

      if (result.success && result.text) {
        setExtractedText(result.text);
        toast({
          title: "Text extracted successfully",
          description: `Extracted text from ${result.pages} pages`,
        });
        onOperationComplete?.(result);
      } else {
        throw new Error(result.error || 'Failed to extract text');
      }
    } catch (error: any) {
      toast({
        title: "Text extraction failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRichEditor = () => {
    if (!extractedText) {
      toast({
        title: "No text to edit",
        description: "Please extract text first",
        variant: "destructive"
      });
      return;
    }
    setShowRichEditor(true);
  };

  const handleSaveRichText = async (editedText: string, formatting: any) => {
    if (!fileUrl) return;

    setIsLoading(true);
    try {
      const result = await pdfOperationsService.replaceWithEditedText(fileUrl, editedText);
      
      if (result.success) {
        toast({
          title: "Text updated successfully",
          description: "The PDF has been updated with your changes",
        });
        setExtractedText(editedText);
        onOperationComplete?.(result);
      } else {
        throw new Error(result.error || 'Failed to update text');
      }
    } catch (error: any) {
      toast({
        title: "Text update failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setShowRichEditor(false);
    }
  };

  const handleEditText = async () => {
    if (!fileUrl || !textToReplace || !replacementText) {
      toast({
        title: "Missing information",
        description: "Please provide both text to replace and replacement text",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await pdfOperationsService.editText(
        fileUrl,
        [textToReplace],
        [replacementText],
        false
      );

      if (result.success) {
        toast({
          title: "Text edited successfully",
          description: `Made ${result.replacements} replacements`,
        });
        onOperationComplete?.(result);
      } else {
        throw new Error(result.error || 'Failed to edit text');
      }
    } catch (error: any) {
      toast({
        title: "Text editing failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtractFormFields = async () => {
    if (!fileUrl) {
      toast({
        title: "No PDF file",
        description: "Please select a PDF file first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await pdfOperationsService.extractFormFields(fileUrl);

      if (result.success && result.formFields) {
        setFormFields(result.formFields);
        toast({
          title: "Form fields extracted successfully",
          description: `Found ${result.formFields.length} form fields`,
        });
        onOperationComplete?.(result);
      } else {
        throw new Error(result.error || 'Failed to extract form fields');
      }
    } catch (error: any) {
      toast({
        title: "Form field extraction failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillForm = async () => {
    if (!fileUrl || Object.keys(formData).length === 0) {
      toast({
        title: "Missing form data",
        description: "Please fill out the form fields first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await pdfOperationsService.fillForm(fileUrl, formData);

      if (result.success) {
        toast({
          title: "Form filled successfully",
          description: "The PDF form has been filled with your data",
        });
        onOperationComplete?.(result);
      } else {
        throw new Error(result.error || 'Failed to fill form');
      }
    } catch (error: any) {
      toast({
        title: "Form filling failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAnnotation = (type: string, x: number, y: number) => {
    const newAnnotation = {
      id: `annotation-${Date.now()}`,
      type,
      x,
      y,
      width: type === 'highlight' ? 200 : 100,
      height: type === 'highlight' ? 20 : 100,
      pages: "1"
    };
    setAnnotations([...annotations, newAnnotation]);
  };

  const handleAddShape = (type: string, x: number, y: number) => {
    const newShape = {
      id: `shape-${Date.now()}`,
      type,
      x,
      y,
      width: 100,
      height: 100,
      fillColor: { r: 0.8, g: 0.8, b: 1 },
      strokeColor: { r: 0, g: 0, b: 1 },
      strokeWidth: 2,
      opacity: 0.8,
      rotation: 0,
      pages: "1"
    };
    setShapes([...shapes, newShape]);
  };

  const handleApplyAnnotations = async () => {
    if (!fileUrl || (annotations.length === 0 && shapes.length === 0)) {
      toast({
        title: "No annotations to apply",
        description: "Please add some annotations or shapes first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const allAnnotations = [...annotations, ...shapes];
      const result = await pdfOperationsService.addAnnotations(fileUrl, allAnnotations);

      if (result.success) {
        toast({
          title: "Annotations added successfully",
          description: `Added ${allAnnotations.length} annotations to the PDF`,
        });
        onOperationComplete?.(result);
      } else {
        throw new Error(result.error || 'Failed to add annotations');
      }
    } catch (error: any) {
      toast({
        title: "Annotation failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQRCode = (content: string, size: number) => {
    const newQRCode = {
      id: `qr-${Date.now()}`,
      content,
      x: qrPosition.x,
      y: qrPosition.y,
      size,
      pages: "1"
    };
    
    setQrCodeText(content);
    setQrPosition(prev => ({ ...prev, size }));
    setShowQRGenerator(false);
    
    toast({
      title: "QR Code generated",
      description: "QR code is ready to be added to PDF",
    });
  };

  const handleAddQRCode = async () => {
    if (!fileUrl || !qrCodeText) {
      toast({
        title: "Missing information",
        description: "Please generate a QR code first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await pdfOperationsService.addQRCode(
        fileUrl,
        qrCodeText,
        qrPosition.x,
        qrPosition.y,
        qrPosition.size,
        "1"
      );

      if (result.success) {
        toast({
          title: "QR code added successfully",
          description: "QR code has been added to the PDF",
        });
        onOperationComplete?.(result);
      } else {
        throw new Error(result.error || 'Failed to add QR code');
      }
    } catch (error: any) {
      toast({
        title: "QR code addition failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    if (!fileUrl) {
      toast({
        title: "No PDF file",
        description: "Please select a PDF file first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await pdfOperationsService.exportPDF(fileUrl);

      if (result.success && result.url) {
        // Open the processed PDF in a new tab
        window.open(result.url, '_blank');
        toast({
          title: "PDF exported successfully",
          description: "The processed PDF is ready for download",
        });
        onOperationComplete?.(result);
      } else {
        throw new Error(result.error || 'Failed to export PDF');
      }
    } catch (error: any) {
      toast({
        title: "PDF export failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {showRichEditor && (
        <RichTextEditor
          initialText={extractedText}
          onSave={handleSaveRichText}
          onCancel={() => setShowRichEditor(false)}
          position={richEditorPosition}
        />
      )}

      {showQRGenerator && (
        <QRCodeGenerator
          onGenerate={handleGenerateQRCode}
          onClose={() => setShowQRGenerator(false)}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            PDF Operations
          </CardTitle>
          <CardDescription>
            Extract text, edit content, add annotations, fill forms, and manipulate PDF files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="extract" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="extract">Extract</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="rich">Rich Edit</TabsTrigger>
              <TabsTrigger value="annotate">Annotate</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="qr">QR Code</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="extract" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <h3 className="font-medium">Text Extraction</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Extract text from PDF files including scanned documents using OCR
                </p>
                <Button 
                  onClick={handleExtractText} 
                  disabled={isLoading || !fileUrl}
                  className="w-full"
                >
                  {isLoading ? 'Extracting...' : 'Extract Text'}
                </Button>
                {extractedText && (
                  <div className="space-y-2">
                    <Label>Extracted Text:</Label>
                    <Textarea
                      value={extractedText}
                      readOnly
                      className="min-h-32"
                      placeholder="Extracted text will appear here..."
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="edit" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  <h3 className="font-medium">Simple Text Editing</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Find and replace text in PDF files
                </p>
                <div className="space-y-2">
                  <Label>Text to Replace:</Label>
                  <Input
                    value={textToReplace}
                    onChange={(e) => setTextToReplace(e.target.value)}
                    placeholder="Enter text to find and replace"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Replacement Text:</Label>
                  <Input
                    value={replacementText}
                    onChange={(e) => setReplacementText(e.target.value)}
                    placeholder="Enter replacement text"
                  />
                </div>
                <Button 
                  onClick={handleEditText} 
                  disabled={isLoading || !fileUrl}
                  className="w-full"
                >
                  {isLoading ? 'Editing...' : 'Replace Text'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="rich" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <h3 className="font-medium">Rich Text Editor</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Edit text with full formatting control and rich text features
                </p>
                <Button 
                  onClick={handleOpenRichEditor} 
                  disabled={isLoading || !fileUrl || !extractedText}
                  className="w-full"
                >
                  {isLoading ? 'Loading...' : 'Open Rich Text Editor'}
                </Button>
                <p className="text-xs text-gray-500">
                  First extract text, then use the rich editor for advanced formatting
                </p>
              </div>
            </TabsContent>

            <TabsContent value="annotate" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Square className="w-4 h-4" />
                  <h3 className="font-medium">Annotations & Shapes</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Add highlights, shapes, and annotations to your PDF
                </p>
                
                <PDFAnnotationTool
                  selectedTool={selectedAnnotationTool}
                  onToolChange={setSelectedAnnotationTool}
                  onAddAnnotation={handleAddAnnotation}
                />

                <div className="space-y-2">
                  <Label>Quick Actions:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddShape('rectangle', 100, 100)}
                    >
                      Add Rectangle
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddShape('circle', 150, 150)}
                    >
                      Add Circle
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>Annotations: {annotations.length}</p>
                  <p>Shapes: {shapes.length}</p>
                </div>

                <Button 
                  onClick={handleApplyAnnotations} 
                  disabled={isLoading || !fileUrl || (annotations.length === 0 && shapes.length === 0)}
                  className="w-full"
                >
                  {isLoading ? 'Applying...' : 'Apply Annotations'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="forms" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FormInput className="w-4 h-4" />
                  <h3 className="font-medium">PDF Form Management</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Extract, fill, and manage PDF form fields
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={handleExtractFormFields} 
                    disabled={isLoading || !fileUrl}
                    variant="outline"
                  >
                    {isLoading ? 'Extracting...' : 'Extract Form Fields'}
                  </Button>
                  <Button 
                    onClick={handleFillForm} 
                    disabled={isLoading || !fileUrl || Object.keys(formData).length === 0}
                    variant="outline"
                  >
                    {isLoading ? 'Filling...' : 'Fill Form'}
                  </Button>
                </div>

                {formFields.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Form Fields ({formFields.length})</Label>
                    {formFields.map((field, index) => (
                      <div key={index} className="space-y-2 p-3 border rounded-lg">
                        <Label className="text-sm font-medium">{field.name || `Field ${index + 1}`}</Label>
                        {field.type === 'text' && (
                          <Input
                            placeholder={`Enter ${field.name || 'value'}`}
                            value={formData[field.name] || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                          />
                        )}
                        {field.type === 'textarea' && (
                          <Textarea
                            placeholder={`Enter ${field.name || 'value'}`}
                            value={formData[field.name] || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                          />
                        )}
                        {field.type === 'select' && field.options && (
                          <Select
                            value={formData[field.name] || ''}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, [field.name]: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${field.name || 'option'}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map((option: string, optIndex: number) => (
                                <SelectItem key={optIndex} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {formFields.length === 0 && (
                  <div className="text-center py-8">
                    <FormInput className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No form fields found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Extract form fields from your PDF first
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="qr" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  <h3 className="font-medium">QR Code Generation</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Generate and add advanced QR codes to your PDF documents
                </p>
                
                <Button 
                  onClick={() => setShowQRGenerator(true)}
                  variant="outline"
                  className="w-full"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Open QR Code Generator
                </Button>

                {qrCodeText && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Generated QR Code</Label>
                    <div className="p-3 border rounded-lg bg-gray-50">
                      <p className="text-sm font-medium">Content: {qrCodeText}</p>
                      <p className="text-xs text-gray-500">
                        Position: ({qrPosition.x}, {qrPosition.y}) | Size: {qrPosition.size}px
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">X Position:</Label>
                        <Input
                          type="number"
                          value={qrPosition.x}
                          onChange={(e) => setQrPosition(prev => ({ ...prev, x: parseInt(e.target.value) || 100 }))}
                          placeholder="100"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Y Position:</Label>
                        <Input
                          type="number"
                          value={qrPosition.y}
                          onChange={(e) => setQrPosition(prev => ({ ...prev, y: parseInt(e.target.value) || 100 }))}
                          placeholder="100"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Size:</Label>
                        <Input
                          type="number"
                          value={qrPosition.size}
                          onChange={(e) => setQrPosition(prev => ({ ...prev, size: parseInt(e.target.value) || 100 }))}
                          placeholder="100"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleAddQRCode} 
                      disabled={isLoading || !fileUrl}
                      className="w-full"
                    >
                      {isLoading ? 'Adding QR Code...' : 'Add QR Code to PDF'}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <h3 className="font-medium">PDF Export</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Export and download your processed PDF files
                </p>
                <Button 
                  onClick={handleExport} 
                  disabled={isLoading || !fileUrl}
                  className="w-full"
                >
                  {isLoading ? 'Exporting...' : 'Export PDF'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
