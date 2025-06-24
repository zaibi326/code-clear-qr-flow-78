
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Filter, Calendar } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  campaigns: number;
  scans: number;
  lastActive: string;
}

export function ProjectSelector() {
  const [selectedProject, setSelectedProject] = useState<string>('all-projects');
  const [dateRange, setDateRange] = useState<string>('30-days');

  const projects: Project[] = [
    {
      id: 'summer-campaign-2024',
      name: 'Summer Campaign 2024',
      campaigns: 12,
      scans: 8450,
      lastActive: '2 hours ago'
    },
    {
      id: 'product-launch-q4',
      name: 'Product Launch Q4',
      campaigns: 8,
      scans: 5230,
      lastActive: '1 day ago'
    },
    {
      id: 'holiday-promotions',
      name: 'Holiday Promotions',
      campaigns: 15,
      scans: 12100,
      lastActive: '3 hours ago'
    }
  ];

  // Ensure all project options have non-empty values
  const projectOptions = [
    { value: 'all-projects', label: 'All Projects' },
    ...projects.map(project => ({ value: project.id, label: project.name }))
  ].filter(option => option.value && option.value.trim() !== '');

  // Ensure all date range options have non-empty values
  const dateRangeOptions = [
    { value: '7-days', label: 'Last 7 days' },
    { value: '30-days', label: 'Last 30 days' },
    { value: '90-days', label: 'Last 90 days' },
    { value: 'custom-range', label: 'Custom range' }
  ].filter(option => option.value && option.value.trim() !== '');

  console.log('ProjectSelector projectOptions:', projectOptions);
  console.log('ProjectSelector dateRangeOptions:', dateRangeOptions);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Project Overview</span>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Project
            </label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a project" />
              </SelectTrigger>
              <SelectContent>
                {projectOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        {selectedProject !== 'all-projects' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects
              .filter(project => project.id === selectedProject)
              .map((project) => (
                <div key={project.id} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Campaigns:</span>
                      <span className="font-medium">{project.campaigns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Scans:</span>
                      <span className="font-medium">{project.scans.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Active:</span>
                      <span className="font-medium">{project.lastActive}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
