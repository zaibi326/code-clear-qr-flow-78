
import React from 'react';
import { Users } from 'lucide-react';

const HeroStats = () => {
  return (
    <div className="max-w-6xl mx-auto mb-16">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 transform hover:scale-[1.02] transition-all duration-500">
        {/* Browser chrome */}
        <div className="bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-4 border-b border-slate-300/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
              </div>
              <div className="bg-white/80 px-4 py-1 rounded-lg text-sm font-medium text-slate-600 shadow-sm">
                🔒 enterprise.clearqr.io/dashboard
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-green-600">LIVE</span>
            </div>
          </div>
        </div>
        
        {/* Dashboard content */}
        <div className="p-8 bg-gradient-to-br from-white to-slate-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { value: "2.4M", label: "Monthly Scans", color: "blue", icon: "📊", trend: "+24%" },
              { value: "1,847", label: "Active Campaigns", color: "green", icon: "🚀", trend: "+12%" },
              { value: "34.8%", label: "Engagement Rate", color: "purple", icon: "📈", trend: "+8%" },
              { value: "$847K", label: "Revenue Tracked", color: "orange", icon: "💰", trend: "+31%" }
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>{stat.value}</div>
                <div className="text-sm text-slate-600 font-medium mb-2">{stat.label}</div>
                <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.trend}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 px-8 py-4 rounded-full border border-blue-200/50">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-slate-700 font-bold text-lg">Enterprise Analytics Dashboard</span>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroStats;
