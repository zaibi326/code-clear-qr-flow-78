
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Type, 
  Edit3, 
  Palette, 
  FileText, 
  QrCode, 
  Download,
  AlertCircle,
  Info
} from 'lucide-react';
import { Template } from '@/types/template';
import { pdfOperationsService } from '@/services/pdfOperationsService';
import { toast } from '@/hooks/use-toast';

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
          result = await pdfOperationsService.extractText(fileUrl!);
          if (result.success) {
            toast({
              title: "Text Extracted",
              description: `Extracted ${result.text?.length || 0} characters`
            });
          }
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
            // Update template with new URL
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
            // Update template with new URL
            onTemplateUpdate({
              ...template,
              template_url: result.url,
              updatedAt: new Date()
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

  const isOperationActive = (operation: string) => activeOperation === operation && isProcessing;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-xl font-bold text-gray-900 mb-2">PDF Operations</h2>
        <p className="text-sm text-gray-600">Transform and enhance your PDF documents</p>
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
            {/* Extract Tab */}
            <TabsContent value="extract" className="mt-0 space-y-4">
              <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                    <Type className="h-5 w-5" />
                    Text Extraction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Extract text content from your PDF for editing or analysis.
                  </p>
                  <Button
                    onClick={() => handleOperation('extract-text')}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    {isOperationActive('extract-text') ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <Type className="h-4 w-4 mr-2" />
                        Extract Text
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Edit Tab */}
            <TabsContent value="edit" className="mt-0 space-y-4">
              <Card className="border-green-200 bg-green-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                    <Edit3 className="h-5 w-5" />
                    Text Editing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Edit and replace text content directly in your PDF documents.
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <Info className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <span className="text-sm text-amber-800">Coming Soon</span>
                  </div>
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

            {/* Forms Tab */}
            <TabsContent value="forms" className="mt-0 space-y-4">
              <Card className="border-orange-200 bg-orange-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                    <FileText className="h-5 w-5" />
                    Form Operations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <Info className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <span className="text-sm text-amber-800">Coming Soon</span>
                  </div>
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
                    onClick={() => handleOperation('add-qr-code', {
                      qrText: 'https://example.com',
                      x: 100,
                      y: 100,
                      size: 100
                    })}
                    disabled={isProcessing}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    size="lg"
                  >
                    {isOperationActive('add-qr-code') ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Adding QR Code...
                      </>
                    ) : (
                      <>
                        <QrCode className="h-4 w-4 mr-2" />
                        Add Sample QR Code
                      </>
                    )}
                  </Button>
                  <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                    <strong>Note:</strong> This adds a sample QR code. Advanced QR customization coming soon.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Export Tab */}
            <TabsContent value="export" className="mt-0 space-y-4">
              <Card className="border-pink-200 bg-pink-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-pink-800">
                    <Download className="h-5 w-5" />
                    Export & Download
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <Info className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <span className="text-sm text-amber-800">Coming Soon</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Status Bar */}
      <div className="border-t bg-gray-50 p-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>PDF Operations Panel</span>
          {isProcessing && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />
              <span>Processing...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
