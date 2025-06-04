
import React, { useState } from 'react';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsStatsGrid } from './AnalyticsStatsGrid';
import { GeographicPerformance } from './GeographicPerformance';
import { DeviceAnalytics } from './DeviceAnalytics';
import { LiveActivityFeed } from './LiveActivityFeed';

export function AnalyticsOverview() {
  const [timeFilter, setTimeFilter] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('scans');

  return (
    <div className="space-y-8 animate-fade-in">
      <AnalyticsHeader timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
      
      <AnalyticsStatsGrid 
        selectedMetric={selectedMetric} 
        setSelectedMetric={setSelectedMetric} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <GeographicPerformance />
        <DeviceAnalytics />
      </div>

      <LiveActivityFeed />
    </div>
  );
}
