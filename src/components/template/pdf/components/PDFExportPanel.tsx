
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Download, 
  FileText, 
  Settings,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { pdfOperationsService } from '@/services/pdfOperationsService';

interface ExportOptions {
  format: 'pdf' | 'png' | 'jpg';
  fileName: string;
  quality: number;
  compression: boolean;
}

interface PDFExportPanelProps {
  fileUrl?: string;
  modifications?: {
    textChanges?: any[];
    annotations?: any[];
    qrCodes?: any[];
    formData?: Record<string, any>;
  };
  onExportComplete?: (result: any) => void;
}

export const PDFExportPanel: React.FC<PDFExportPanelProps> = ({
  fileUrl,
  modifications = {},
  onExportComplete
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    fileName: 'edited-document',
    quality: 90,
    compression: true
  });
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);

  const handleExport = async () => {
    if (!fileUrl) {
      toast({
        title: "No file to export",
        description: "Please select a PDF file first",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    try {
      // First finalize the PDF with all modifications
      const finalizeResult = await pdfOperationsService.finalizePDF(fileUrl, modifications);
      
      if (finalizeResult.success && finalizeResult.url) {
        // Then export in the desired format
        const exportResult = await pdfOperationsService.exportPDF(
          finalizeResult.url, 
          exportOptions.format,
          {
            fileName: exportOptions.fileName,
            quality: exportOptions.quality,
            compression: exportOptions.compression
          }
        );

        if (exportResult.success && exportResult.downloadUrl) {
          setExportedUrl(exportResult.downloadUrl);
          toast({
            title: "PDF exported successfully",
            description: `Your ${exportOptions.format.toUpperCase()} is ready for download`,
          });
          onExportComplete?.(exportResult);
        } else {
          throw new Error(exportResult.error || 'Failed to export PDF');
        }
      } else {
        throw new Error(finalizeResult.error || 'Failed to finalize PDF');
      }
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = async () => {
    if (!exportedUrl) return;
    
    try {
      const fileName = `${exportOptions.fileName}.${exportOptions.format}`;
      await pdfOperationsService.downloadPDF(exportedUrl, fileName);
      
      toast({
        title: "Download started",
        description: `${fileName} is being downloaded`,
      });
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const hasModifications = Object.values(modifications).some(mod => 
    Array.isArray(mod) ? mod.length > 0 : Object.keys(mod || {}).length > 0
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export & Download
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Export Format */}
        <div>
          <Label className="text-xs text-gray-600 mb-2 block">Export Format</Label>
          <Select
            value={exportOptions.format}
            onValueChange={(value: any) => setExportOptions(prev => ({ ...prev, format: value }))}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document</SelectItem>
              <SelectItem value="png">PNG Image</SelectItem>
              <SelectItem value="jpg">JPG Image</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* File Name */}
        <div>
          <Label className="text-xs text-gray-600 mb-2 block">File Name</Label>
          <Input
            value={exportOptions.fileName}
            onChange={(e) => setExportOptions(prev => ({ ...prev, fileName: e.target.value }))}
            placeholder="Enter file name"
            className="h-8"
          />
        </div>

        {/* Quality (for images) */}
        {exportOptions.format !== 'pdf' && (
          <div>
            <Label className="text-xs text-gray-600 mb-2 block">
              Quality: {exportOptions.quality}%
            </Label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={exportOptions.quality}
              onChange={(e) => setExportOptions(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
        )}

        {/* Compression */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="compression"
            checked={exportOptions.compression}
            onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, compression: !!checked }))}
          />
          <Label htmlFor="compression" className="text-xs text-gray-600">
            Enable compression
          </Label>
        </div>

        {/* Modifications Summary */}
        {hasModifications && (
          <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-1 mb-1">
              <Settings className="w-3 h-3" />
              Applied Modifications
            </div>
            {modifications.textChanges && modifications.textChanges.length > 0 && (
              <div>• Text changes: {modifications.textChanges.length}</div>
            )}
            {modifications.annotations && modifications.annotations.length > 0 && (
              <div>• Annotations: {modifications.annotations.length}</div>
            )}
            {modifications.qrCodes && modifications.qrCodes.length > 0 && (
              <div>• QR codes: {modifications.qrCodes.length}</div>
            )}
            {modifications.formData && Object.keys(modifications.formData).length > 0 && (
              <div>• Form fields: {Object.keys(modifications.formData).length}</div>
            )}
          </div>
        )}

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={isExporting || !fileUrl}
          className="w-full"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Prepare Export
            </>
          )}
        </Button>

        {/* Download Button */}
        {exportedUrl && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              Export ready!
            </div>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download {exportOptions.format.toUpperCase()}
            </Button>
          </div>
        )}

        {/* Quick Export Options */}
        <div className="pt-2 border-t">
          <Label className="text-xs text-gray-600 mb-2 block">Quick Actions</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setExportOptions(prev => ({ ...prev, format: 'pdf' }));
                handleExport();
              }}
              className="text-xs"
            >
              Export PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setExportOptions(prev => ({ ...prev, format: 'png' }));
                handleExport();
              }}
              className="text-xs"
            >
              Export PNG
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
