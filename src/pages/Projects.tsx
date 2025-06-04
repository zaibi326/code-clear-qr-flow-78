
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Folder, Plus, Users, Calendar, TrendingUp, Eye, Edit, Trash2, Share2, Download } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Summer Marketing Campaign',
      description: 'QR codes for summer product promotion',
      qrCount: 45,
      scans: 12543,
      created: '2024-01-15',
      status: 'active',
      team: ['John Doe', 'Jane Smith'],
      category: 'Marketing'
    },
    {
      id: 2,
      name: 'Restaurant Menu System',
      description: 'Digital menus for restaurant chain',
      qrCount: 23,
      scans: 8921,
      created: '2024-01-10',
      status: 'active',
      team: ['Mike Johnson'],
      category: 'Hospitality'
    },
    {
      id: 3,
      name: 'Event Registration',
      description: 'QR codes for conference registration',
      qrCount: 12,
      scans: 3456,
      created: '2024-01-08',
      status: 'completed',
      team: ['Sarah Wilson', 'Tom Brown'],
      category: 'Events'
    }
  ]);

  const projectStats = [
    {
      title: 'Total Projects',
      value: '24',
      icon: Folder,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '+6'
    },
    {
      title: 'Active Projects',
      value: '18',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      change: '+3'
    },
    {
      title: 'Team Members',
      value: '12',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      change: '+2'
    },
    {
      title: 'Total Scans',
      value: '45.2K',
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-r from-orange-500 to-orange-600',
      change: '+18%'
    }
  ];

  const handleProjectAction = (action: string, projectId: number) => {
    console.log(`${action} project:`, projectId);
  };

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
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      Projects
                    </h1>
                    <p className="text-lg text-gray-600">Organize and manage your QR code projects efficiently</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-100">
                      <Share2 className="h-4 w-4" />
                      Share Project
                    </Button>
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      New Project
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

              {/* Projects Management */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl p-8 animate-fade-in">
                <Tabs defaultValue="grid" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                  </TabsList>

                  <TabsContent value="grid" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((project) => (
                        <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 bg-white/80 backdrop-blur-sm">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl text-white">
                                  <Folder className="h-6 w-6" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg font-bold text-gray-900 mb-1">{project.name}</CardTitle>
                                  <Badge variant="secondary" className="text-xs">{project.category}</Badge>
                                </div>
                              </div>
                              <Badge 
                                variant={project.status === 'active' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {project.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{project.description}</p>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                  <p className="text-2xl font-bold text-blue-600">{project.qrCount}</p>
                                  <p className="text-xs text-gray-600">QR Codes</p>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                  <p className="text-2xl font-bold text-green-600">{project.scans.toLocaleString()}</p>
                                  <p className="text-xs text-gray-600">Total Scans</p>
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-xs text-gray-500 mb-2">Team Members:</p>
                                <div className="flex items-center gap-2">
                                  {project.team.slice(0, 2).map((member, index) => (
                                    <div key={index} className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium">
                                      {member.split(' ').map(n => n[0]).join('')}
                                    </div>
                                  ))}
                                  {project.team.length > 2 && (
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                                      +{project.team.length - 2}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <span className="text-xs text-gray-500">Created: {project.created}</span>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => handleProjectAction('view', project.id)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleProjectAction('edit', project.id)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleProjectAction('download', project.id)}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="list" className="mt-0">
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <Card key={project.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white">
                                  <Folder className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                                  <p className="text-sm text-gray-600">{project.description}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-6">
                                <div className="text-center">
                                  <p className="font-bold text-gray-900">{project.qrCount}</p>
                                  <p className="text-xs text-gray-500">QR Codes</p>
                                </div>
                                <div className="text-center">
                                  <p className="font-bold text-gray-900">{project.scans.toLocaleString()}</p>
                                  <p className="text-xs text-gray-500">Scans</p>
                                </div>
                                <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                                  {project.status}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => handleProjectAction('edit', project.id)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleProjectAction('delete', project.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Projects;
