
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Template } from '@/types/template';
import { 
  Type, 
  Search, 
  Replace, 
  Plus, 
  Download,
  Palette,
  AlignLeft,
  Bold,
  Italic
} from 'lucide-react';
import { pdfOperationsService } from '@/services/pdfOperationsService';
import { toast } from '@/hooks/use-toast';

interface PDFOperationsPanelProps {
  template: Template;
  onTemplateUpdate: (template: Template) => void;
}

export const PDFOperationsPanel: React.FC<PDFOperationsPanelProps> = ({
  template,
  onTemplateUpdate
}) => {
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [newTextContent, setNewTextContent] = useState('New Text');
  const [textBoxPosition, setTextBoxPosition] = useState({ x: 100, y: 100 });

  const handleSearchAndReplace = async () => {
    if (!searchText.trim() || !replaceText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter both search and replace text.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('🔍 Starting search and replace:', { searchText, replaceText });
      
      const result = await pdfOperationsService.editTextEnhanced(
        template.template_url || template.preview || '',
        [searchText],
        [replaceText],
        {
          caseSensitive: false,
          preserveFormatting: true,
          maintainLayout: true
        }
      );

      if (result.success) {
        const updatedTemplate = {
          ...template,
          template_url: result.url,
          preview: result.url,
          updated_at: new Date().toISOString()
        };
        
        onTemplateUpdate(updatedTemplate);
        
        toast({
          title: "Text Replaced Successfully",
          description: `Found and replaced ${result.replacements || 0} instances of "${searchText}".`,
        });
        
        // Clear inputs
        setSearchText('');
        setReplaceText('');
      } else {
        throw new Error(result.error || 'Search and replace failed');
      }
    } catch (error: any) {
      console.error('❌ Search and replace failed:', error);
      toast({
        title: "Operation Failed",
        description: error.message || "Failed to perform search and replace.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddTextBox = async () => {
    if (!newTextContent.trim()) {
      toast({
        title: "Text Required",
        description: "Please enter text for the new text box.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('➕ Adding text box:', { 
        text: newTextContent, 
        position: textBoxPosition 
      });
      
      const result = await pdfOperationsService.addTextBox(
        template.template_url || template.preview || '',
        1, // page number
        textBoxPosition.x,
        textBoxPosition.y,
        newTextContent,
        16, // font size
        '#000000' // color
      );

      if (result.success) {
        const updatedTemplate = {
          ...template,
          template_url: result.url,
          preview: result.url,
          updated_at: new Date().toISOString()
        };
        
        onTemplateUpdate(updatedTemplate);
        
        toast({
          title: "Text Box Added",
          description: `Added text box with content: "${newTextContent}".`,
        });
        
        // Reset values
        setNewTextContent('New Text');
        setTextBoxPosition({ x: textBoxPosition.x + 20, y: textBoxPosition.y + 20 });
      } else {
        throw new Error(result.error || 'Failed to add text box');
      }
    } catch (error: any) {
      console.error('❌ Add text box failed:', error);
      toast({
        title: "Operation Failed",
        description: error.message || "Failed to add text box.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfUrl = template.template_url || template.preview || '';
      if (!pdfUrl) {
        throw new Error('No PDF URL available');
      }
      
      await pdfOperationsService.downloadPDF(pdfUrl, `${template.name}.pdf`);
      
      toast({
        title: "Download Started",
        description: "Your PDF download has begun.",
      });
    } catch (error: any) {
      console.error('❌ Download failed:', error);
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download PDF.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Type className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">PDF Editor Tools</h2>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Text Box
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="new-text">Text Content</Label>
                <Input
                  id="new-text"
                  value={newTextContent}
                  onChange={(e) => setNewTextContent(e.target.value)}
                  placeholder="Enter text to add..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="text-x">X Position</Label>
                  <Input
                    id="text-x"
                    type="number"
                    value={textBoxPosition.x}
                    onChange={(e) => setTextBoxPosition({
                      ...textBoxPosition,
                      x: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="text-y">Y Position</Label>
                  <Input
                    id="text-y"
                    type="number"
                    value={textBoxPosition.y}
                    onChange={(e) => setTextBoxPosition({
                      ...textBoxPosition,
                      y: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleAddTextBox}
                disabled={isProcessing || !newTextContent.trim()}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Text Box
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Text Formatting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Palette className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search & Replace
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="search-text">Search for</Label>
                <Input
                  id="search-text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Enter text to search..."
                />
              </div>
              
              <div>
                <Label htmlFor="replace-text">Replace with</Label>
                <Input
                  id="replace-text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Enter replacement text..."
                />
              </div>
              
              <Button 
                onClick={handleSearchAndReplace}
                disabled={isProcessing || !searchText.trim() || !replaceText.trim()}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Replace className="w-4 h-4 mr-2" />
                    Replace All
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleDownloadPDF}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
