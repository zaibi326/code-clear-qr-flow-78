
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  onDateRangeChange: (range: { from: Date | null; to: Date | null }) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  onDateRangeChange
}) => {
  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onDateRangeChange({ ...dateRange, from: date });
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onDateRangeChange({ ...dateRange, to: date });
  };

  const clearDateRange = () => {
    onDateRangeChange({ from: null, to: null });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Date Range Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="from-date">From Date</Label>
            <Input
              id="from-date"
              type="date"
              value={dateRange.from ? dateRange.from.toISOString().split('T')[0] : ''}
              onChange={handleFromDateChange}
            />
          </div>
          <div>
            <Label htmlFor="to-date">To Date</Label>
            <Input
              id="to-date"
              type="date"
              value={dateRange.to ? dateRange.to.toISOString().split('T')[0] : ''}
              onChange={handleToDateChange}
            />
          </div>
        </div>
        
        {(dateRange.from || dateRange.to) && (
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {dateRange.from && dateRange.to && (
                <>Selected range: {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}</>
              )}
              {dateRange.from && !dateRange.to && (
                <>From: {dateRange.from.toLocaleDateString()}</>
              )}
              {!dateRange.from && dateRange.to && (
                <>Until: {dateRange.to.toLocaleDateString()}</>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={clearDateRange}>
              Clear
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
