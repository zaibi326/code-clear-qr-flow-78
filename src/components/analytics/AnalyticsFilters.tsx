
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
  const [selectedDateRange, setSelectedDateRange] = useState<string>('30-days');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all-campaigns');
  const [selectedLocation, setSelectedLocation] = useState<string>('all-locations');
  
  // Ensure all date range options have valid non-empty values with explicit validation
  const dateRangeOptions = [
    { value: '7-days', label: 'Last 7 days' },
    { value: '30-days', label: 'Last 30 days' },
    { value: '90-days', label: 'Last 90 days' },
    { value: '1-year', label: 'Last year' }
  ].filter(option => {
    const isValid = option.value && 
                   typeof option.value === 'string' && 
                   option.value.trim() !== '' && 
                   option.label && 
                   typeof option.label === 'string' && 
                   option.label.trim() !== '';
    if (!isValid) {
      console.error('AnalyticsFilters: Invalid date range option detected:', option);
    }
    return isValid;
  });

  // Ensure all campaign options have valid non-empty values with explicit validation
  const campaignOptions = [
    { value: 'all-campaigns', label: 'All Campaigns' },
    { value: 'summer-promo', label: 'Summer Promo' },
    { value: 'product-launch', label: 'Product Launch' },
    { value: 'holiday-sale', label: 'Holiday Sale' }
  ].filter(option => {
    const isValid = option.value && 
                   typeof option.value === 'string' && 
                   option.value.trim() !== '' && 
                   option.label && 
                   typeof option.label === 'string' && 
                   option.label.trim() !== '';
    if (!isValid) {
      console.error('AnalyticsFilters: Invalid campaign option detected:', option);
    }
    return isValid;
  });

  // Ensure all location options have valid non-empty values with explicit validation
  const locationOptions = [
    { value: 'all-locations', label: 'All Locations' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' }
  ].filter(option => {
    const isValid = option.value && 
                   typeof option.value === 'string' && 
                   option.value.trim() !== '' && 
                   option.label && 
                   typeof option.label === 'string' && 
                   option.label.trim() !== '';
    if (!isValid) {
      console.error('AnalyticsFilters: Invalid location option detected:', option);
    }
    return isValid;
  });

  console.log('AnalyticsFilters rendering with valid options:');
  console.log('dateRangeOptions:', dateRangeOptions);
  console.log('campaignOptions:', campaignOptions);
  console.log('locationOptions:', locationOptions);
  console.log('selectedDateRange:', selectedDateRange);
  console.log('selectedCampaign:', selectedCampaign);
  console.log('selectedLocation:', selectedLocation);
  
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
            
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4" />
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map(option => {
                  console.log('Rendering dateRange SelectItem with value:', option.value, 'label:', option.label);
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Campaign" />
              </SelectTrigger>
              <SelectContent>
                {campaignOptions.map(option => {
                  console.log('Rendering campaign SelectItem with value:', option.value, 'label:', option.label);
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map(option => {
                  console.log('Rendering location SelectItem with value:', option.value, 'label:', option.label);
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  );
                })}
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
