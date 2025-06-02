
import React from 'react';

const HeroSocialProof = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      {[
        { stat: "5M+", label: "QR Scans Monthly", icon: "📱" },
        { stat: "99.9%", label: "Uptime Guaranteed", icon: "⚡" },
        { stat: "150+", label: "Countries Served", icon: "🌍" }
      ].map((item, index) => (
        <div key={index} className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50">
          <div className="text-3xl mb-2">{item.icon}</div>
          <div className="text-3xl font-bold text-blue-600 mb-1">{item.stat}</div>
          <div className="text-slate-600 font-medium">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default HeroSocialProof;
