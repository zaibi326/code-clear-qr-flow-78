
import React, { useEffect, useState } from 'react';
import { Template } from '@/types/template';
import { PDFTextEditor } from './pdf/PDFTextEditor';
import { usePDFTextEditor } from '@/hooks/canvas/usePDFTextEditor';

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
  const { loadPDF, pdfPages, isLoading } = usePDFTextEditor();
  const [isTemplateLoaded, setIsTemplateLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Auto-load the PDF when template is provided
  useEffect(() => {
    const loadTemplateFile = async () => {
      if (template && !isTemplateLoaded && !isLoading) {
        console.log('Loading template file:', template.name);
        
        try {
          setLoadingError(null);
          let fileToLoad: File | null = null;
          
          // If template has a file object, use it directly
          if (template.file && template.file instanceof File) {
            fileToLoad = template.file;
            console.log('Using template file object');
          }
          // If template has preview data, convert it to a file
          else if (template.preview && template.preview.startsWith('data:application/pdf')) {
            console.log('Converting preview data to file');
            const response = await fetch(template.preview);
            const blob = await response.blob();
            fileToLoad = new File([blob], template.name || 'document.pdf', { type: 'application/pdf' });
          }
          // If template has template_url, fetch it
          else if (template.template_url) {
            console.log('Fetching from template_url');
            const response = await fetch(template.template_url);
            const blob = await response.blob();
            fileToLoad = new File([blob], template.name || 'document.pdf', { type: 'application/pdf' });
          }
          
          if (fileToLoad) {
            console.log('Loading PDF file:', fileToLoad.name, fileToLoad.type);
            await loadPDF(fileToLoad);
            setIsTemplateLoaded(true);
            console.log('Template loaded successfully');
          } else {
            console.error('No valid file source found for template');
            setLoadingError('No valid PDF file found for this template');
          }
        } catch (error) {
          console.error('Error loading template file:', error);
          setLoadingError('Failed to load PDF template');
        }
      }
    };

    loadTemplateFile();
  }, [template, loadPDF, isTemplateLoaded, isLoading]);

  const handleSave = () => {
    // For now, we'll create a basic template structure
    // In a real implementation, you'd want to save the PDF edits
    const updatedTemplate: Template = {
      ...template,
      id: template?.id || Date.now().toString(),
      name: template?.name || 'Edited PDF',
      type: 'pdf',
      updatedAt: new Date()
    };
    
    onSave(updatedTemplate);
  };

  // Show loading error if there's one
  if (loadingError) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-500 text-lg mb-4">Error Loading PDF</div>
          <p className="text-gray-600 mb-4">{loadingError}</p>
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Go Back
          </button>
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
