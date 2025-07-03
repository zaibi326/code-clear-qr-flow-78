
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Download, 
  FileText, 
  Image as ImageIcon,
  Settings,
  Loader2
} from 'lucide-react';

interface ExportOptions {
  format: 'pdf' | 'png' | 'jpg';
  quality: number;
  resolution: 'low' | 'medium' | 'high' | 'print';
  pages: 'all' | 'current' | 'range';
  pageRange?: string;
}

interface CanvaStyleExportPanelProps {
  onExport: (options: ExportOptions) => Promise<void>;
  isExporting: boolean;
  currentPage: number;
  totalPages: number;
}

export const CanvaStyleExportPanel: React.FC<CanvaStyleExportPanelProps> = ({
  onExport,
  isExporting,
  currentPage,
  totalPages
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    quality: 85,
    resolution: 'high',
    pages: 'all'
  });

  const handleExport = async () => {
    await onExport(exportOptions);
  };

  const getResolutionDescription = (resolution: string) => {
    switch (resolution) {
      case 'low': return '72 DPI (Web)';
      case 'medium': return '150 DPI (Standard)';
      case 'high': return '300 DPI (High Quality)';
      case 'print': return '600 DPI (Print Ready)';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Options
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Format Selection */}
        <div>
          <Label className="text-xs text-gray-600 mb-2 block">Export Format</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={exportOptions.format === 'pdf' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setExportOptions(prev => ({ ...prev, format: 'pdf' }))}
              className="flex flex-col items-center gap-1 h-12"
            >
              <FileText className="w-4 h-4" />
              <span className="text-xs">PDF</span>
            </Button>
            <Button
              variant={exportOptions.format === 'png' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setExportOptions(prev => ({ ...prev, format: 'png' }))}
              className="flex flex-col items-center gap-1 h-12"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="text-xs">PNG</span>
            </Button>
            <Button
              variant={exportOptions.format === 'jpg' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setExportOptions(prev => ({ ...prev, format: 'jpg' }))}
              className="flex flex-col items-center gap-1 h-12"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="text-xs">JPG</span>
            </Button>
          </div>
        </div>

        {/* Resolution Selection */}
        <div>
          <Label className="text-xs text-gray-600 mb-2 block">Resolution</Label>
          <Select
            value={exportOptions.resolution}
            onValueChange={(value: any) => setExportOptions(prev => ({ ...prev, resolution: value }))}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">72 DPI (Web)</SelectItem>
              <SelectItem value="medium">150 DPI (Standard)</SelectItem>
              <SelectItem value="high">300 DPI (High Quality)</SelectItem>
              <SelectItem value="print">600 DPI (Print Ready)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quality Slider (for JPG/PNG) */}
        {exportOptions.format !== 'pdf' && (
          <div>
            <Label className="text-xs text-gray-600 mb-2 block">
              Quality: {exportOptions.quality}%
            </Label>
            <Slider
              value={[exportOptions.quality]}
              onValueChange={(value) => setExportOptions(prev => ({ ...prev, quality: value[0] }))}
              min={10}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        )}

        {/* Page Selection */}
        {totalPages > 1 && (
          <div>
            <Label className="text-xs text-gray-600 mb-2 block">Pages to Export</Label>
            <Select
              value={exportOptions.pages}
              onValueChange={(value: any) => setExportOptions(prev => ({ ...prev, pages: value }))}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pages ({totalPages})</SelectItem>
                <SelectItem value="current">Current Page ({currentPage + 1})</SelectItem>
                <SelectItem value="range">Page Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Page Range Input */}
        {exportOptions.pages === 'range' && (
          <div>
            <Label className="text-xs text-gray-600 mb-2 block">Page Range (e.g., 1-3, 5)</Label>
            <input
              type="text"
              value={exportOptions.pageRange || ''}
              onChange={(e) => setExportOptions(prev => ({ ...prev, pageRange: e.target.value }))}
              placeholder="1-3, 5"
              className="w-full h-8 px-2 border border-gray-300 rounded text-sm"
            />
          </div>
        )}

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export {exportOptions.format.toUpperCase()}
            </>
          )}
        </Button>

        {/* Export Info */}
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          <div className="flex items-center gap-1 mb-1">
            <Settings className="w-3 h-3" />
            Export Settings
          </div>
          <div>Format: {exportOptions.format.toUpperCase()}</div>
          <div>Resolution: {getResolutionDescription(exportOptions.resolution)}</div>
          {exportOptions.format !== 'pdf' && (
            <div>Quality: {exportOptions.quality}%</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
