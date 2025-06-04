
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BarChart3,
  Activity,
  Clock,
  Download
} from 'lucide-react';

interface AnalyticsHeaderProps {
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
}

export function AnalyticsHeader({ timeFilter, setTimeFilter }: AnalyticsHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/5 rounded-full blur-lg"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold">Analytics Overview</h2>
              <p className="text-blue-100 text-lg">Real-time insights into your QR code performance</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Activity className="h-4 w-4" />
              <span>Live Data</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Clock className="h-4 w-4" />
              <span>Updated 2 mins ago</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1">
            {['7d', '30d', '90d'].map((period) => (
              <Button
                key={period}
                variant={timeFilter === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeFilter(period)}
                className={`relative ${timeFilter === period 
                  ? 'bg-white text-purple-600 shadow-lg' 
                  : 'text-white hover:bg-white/20'
                }`}
              >
                {period}
              </Button>
            ))}
          </div>
          <Button className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
