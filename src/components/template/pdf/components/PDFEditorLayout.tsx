
import React from 'react';
import { PDFOperationsPanel } from '../PDFOperationsPanel';
import { PDFPreviewCanvas } from '../PDFPreviewCanvas';
import { MobileSidebarOverlay } from './MobileSidebarOverlay';
import { Template } from '@/types/template';

interface PDFEditorLayoutProps {
  currentTemplate: Template;
  isSidebarOpen: boolean;
  isMobile: boolean;
  searchTerm: string;
  currentPage: number;
  onTemplateUpdate: (template: Template) => void;
  onSearchTermChange: (term: string) => void;
  onPageChange: (page: number) => void;
  onToggleSidebar: () => void;
}

export const PDFEditorLayout: React.FC<PDFEditorLayoutProps> = ({
  currentTemplate,
  isSidebarOpen,
  isMobile,
  searchTerm,
  currentPage,
  onTemplateUpdate,
  onSearchTermChange,
  onPageChange,
  onToggleSidebar
}) => {
  const getPDFUrl = () => {
    return currentTemplate?.template_url || currentTemplate?.preview;
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Panel - Operations (Responsive) */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${isMobile ? 'absolute inset-y-0 left-0 z-50' : 'relative'}
        w-80 bg-white/90 backdrop-blur-sm border-r border-gray-200/60 
        transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
        flex flex-col
      `}>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <PDFOperationsPanel
              template={currentTemplate}
              onTemplateUpdate={onTemplateUpdate}
              searchTerm={searchTerm}
              onSearchTermChange={onSearchTermChange}
            />
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      <MobileSidebarOverlay 
        isVisible={isMobile && isSidebarOpen}
        onClick={onToggleSidebar}
      />

      {/* Center Panel - PDF Preview (Responsive) */}
      <div className="flex-1 p-2 md:p-4 overflow-hidden">
        <div className="h-full bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden">
          <PDFPreviewCanvas
            fileUrl={getPDFUrl()!}
            fileName={currentTemplate.name}
            searchTerm={searchTerm}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};
