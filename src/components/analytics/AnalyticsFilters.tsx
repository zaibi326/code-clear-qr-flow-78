
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Filter, Download, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function AnalyticsFilters() {
  const [activeFilters, setActiveFilters] = useState<string[]>(['Last 30 days']);
  
  // Ensure all date range options have non-empty values
  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' },
    { value: '1year', label: 'Last year' }
  ].filter(option => option.value.trim() !== '');

  // Ensure all campaign options have non-empty values
  const campaignOptions = [
    { value: 'all', label: 'All Campaigns' },
    { value: 'summer-promo', label: 'Summer Promo' },
    { value: 'product-launch', label: 'Product Launch' },
    { value: 'holiday-sale', label: 'Holiday Sale' }
  ].filter(option => option.value.trim() !== '');

  // Ensure all location options have non-empty values
  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' }
  ].filter(option => option.value.trim() !== '');

  console.log('AnalyticsFilters dateRangeOptions:', dateRangeOptions);
  console.log('AnalyticsFilters campaignOptions:', campaignOptions);
  console.log('AnalyticsFilters locationOptions:', locationOptions);
  
  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <Select>
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4" />
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Campaign" />
              </SelectTrigger>
              <SelectContent>
                {campaignOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t">
            <span className="text-xs text-gray-500">Active filters:</span>
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                {filter}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-red-500" 
                  onClick={() => removeFilter(filter)}
                />
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
