
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
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="summer-promo">Summer Promo</SelectItem>
                <SelectItem value="product-launch">Product Launch</SelectItem>
                <SelectItem value="holiday-sale">Holiday Sale</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
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
