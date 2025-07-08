
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, FileTextIcon } from 'lucide-react';
import { Template } from '@/types/template';
import { PDFElement } from '../ClearQRPDFEditor';

interface PDFExportDialogProps {
  template: Template;
  elements: PDFElement[];
  onClose: () => void;
  onExport: (format: 'pdf' | 'png' | 'jpg' | 'docx') => void;
}

export const PDFExportDialog: React.FC<PDFExportDialogProps> = ({
  template,
  elements,
  onClose,
  onExport
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'png' | 'jpg' | 'docx') => {
    setIsExporting(true);
    try {
      await onExport(format);
    } finally {
      setIsExporting(false);
    }
  };

  const editedElementsCount = elements.filter(el => el.isEdited).length;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export PDF</DialogTitle>
          <DialogDescription>
            Choose your preferred export format. {editedElementsCount > 0 && 
            `You have ${editedElementsCount} edited elements that will be included.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start h-12"
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
          >
            <FileText className="w-5 h-5 mr-3 text-red-600" />
            <div className="text-left">
              <div className="font-medium">PDF Document</div>
              <div className="text-xs text-gray-500">Preserve all edits and formatting</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-12"
            onClick={() => handleExport('png')}
            disabled={isExporting}
          >
            <Image className="w-5 h-5 mr-3 text-blue-600" />
            <div className="text-left">
              <div className="font-medium">PNG Images</div>
              <div className="text-xs text-gray-500">High quality images for each page</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-12"
            onClick={() => handleExport('jpg')}
            disabled={isExporting}
          >
            <Image className="w-5 h-5 mr-3 text-green-600" />
            <div className="text-left">
              <div className="font-medium">JPG Images</div>
              <div className="text-xs text-gray-500">Compressed images for web use</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-12"
            onClick={() => handleExport('docx')}
            disabled={isExporting}
          >
            <FileTextIcon className="w-5 h-5 mr-3 text-purple-600" />
            <div className="text-left">
              <div className="font-medium">Word Document</div>
              <div className="text-xs text-gray-500">Convert to editable Word format</div>
            </div>
          </Button>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
