
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Replace, 
  Download, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Edit3
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
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [replacements, setReplacements] = useState<Array<{search: string, replace: string}>>([]);

  const handleTextReplace = async () => {
    if (!searchText.trim()) {
      toast({
        title: "Search text required",
        description: "Please enter text to search for",
        variant: "destructive"
      });
      return;
    }

    const fileUrl = template.template_url || template.preview;
    if (!fileUrl) {
      toast({
        title: "No PDF file",
        description: "Please upload a PDF file first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      console.log('🔄 Starting text replacement:', { searchText, replaceText });

      const result = await pdfOperationsService.editTextEnhanced(
        fileUrl,
        [searchText.trim()],
        [replaceText.trim()],
        {
          caseSensitive: false,
          preserveFormatting: true,
          maintainLayout: true
        }
      );

      if (result.success && result.url) {
        setProcessedUrl(result.url);
        
        // Add to replacements history
        setReplacements(prev => [...prev, { search: searchText, replace: replaceText }]);
        
        // Update template with new URL
        const updatedTemplate: Template = {
          ...template,
          template_url: result.url,
          updatedAt: new Date()
        };
        
        onTemplateUpdate(updatedTemplate);

        toast({
          title: "Text replaced successfully",
          description: `Found and replaced text. ${result.replacements || 0} replacements made.`,
        });

        // Clear inputs
        setSearchText('');
        setReplaceText('');
      } else {
        throw new Error(result.error || 'Text replacement failed');
      }
    } catch (error: any) {
      console.error('❌ Text replacement failed:', error);
      toast({
        title: "Text replacement failed",
        description: error.message || 'Please try again or re-upload the PDF',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    const downloadUrl = processedUrl || template.template_url || template.preview;
    if (!downloadUrl) return;

    try {
      await pdfOperationsService.downloadPDF(downloadUrl, `edited-${template.name}.pdf`);
      toast({
        title: "Download started",
        description: "Your edited PDF is being downloaded",
      });
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-600" />
            PDF Text Editor
          </CardTitle>
          <p className="text-sm text-gray-600">
            Search and replace text in your PDF document
          </p>
        </CardHeader>
      </Card>

      {/* Text Replace Section */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Replace className="w-4 h-4" />
            Find & Replace Text
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div>
            <Label htmlFor="search" className="text-sm font-medium mb-2 block">
              Find Text
            </Label>
            <Input
              id="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Enter text to find..."
              className="w-full"
            />
          </div>

          {/* Replace Input */}
          <div>
            <Label htmlFor="replace" className="text-sm font-medium mb-2 block">
              Replace With
            </Label>
            <Textarea
              id="replace"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Enter replacement text..."
              className="w-full min-h-[80px]"
              rows={3}
            />
          </div>

          {/* Replace Button */}
          <Button
            onClick={handleTextReplace}
            disabled={isProcessing || !searchText.trim()}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Replace className="w-4 h-4 mr-2" />
                Replace Text
              </>
            )}
          </Button>

          {/* Replacement History */}
          {replacements.length > 0 && (
            <div className="pt-4 border-t">
              <Label className="text-sm font-medium mb-2 block">
                Recent Replacements
              </Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {replacements.slice(-5).map((replacement, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs p-2 bg-gray-50 rounded">
                    <Search className="w-3 h-3 text-gray-400" />
                    <span className="truncate flex-1">"{replacement.search}"</span>
                    <span className="text-gray-400">→</span>
                    <span className="truncate flex-1">"{replacement.replace}"</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Download Section */}
      {(processedUrl || template.template_url) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download Edited PDF
            </Button>
            
            {processedUrl && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Changes applied successfully</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-xs text-gray-500 space-y-1">
            <p className="font-medium">Tips:</p>
            <p>• Text replacement is case-insensitive</p>
            <p>• Original formatting is preserved</p>
            <p>• Changes apply to all pages</p>
            <p>• Download updated PDF when ready</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
