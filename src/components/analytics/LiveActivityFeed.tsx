
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity,
  MapPin
} from 'lucide-react';

export function LiveActivityFeed() {
  const mockData = {
    recentActivity: [
      { time: '2 mins ago', action: 'QR Code scanned', campaign: 'Summer Sale 2024', location: 'New York, US', status: 'success' },
      { time: '5 mins ago', action: 'Campaign created', campaign: 'Product Launch', location: 'London, UK', status: 'info' },
      { time: '8 mins ago', action: 'QR Code scanned', campaign: 'Restaurant Menu', location: 'Paris, FR', status: 'success' },
      { time: '12 mins ago', action: 'QR Code scanned', campaign: 'Event Tickets', location: 'Berlin, DE', status: 'success' },
      { time: '15 mins ago', action: 'Campaign updated', campaign: 'Holiday Promo', location: 'Toronto, CA', status: 'warning' }
    ]
  };

  return (
    <Card className="hover:shadow-2xl transition-all duration-500 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-t-xl">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl text-white shadow-lg">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Live Activity Feed
            </span>
            <p className="text-sm text-gray-600 font-normal">Real-time user interactions</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {mockData.recentActivity.map((activity, index) => (
            <div key={index} className="group/activity relative overflow-hidden flex items-center justify-between p-4 bg-gradient-to-r from-white via-gray-50 to-white rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-4 h-4 rounded-full animate-pulse ${
                    activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'warning' ? 'bg-yellow-500' : 
                    activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}></div>
                  <div className={`absolute inset-0 w-4 h-4 rounded-full animate-ping opacity-75 ${
                    activity.status === 'success' ? 'bg-green-400' : 
                    activity.status === 'warning' ? 'bg-yellow-400' : 
                    activity.status === 'info' ? 'bg-blue-400' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 group-hover/activity:text-indigo-600 transition-colors">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">{activity.campaign}</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-bold text-gray-900">{activity.time}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span>{activity.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
