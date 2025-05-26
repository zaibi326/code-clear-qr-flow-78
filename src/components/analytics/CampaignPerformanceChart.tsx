
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Summer Promo', value: 15432, fill: '#3b82f6' },
  { name: 'Product Launch', value: 12543, fill: '#10b981' },
  { name: 'Holiday Sale', value: 8976, fill: '#f59e0b' },
  { name: 'Brand Awareness', value: 6234, fill: '#ef4444' },
  { name: 'Store Events', value: 3456, fill: '#8b5cf6' }
];

const chartConfig = {
  value: {
    label: "Scans"
  },
  "Summer Promo": {
    label: "Summer Promo",
    color: "#3b82f6"
  },
  "Product Launch": {
    label: "Product Launch", 
    color: "#10b981"
  },
  "Holiday Sale": {
    label: "Holiday Sale",
    color: "#f59e0b"
  },
  "Brand Awareness": {
    label: "Brand Awareness",
    color: "#ef4444"
  },
  "Store Events": {
    label: "Store Events",
    color: "#8b5cf6"
  }
};

export function CampaignPerformanceChart() {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance</CardTitle>
        <CardDescription>Scans by campaign type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ value, percent }) => `${((value / total) * 100).toFixed(1)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="mt-4 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-gray-600">{item.name}</span>
              </div>
              <span className="font-medium">{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
