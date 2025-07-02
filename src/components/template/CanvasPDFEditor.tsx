
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
  const { loadPDF } = usePDFTextEditor();
  const [isTemplateLoaded, setIsTemplateLoaded] = useState(false);

  // Auto-load the PDF when template is provided
  useEffect(() => {
    const loadTemplateFile = async () => {
      if (template && !isTemplateLoaded) {
        console.log('Loading template file:', template.name);
        
        try {
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
          } else {
            console.error('No valid file source found for template');
          }
        } catch (error) {
          console.error('Error loading template file:', error);
        }
      }
    };

    loadTemplateFile();
  }, [template, loadPDF, isTemplateLoaded]);

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
