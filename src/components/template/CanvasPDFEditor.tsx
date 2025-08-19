import React, { useEffect, useState } from 'react';
import { Template } from '@/types/template';
import { PDFTextEditor } from './pdf/PDFTextEditor';
import { usePDFTextEditor } from '@/hooks/canvas/usePDFTextEditor';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CanvasPDFEditorProps {
  template?: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export const CanvasPDFEditor: React.FC<CanvasPDFEditorProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const [isTemplateReady, setIsTemplateReady] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);

  // Validate template has PDF data
  useEffect(() => {
    const validateTemplate = () => {
      if (!template) {
        setTemplateError('No template provided');
        return;
      }

      // Check if template has valid PDF data
      const hasValidPDFData = 
        (template.file && template.file instanceof File && template.file.type === 'application/pdf') ||
        (template.preview && template.preview.startsWith('data:application/pdf')) ||
        (template.template_url && (
          template.template_url.startsWith('data:application/pdf') ||
          template.template_url.startsWith('blob:') ||
          template.template_url.toLowerCase().includes('.pdf')
        ));

      if (!hasValidPDFData) {
        console.error('Template validation failed:', {
          hasFile: !!template.file,
          fileType: template.file?.type,
          hasPreview: !!template.preview,
          previewStart: template.preview?.substring(0, 30),
          hasTemplateUrl: !!template.template_url,
          templateUrlStart: template.template_url?.substring(0, 30)
        });
        setTemplateError('Template does not contain valid PDF data. Please re-upload the PDF file.');
        return;
      }

      console.log('Template validation successful:', {
        name: template.name,
        hasFile: !!template.file,
        hasPreview: !!template.preview,
        hasTemplateUrl: !!template.template_url
      });

      setTemplateError(null);
      setIsTemplateReady(true);
    };

    validateTemplate();
  }, [template]);

  const handleSave = () => {
    if (!template) return;

    console.log('Saving PDF template changes...');
    
    // Create updated template with current timestamp
    const updatedTemplate: Template = {
      ...template,
      updated_at: new Date().toISOString(),
      // Keep all existing PDF data intact
      preview: template.preview,
      template_url: template.template_url,
      file: template.file
    };
    
    onSave(updatedTemplate);
    
    toast({
      title: 'PDF Template Saved',
      description: 'Your PDF template edits have been saved successfully.',
    });
  };

  // Show error state if template validation fails
  if (templateError) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Template Error
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {templateError}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={onCancel} variant="outline">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while validating template
  if (!isTemplateReady) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing PDF for editing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <PDFTextEditor
        onSave={handleSave}
        onCancel={onCancel}
        template={template}
        hideFileUpload={true}
      />
    </div>
  );
};
