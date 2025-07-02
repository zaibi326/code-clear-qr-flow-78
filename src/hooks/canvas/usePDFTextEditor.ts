
import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { toast } from '@/hooks/use-toast';
import { usePDFLoader } from './usePDFLoader';
import { usePDFTextOperations } from './usePDFTextOperations';

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
  const [pdfDocument, setPdfDocument] = useState<PDFDocument | null>(null);
  const [originalPdfBytes, setOriginalPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfPages, setPdfPages] = useState<PDFPageData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [editedTextBlocks, setEditedTextBlocks] = useState<Map<string, PDFTextBlock>>(new Map());

  const { loadPDF: loadPDFFile, isLoading } = usePDFLoader();
  const { addTextBlock: createTextBlock, exportPDFWithEdits } = usePDFTextOperations();

  const loadPDF = useCallback(async (file: File) => {
    try {
      const { pages, originalBytes } = await loadPDFFile(file);
      
      // Load PDF with pdf-lib for editing
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPdfDocument(pdfDoc);
      setOriginalPdfBytes(originalBytes);
      setPdfPages(pages);
      setCurrentPage(0);
    } catch (error) {
      console.error('Error in loadPDF:', error);
    }
  }, [loadPDFFile]);

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
    const { newId, newTextBlock } = createTextBlock(pageNumber, x, y, text);
    
    setEditedTextBlocks(prev => {
      const newMap = new Map(prev);
      newMap.set(newId, newTextBlock);
      return newMap;
    });
    
    return newId;
  }, [createTextBlock]);

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
      const modifiedPdfBytes = await exportPDFWithEdits(originalPdfBytes, editedTextBlocks);
      
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
  }, [pdfDocument, pdfPages, editedTextBlocks, originalPdfBytes, exportPDFWithEdits]);

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
