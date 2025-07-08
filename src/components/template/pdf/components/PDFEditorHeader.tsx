
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Menu, 
  X, 
  FileText, 
  Wifi, 
  WifiOff, 
  RotateCcw,
  Upload
} from 'lucide-react';
import { Template } from '@/types/template';

interface PDFEditorHeaderProps {
  currentTemplate: Template;
  isApiConnected?: boolean;
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
    <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/60 px-4 py-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={onToggleSidebar}>
              <Menu className="w-4 h-4" />
            </Button>
          )}
          
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isMobile ? '' : 'Back'}
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-gray-900 text-sm">
                {currentTemplate.name}
              </h1>
              <p className="text-xs text-gray-600">ClearQR PDF Editor</p>
            </div>
          </div>
        </div>

        {/* Center Section - Status */}
        <div className="flex items-center gap-2">
          {isApiConnected !== undefined && (
            <Badge variant={isApiConnected ? "default" : "secondary"} className="text-xs">
              {isApiConnected ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  PDF.co Connected
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline Mode
                </>
              )}
            </Badge>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {!isApiConnected && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetryConnection}
              disabled={isRetrying}
            >
              <RotateCcw className={`w-4 h-4 mr-1 ${isRetrying ? 'animate-spin' : ''}`} />
              {isMobile ? '' : 'Retry'}
            </Button>
          )}
          
          <Button variant="outline" size="sm" onClick={onNewPDF}>
            <Upload className="w-4 h-4 mr-1" />
            {isMobile ? '' : 'New PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
};
