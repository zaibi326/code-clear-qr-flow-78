import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  Image, 
  FileImage, 
  FileSpreadsheet,
  Settings,
  CheckCircle
} from 'lucide-react';

interface CanvaExportPanelProps {
  onExport: (format: 'pdf' | 'png' | 'jpg' | 'docx') => Promise<void>;
  onClose: () => void;
  documentInfo: any;
}

export const CanvaExportPanel: React.FC<CanvaExportPanelProps> = ({
  onExport,
  onClose,
  documentInfo
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'png' | 'jpg' | 'docx'>('pdf');
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const exportFormats = [
    {
      id: 'pdf' as const,
      name: 'PDF Document',
      description: 'Export as editable PDF with all modifications',
      icon: FileText,
      extension: '.pdf',
      recommended: true
    },
    {
      id: 'png' as const,
      name: 'PNG Images',
      description: 'Export each page as high-quality PNG image',
      icon: Image,
      extension: '.png',
      recommended: false
    },
    {
      id: 'jpg' as const,
      name: 'JPEG Images',
      description: 'Export each page as compressed JPEG image',
      icon: FileImage,
      extension: '.jpg',
      recommended: false
    },
    {
      id: 'docx' as const,
      name: 'Word Document',
      description: 'Convert to Microsoft Word format (experimental)',
      icon: FileSpreadsheet,
      extension: '.docx',
      recommended: false
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    
    try {
      await onExport(selectedFormat);
      setExportSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const selectedFormatInfo = exportFormats.find(f => f.id === selectedFormat);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Info */}
          {documentInfo && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Document Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Pages:</span>
                    <span className="ml-2 font-medium">{documentInfo.numPages}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Title:</span>
                    <span className="ml-2 font-medium truncate">
                      {documentInfo.title || 'Untitled'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Author:</span>
                    <span className="ml-2 font-medium truncate">
                      {documentInfo.author || 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Modified:</span>
                    <span className="ml-2 font-medium">
                      {documentInfo.modificationDate 
                        ? new Date(documentInfo.modificationDate).toLocaleDateString()
                        : 'Now'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Format Selection */}
          <div>
            <Label className="text-sm font-medium">Export Format</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {exportFormats.map((format) => {
                const Icon = format.icon;
                const isSelected = selectedFormat === format.id;
                
                return (
                  <Card
                    key={format.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'ring-2 ring-blue-500 bg-blue-50/50' 
                        : 'hover:ring-1 hover:ring-gray-300'
                    }`}
                    onClick={() => setSelectedFormat(format.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{format.name}</h4>
                            {format.recommended && (
                              <Badge variant="secondary" className="text-xs">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {format.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Output: *{format.extension}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Quality Settings */}
          {(selectedFormat === 'png' || selectedFormat === 'jpg') && (
            <div>
              <Label className="text-sm font-medium">Image Quality</Label>
              <Select value={quality} onValueChange={(value: any) => setQuality(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Quality (300 DPI)</SelectItem>
                  <SelectItem value="medium">Medium Quality (150 DPI)</SelectItem>
                  <SelectItem value="low">Low Quality (72 DPI)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          {/* Export Actions */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {selectedFormatInfo && (
                <span>Export as {selectedFormatInfo.name}</span>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} disabled={isExporting}>
                Cancel
              </Button>
              <Button 
                onClick={handleExport} 
                disabled={isExporting}
                className="min-w-24"
              >
                {isExporting ? (
                  <>
                    <Settings className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : exportSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Success!
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Export Notes */}
          <Card className="bg-blue-50/50 border-blue-200">
            <CardContent className="pt-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Export Notes:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• All modifications and annotations will be included</li>
                <li>• Large documents may take a few moments to process</li>
                <li>• Original document formatting will be preserved</li>
                {selectedFormat === 'docx' && (
                  <li>• DOCX conversion is experimental and may not preserve all formatting</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};