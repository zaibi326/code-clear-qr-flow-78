
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MapPin, Clock, Repeat, UserCheck } from 'lucide-react';

const scanLocationData = [
  { location: 'New York', scans: 145, percentage: 35 },
  { location: 'California', scans: 98, percentage: 24 },
  { location: 'Texas', scans: 76, percentage: 18 },
  { location: 'Florida', scans: 45, percentage: 11 },
  { location: 'Others', scans: 48, percentage: 12 }
];

const scanTimeData = [
  { time: '9 AM', scans: 23 },
  { time: '12 PM', scans: 45 },
  { time: '3 PM', scans: 67 },
  { time: '6 PM', scans: 89 },
  { time: '9 PM', scans: 34 }
];

const scanTypeData = [
  { name: 'First-time', value: 68, color: '#8884d8' },
  { name: 'Repeat', value: 32, color: '#82ca9d' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function ScanAnalytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Location Analytics */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Scan Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scanLocationData.map((location, index) => (
              <div key={location.location} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="font-medium">{location.location}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{location.scans}</div>
                  <div className="text-sm text-gray-500">{location.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Analytics */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            Scan Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scanTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="scans" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* First-time vs Repeat Scans */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-600" />
            Scan Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="60%" height={150}>
              <PieChart>
                <Pie
                  data={scanTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {scanTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {scanTypeData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-500">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Source Tracking */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-orange-600" />
            Lead Source Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Social Media</span>
              <span className="font-semibold text-blue-600">245 scans</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium">Email Campaign</span>
              <span className="font-semibold text-green-600">189 scans</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="font-medium">Print Materials</span>
              <span className="font-semibold text-purple-600">156 scans</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="font-medium">Direct Link</span>
              <span className="font-semibold text-orange-600">89 scans</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
