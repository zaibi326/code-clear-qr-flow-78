
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Eye, AlertCircle, CheckCircle, Menu } from 'lucide-react';
import { Template } from '@/types/template';

interface PDFEditorHeaderProps {
  currentTemplate: Template;
  isApiConnected: boolean | null;
  isMobile: boolean;
  isRetrying: boolean;
  onCancel: () => void;
  onToggleSidebar: () => void;
  onNewPDF: () => void;
  onRetryConnection: () => void;
}

export const PDFEditorHeader: React.FC<PDFEditorHeaderProps> = ({
  currentTemplate,
  isApiConnected,
  isMobile,
  isRetrying,
  onCancel,
  onToggleSidebar,
  onNewPDF,
  onRetryConnection
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-4 md:px-6 py-4 shadow-sm flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-gray-100/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          
          {/* Mobile menu toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleSidebar}
            className="md:hidden hover:bg-gray-100/80"
          >
            <Menu className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-base md:text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate max-w-[150px] md:max-w-none">
              {currentTemplate.name}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          {/* API Status */}
          {isApiConnected && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              <CheckCircle className="w-4 h-4" />
              <span>Connected</span>
            </div>
          )}
          {isApiConnected === false && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onRetryConnection}
              disabled={isRetrying}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Reconnect</span>
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onNewPDF}
            className="hover:bg-gray-100/80"
          >
            <Eye className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">New PDF</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
