
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

const dailyData = [
  { date: 'Jan 1', scans: 120 },
  { date: 'Jan 2', scans: 132 },
  { date: 'Jan 3', scans: 101 },
  { date: 'Jan 4', scans: 134 },
  { date: 'Jan 5', scans: 90 },
  { date: 'Jan 6', scans: 230 },
  { date: 'Jan 7', scans: 210 },
  { date: 'Jan 8', scans: 214 },
  { date: 'Jan 9', scans: 267 },
  { date: 'Jan 10', scans: 289 },
  { date: 'Jan 11', scans: 145 },
  { date: 'Jan 12', scans: 178 },
  { date: 'Jan 13', scans: 234 },
  { date: 'Jan 14', scans: 267 }
];

const weeklyData = [
  { date: 'Week 1', scans: 890 },
  { date: 'Week 2', scans: 1200 },
  { date: 'Week 3', scans: 1100 },
  { date: 'Week 4', scans: 1340 },
  { date: 'Week 5', scans: 1150 },
  { date: 'Week 6', scans: 1580 },
  { date: 'Week 7', scans: 1420 },
  { date: 'Week 8', scans: 1680 }
];

const monthlyData = [
  { date: 'Jan', scans: 4200 },
  { date: 'Feb', scans: 3800 },
  { date: 'Mar', scans: 5100 },
  { date: 'Apr', scans: 4700 },
  { date: 'May', scans: 5300 },
  { date: 'Jun', scans: 4900 }
];

const chartConfig = {
  scans: {
    label: "Scans",
    color: "#3b82f6"
  }
};

export function ScanActivityChart() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const getData = () => {
    switch (timeframe) {
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      default: return dailyData;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Scan Activity</CardTitle>
            <CardDescription>QR code scans over time</CardDescription>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={timeframe === 'daily' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe('daily')}
              className="h-7"
            >
              Daily
            </Button>
            <Button
              variant={timeframe === 'weekly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe('weekly')}
              className="h-7"
            >
              Weekly
            </Button>
            <Button
              variant={timeframe === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe('monthly')}
              className="h-7"
            >
              Monthly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getData()}>
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
              <ChartTooltip 
                content={<ChartTooltipContent />}
              />
              <Line 
                type="monotone" 
                dataKey="scans" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
