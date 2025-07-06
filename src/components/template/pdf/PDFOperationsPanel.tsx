import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Type, 
  Edit3, 
  Palette, 
  FileText, 
  QrCode, 
  Download,
  Plus,
  Save,
  Search,
  Replace
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
  
  // Enhanced search and replace state
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [searchReplaceList, setSearchReplaceList] = useState<Array<{search: string, replace: string}>>([]);
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
        case 'extract-text-enhanced':
          result = await pdfOperationsService.extractTextEnhanced(fileUrl!, {
            preserveFormatting: true,
            includeBoundingBoxes: true,
            preserveLineBreaks: true,
            preserveParagraphs: true,
            detectTables: true,
            maxTextLength: 10000000,
            chunkSize: 1000000
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

        case 'search-replace-multiple':
          if (searchReplaceList.length === 0) {
            toast({
              title: "Error",
              description: "Please add at least one search and replace pair",
              variant: "destructive"
            });
            return;
          }
          
          const searchStrings = searchReplaceList.map(item => item.search);
          const replaceStrings = searchReplaceList.map(item => item.replace);
          
          result = await pdfOperationsService.editTextEnhanced(
            fileUrl!,
            searchStrings,
            replaceStrings,
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
              title: "Multiple Text Replacements Complete",
              description: `Made ${result.replacements || 0} replacement(s) across all search terms`,
              duration: 4000
            });
            onTemplateUpdate({
              ...template,
              template_url: result.url,
              updatedAt: new Date()
            });
          }
          break;

        case 'single-search-replace':
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
              normalizeSpaces: true
            }
          );
          if (result.success) {
            toast({
              title: "Text Replaced Successfully",
              description: `Made ${result.replacements || 0} replacement(s)`,
              duration: 3000
            });
            onTemplateUpdate({
              ...template,
              template_url: result.url,
              updatedAt: new Date()
            });
          }
          break;

        case 'add-qr-code':
          result = await pdfOperationsService.addQRCode(
            fileUrl!,
            options?.qrText || "https://clearqr.io",
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

        case 'export-pdf':
          const exportResult = await pdfOperationsService.exportPDF(fileUrl!, 'pdf', {
            fileName: template.name || 'edited-document',
            compression: true
          });
          if (exportResult.success && exportResult.downloadUrl) {
            const link = document.createElement('a');
            link.href = exportResult.downloadUrl;
            link.download = exportResult.fileName || 'document.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast({
              title: "PDF Downloaded",
              description: "Your edited PDF has been downloaded successfully"
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
        let errorMessage = result.error || "An error occurred during processing";
        
        if (errorMessage.includes('expired') || errorMessage.includes('Access Forbidden') || errorMessage.includes('403')) {
          errorMessage = "PDF file has expired. Please refresh the page and try again, or re-upload the PDF file.";
          
          toast({
            title: "PDF File Expired",
            description: errorMessage,
            variant: "destructive",
            action: (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            )
          });
        } else {
          toast({
            title: "Operation Failed",
            description: errorMessage,
            variant: "destructive"
          });
        }
      }

    } catch (error: any) {
      console.error('PDF operation failed:', error);
      
      let errorMessage = error.message || "An unexpected error occurred";
      if (errorMessage.includes('expired') || errorMessage.includes('403')) {
        errorMessage = "PDF file has expired. Please refresh the page and try again.";
      }
      
      toast({
        title: "Operation Failed",
        description: errorMessage,
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

  const addSearchReplacePair = () => {
    if (searchText.trim() && replaceText.trim()) {
      setSearchReplaceList(prev => [...prev, { search: searchText.trim(), replace: replaceText.trim() }]);
      setSearchText('');
      setReplaceText('');
    }
  };

  const removeSearchReplacePair = (index: number) => {
    setSearchReplaceList(prev => prev.filter((_, i) => i !== index));
  };

  const handleExtractAndEdit = async () => {
    setIsEditing(true);
    await handleOperation('extract-text-enhanced');
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

    const result = await pdfOperationsService.replaceWithEditedText(
      template.template_url || template.preview!,
      extractedText
    );

    if (result.success) {
      toast({
        title: "Text Updated Successfully",
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
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-green-50">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Canva-Style PDF Editor</h2>
        <p className="text-sm text-gray-600">Professional PDF editing with advanced text processing</p>
      </div>

      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="search-replace" className="h-full">
          <div className="border-b bg-white sticky top-0 z-10">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1">
              <TabsTrigger 
                value="search-replace" 
                className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-blue-100"
              >
                <Search className="h-4 w-4" />
                Search & Replace
              </TabsTrigger>
              <TabsTrigger 
                value="extract" 
                className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-green-100"
              >
                <Type className="h-4 w-4" />
                Extract Text
              </TabsTrigger>
              <TabsTrigger 
                value="annotate" 
                className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-purple-100"
              >
                <Palette className="h-4 w-4" />
                Annotate
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
            {/* Enhanced Search & Replace Tab */}
            <TabsContent value="search-replace" className="mt-0 space-y-4">
              <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                    <Replace className="h-5 w-5" />
                    Advanced Search & Replace
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Professional text replacement with formatting preservation, similar to Canva PDF Editor.
                  </p>
                  
                  {/* Single Search & Replace */}
                  <div className="space-y-3 p-4 bg-white rounded-lg border">
                    <h4 className="font-medium text-gray-800">Quick Replace</h4>
                    
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
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="search" className="text-sm font-medium">Find:</Label>
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
                    </div>
                    
                    <Button
                      onClick={() => handleOperation('single-search-replace')}
                      disabled={isProcessing || !searchText.trim()}
                      className="w-full"
                    >
                      {isOperationActive('single-search-replace') ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Replacing...
                        </>
                      ) : (
                        <>
                          <Replace className="h-4 w-4 mr-2" />
                          Replace All Instances
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Multiple Search & Replace */}
                  <div className="space-y-3 p-4 bg-white rounded-lg border">
                    <h4 className="font-medium text-gray-800">Batch Replace (Multiple)</h4>
                    
                    {/* Add new pair */}
                    <div className="flex gap-2">
                      <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Find..."
                        className="flex-1"
                      />
                      <Input
                        value={replaceText}
                        onChange={(e) => setReplaceText(e.target.value)}
                        placeholder="Replace with..."
                        className="flex-1"
                      />
                      <Button
                        onClick={addSearchReplacePair}
                        disabled={!searchText.trim()}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* List of pairs */}
                    {searchReplaceList.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Replace List:</Label>
                        {searchReplaceList.map((pair, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                            <span className="flex-1">"{pair.search}" → "{pair.replace}"</span>
                            <Button
                              onClick={() => removeSearchReplacePair(index)}
                              variant="ghost"
                              size="sm"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          onClick={() => handleOperation('search-replace-multiple')}
                          disabled={isProcessing}
                          className="w-full mt-2"
                        >
                          {isOperationActive('search-replace-multiple') ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Replace className="h-4 w-4 mr-2" />
                              Execute All Replacements
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Extract Tab */}
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
                      onClick={() => handleOperation('extract-text-enhanced')}
                      disabled={isProcessing}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      {isOperationActive('extract-text-enhanced') ? (
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

            {/* Export Tab */}
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
          <span>Canva-Style PDF Editor • ClearQR.io Integration</span>
          {isProcessing && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />
              <span>Processing PDF...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
