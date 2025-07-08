
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image } from 'lucide-react';
import { Template } from '@/types/template';
import { PDFElement } from '../ClearQRPDFEditor';

interface PDFExportDialogProps {
  template: Template;
  elements: PDFElement[];
  onClose: () => void;
  onExport: (format: 'PDF' | 'PNG' | 'JPEG') => void;
}

export const PDFExportDialog: React.FC<PDFExportDialogProps> = ({
  template,
  elements,
  onClose,
  onExport
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export PDF
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose your export format for "{template.name}"
          </p>
          
          <div className="grid gap-3">
            <Button
              variant="outline"
              className="flex items-center justify-start gap-3 p-4 h-auto"
              onClick={() => onExport('PDF')}
            >
              <FileText className="w-8 h-8 text-red-500" />
              <div className="text-left">
                <div className="font-medium">PDF Document</div>
                <div className="text-sm text-gray-500">
                  Editable PDF with {elements.length} elements
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-start gap-3 p-4 h-auto"
              onClick={() => onExport('PNG')}
            >
              <Image className="w-8 h-8 text-blue-500" />
              <div className="text-left">
                <div className="font-medium">PNG Image</div>
                <div className="text-sm text-gray-500">
                  High-quality image format
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-start gap-3 p-4 h-auto"
              onClick={() => onExport('JPEG')}
            >
              <Image className="w-8 h-8 text-green-500" />
              <div className="text-left">
                <div className="font-medium">JPEG Image</div>
                <div className="text-sm text-gray-500">
                  Compressed image format
                </div>
              </div>
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
