
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { TrendingUp, Activity, BarChart3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const scanData = [
  { date: 'Jan 1', scans: 120, clicks: 85, conversions: 45 },
  { date: 'Jan 2', scans: 180, clicks: 125, conversions: 68 },
  { date: 'Jan 3', scans: 150, clicks: 95, conversions: 52 },
  { date: 'Jan 4', scans: 220, clicks: 160, conversions: 89 },
  { date: 'Jan 5', scans: 190, clicks: 140, conversions: 76 },
  { date: 'Jan 6', scans: 240, clicks: 180, conversions: 98 },
  { date: 'Jan 7', scans: 280, clicks: 200, conversions: 112 },
  { date: 'Jan 8', scans: 320, clicks: 230, conversions: 125 },
  { date: 'Jan 9', scans: 290, clicks: 210, conversions: 118 },
  { date: 'Jan 10', scans: 350, clicks: 250, conversions: 140 },
];

export function ScanActivityChart() {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={scanData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="scans" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="clicks" fill="#10b981" radius={[2, 2, 0, 0]} />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={scanData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area type="monotone" dataKey="scans" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            <Area type="monotone" dataKey="clicks" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
          </AreaChart>
        );
      default:
        return (
          <LineChart data={scanData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }} />
            <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }} />
          </LineChart>
        );
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Scan Activity Overview
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={timeRange === '7d' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('7d')}
              className="h-7 px-3 text-xs"
            >
              7D
            </Button>
            <Button
              variant={timeRange === '30d' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('30d')}
              className="h-7 px-3 text-xs"
            >
              30D
            </Button>
            <Button
              variant={timeRange === '90d' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('90d')}
              className="h-7 px-3 text-xs"
            >
              90D
            </Button>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('line')}
              className="h-7 w-7 p-0"
            >
              <TrendingUp className="h-3 w-3" />
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('bar')}
              className="h-7 w-7 p-0"
            >
              <BarChart3 className="h-3 w-3" />
            </Button>
            <Button
              variant={chartType === 'area' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('area')}
              className="h-7 w-7 p-0"
            >
              <Activity className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Scans</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Clicks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Conversions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
