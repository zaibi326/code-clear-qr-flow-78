
import { useCallback } from 'react';
import { PDFDocument, PDFPage, rgb, StandardFonts, degrees } from 'pdf-lib';

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
  transform?: number[];
  dir?: string;
  baseline?: number;
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
      isEdited: true,
      baseline: 0
    };
    
    return { newId, newTextBlock };
  }, []);

  const exportPDFWithEdits = useCallback(async (
    originalPdfBytes: Uint8Array,
    editedTextBlocks: Map<string, PDFTextBlock>
  ) => {
    try {
      console.log('Starting PDF export with enhanced text handling...');
      
      const pdfDoc = await PDFDocument.load(originalPdfBytes);
      const pages = pdfDoc.getPages();
      
      // Load fonts for better text rendering
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
      const boldItalicFont = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);
      
      // Group edits by page for efficient processing
      const editsByPage = new Map<number, PDFTextBlock[]>();
      
      editedTextBlocks.forEach((block) => {
        const pageNum = block.pageNumber;
        if (!editsByPage.has(pageNum)) {
          editsByPage.set(pageNum, []);
        }
        editsByPage.get(pageNum)!.push(block);
      });
      
      // Process each page with edits
      for (const [pageNum, pageEdits] of editsByPage) {
        const page = pages[pageNum - 1];
        if (!page) continue;
        
        const { width: pageWidth, height: pageHeight } = page.getSize();
        
        // Create precise white overlays to completely hide original text
        pageEdits.forEach((edit) => {
          if (edit.originalText && edit.originalText !== edit.text) {
            // Calculate overlay dimensions with padding to ensure complete coverage
            const overlayX = Math.max(0, edit.x - 2);
            const overlayY = Math.max(0, pageHeight - edit.y - edit.height - 2);
            const overlayWidth = Math.min(pageWidth - overlayX, edit.width + 8);
            const overlayHeight = Math.min(pageHeight - overlayY, edit.height + 6);
            
            // Draw white rectangle with slight padding to completely hide original text
            page.drawRectangle({
              x: overlayX,
              y: overlayY,
              width: overlayWidth,
              height: overlayHeight,
              color: rgb(1, 1, 1),
              opacity: 1
            });
          }
        });
        
        // Add new/edited text with enhanced positioning and multi-line support
        pageEdits.forEach((edit) => {
          if (edit.text.trim()) {
            // Select appropriate font based on styling
            let font = regularFont;
            if (edit.fontWeight === 'bold' && edit.fontStyle === 'italic') {
              font = boldItalicFont;
            } else if (edit.fontWeight === 'bold') {
              font = boldFont;
            } else if (edit.fontStyle === 'italic') {
              font = italicFont;
            }
            
            // Handle multi-line text
            const lines = edit.text.split('\n');
            const lineHeight = edit.fontSize * 1.2;
            
            lines.forEach((line, lineIndex) => {
              if (line.trim()) {
                // Calculate precise text position for each line
                const textX = edit.x;
                const textY = pageHeight - edit.y - (edit.fontSize * 0.8) - (lineIndex * lineHeight);
                
                // Base text options
                const textOptions: any = {
                  x: textX,
                  y: textY,
                  size: edit.fontSize,
                  font: font,
                  color: rgb(edit.color.r, edit.color.g, edit.color.b),
                  opacity: edit.opacity || 1
                };
                
                // Add rotation if specified
                if (edit.rotation) {
                  textOptions.rotate = degrees(edit.rotation);
                }
                
                // Handle text alignment
                if (edit.textAlign === 'center') {
                  const textWidth = font.widthOfTextAtSize(line, edit.fontSize);
                  textOptions.x = textX - (textWidth / 2);
                } else if (edit.textAlign === 'right') {
                  const textWidth = font.widthOfTextAtSize(line, edit.fontSize);
                  textOptions.x = textX - textWidth;
                }
                
                // Draw the text line
                page.drawText(line, textOptions);
                
                // Add underline if specified
                if (edit.textDecoration === 'underline') {
                  const textWidth = font.widthOfTextAtSize(line, edit.fontSize);
                  page.drawLine({
                    start: { x: textOptions.x, y: textY - 2 },
                    end: { x: textOptions.x + textWidth, y: textY - 2 },
                    thickness: 1,
                    color: rgb(edit.color.r, edit.color.g, edit.color.b),
                    opacity: edit.opacity || 1
                  });
                }
              }
            });
          }
        });
      }
      
      // Serialize the modified PDF with optimized settings
      const modifiedPdfBytes = await pdfDoc.save({
        useObjectStreams: false,
        addDefaultPage: false,
        updateFieldAppearances: false
      });
      
      console.log('PDF export completed successfully with enhanced text handling');
      return modifiedPdfBytes;
      
    } catch (error) {
      console.error('Error exporting PDF with enhanced text handling:', error);
      throw new Error('Failed to export PDF with enhanced text modifications');
    }
  }, []);

  return {
    addTextBlock,
    exportPDFWithEdits
  };
};
