
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const comparisonData = [
  {
    month: 'Jan',
    'Summer Campaign': 2400,
    'Product Launch': 1800,
    'Holiday Promo': 3200
  },
  {
    month: 'Feb',
    'Summer Campaign': 2800,
    'Product Launch': 2200,
    'Holiday Promo': 2900
  },
  {
    month: 'Mar',
    'Summer Campaign': 3200,
    'Product Launch': 2800,
    'Holiday Promo': 3800
  },
  {
    month: 'Apr',
    'Summer Campaign': 2900,
    'Product Launch': 2400,
    'Holiday Promo': 3100
  },
  {
    month: 'May',
    'Summer Campaign': 3400,
    'Product Launch': 3100,
    'Holiday Promo': 4200
  },
  {
    month: 'Jun',
    'Summer Campaign': 3800,
    'Product Launch': 2900,
    'Holiday Promo': 3900
  }
];

const chartConfig = {
  'Summer Campaign': {
    label: 'Summer Campaign',
    color: '#3b82f6'
  },
  'Product Launch': {
    label: 'Product Launch',
    color: '#10b981'
  },
  'Holiday Promo': {
    label: 'Holiday Promo',
    color: '#f59e0b'
  }
};

export function MultiProjectComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Performance Comparison</CardTitle>
        <p className="text-sm text-gray-600">
          Compare scan metrics across your active projects
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} barCategoryGap="15%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                fontSize={12}
                tickMargin={8}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickMargin={8}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value) => [value.toLocaleString(), '']}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar 
                dataKey="Summer Campaign" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="Product Launch" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="Holiday Promo" 
                fill="#f59e0b" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">18,600</div>
            <div className="text-sm text-gray-600">Summer Campaign Total</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">15,200</div>
            <div className="text-sm text-gray-600">Product Launch Total</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">21,200</div>
            <div className="text-sm text-gray-600">Holiday Promo Total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
