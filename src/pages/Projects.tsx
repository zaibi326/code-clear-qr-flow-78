
import React, { useState } from 'react';
import { Plus, Search, Archive, FolderOpen, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserProjects, Project } from '@/hooks/useUserProjects';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/hooks/use-toast';

const Projects = () => {
  const { user, loading: authLoading } = useAuth();
  const { projects, setProjects, isLoaded } = useUserProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArchived = showArchived ? project.isArchived : !project.isArchived;
    return matchesSearch && matchesArchived;
  });

  const handleCreateProject = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create projects.",
        variant: "destructive"
      });
      return;
    }

    const newProject: Project = {
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `New Project ${projects.length + 1}`,
      description: 'A new marketing project',
      color: '#3B82F6',
      createdAt: new Date(),
      updatedAt: new Date(),
      isArchived: false
    };

    setProjects(prev => [...prev, newProject]);
    toast({
      title: "Project created",
      description: `${newProject.name} has been created successfully.`,
    });
  };

  const handleArchiveProject = (projectId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, isArchived: !project.isArchived, updatedAt: new Date() }
        : project
    ));
    
    const project = projects.find(p => p.id === projectId);
    toast({
      title: project?.isArchived ? "Project restored" : "Project archived",
      description: `${project?.name} has been ${project?.isArchived ? 'restored' : 'archived'}.`,
    });
  };

  if (authLoading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view and manage your projects.</p>
          <Button onClick={() => window.location.href = '/login'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-2">
                Organize your QR campaigns and templates by project
              </p>
            </div>
            <Button onClick={handleCreateProject} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showArchived ? "default" : "outline"}
              onClick={() => setShowArchived(!showArchived)}
            >
              <Archive className="h-4 w-4 mr-2" />
              {showArchived ? 'Show Active' : 'Show Archived'}
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {projects.length === 0 ? 'No projects yet' : 'No projects found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {projects.length === 0 
                ? 'Create your first project to organize your QR campaigns'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {projects.length === 0 && (
              <Button onClick={handleCreateProject} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create First Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: project.color }}
                      />
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                    </div>
                    {project.isArchived && (
                      <Badge variant="secondary">
                        <Archive className="h-3 w-3 mr-1" />
                        Archived
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description || 'No description provided'}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    Created {project.createdAt.toLocaleDateString()}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Target className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleArchiveProject(project.id)}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {projects.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{projects.filter(p => !p.isArchived).length}</div>
                <div className="text-sm text-gray-600">Active Projects</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">{projects.filter(p => p.isArchived).length}</div>
                <div className="text-sm text-gray-600">Archived Projects</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{projects.length}</div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
