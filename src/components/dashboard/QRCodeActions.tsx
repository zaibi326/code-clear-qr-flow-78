
import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Download, Copy, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface QRCodeActionsProps {
  qr: any;
  onEdit: (qr: any) => void;
  onDownload: (qr: any) => void;
  onDuplicate: (qr: any) => void;
  onDelete: (qr: any) => void;
  className?: string;
  variant?: 'card' | 'list';
}

export function QRCodeActions({ 
  qr, 
  onEdit, 
  onDownload, 
  onDuplicate, 
  onDelete, 
  className = "",
  variant = 'card'
}: QRCodeActionsProps) {
  const buttonClasses = variant === 'card' 
    ? "h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
    : "h-8 w-8 p-0 hover:bg-gray-200";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`${buttonClasses} ${className}`}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onEdit(qr)} className="cursor-pointer">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownload(qr)} className="cursor-pointer">
          <Download className="h-4 w-4 mr-2" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDuplicate(qr)} className="cursor-pointer">
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDelete(qr)} 
          className="text-red-600 cursor-pointer hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
