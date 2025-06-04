
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp } from 'lucide-react';

const scanData = [
  { name: 'Mon', scans: 240, users: 180 },
  { name: 'Tue', scans: 380, users: 290 },
  { name: 'Wed', scans: 290, users: 220 },
  { name: 'Thu', scans: 480, users: 380 },
  { name: 'Fri', scans: 620, users: 480 },
  { name: 'Sat', scans: 520, users: 420 },
  { name: 'Sun', scans: 350, users: 280 }
];

export function DashboardCharts() {
  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white shadow-lg">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Scan Activity
            </span>
            <p className="text-sm text-gray-600 font-normal">Weekly performance overview</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={scanData}>
              <defs>
                <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                }} 
              />
              <Area
                type="monotone"
                dataKey="scans"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#scanGradient)"
                name="Total Scans"
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#userGradient)"
                name="Unique Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
