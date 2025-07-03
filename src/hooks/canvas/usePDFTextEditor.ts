
import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { toast } from '@/hooks/use-toast';

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

interface PDFPageData {
  pageNumber: number;
  width: number;
  height: number;
  backgroundImage: string;
  textBlocks: PDFTextBlock[];
}

export const usePDFTextEditor = () => {
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [originalPdfBytes, setOriginalPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfPages, setPdfPages] = useState<PDFPageData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [editedTextBlocks, setEditedTextBlocks] = useState<Map<string, PDFTextBlock>>(new Map());

  const extractTextBlocks = useCallback(async (page: any, pageNumber: number, viewport: any): Promise<PDFTextBlock[]> => {
    const textContent = await page.getTextContent();
    const textBlocks: PDFTextBlock[] = [];

    textContent.items.forEach((item: any, index: number) => {
      if ('str' in item && item.str && item.str.trim()) {
        const transform = item.transform;
        if (!transform || transform.length < 6) return;

        const [scaleX, skewY, skewX, scaleY, translateX, translateY] = transform;
        const fontSize = Math.abs(scaleY);
        
        // Convert PDF coordinates to screen coordinates
        const x = translateX;
        const y = viewport.height - translateY;
        
        // Calculate text dimensions
        const textWidth = item.width || item.str.length * fontSize * 0.6;
        const textHeight = fontSize;
        
        // Detect font properties
        const fontName = item.fontName || 'Helvetica';
        const isBold = fontName.toLowerCase().includes('bold') || Math.abs(scaleX) > fontSize * 1.2;
        const isItalic = fontName.toLowerCase().includes('italic') || Math.abs(skewX) > 0.1;
        
        // Extract color (default to black if not available)
        let textColor = { r: 0, g: 0, b: 0 };
        if (item.color && Array.isArray(item.color)) {
          textColor = {
            r: item.color[0] || 0,
            g: item.color[1] || 0,
            b: item.color[2] || 0
          };
        }

        textBlocks.push({
          id: `page-${pageNumber}-text-${index}`,
          text: item.str,
          originalText: item.str,
          x: x,
          y: y,
          width: textWidth,
          height: textHeight,
          fontSize: fontSize,
          fontName: fontName,
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
          color: textColor,
          pageNumber: pageNumber,
          isEdited: false
        });
      }
    });

    // Sort text blocks by reading order (top to bottom, left to right)
    textBlocks.sort((a, b) => {
      const yDiff = a.y - b.y;
      if (Math.abs(yDiff) < Math.max(a.fontSize, b.fontSize) * 0.5) {
        return a.x - b.x; // Same line, sort by x
      }
      return yDiff; // Different lines, sort by y
    });

    return textBlocks;
  }, []);

  const loadPDF = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      setOriginalPdfBytes(uint8Array);

      // Load PDF with PDF.js
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      setPdfDocument(pdfDoc);

      const pages: PDFPageData[] = [];
      const scale = 1.5; // High quality rendering

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        
        // Render page to canvas for background
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Extract text blocks
        const textBlocks = await extractTextBlocks(page, pageNum, viewport);

        pages.push({
          pageNumber: pageNum,
          width: viewport.width,
          height: viewport.height,
          backgroundImage: canvas.toDataURL('image/png', 0.95),
          textBlocks: textBlocks
        });
      }

      setPdfPages(pages);
      setCurrentPage(0);
      setEditedTextBlocks(new Map());

      toast({
        title: 'PDF Loaded Successfully',
        description: `Loaded ${pages.length} pages with ${pages.reduce((sum, p) => sum + p.textBlocks.length, 0)} editable text elements.`,
      });

    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({
        title: 'Error Loading PDF',
        description: 'Failed to load PDF file. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [extractTextBlocks]);

  const updateTextBlock = useCallback((blockId: string, updates: Partial<PDFTextBlock>) => {
    setEditedTextBlocks(prev => {
      const newMap = new Map(prev);
      const existingBlock = newMap.get(blockId);
      
      if (existingBlock) {
        newMap.set(blockId, { ...existingBlock, ...updates, isEdited: true });
      } else {
        // Find original block to get base data
        const originalBlock = pdfPages
          .flatMap(page => page.textBlocks)
          .find(block => block.id === blockId);
        
        if (originalBlock) {
          newMap.set(blockId, { ...originalBlock, ...updates, isEdited: true });
        }
      }
      
      return newMap;
    });
  }, [pdfPages]);

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
    
    setEditedTextBlocks(prev => {
      const newMap = new Map(prev);
      newMap.set(newId, newTextBlock);
      return newMap;
    });
  }, []);

  const deleteTextBlock = useCallback((blockId: string) => {
    setEditedTextBlocks(prev => {
      const newMap = new Map(prev);
      newMap.delete(blockId);
      return newMap;
    });
  }, []);

  const exportPDF = useCallback(async () => {
    if (!originalPdfBytes || editedTextBlocks.size === 0) {
      toast({
        title: 'No Changes to Export',
        description: 'Make some text edits before exporting.',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Load original PDF with pdf-lib
      const pdfDoc = await PDFDocument.load(originalPdfBytes);
      const pages = pdfDoc.getPages();
      
      // Load fonts
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
      const boldItalicFont = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);
      
      // Group edits by page
      const editsByPage = new Map<number, PDFTextBlock[]>();
      editedTextBlocks.forEach((block) => {
        const pageNum = block.pageNumber;
        if (!editsByPage.has(pageNum)) {
          editsByPage.set(pageNum, []);
        }
        editsByPage.get(pageNum)!.push(block);
      });
      
      // Apply edits to each page
      for (const [pageNum, pageEdits] of editsByPage) {
        const page = pages[pageNum - 1];
        if (!page) continue;
        
        const { height: pageHeight } = page.getSize();
        
        pageEdits.forEach((edit) => {
          if (edit.originalText && edit.originalText !== edit.text) {
            // Cover original text with white rectangle
            page.drawRectangle({
              x: edit.x - 1,
              y: pageHeight - edit.y - edit.height - 1,
              width: edit.width + 2,
              height: edit.height + 2,
              color: rgb(1, 1, 1),
              opacity: 1
            });
          }
          
          if (edit.text.trim()) {
            // Select appropriate font
            let font = regularFont;
            if (edit.fontWeight === 'bold' && edit.fontStyle === 'italic') {
              font = boldItalicFont;
            } else if (edit.fontWeight === 'bold') {
              font = boldFont;
            } else if (edit.fontStyle === 'italic') {
              font = italicFont;
            }
            
            // Draw new text
            page.drawText(edit.text, {
              x: edit.x,
              y: pageHeight - edit.y - edit.fontSize * 0.8,
              size: edit.fontSize,
              font: font,
              color: rgb(edit.color.r, edit.color.g, edit.color.b)
            });
          }
        });
      }
      
      // Save and download
      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'edited-document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'PDF Exported Successfully',
        description: 'Your edited PDF has been downloaded.',
      });
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export PDF. Please try again.',
        variant: 'destructive'
      });
    }
  }, [originalPdfBytes, editedTextBlocks]);

  return {
    pdfDocument,
    pdfPages,
    currentPage,
    setCurrentPage,
    isLoading,
    editedTextBlocks,
    loadPDF,
    updateTextBlock,
    addTextBlock,
    deleteTextBlock,
    exportPDF
  };
};
