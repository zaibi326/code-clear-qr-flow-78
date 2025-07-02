
import { useState, useCallback, useRef } from 'react';
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
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const isLoadingRef = useRef(false);

  const { loadPDF: loadPDFFile, isLoading } = usePDFLoader();
  const { addTextBlock: createTextBlock, exportPDFWithEdits } = usePDFTextOperations();

  const loadPDF = useCallback(async (file: File) => {
    // Prevent duplicate loading
    if (isLoadingRef.current || currentFileName === file.name) {
      console.log('PDF already loading or same file, skipping...');
      return;
    }

    isLoadingRef.current = true;
    
    try {
      console.log('Loading PDF:', file.name);
      
      // Clear previous state
      setPdfDocument(null);
      setOriginalPdfBytes(null);
      setPdfPages([]);
      setEditedTextBlocks(new Map());
      setCurrentPage(0);
      
      const { pages, originalBytes } = await loadPDFFile(file);
      
      // Load PDF with pdf-lib for editing
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      setPdfDocument(pdfDoc);
      setOriginalPdfBytes(originalBytes);
      setPdfPages(pages);
      setCurrentPage(0);
      setCurrentFileName(file.name);
      
      console.log('PDF loaded successfully:', file.name, 'Pages:', pages.length);
    } catch (error) {
      console.error('Error in loadPDF:', error);
      toast({
        title: 'Error loading PDF',
        description: 'Failed to load the PDF file. Please try again.',
        variant: 'destructive'
      });
    } finally {
      isLoadingRef.current = false;
    }
  }, [loadPDFFile, currentFileName]);

  const updateTextBlock = useCallback((blockId: string, updates: Partial<PDFTextBlock>) => {
    setEditedTextBlocks(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(blockId) || findOriginalTextBlock(blockId);
      
      if (existing) {
        // Mark as edited and preserve original text if this is the first edit
        const originalText = existing.originalText || existing.text;
        
        newMap.set(blockId, { 
          ...existing, 
          ...updates, 
          id: blockId,
          isEdited: true,
          originalText: originalText
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
    // Check if it's an original text block that should be hidden instead of deleted
    const originalBlock = findOriginalTextBlock(blockId);
    
    if (originalBlock) {
      // For original blocks, mark them as deleted by setting text to empty
      // This will hide them from the unified view
      setEditedTextBlocks(prev => {
        const newMap = new Map(prev);
        newMap.set(blockId, {
          ...originalBlock,
          text: '',
          isEdited: true,
          originalText: originalBlock.text
        });
        return newMap;
      });
    } else {
      // For custom added blocks, actually remove them
      setEditedTextBlocks(prev => {
        const newMap = new Map(prev);
        newMap.delete(blockId);
        return newMap;
      });
    }
  }, []);

  const duplicateTextBlock = useCallback((blockId: string) => {
    const textBlock = editedTextBlocks.get(blockId) || findOriginalTextBlock(blockId);
    if (textBlock) {
      const newId = `custom-text-${Date.now()}`;
      const duplicatedBlock: PDFTextBlock = {
        ...textBlock,
        id: newId,
        x: textBlock.x + 20,
        y: textBlock.y + 20,
        isEdited: true
      };

      setEditedTextBlocks(prev => {
        const newMap = new Map(prev);
        newMap.set(newId, duplicatedBlock);
        return newMap;
      });

      return newId;
    }
  }, [editedTextBlocks, findOriginalTextBlock]);

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
      // Only export blocks that have actual content (not deleted ones)
      const blocksToExport = new Map();
      editedTextBlocks.forEach((block, id) => {
        if (block.text.trim() !== '') {
          blocksToExport.set(id, block);
        }
      });

      const modifiedPdfBytes = await exportPDFWithEdits(originalPdfBytes, blocksToExport);
      
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `edited-${currentFileName || 'document.pdf'}`;
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
  }, [pdfDocument, pdfPages, editedTextBlocks, originalPdfBytes, exportPDFWithEdits, currentFileName]);

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
    duplicateTextBlock,
    exportPDF
  };
};
