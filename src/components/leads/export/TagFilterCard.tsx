
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TagFilter } from '@/components/tags/TagFilter';

interface TagFilterCardProps {
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
}

export const TagFilterCard: React.FC<TagFilterCardProps> = ({
  selectedTags,
  onTagsChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter by Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <TagFilter
          selectedTags={selectedTags}
          onTagsChange={onTagsChange}
        />
      </CardContent>
    </Card>
  );
};
