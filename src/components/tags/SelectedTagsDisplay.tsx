
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag } from '@/services/tagService';

interface SelectedTagsDisplayProps {
  selectedTagObjects: Tag[];
  onTagToggle: (tagId: string) => void;
}

export const SelectedTagsDisplay: React.FC<SelectedTagsDisplayProps> = ({
  selectedTagObjects,
  onTagToggle
}) => {
  return (
    <>
      {selectedTagObjects.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1"
          style={{ backgroundColor: `${tag.color}20`, borderColor: tag.color }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: tag.color }}
          />
          <span className="text-sm">{tag.name}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => onTagToggle(tag.id)}
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      ))}
    </>
  );
};
