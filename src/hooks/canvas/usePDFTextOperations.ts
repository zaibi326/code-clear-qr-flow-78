
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
      color: { r: 0, g: 0, b: 0 },
      pageNumber,
      isEdited: true
    };
    
    return { newId, newTextBlock };
  }, []);

  const exportPDFWithEdits = useCallback(async (
    originalPdfBytes: Uint8Array,
    editedTextBlocks: Map<string, PDFTextBlock>
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
        if (textBlock.originalText && textBlock.originalText !== textBlock.text) {
          page.drawRectangle({
            x: textBlock.x - 2,
            y: pdfLibY - 2,
            width: textBlock.width + 4,
            height: textBlock.height + 4,
            color: rgb(1, 1, 1),
          });
        }

        page.drawText(textBlock.text, {
          x: textBlock.x,
          y: pdfLibY,
          size: textBlock.fontSize,
          font: font,
          color: rgb(textBlock.color.r, textBlock.color.g, textBlock.color.b),
        });
      } catch (error) {
        console.warn('Failed to draw text block:', textBlock.id, error);
      }
    });

    return await newPdfDoc.save();
  }, []);

  return {
    addTextBlock,
    exportPDFWithEdits
  };
};
