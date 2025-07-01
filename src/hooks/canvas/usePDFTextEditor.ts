
import { useState, useCallback } from 'react';
import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
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
  const [pdfPages, setPdfPages] = useState<PDFPageData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [editedTextBlocks, setEditedTextBlocks] = useState<Map<string, PDFTextBlock>>(new Map());

  const loadPDF = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      // Load PDF with pdf-lib for editing
      const arrayBuffer = await file.arrayBuffer();
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

        // Extract text content with detailed positioning
        const textContent = await page.getTextContent();
        const textBlocks: PDFTextBlock[] = [];

        textContent.items.forEach((item: any, index) => {
          if (item.str && item.str.trim()) {
            const transform = item.transform;
            const x = transform[4];
            const y = viewport.height - transform[5];
            
            textBlocks.push({
              id: `page-${pageNum}-text-${index}`,
              text: item.str.trim(),
              x: x,
              y: y - (transform[0] || 12),
              width: item.width || (item.str.length * (transform[0] || 12) * 0.6),
              height: transform[0] || 12,
              fontSize: transform[0] || 12,
              fontName: item.fontName || 'Helvetica',
              color: { r: 0, g: 0, b: 0 },
              pageNumber: pageNum,
              isEdited: false
            });
          }
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
        description: `Loaded ${pages.length} page(s). Text blocks are now editable like Canva!`,
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
      const existing = newMap.get(blockId);
      newMap.set(blockId, { 
        ...existing, 
        ...updates, 
        id: blockId,
        isEdited: true 
      } as PDFTextBlock);
      return newMap;
    });
  }, []);

  const exportPDF = useCallback(async () => {
    if (!pdfDocument || !pdfPages.length) {
      toast({
        title: 'No PDF to export',
        description: 'Please load a PDF first.',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Create a copy of the PDF document
      const pdfBytes = await pdfDocument.save();
      const newPdfDoc = await PDFDocument.load(pdfBytes);

      // Apply text edits to each page
      editedTextBlocks.forEach((textBlock) => {
        const page = newPdfDoc.getPage(textBlock.pageNumber - 1);
        const { width, height } = page.getSize();
        
        // Convert coordinates (pdf.js uses different coordinate system than pdf-lib)
        const pdfLibY = height - textBlock.y - textBlock.height;
        
        try {
          page.drawText(textBlock.text, {
            x: textBlock.x,
            y: pdfLibY,
            size: textBlock.fontSize,
            color: rgb(textBlock.color.r, textBlock.color.g, textBlock.color.b),
          });
        } catch (error) {
          console.warn('Failed to draw text:', error);
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
  }, [pdfDocument, pdfPages, editedTextBlocks]);

  const addTextBlock = useCallback((pageNumber: number, x: number, y: number, text: string = 'New Text') => {
    const newId = `custom-text-${Date.now()}`;
    const newTextBlock: PDFTextBlock = {
      id: newId,
      text,
      x,
      y,
      width: text.length * 10,
      height: 16,
      fontSize: 16,
      fontName: 'Helvetica',
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
    exportPDF
  };
};
