
import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardStatsGrid } from './DashboardStatsGrid';
import { QuickActions } from './QuickActions';
import { DashboardCharts } from './DashboardCharts';

export function DashboardOverview() {
  const [timeFilter, setTimeFilter] = useState('7d');

  return (
    <div className="space-y-8 animate-fade-in">
      <DashboardHeader timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
      
      <DashboardStatsGrid />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <DashboardCharts />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
