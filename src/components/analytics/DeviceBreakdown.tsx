
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Progress } from '@/components/ui/progress';

const deviceData = [
  { name: 'Mobile', value: 63, color: '#3b82f6' },
  { name: 'Desktop', value: 24, color: '#10b981' },
  { name: 'Tablet', value: 13, color: '#f59e0b' },
];

const browserData = [
  { name: 'Chrome', value: 52, color: '#3b82f6' },
  { name: 'Safari', value: 29, color: '#10b981' },
  { name: 'Firefox', value: 9, color: '#f59e0b' },
  { name: 'Edge', value: 6, color: '#8b5cf6' },
  { name: 'Others', value: 4, color: '#ef4444' },
];

const osData = [
  { name: 'iOS', value: 42, percentage: 42 },
  { name: 'Android', value: 35, percentage: 35 },
  { name: 'Windows', value: 15, percentage: 15 },
  { name: 'macOS', value: 6, percentage: 6 },
  { name: 'Others', value: 2, percentage: 2 },
];

export function DeviceBreakdown() {
  const chartConfig = {
    deviceType: {
      label: "Device Type",
      color: "#3b82f6"
    },
    Mobile: {
      label: "Mobile",
      color: "#3b82f6"
    },
    Desktop: {
      label: "Desktop",
      color: "#10b981"
    },
    Tablet: {
      label: "Tablet",
      color: "#f59e0b"
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Device Type</h3>
          <div className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="mt-4 space-y-2">
            {deviceData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Browser</h3>
          <div className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={browserData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {browserData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="mt-4 space-y-2">
            {browserData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm md:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Operating System</h3>
          <div className="space-y-4">
            {osData.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium">{item.percentage}%</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
