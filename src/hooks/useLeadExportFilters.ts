
import { useState } from 'react';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface IncludeFields {
  name: boolean;
  phone: boolean;
  email: boolean;
  qr_id: boolean;
  notes: boolean;
  company: boolean;
  tags: boolean;
  created_at: boolean;
}

interface ExportFilters {
  dateRange: DateRange;
  selectedTags: string[];
  selectedLists: string[];
  includeFields: IncludeFields;
}

export const useLeadExportFilters = () => {
  const [filters, setFilters] = useState<ExportFilters>({
    dateRange: { from: undefined, to: undefined },
    selectedTags: [],
    selectedLists: [],
    includeFields: {
      name: true,
      phone: true,
      email: true,
      qr_id: true,
      notes: true,
      company: true,
      tags: true,
      created_at: true
    }
  });

  const handleFieldToggle = (field: keyof IncludeFields) => {
    setFilters(prev => ({
      ...prev,
      includeFields: {
        ...prev.includeFields,
        [field]: !prev.includeFields[field]
      }
    }));
  };

  const handleDateRangeChange = (key: 'from' | 'to', date?: Date) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        from: key === 'from' ? date : prev.dateRange.from,
        to: key === 'to' ? date : prev.dateRange.to
      }
    }));
  };

  const handleTagsChange = (tagIds: string[]) => {
    setFilters(prev => ({ ...prev, selectedTags: tagIds }));
  };

  return {
    filters,
    handleFieldToggle,
    handleDateRangeChange,
    handleTagsChange
  };
};
