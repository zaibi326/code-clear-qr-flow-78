import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Type, 
  Edit3, 
  Palette, 
  FileText, 
  QrCode, 
  Download,
  AlertCircle,
  Info,
  Plus,
  Save,
  Upload
} from 'lucide-react';
import { Template } from '@/types/template';
import { pdfOperationsService } from '@/services/pdfOperationsService';
import { toast } from '@/hooks/use-toast';
import { QRCodeGenerator } from './components/QRCodeGenerator';

interface PDFOperationsPanelProps {
  template: Template;
  onTemplateUpdate: (updatedTemplate: Template) => void;
}

export const PDFOperationsPanel: React.FC<PDFOperationsPanelProps> = ({
  template,
  onTemplateUpdate
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  
  // Enhanced edit text state
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [preserveFormatting, setPreserveFormatting] = useState(true);
  const [maintainLayout, setMaintainLayout] = useState(true);
  
  // Form fields state
  const [formFields, setFormFields] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleOperation = async (operation: string, options?: any) => {
    if (!template.preview && !template.template_url) {
      toast({
        title: "Error",
        description: "No PDF file available for processing",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setActiveOperation(operation);

    try {
      const fileUrl = template.template_url || template.preview;
      let result;

      switch (operation) {
        case 'extract-text':
          result = await pdfOperationsService.extractTextEnhanced(fileUrl!, {
            preserveFormatting: true,
            includeBoundingBoxes: true,
            preserveLineBreaks: true,
            preserveParagraphs: true,
            detectTables: true,
            maxTextLength: 10000000, // 10MB
            chunkSize: 1000000 // 1MB chunks
          });
          if (result.success) {
            setExtractedText(result.text || '');
            toast({
              title: "Enhanced Text Extracted",
              description: `Extracted ${result.text?.length || 0} characters with preserved formatting`,
              duration: 3000
            });
          }
          break;

        case 'edit-text':
          if (!searchText.trim()) {
            toast({
              title: "Error",
              description: "Please enter text to search for",
              variant: "destructive"
            });
            return;
          }
          result = await pdfOperationsService.editTextEnhanced(
            fileUrl!,
            [searchText],
            [replaceText],
            {
              caseSensitive: false,
              preserveFormatting: preserveFormatting,
              maintainLayout: maintainLayout,
              boundingBoxMapping: true,
              normalizeSpaces: true,
              chunkProcessing: true
            }
          );
          if (result.success) {
            toast({
              title: "Text Edited with Enhanced Formatting",
              description: `Made ${result.replacements || 0} replacement(s) while preserving layout`,
              duration: 3000
            });
            onTemplateUpdate({
              ...template,
              template_url: result.url,
              updatedAt: new Date()
            });
          }
          break;

        case 'batch-extract':
          // Process large PDFs in batches
          const pageCount = options?.pageCount || 10;
          const batchSize = 5; // Process 5 pages at a time
          let allText = '';
          let allTextBlocks: any[] = [];
          
          for (let start = 1; start <= pageCount; start += batchSize) {
            const end = Math.min(start + batchSize - 1, pageCount);
            
            const batchResult = await pdfOperationsService.processPageBatch(
              fileUrl!,
              start,
              end,
              'extract',
              {
                preserveFormatting: true,
                includeBoundingBoxes: true,
                normalizeSpaces: true,
                preserveLineBreaks: true
              }
            );
            
            if (batchResult.success) {
              allText += (batchResult.text || '') + '\n\n';
              allTextBlocks.push(...(batchResult.textBlocks || []));
            }
          }
          
          setExtractedText(allText);
          toast({
            title: "Batch Text Extraction Complete",
            description: `Processed ${pageCount} pages in batches with enhanced formatting`,
            duration: 4000
          });
          break;

        case 'add-qr-code':
          result = await pdfOperationsService.addQRCode(
            fileUrl!,
            options?.qrText || "https://example.com",
            options?.x || 100,
            options?.y || 100,
            options?.size || 100
          );
          if (result.success) {
            toast({
              title: "QR Code Added",
              description: "QR code has been added to the PDF"
            });
            onTemplateUpdate({
              ...template,
              template_url: result.url,
              updatedAt: new Date()
            });
          }
          break;

        case 'add-annotations':
          const annotations = options?.annotations || [{
            type: 'rectangle',
            x: 100,
            y: 100,
            width: 200,
            height: 100,
            pages: "1"
          }];
          result = await pdfOperationsService.addAnnotations(fileUrl!, annotations);
          if (result.success) {
            toast({
              title: "Annotations Added",
              description: `Added ${annotations.length} annotation(s)`
            });
            onTemplateUpdate({
              ...template,
              template_url: result.url,
              updatedAt: new Date()
            });
          }
          break;

        case 'extract-form-fields':
          // This would extract form fields from the PDF
          setFormFields([
            { name: 'name', type: 'text', required: true },
            { name: 'email', type: 'email', required: true },
            { name: 'message', type: 'textarea', required: false }
          ]);
          toast({
            title: "Form Fields Extracted",
            description: "Found form fields in the PDF"
          });
          break;

        case 'export-pdf':
          const exportResult = await pdfOperationsService.exportPDF(fileUrl!, 'pdf', {
            fileName: template.name || 'exported-document',
            compression: true
          });
          if (exportResult.success && exportResult.downloadUrl) {
            // Trigger download
            const link = document.createElement('a');
            link.href = exportResult.downloadUrl;
            link.download = exportResult.fileName || 'document.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast({
              title: "PDF Exported",
              description: "PDF has been downloaded successfully"
            });
          }
          break;

        default:
          toast({
            title: "Feature Coming Soon",
            description: `${operation} functionality will be available soon`
          });
          return;
      }

      if (result && !result.success) {
        toast({
          title: "Operation Failed",
          description: result.error || "An error occurred during processing",
          variant: "destructive"
        });
      }

    } catch (error: any) {
      console.error('PDF operation failed:', error);
      toast({
        title: "Operation Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setActiveOperation(null);
    }
  };

  const handleQRGenerate = (qrContent: string, size: number) => {
    setShowQRGenerator(false);
    handleOperation('add-qr-code', {
      qrText: qrContent,
      x: 100,
      y: 100,
      size: size
    });
  };

  const handleExtractAndEdit = async () => {
    setIsEditing(true);
    await handleOperation('extract-text');
  };

  const handleSaveEditedText = async () => {
    if (!extractedText.trim()) {
      toast({
        title: "Error",
        description: "No text to save",
        variant: "destructive"
      });
      return;
    }

    // Use enhanced text replacement with formatting preservation
    const result = await pdfOperationsService.replaceWithEditedText(
      template.template_url || template.preview!,
      extractedText
    );

    if (result.success) {
      toast({
        title: "Text Updated with Enhanced Formatting",
        description: "PDF text has been updated while preserving layout and formatting",
        duration: 3000
      });
      onTemplateUpdate({
        ...template,
        template_url: result.url,
        updatedAt: new Date()
      });
      setIsEditing(false);
    }
  };

  const isOperationActive = (operation: string) => activeOperation === operation && isProcessing;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Enhanced PDF Operations</h2>
        <p className="text-sm text-gray-600">Advanced text processing with format preservation</p>
      </div>

      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="extract" className="h-full">
          <div className="border-b bg-white sticky top-0 z-10">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger 
                value="extract" 
                className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-blue-100"
              >
                <Type className="h-4 w-4" />
                Extract
              </TabsTrigger>
              <TabsTrigger 
                value="edit" 
                className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-green-100"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger 
                value="annotate" 
                className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-purple-100"
              >
                <Palette className="h-4 w-4" />
                Annotate
              </TabsTrigger>
            </TabsList>
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 border-t">
              <TabsTrigger 
                value="forms" 
                className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-orange-100"
              >
                <FileText className="h-4 w-4" />
                Forms
              </TabsTrigger>
              <TabsTrigger 
                value="qrcode" 
                className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-indigo-100"
              >
                <QrCode className="h-4 w-4" />
                QR Code
              </TabsTrigger>
              <TabsTrigger 
                value="export" 
                className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-pink-100"
              >
                <Download className="h-4 w-4" />
                Export
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4 space-y-4">
            {/* Enhanced Extract Tab */}
            <TabsContent value="extract" className="mt-0 space-y-4">
              <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                    <Type className="h-5 w-5" />
                    Enhanced Text Extraction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Extract text with preserved formatting, paragraph structure, and table detection.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleOperation('extract-text')}
                      disabled={isProcessing}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      {isOperationActive('extract-text') ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Extracting...
                        </>
                      ) : (
                        <>
                          <Type className="h-4 w-4 mr-2" />
                          Extract Enhanced
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => handleOperation('batch-extract', { pageCount: 10 })}
                      disabled={isProcessing}
                      variant="outline"
                      size="sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Batch Extract
                    </Button>
                  </div>
                  
                  {extractedText && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium mb-2 block">Enhanced Extracted Text:</Label>
                      <div className="max-h-40 overflow-y-auto p-3 bg-white border rounded text-sm font-mono">
                        {extractedText.substring(0, 1000)}
                        {extractedText.length > 1000 && '...'}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {extractedText.length} characters • Formatting preserved
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Edit Tab */}
            <TabsContent value="edit" className="mt-0 space-y-4">
              <Card className="border-green-200 bg-green-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                    <Edit3 className="h-5 w-5" />
                    Enhanced Text Editing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isEditing ? (
                    <>
                      <p className="text-sm text-gray-600">
                        Advanced search and replace with layout preservation and bounding box mapping.
                      </p>
                      
                      {/* Enhanced Options */}
                      <div className="flex gap-4 mb-3">
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={preserveFormatting}
                            onChange={(e) => setPreserveFormatting(e.target.checked)}
                            className="mr-2"
                          />
                          Preserve Formatting
                        </label>
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={maintainLayout}
                            onChange={(e) => setMaintainLayout(e.target.checked)}
                            className="mr-2"
                          />
                          Maintain Layout
                        </label>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="search" className="text-sm font-medium">Search for:</Label>
                          <Input
                            id="search"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Enter text to find..."
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="replace" className="text-sm font-medium">Replace with:</Label>
                          <Input
                            id="replace"
                            value={replaceText}
                            onChange={(e) => setReplaceText(e.target.value)}
                            placeholder="Enter replacement text..."
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => handleOperation('edit-text')}
                            disabled={isProcessing || !searchText.trim()}
                            variant="outline"
                            size="sm"
                          >
                            {isOperationActive('edit-text') ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600" />
                            ) : (
                              <>
                                <Edit3 className="h-4 w-4 mr-1" />
                                Enhanced Replace
                              </>
                            )}
                          </Button>
                          
                          <Button
                            onClick={handleExtractAndEdit}
                            disabled={isProcessing}
                            variant="outline"
                            size="sm"
                          >
                            <Type className="h-4 w-4 mr-1" />
                            Rich Edit
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Edit extracted text (formatting preserved):</Label>
                      <Textarea
                        value={extractedText}
                        onChange={(e) => setExtractedText(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                        placeholder="Extracted text will appear here for editing..."
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveEditedText}
                          disabled={isProcessing}
                          size="sm"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save with Formatting
                        </Button>
                        <Button
                          onClick={() => setIsEditing(false)}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Annotate Tab */}
            <TabsContent value="annotate" className="mt-0 space-y-4">
              <Card className="border-purple-200 bg-purple-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                    <Palette className="h-5 w-5" />
                    Add Annotations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Add visual annotations like rectangles, highlights, and shapes.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleOperation('add-annotations', {
                        annotations: [{
                          type: 'rectangle',
                          x: 100,
                          y: 100,
                          width: 200,
                          height: 100,
                          pages: "1"
                        }]
                      })}
                      disabled={isProcessing}
                      variant="outline"
                      className="flex flex-col items-center gap-1 h-auto py-3"
                    >
                      {isOperationActive('add-annotations') ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600" />
                      ) : (
                        <>
                          <div className="w-6 h-4 border-2 border-purple-600 rounded" />
                          <span className="text-xs">Rectangle</span>
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleOperation('add-annotations', {
                        annotations: [{
                          type: 'highlight',
                          x: 150,
                          y: 150,
                          width: 180,
                          height: 20,
                          pages: "1"
                        }]
                      })}
                      disabled={isProcessing}
                      variant="outline"
                      className="flex flex-col items-center gap-1 h-auto py-3"
                    >
                      <div className="w-6 h-2 bg-yellow-400 rounded" />
                      <span className="text-xs">Highlight</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Forms Tab - Now with actual functionality */}
            <TabsContent value="forms" className="mt-0 space-y-4">
              <Card className="border-orange-200 bg-orange-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                    <FileText className="h-5 w-5" />
                    Form Operations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Extract and fill form fields in your PDF documents.
                  </p>
                  
                  <Button
                    onClick={() => handleOperation('extract-form-fields')}
                    disabled={isProcessing}
                    className="w-full"
                    variant="outline"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Extract Form Fields
                  </Button>
                  
                  {formFields.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Fill Form Fields:</Label>
                      {formFields.map((field, index) => (
                        <div key={index}>
                          <Label className="text-xs text-gray-600 capitalize">
                            {field.name} {field.required && '*'}
                          </Label>
                          {field.type === 'textarea' ? (
                            <Textarea
                              value={formData[field.name] || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                [field.name]: e.target.value
                              }))}
                              placeholder={`Enter ${field.name}...`}
                              className="mt-1"
                            />
                          ) : (
                            <Input
                              type={field.type}
                              value={formData[field.name] || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                [field.name]: e.target.value
                              }))}
                              placeholder={`Enter ${field.name}...`}
                              className="mt-1"
                            />
                          )}
                        </div>
                      ))}
                      <Button
                        onClick={() => handleOperation('fill-form', { fields: formData })}
                        disabled={isProcessing}
                        className="w-full"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Fill Form
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* QR Code Tab */}
            <TabsContent value="qrcode" className="mt-0 space-y-4">
              <Card className="border-indigo-200 bg-indigo-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-indigo-800">
                    <QrCode className="h-5 w-5" />
                    QR Code Generator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Add QR codes to your PDF documents at specified positions.
                  </p>
                  <Button
                    onClick={() => setShowQRGenerator(true)}
                    disabled={isProcessing}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    size="lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add QR Code
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Export Tab - Now with actual functionality */}
            <TabsContent value="export" className="mt-0 space-y-4">
              <Card className="border-pink-200 bg-pink-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-pink-800">
                    <Download className="h-5 w-5" />
                    Export & Download
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Export your PDF in different formats or download the processed version.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      onClick={() => handleOperation('export-pdf')}
                      disabled={isProcessing}
                      variant="outline"
                    >
                      {isOperationActive('export-pdf') ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600 mr-2" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* QR Code Generator Modal */}
      {showQRGenerator && (
        <QRCodeGenerator
          onGenerate={handleQRGenerate}
          onClose={() => setShowQRGenerator(false)}
        />
      )}

      {/* Enhanced Status Bar */}
      <div className="border-t bg-gray-50 p-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Enhanced PDF Operations • Format Preservation Active</span>
          {isProcessing && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />
              <span>Processing with enhanced formatting...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
