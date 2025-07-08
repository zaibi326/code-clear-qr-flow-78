import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, MessageSquare } from 'lucide-react';

export interface Comment {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  pageNumber: number;
  timestamp: Date;
}

interface CommentToolProps {
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  onRemoveComment: (id: string) => void;
  currentPage: number;
  scale: number;
  color: string;
  isActive: boolean;
}

export const CommentTool: React.FC<CommentToolProps> = ({
  comments,
  onAddComment,
  onRemoveComment,
  currentPage,
  scale,
  color,
  isActive
}) => {
  const [activeComment, setActiveComment] = useState<{ x: number; y: number; text: string } | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!isActive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    setActiveComment({ x, y, text: '' });
  };

  const handleSaveComment = () => {
    if (!activeComment || !activeComment.text.trim()) return;
    
    onAddComment({
      x: activeComment.x,
      y: activeComment.y,
      text: activeComment.text.trim(),
      color: color,
      pageNumber: currentPage + 1
    });
    
    setActiveComment(null);
  };

  const handleCancelComment = () => {
    setActiveComment(null);
  };

  const currentPageComments = comments.filter(c => c.pageNumber === currentPage + 1);

  return (
    <>
      {/* Existing comments */}
      {currentPageComments.map((comment) => (
        <div
          key={comment.id}
          className="absolute group"
          style={{
            left: `${comment.x * scale}px`,
            top: `${comment.y * scale}px`,
            zIndex: 1001
          }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
            style={{ backgroundColor: comment.color }}
          >
            <MessageSquare className="w-3 h-3 text-white" />
          </div>
          
          {/* Comment popup */}
          <div className="absolute left-8 top-0 bg-white border border-gray-300 rounded-lg shadow-xl p-3 min-w-48 max-w-64 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-500">
                {comment.timestamp.toLocaleDateString()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveComment(comment.id)}
                className="h-4 w-4 p-0 text-gray-400 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-sm text-gray-800">{comment.text}</p>
          </div>
        </div>
      ))}
      
      {/* Active comment input */}
      {activeComment && (
        <div
          className="absolute bg-white border border-gray-300 rounded-lg shadow-xl p-3 min-w-64"
          style={{
            left: `${activeComment.x * scale}px`,
            top: `${activeComment.y * scale}px`,
            zIndex: 1002
          }}
        >
          <Textarea
            value={activeComment.text}
            onChange={(e) => setActiveComment({ ...activeComment, text: e.target.value })}
            placeholder="Add your comment..."
            className="mb-3 h-20 resize-none"
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveComment}>
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancelComment}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {/* Click overlay */}
      {isActive && (
        <div
          className="absolute inset-0 cursor-crosshair"
          onClick={handleClick}
          style={{ zIndex: 996 }}
        />
      )}
    </>
  );
};
