
import { useState } from 'react';

export interface LeadExportFilters {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  selectedTags: string[];
  includeFields: {
    name: boolean;
    email: boolean;
    phone: boolean;
    company: boolean;
    url: boolean;
    notes: boolean;
    tags: boolean;
    createdAt: boolean;
    updatedAt: boolean;
  };
}

export const useLeadExportFilters = () => {
  const [filters, setFilters] = useState<LeadExportFilters>({
    dateRange: {
      from: null,
      to: null
    },
    selectedTags: [],
    includeFields: {
      name: true,
      email: true,
      phone: true,
      company: true,
      url: false,
      notes: false,
      tags: true,
      createdAt: true,
      updatedAt: false
    }
  });

  const handleFieldToggle = (field: keyof LeadExportFilters['includeFields']) => {
    setFilters(prev => ({
      ...prev,
      includeFields: {
        ...prev.includeFields,
        [field]: !prev.includeFields[field]
      }
    }));
  };

  const handleDateRangeChange = (range: { from: Date | null; to: Date | null }) => {
    setFilters(prev => ({
      ...prev,
      dateRange: range
    }));
  };

  const handleTagsChange = (tagIds: string[]) => {
    setFilters(prev => ({
      ...prev,
      selectedTags: tagIds
    }));
  };

  return {
    filters,
    handleFieldToggle,
    handleDateRangeChange,
    handleTagsChange
  };
};
