
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const chartData = [
  { date: 'Jan 1', scans: 120 },
  { date: 'Jan 2', scans: 135 },
  { date: 'Jan 3', scans: 148 },
  { date: 'Jan 4', scans: 167 },
  { date: 'Jan 5', scans: 189 },
  { date: 'Jan 6', scans: 201 },
  { date: 'Jan 7', scans: 224 },
  { date: 'Jan 8', scans: 198 },
  { date: 'Jan 9', scans: 245 },
  { date: 'Jan 10', scans: 267 },
  { date: 'Jan 11', scans: 289 },
  { date: 'Jan 12', scans: 312 },
  { date: 'Jan 13', scans: 298 },
  { date: 'Jan 14', scans: 334 },
];

const chartConfig = {
  scans: {
    label: "Scans",
    color: "hsl(var(--chart-1))",
  },
};

export function ScanActivityChart() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Scan Activity
        </CardTitle>
        <p className="text-sm text-gray-600">
          Daily QR code scans over the last 14 days
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              className="text-xs text-gray-600"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              className="text-xs text-gray-600"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="scans" 
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
