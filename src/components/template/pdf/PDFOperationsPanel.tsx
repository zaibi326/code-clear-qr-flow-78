
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Type, 
  Search, 
  Download, 
  QrCode, 
  FileImage,
  Edit3,
  Wand2,
  ImageIcon
} from 'lucide-react';
import { Template } from '@/types/template';
import { usePDFRenderer } from '@/hooks/usePDFRenderer';
import { pdfOperationsService } from '@/services/pdfOperationsService';
import { toast } from '@/hooks/use-toast';

interface PDFOperationsPanelProps {
  template: Template;
  onTemplateUpdate: (template: Template) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export const PDFOperationsPanel: React.FC<PDFOperationsPanelProps> = ({
  template,
  onTemplateUpdate,
  searchTerm,
  onSearchTermChange
}) => {
  const [activeOperation, setActiveOperation] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [qrContent, setQrContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { processWithPDFCo, convertToImages } = usePDFRenderer();

  const handleTextReplace = async () => {
    if (!searchText.trim() || !template.template_url) return;

    setIsProcessing(true);
    try {
      const result = await processWithPDFCo('textReplace', {
        pdfUrl: template.template_url,
        searchTexts: [searchText],
        replaceTexts: [replaceText],
        options: {
          caseSensitive: false,
          preserveFormatting: true,
          maintainLayout: true
        }
      });

      if (result.success && result.url) {
        const updatedTemplate = {
          ...template,
          template_url: result.url,
          preview: result.url
        };
        onTemplateUpdate(updatedTemplate);
        
        toast({
          title: "Text Replaced Successfully",
          description: `${result.replacements || 0} instances replaced`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Text Replace Failed",
        description: error.message || "Failed to replace text",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddQRCode = async () => {
    if (!qrContent.trim() || !template.template_url) return;

    setIsProcessing(true);
    try {
      const result = await processWithPDFCo('addQRCode', {
        pdfUrl: template.template_url,
        content: qrContent,
        x: 50,
        y: 50,
        size: 100,
        pages: '1'
      });

      if (result.success && result.url) {
        const updatedTemplate = {
          ...template,
          template_url: result.url,
          preview: result.url
        };
        onTemplateUpdate(updatedTemplate);
        
        toast({
          title: "QR Code Added",
          description: "QR code successfully added to PDF",
        });
      }
    } catch (error: any) {
      toast({
        title: "QR Code Failed",
        description: error.message || "Failed to add QR code",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvertToImages = async () => {
    if (!template.template_url) return;

    setIsProcessing(true);
    try {
      const images = await convertToImages({
        format: 'PNG',
        quality: 0.95,
        dpi: 300
      });

      // Create download links for each image
      images.forEach((imageData, index) => {
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `${template.name}-page-${index + 1}.png`;
        link.click();
      });

      toast({
        title: "Images Downloaded",
        description: `${images.length} page(s) converted to images`,
      });
    } catch (error: any) {
      toast({
        title: "Conversion Failed",
        description: error.message || "Failed to convert PDF to images",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const operations = [
    {
      id: 'search',
      title: 'Search & Replace',
      icon: Search,
      description: 'Find and replace text in PDF'
    },
    {
      id: 'qrcode',
      title: 'Add QR Code',
      icon: QrCode,
      description: 'Insert QR codes into PDF'
    },
    {
      id: 'convert',
      title: 'Convert to Images',
      icon: ImageIcon,
      description: 'Export PDF pages as images'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            <Input
              placeholder="Search in PDF..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="flex-1 bg-white/80"
            />
          </div>
        </CardContent>
      </Card>

      {/* Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-600" />
            PDF Operations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {operations.map((operation) => (
            <div key={operation.id}>
              <Button
                variant={activeOperation === operation.id ? "default" : "outline"}
                onClick={() => setActiveOperation(activeOperation === operation.id ? '' : operation.id)}
                className="w-full justify-start"
              >
                <operation.icon className="w-4 h-4 mr-2" />
                {operation.title}
              </Button>

              {activeOperation === operation.id && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-3">
                  <p className="text-sm text-gray-600">{operation.description}</p>
                  
                  {operation.id === 'search' && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="search-text">Search for:</Label>
                        <Input
                          id="search-text"
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                          placeholder="Enter text to find..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="replace-text">Replace with:</Label>
                        <Input
                          id="replace-text"
                          value={replaceText}
                          onChange={(e) => setReplaceText(e.target.value)}
                          placeholder="Enter replacement text..."
                        />
                      </div>
                      <Button 
                        onClick={handleTextReplace}
                        disabled={!searchText.trim() || isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? 'Processing...' : 'Replace Text'}
                      </Button>
                    </div>
                  )}

                  {operation.id === 'qrcode' && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="qr-content">QR Code Content:</Label>
                        <Textarea
                          id="qr-content"
                          value={qrContent}
                          onChange={(e) => setQrContent(e.target.value)}
                          placeholder="Enter URL or text for QR code..."
                          rows={3}
                        />
                      </div>
                      <Button 
                        onClick={handleAddQRCode}
                        disabled={!qrContent.trim() || isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? 'Adding...' : 'Add QR Code'}
                      </Button>
                    </div>
                  )}

                  {operation.id === 'convert' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Convert all PDF pages to high-quality PNG images.
                      </p>
                      <Button 
                        onClick={handleConvertToImages}
                        disabled={isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? 'Converting...' : 'Download as Images'}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-green-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Type className="w-4 h-4 mr-2" />
            Extract Text
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Edit3 className="w-4 h-4 mr-2" />
            Add Annotations
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileImage className="w-4 h-4 mr-2" />
            Optimize PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
