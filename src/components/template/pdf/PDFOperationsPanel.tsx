
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
import { FileText, Edit, MessageSquare, FormInput, QrCode, Download } from 'lucide-react';

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

  const handleAddQRCode = async () => {
    if (!fileUrl || !qrCodeText) {
      toast({
        title: "Missing information",
        description: "Please provide QR code text",
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            PDF Operations
          </CardTitle>
          <CardDescription>
            Extract text, edit content, add annotations, and manipulate PDF files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="extract" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="extract">Extract</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
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
                  <h3 className="font-medium">Text Editing</h3>
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
                  {isLoading ? 'Editing...' : 'Edit Text'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="qr" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  <h3 className="font-medium">QR Code Generation</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Add QR codes to your PDF documents
                </p>
                <div className="space-y-2">
                  <Label>QR Code Text/URL:</Label>
                  <Input
                    value={qrCodeText}
                    onChange={(e) => setQrCodeText(e.target.value)}
                    placeholder="Enter text or URL for QR code"
                  />
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
                  {isLoading ? 'Adding QR Code...' : 'Add QR Code'}
                </Button>
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
