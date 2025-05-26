
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';

const chartData = [
  { date: "Jan 1", scans: 120, visitors: 90, conversions: 20 },
  { date: "Jan 2", scans: 132, visitors: 103, conversions: 24 },
  { date: "Jan 3", scans: 101, visitors: 88, conversions: 18 },
  { date: "Jan 4", scans: 134, visitors: 113, conversions: 29 },
  { date: "Jan 5", scans: 90, visitors: 87, conversions: 16 },
  { date: "Jan 6", scans: 230, visitors: 210, conversions: 47 },
  { date: "Jan 7", scans: 210, visitors: 180, conversions: 38 },
  { date: "Jan 8", scans: 214, visitors: 190, conversions: 41 },
  { date: "Jan 9", scans: 267, visitors: 220, conversions: 52 },
  { date: "Jan 10", scans: 289, visitors: 250, conversions: 61 },
  { date: "Jan 11", scans: 145, visitors: 128, conversions: 32 },
  { date: "Jan 12", scans: 178, visitors: 159, conversions: 38 },
  { date: "Jan 13", scans: 234, visitors: 201, conversions: 49 },
  { date: "Jan 14", scans: 267, visitors: 230, conversions: 56 },
];

const chartConfig = {
  scans: {
    label: "Scans",
    color: "#3b82f6",
  },
  visitors: {
    label: "Visitors",
    color: "#10b981",
  },
  conversions: {
    label: "Conversions",
    color: "#f59e0b",
  },
};

export function S3Chart() {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">QR Code Performance</h3>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Scans</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Visitors</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Conversions</span>
            </div>
          </div>
          
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  fontSize={12}
                  tickMargin={8}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="scans" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#scanGradient)"
                />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#visitorGradient)"
                />
                <Area 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#conversionGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="px-6 py-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-semibold text-blue-600">2,611</div>
              <div className="text-sm text-gray-600">Total Scans</div>
            </div>
            <div className="px-6 py-4 bg-green-50 rounded-lg">
              <div className="text-xl font-semibold text-green-600">2,249</div>
              <div className="text-sm text-gray-600">Total Visitors</div>
            </div>
            <div className="px-6 py-4 bg-amber-50 rounded-lg">
              <div className="text-xl font-semibold text-amber-600">471</div>
              <div className="text-sm text-gray-600">Conversions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
