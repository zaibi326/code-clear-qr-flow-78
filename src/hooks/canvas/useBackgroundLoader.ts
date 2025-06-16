
import { useCallback } from 'react';
import { Canvas } from 'fabric';
import { Template } from '@/types/template';
import { resolveTemplateImageUrl } from './utils/templateUrlResolver';
import { loadBackgroundImage } from './utils/backgroundImageLoader';

export const useBackgroundLoader = () => {
  const loadBackgroundTemplate = useCallback(async (canvas: Canvas, template: Template): Promise<boolean> => {
    if (!canvas || canvas.disposed) {
      console.log('Canvas not available for background loading');
      return false;
    }

    console.log('Loading background template:', template.name);
    
    try {
      const imageUrl = resolveTemplateImageUrl(template);

      if (!imageUrl) {
        console.warn('No valid image source found, using white background');
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
        return true;
      }

      if (!canvas.disposed) {
        return await loadBackgroundImage(canvas, imageUrl);
      }
      
      return true;
    } catch (error) {
      console.error('Error loading background template:', error);
      // Set white background as fallback
      if (!canvas.disposed) {
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
      }
      return false;
    }
  }, []);

  return { loadBackgroundTemplate };
};
