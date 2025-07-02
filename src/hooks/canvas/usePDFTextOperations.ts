
import { useCallback } from 'react';
import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';

interface PDFTextBlock {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
  color: { r: number; g: number; b: number };
  pageNumber: number;
  isEdited: boolean;
  originalText?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  rotation?: number;
  opacity?: number;
  shadow?: boolean;
  borderColor?: { r: number; g: number; b: number };
  borderWidth?: number;
}

export const usePDFTextOperations = () => {
  const addTextBlock = useCallback((pageNumber: number, x: number, y: number, text: string = 'New Text') => {
    const newId = `custom-text-${Date.now()}`;
    const newTextBlock: PDFTextBlock = {
      id: newId,
      text,
      x,
      y,
      width: text.length * 12,
      height: 16,
      fontSize: 16,
      fontName: 'Helvetica',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
      rotation: 0,
      opacity: 1,
      shadow: false,
      borderWidth: 0,
      color: { r: 0, g: 0, b: 0 },
      pageNumber,
      isEdited: true
    };
    
    return { newId, newTextBlock };
  }, []);

  const duplicateTextBlock = useCallback((textBlock: PDFTextBlock) => {
    const newId = `custom-text-${Date.now()}`;
    const duplicatedBlock: PDFTextBlock = {
      ...textBlock,
      id: newId,
      x: textBlock.x + 20,
      y: textBlock.y + 20,
      isEdited: true
    };
    
    return { newId, newTextBlock: duplicatedBlock };
  }, []);

  const exportPDFWithEdits = useCallback(async (
    originalPdfBytes: Uint8Array,
    editedTextBlocks: Map<string, PDFTextBlock>,
    shapes?: Map<string, any>
  ) => {
    const newPdfDoc = await PDFDocument.load(originalPdfBytes);
    const helveticaFont = await newPdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await newPdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaObliqueFont = await newPdfDoc.embedFont(StandardFonts.HelveticaOblique);

    editedTextBlocks.forEach((textBlock) => {
      const page = newPdfDoc.getPage(textBlock.pageNumber - 1);
      const { width, height } = page.getSize();
      
      const pdfLibY = height - textBlock.y - textBlock.height;
      
      let font = helveticaFont;
      if (textBlock.fontWeight === 'bold' && textBlock.fontStyle === 'italic') {
        font = helveticaBoldFont;
      } else if (textBlock.fontWeight === 'bold') {
        font = helveticaBoldFont;
      } else if (textBlock.fontStyle === 'italic') {
        font = helveticaObliqueFont;
      }

      try {
        // Clear original text if it's an edit
        if (textBlock.originalText && textBlock.originalText !== textBlock.text) {
          page.drawRectangle({
            x: textBlock.x - 2,
            y: pdfLibY - 2,
            width: textBlock.width + 4,
            height: textBlock.height + 4,
            color: rgb(1, 1, 1),
          });
        }

        // Draw border if specified
        if (textBlock.borderColor && textBlock.borderWidth && textBlock.borderWidth > 0) {
          page.drawRectangle({
            x: textBlock.x - 2,
            y: pdfLibY - 2,
            width: textBlock.width + 4,
            height: textBlock.height + 4,
            borderColor: rgb(textBlock.borderColor.r, textBlock.borderColor.g, textBlock.borderColor.b),
            borderWidth: textBlock.borderWidth,
          });
        }

        // Draw text
        page.drawText(textBlock.text, {
          x: textBlock.x,
          y: pdfLibY,
          size: textBlock.fontSize,
          font: font,
          color: rgb(textBlock.color.r, textBlock.color.g, textBlock.color.b),
          opacity: textBlock.opacity || 1,
          rotate: textBlock.rotation ? { angle: textBlock.rotation * (Math.PI / 180) } : undefined,
        });

        // Draw underline if specified
        if (textBlock.textDecoration === 'underline') {
          page.drawLine({
            start: { x: textBlock.x, y: pdfLibY - 2 },
            end: { x: textBlock.x + textBlock.width, y: pdfLibY - 2 },
            thickness: 1,
            color: rgb(textBlock.color.r, textBlock.color.g, textBlock.color.b),
            opacity: textBlock.opacity || 1,
          });
        }
      } catch (error) {
        console.warn('Failed to draw text block:', textBlock.id, error);
      }
    });

    // Render shapes if provided
    if (shapes) {
      shapes.forEach((shape) => {
        const page = newPdfDoc.getPage(shape.pageNumber - 1);
        const { height } = page.getSize();
        const pdfY = height - shape.y - shape.height;
        
        try {
          switch (shape.type) {
            case 'rectangle':
              page.drawRectangle({
                x: shape.x,
                y: pdfY,
                width: shape.width,
                height: shape.height,
                color: rgb(shape.fillColor.r, shape.fillColor.g, shape.fillColor.b),
                borderColor: rgb(shape.strokeColor.r, shape.strokeColor.g, shape.strokeColor.b),
                borderWidth: shape.strokeWidth,
                opacity: shape.opacity
              });
              break;
            case 'circle':
              const radius = Math.min(shape.width, shape.height) / 2;
              page.drawCircle({
                x: shape.x + shape.width / 2,
                y: pdfY + shape.height / 2,
                size: radius,
                color: rgb(shape.fillColor.r, shape.fillColor.g, shape.fillColor.b),
                borderColor: rgb(shape.strokeColor.r, shape.strokeColor.g, shape.strokeColor.b),
                borderWidth: shape.strokeWidth,
                opacity: shape.opacity
              });
              break;
          }
        } catch (error) {
          console.warn('Failed to draw shape:', shape.id, error);
        }
      });
    }

    return await newPdfDoc.save();
  }, []);

  return {
    addTextBlock,
    duplicateTextBlock,
    exportPDFWithEdits
  };
};
