import { Template } from '@/types/template';
import { toast } from '@/hooks/use-toast';

interface UseTemplateActionsProps {
  templates: Template[];
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  fileToDataUrl: (file: File) => Promise<string>;
}

export const useTemplateActions = ({ templates, setTemplates, fileToDataUrl }: UseTemplateActionsProps) => {
  const handleTemplateUpload = async (template: Template) => {
    console.log('Template uploaded:', template);
    
    try {
      let processedTemplate = { ...template };
      
      // If template has a file, convert it to data URL for preview and storage
      if (template.file) {
        console.log('Converting file to data URL for template:', template.name, {
          type: template.file.type,
          size: template.file.size
        });
        
        const dataUrl = await fileToDataUrl(template.file);
        console.log('Data URL created successfully, length:', dataUrl.length);
        
        // For PDF files, ensure we mark them properly and store complete data
        if (template.file.type === 'application/pdf') {
          processedTemplate.preview = dataUrl;
          processedTemplate.template_url = dataUrl; // Critical: store the full PDF data
          processedTemplate.thumbnail_url = dataUrl;
          processedTemplate.category = 'pdf';
          processedTemplate.type = 'application/pdf';
          processedTemplate.isPdf = true;
          
          console.log('PDF template processed with full data URL for editing capability');
        } else {
          // For non-PDF files, use existing logic
          processedTemplate.preview = dataUrl;
          processedTemplate.template_url = dataUrl;
          processedTemplate.thumbnail_url = dataUrl;
        }
        
        // Store file metadata
        processedTemplate.fileSize = template.file.size;
        processedTemplate.file_type = template.file.type;
        
        console.log('Template processed with complete data URL setup for editing');
      }
      
      setTemplates(prev => {
        const newTemplates = [...prev, processedTemplate];
        console.log('Added template to collection. Total templates:', newTemplates.length);
        console.log('New template data check:', {
          name: processedTemplate.name,
          hasPreview: !!processedTemplate.preview,
          hasTemplateUrl: !!processedTemplate.template_url,
          isPdf: processedTemplate.isPdf || processedTemplate.type === 'application/pdf',
          previewStart: processedTemplate.preview?.substring(0, 50) + '...'
        });
        return newTemplates;
      });
      
      toast({
        title: "Template uploaded successfully!",
        description: `${template.name} has been added to your library and is ready for editing.`,
      });
    } catch (error) {
      console.error('Error processing template upload:', error);
      toast({
        title: "Upload error",
        description: "There was an error processing your template file.",
        variant: "destructive"
      });
    }
  };

  const handleTemplateSelect = (template: Template) => {
    console.log('Template selected:', template);
    
    toast({
      title: "Template selected!",
      description: `You can now use ${template.name} for your QR campaigns.`,
    });
  };

  const handleTemplateDelete = (templateId: string) => {
    setTemplates(prev => prev.filter(template => template.id !== templateId));
    toast({
      title: "Template deleted",
      description: "Template has been removed from your library",
    });
  };

  const handleTemplateDuplicate = (templateId: string) => {
    const templateToDuplicate = templates.find(t => t.id === templateId);
    if (templateToDuplicate) {
      const duplicatedTemplate: Template = {
        ...templateToDuplicate,
        id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${templateToDuplicate.name} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setTemplates(prev => [...prev, duplicatedTemplate]);
      toast({
        title: "Template duplicated",
        description: `Created a copy of ${templateToDuplicate.name}`,
      });
    }
  };

  return {
    handleTemplateUpload,
    handleTemplateSelect,
    handleTemplateDelete,
    handleTemplateDuplicate
  };
};
