
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ProjectSelector } from '@/components/dashboard/ProjectSelector';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Calendar, 
  Users, 
  BarChart3,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Star
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  campaigns: number;
  totalScans: number;
  status: 'active' | 'paused' | 'completed';
  lastActivity: string;
  team: number;
  progress: number;
  featured?: boolean;
}

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Summer Marketing Campaign 2024',
      description: 'Comprehensive summer marketing initiative with QR-based customer engagement',
      campaigns: 12,
      totalScans: 15420,
      status: 'active',
      lastActivity: '2 hours ago',
      team: 5,
      progress: 78,
      featured: true
    },
    {
      id: '2',
      name: 'Product Launch Q4',
      description: 'New product line launch with interactive QR codes for product demos',
      campaigns: 8,
      totalScans: 9876,
      status: 'active',
      lastActivity: '1 day ago',
      team: 3,
      progress: 45
    },
    {
      id: '3',
      name: 'Holiday Promotions',
      description: 'Seasonal promotion campaigns with location-based QR targeting',
      campaigns: 15,
      totalScans: 23100,
      status: 'completed',
      lastActivity: '1 week ago',
      team: 7,
      progress: 100,
      featured: true
    },
    {
      id: '4',
      name: 'Customer Feedback Initiative',
      description: 'QR-based feedback collection system for service improvement',
      campaigns: 4,
      totalScans: 5643,
      status: 'paused',
      lastActivity: '3 days ago',
      team: 2,
      progress: 60
    }
  ];

  const projectStats = [
    {
      title: 'Active Projects',
      value: '12',
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '+3'
    },
    {
      title: 'Total Campaigns',
      value: '89',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      change: '+12'
    },
    {
      title: 'Team Members',
      value: '24',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      change: '+2'
    },
    {
      title: 'Total Scans',
      value: '54.2k',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-r from-orange-500 to-orange-600',
      change: '+18%'
    }
  ];

  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || project.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header Section */}
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      Projects
                    </h1>
                    <p className="text-lg text-gray-600">Organize and manage your QR campaign projects</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-100">
                      <Search className="h-4 w-4" />
                      Advanced Search
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create Project
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
                {projectStats.map((stat, index) => (
                  <Card key={index} className="group border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-4 rounded-2xl ${stat.bgColor} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">{stat.change}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Project Selector */}
              <div className="mb-8 animate-fade-in">
                <ProjectSelector />
              </div>

              {/* Search and Filters */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl mb-8 animate-fade-in">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      {['all', 'active', 'paused', 'completed'].map((filter) => (
                        <Button
                          key={filter}
                          variant={activeFilter === filter ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setActiveFilter(filter)}
                          className={activeFilter === filter ? 'bg-blue-600 hover:bg-blue-700' : ''}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="group border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {project.name}
                            </CardTitle>
                            {project.featured && (
                              <Star className="h-5 w-5 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                          <Badge className={`${statusColors[project.status]} border`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{project.campaigns}</p>
                          <p className="text-sm text-gray-600">Campaigns</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{project.totalScans.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Total Scans</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{project.lastActivity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{project.team} members</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <FolderOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery ? 'Try adjusting your search terms' : 'Create your first project to get started'}
                    </p>
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Project
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Projects;
