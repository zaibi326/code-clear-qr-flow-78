
import { useState, useCallback } from 'react';
import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
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
  pdfPage: PDFPage;
}

export const usePDFTextEditor = () => {
  const [pdfDocument, setPdfDocument] = useState<PDFDocument | null>(null);
  const [originalPdfBytes, setOriginalPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfPages, setPdfPages] = useState<PDFPageData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [editedTextBlocks, setEditedTextBlocks] = useState<Map<string, PDFTextBlock>>(new Map());

  const loadPDF = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalBytes = new Uint8Array(arrayBuffer);
      setOriginalPdfBytes(originalBytes);

      // Load PDF with pdf-lib for editing
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPdfDocument(pdfDoc);

      // Load PDF with pdf.js for rendering and text extraction
      const pdfJsDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages: PDFPageData[] = [];

      for (let pageNum = 1; pageNum <= pdfJsDoc.numPages; pageNum++) {
        const page = await pdfJsDoc.getPage(pageNum);
        const pdfLibPage = pdfDoc.getPage(pageNum - 1);
        const viewport = page.getViewport({ scale: 2.0 });
        
        // Render page to canvas for background
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Extract text content with detailed positioning and styling
        const textContent = await page.getTextContent();
        const textBlocks: PDFTextBlock[] = [];

        // Group text items that are close together into single blocks
        const textItems = textContent.items.filter((item: any) => item.str && item.str.trim());
        
        textItems.forEach((item: any, index: number) => {
          const transform = item.transform;
          const x = transform[4];
          const y = viewport.height - transform[5];
          const fontSize = Math.abs(transform[0]) || 12;
          
          // Detect font weight and style from font name
          const fontName = item.fontName || 'Helvetica';
          const isBold = fontName.toLowerCase().includes('bold');
          const isItalic = fontName.toLowerCase().includes('italic') || fontName.toLowerCase().includes('oblique');
          
          textBlocks.push({
            id: `page-${pageNum}-text-${index}`,
            text: item.str.trim(),
            originalText: item.str.trim(),
            x: x,
            y: y - fontSize,
            width: item.width || (item.str.length * fontSize * 0.6),
            height: fontSize,
            fontSize: fontSize,
            fontName: 'Helvetica', // Standardize for editing
            fontWeight: isBold ? 'bold' : 'normal',
            fontStyle: isItalic ? 'italic' : 'normal',
            color: { r: 0, g: 0, b: 0 },
            pageNumber: pageNum,
            isEdited: false
          });
        });

        pages.push({
          pageNumber: pageNum,
          width: viewport.width,
          height: viewport.height,
          backgroundImage: canvas.toDataURL('image/png'),
          textBlocks,
          pdfPage: pdfLibPage
        });
      }

      setPdfPages(pages);
      setCurrentPage(0);
      
      toast({
        title: 'PDF Loaded Successfully',
        description: `Loaded ${pages.length} page(s). Click on any text to edit it directly like in Canva!`,
      });
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({
        title: 'Error loading PDF',
        description: 'Failed to load PDF file. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTextBlock = useCallback((blockId: string, updates: Partial<PDFTextBlock>) => {
    setEditedTextBlocks(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(blockId) || findOriginalTextBlock(blockId);
      
      if (existing) {
        newMap.set(blockId, { 
          ...existing, 
          ...updates, 
          id: blockId,
          isEdited: true 
        } as PDFTextBlock);
      }
      return newMap;
    });
  }, []);

  const findOriginalTextBlock = (blockId: string): PDFTextBlock | undefined => {
    for (const page of pdfPages) {
      const block = page.textBlocks.find(b => b.id === blockId);
      if (block) return block;
    }
    return undefined;
  };

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
    
    return newId;
  }, []);

  const deleteTextBlock = useCallback((blockId: string) => {
    setEditedTextBlocks(prev => {
      const newMap = new Map(prev);
      newMap.delete(blockId);
      return newMap;
    });
  }, []);

  const exportPDF = useCallback(async () => {
    if (!pdfDocument || !pdfPages.length || !originalPdfBytes) {
      toast({
        title: 'No PDF to export',
        description: 'Please load a PDF first.',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Create a new PDF document from original bytes to preserve all content
      const newPdfDoc = await PDFDocument.load(originalPdfBytes);
      const helveticaFont = await newPdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBoldFont = await newPdfDoc.embedFont(StandardFonts.HelveticaBold);
      const helveticaObliqueFont = await newPdfDoc.embedFont(StandardFonts.HelveticaOblique);

      // Apply text edits to each page
      editedTextBlocks.forEach((textBlock) => {
        const page = newPdfDoc.getPage(textBlock.pageNumber - 1);
        const { width, height } = page.getSize();
        
        // Convert coordinates (pdf.js uses different coordinate system than pdf-lib)
        const pdfLibY = height - textBlock.y - textBlock.height;
        
        // Select appropriate font based on style
        let font = helveticaFont;
        if (textBlock.fontWeight === 'bold' && textBlock.fontStyle === 'italic') {
          font = helveticaBoldFont; // Use bold as closest match
        } else if (textBlock.fontWeight === 'bold') {
          font = helveticaBoldFont;
        } else if (textBlock.fontStyle === 'italic') {
          font = helveticaObliqueFont;
        }

        try {
          // If this is an edited original text block, we need to "white out" the original first
          if (textBlock.originalText && textBlock.originalText !== textBlock.text) {
            // Draw a white rectangle over the original text
            page.drawRectangle({
              x: textBlock.x - 2,
              y: pdfLibY - 2,
              width: textBlock.width + 4,
              height: textBlock.height + 4,
              color: rgb(1, 1, 1), // White
            });
          }

          // Draw the new/edited text
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

      // Save and download the modified PDF
      const modifiedPdfBytes = await newPdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'edited-document.pdf';
      link.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: 'PDF Exported Successfully',
        description: 'Your edited PDF has been downloaded with all changes applied.',
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export PDF. Please try again.',
        variant: 'destructive'
      });
    }
  }, [pdfDocument, pdfPages, editedTextBlocks, originalPdfBytes]);

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
