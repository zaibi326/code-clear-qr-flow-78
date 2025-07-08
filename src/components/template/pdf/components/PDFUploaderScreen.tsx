
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react';
import { EnhancedPDFUploader } from '../EnhancedPDFUploader';
import { Template } from '@/types/template';

interface PDFUploaderScreenProps {
  isApiConnected: boolean | null;
  onUploadComplete: (template: Template) => void;
  onCancel: () => void;
}

export const PDFUploaderScreen: React.FC<PDFUploaderScreenProps> = ({
  isApiConnected,
  onUploadComplete,
  onCancel
}) => {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-gray-100/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Canva-Style PDF Editor
              </h1>
            </div>
          </div>
          
          {/* API Status */}
          {isApiConnected && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              <CheckCircle className="w-4 h-4" />
              <span>API Connected</span>
            </div>
          )}
          {isApiConnected === null && (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
              <span>Connecting...</span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Uploader */}
      <div className="flex-1 flex items-center justify-center p-6">
        <EnhancedPDFUploader
          onUploadComplete={onUploadComplete}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};
