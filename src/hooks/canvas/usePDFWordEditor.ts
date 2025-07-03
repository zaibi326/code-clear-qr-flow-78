
import { useState, useCallback, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { toast } from '@/hooks/use-toast';
import { usePDFWordLoader } from './usePDFWordLoader';
import { usePDFTextOperations } from './usePDFTextOperations';

interface PDFWord {
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
  spaceAfter?: boolean;
}

interface PDFPageData {
  pageNumber: number;
  width: number;
  height: number;
  backgroundImage: string;
  words: PDFWord[];
}

export const usePDFWordEditor = () => {
  const [pdfDocument, setPdfDocument] = useState<PDFDocument | null>(null);
  const [originalPdfBytes, setOriginalPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfPages, setPdfPages] = useState<PDFPageData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [editedWords, setEditedWords] = useState<Map<string, PDFWord>>(new Map());
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const isLoadingRef = useRef(false);

  const { loadPDF: loadPDFFile, isLoading } = usePDFWordLoader();
  const { exportPDFWithEdits } = usePDFTextOperations();

  const loadPDF = useCallback(async (file: File) => {
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
      setEditedWords(new Map());
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

  const updateWord = useCallback((wordId: string, updates: Partial<PDFWord>) => {
    setEditedWords(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(wordId) || findOriginalWord(wordId);
      
      if (existing) {
        const originalText = existing.originalText || existing.text;
        
        newMap.set(wordId, { 
          ...existing, 
          ...updates, 
          id: wordId,
          isEdited: true,
          originalText: originalText
        } as PDFWord);
      }
      return newMap;
    });
  }, []);

  const findOriginalWord = (wordId: string): PDFWord | undefined => {
    for (const page of pdfPages) {
      const word = page.words.find(w => w.id === wordId);
      if (word) return word;
    }
    return undefined;
  };

  const deleteWord = useCallback((wordId: string) => {
    const originalWord = findOriginalWord(wordId);
    
    if (originalWord) {
      setEditedWords(prev => {
        const newMap = new Map(prev);
        newMap.set(wordId, {
          ...originalWord,
          text: '',
          isEdited: true,
          originalText: originalWord.text
        });
        return newMap;
      });
    } else {
      setEditedWords(prev => {
        const newMap = new Map(prev);
        newMap.delete(wordId);
        return newMap;
      });
    }
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
      // Convert words to text blocks format for export
      const blocksToExport = new Map();
      editedWords.forEach((word, id) => {
        if (word.text.trim() !== '') {
          blocksToExport.set(id, {
            ...word,
            width: word.text.length * word.fontSize * 0.6,
            height: word.fontSize
          });
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
        description: 'Your edited PDF has been downloaded with all word-level changes applied.',
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export PDF. Please try again.',
        variant: 'destructive'
      });
    }
  }, [pdfDocument, pdfPages, editedWords, originalPdfBytes, exportPDFWithEdits, currentFileName]);

  return {
    pdfDocument,
    pdfPages,
    currentPage,
    setCurrentPage,
    isLoading,
    editedWords,
    loadPDF,
    updateWord,
    deleteWord,
    exportPDF
  };
};
