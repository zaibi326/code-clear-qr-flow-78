import React, { useState, useEffect } from 'react';
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
  Italic,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { pdfOperationsService } from '@/services/pdfOperationsService';
import { toast } from '@/hooks/use-toast';

interface PDFOperationsPanelProps {
  template: Template;
  onTemplateUpdate: (template: Template) => void;
  searchTerm?: string;
  onSearchTermChange?: (term: string) => void;
}

export const PDFOperationsPanel: React.FC<PDFOperationsPanelProps> = ({
  template,
  onTemplateUpdate,
  searchTerm = '',
  onSearchTermChange
}) => {
  const [localSearchText, setLocalSearchText] = useState(searchTerm);
  const [replaceText, setReplaceText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [newTextContent, setNewTextContent] = useState('New Text');
  const [textBoxPosition, setTextBoxPosition] = useState({ x: 100, y: 100 });

  // Update local search when prop changes
  useEffect(() => {
    setLocalSearchText(searchTerm);
  }, [searchTerm]);

  // Debounced search functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchText.trim() && localSearchText !== searchTerm) {
        handleSearch();
      } else if (!localSearchText.trim()) {
        setSearchResults([]);
        onSearchTermChange?.('');
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearchText]);

  const handleSearch = async () => {
    if (!localSearchText.trim()) {
      setSearchResults([]);
      onSearchTermChange?.('');
      return;
    }

    setIsSearching(true);
    
    try {
      console.log('🔍 Searching for text in PDF:', localSearchText);
      
      const result = await pdfOperationsService.searchInPDF(
        template.template_url || template.preview || '',
        localSearchText
      );

      if (result.success && result.results) {
        setSearchResults(result.results);
        onSearchTermChange?.(localSearchText);
        
        toast({
          title: "Search Complete",
          description: `Found ${result.results.length} matches for "${localSearchText}".`,
        });
      } else {
        setSearchResults([]);
        toast({
          title: "No Results",
          description: `No matches found for "${localSearchText}".`,
        });
      }
    } catch (error: any) {
      console.error('❌ Search failed:', error);
      setSearchResults([]);
      toast({
        title: "Search Failed",
        description: error.message || "Failed to search in PDF.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchAndReplace = async () => {
    if (!localSearchText.trim() || !replaceText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter both search and replace text.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('🔄 Starting global search and replace:', { 
        searchText: localSearchText, 
        replaceText 
      });
      
      const result = await pdfOperationsService.editTextEnhanced(
        template.template_url || template.preview || '',
        [localSearchText],
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
          description: `Replaced ${result.replacements || 0} instances of "${localSearchText}" with "${replaceText}".`,
        });
        
        // Clear search results and refresh search
        setSearchResults([]);
        setReplaceText('');
        
        // Refresh search results with new text
        setTimeout(() => {
          if (replaceText.trim()) {
            setLocalSearchText(replaceText);
          }
        }, 500);
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

  const clearSearch = () => {
    setLocalSearchText('');
    setReplaceText('');
    setSearchResults([]);
    onSearchTermChange?.('');
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Type className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">PDF Editor Tools</h2>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Search className="w-4 h-4" />
                Enhanced Search & Replace
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="search-text">Search for</Label>
                  {isSearching && (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="search-text"
                    value={localSearchText}
                    onChange={(e) => setLocalSearchText(e.target.value)}
                    placeholder="Enter text to search..."
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSearch}
                    disabled={!localSearchText}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
                {searchResults.length > 0 && (
                  <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {searchResults.length} matches found
                  </div>
                )}
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
              
              <div className="space-y-2">
                <Button 
                  onClick={handleSearchAndReplace}
                  disabled={isProcessing || !localSearchText.trim() || !replaceText.trim() || searchResults.length === 0}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Replacing...
                    </>
                  ) : (
                    <>
                      <Replace className="w-4 h-4 mr-2" />
                      Replace All ({searchResults.length})
                    </>
                  )}
                </Button>
                
                {searchResults.length > 0 && (
                  <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                    <p className="font-medium mb-1">Preview changes:</p>
                    <p>This will replace <span className="font-mono bg-red-100 px-1">"{localSearchText}"</span> with <span className="font-mono bg-green-100 px-1">"{replaceText}"</span> in {searchResults.length} location{searchResults.length > 1 ? 's' : ''} while preserving formatting and layout.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Search Results Panel */}
          {searchResults.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Search Results ({searchResults.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {searchResults.slice(0, 10).map((result, index) => (
                    <div
                      key={index}
                      className="text-xs p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                      title={`Found on page ${result.pageNumber}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Page {result.pageNumber}</span>
                        <span className="text-gray-500">Match {index + 1}</span>
                      </div>
                      <p className="mt-1 text-gray-700 truncate">{result.text}</p>
                    </div>
                  ))}
                  {searchResults.length > 10 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      ... and {searchResults.length - 10} more matches
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

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
