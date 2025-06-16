
import { Template } from '@/types/template';

export const resolveTemplateImageUrl = (template: Template): string | null => {
  console.log('Template file info:', {
    hasFile: !!template.file,
    fileType: template.file?.type,
    fileSize: template.file?.size,
    hasPreview: !!template.preview,
    hasTemplateUrl: !!template.template_url,
    hasThumbnailUrl: !!template.thumbnail_url,
    previewLength: template.preview?.length || 0
  });

  // Priority order: preview (data URL) > template_url > thumbnail_url
  if (template.preview && template.preview.startsWith('data:')) {
    console.log('Using preview data URL for background');
    return template.preview;
  } else if (template.template_url && template.template_url.startsWith('data:')) {
    console.log('Using template_url data URL for background');
    return template.template_url;
  } else if (template.preview) {
    console.log('Using preview URL for background');
    return template.preview;
  } else if (template.template_url) {
    console.log('Using template_url for background');
    return template.template_url;
  } else if (template.thumbnail_url) {
    console.log('Using thumbnail_url for background');
    return template.thumbnail_url;
  }

  console.warn('No valid image source found');
  return null;
};
