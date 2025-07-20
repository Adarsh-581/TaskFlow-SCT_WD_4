import { useEffect, useState } from 'react';
import { Plus, MoreHorizontal, Users, Calendar, TrendingUp, Settings, Folder } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';

const ProjectsPage = () => {
  const { projects, fetchProjects, addProject, updateProject, deleteProject, tasks } = useTaskStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async () => {
    if (!formData.name.trim()) return;
    await addProject({ name: formData.name, description: formData.description });
    setFormData({ name: '', description: '' });
    setIsCreateModalOpen(false);
  };

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId);
  };

  const getProjectStats = (projectId: string) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const completed = projectTasks.filter(task => task.completed).length;
    const total = projectTasks.length;
    const overdue = projectTasks.filter(task =>
      !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
    ).length;
    return {
      totalTasks: total,
      completedTasks: completed,
      overdueTasks: overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const projectColors = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#14B8A6', '#F97316'
  ];

  const projectIcons = [
    'Folder', 'Briefcase', 'User', 'Home', 'Star', 'Heart', 'Target', 'Zap'
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Organize your tasks into projects and collaborate with your team
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-white hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Create a new project to organize your tasks
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const stats = getProjectStats(project._id || project.id);
          return (
            <Card key={project._id || project.id} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg font-semibold bg-primary"
                    >
                      <Folder className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {project.description}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDeleteProject(project._id || project.id)} className="text-destructive">
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{stats.completionRate}%</span>
                    </div>
                    <Progress value={stats.completionRate} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-foreground">{stats.totalTasks}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-green-600">{stats.completedTasks}</div>
                      <div className="text-xs text-muted-foreground">Done</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-red-600">{stats.overdueTasks}</div>
                      <div className="text-xs text-muted-foreground">Overdue</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Folder className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first project to start organizing your tasks
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;