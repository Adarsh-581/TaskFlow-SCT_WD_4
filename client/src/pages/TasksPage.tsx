import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  CheckCircle2,
  Circle,
  Edit,
  Trash2,
  Copy,
  Clock,
  Flag,
  List,
  Grid3X3,
  CalendarDays,
} from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { useUIStore } from '@/store/uiStore';
import { Task } from '@/types';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function TasksPage() {
  const {
    tasks,
    projects,
    filters,
    viewSettings,
    selectedTasks,
    isLoading,
    error,
    fetchTasks,
    fetchProjects,
    deleteTask,
    completeTask,
    setFilters,
    setViewSettings,
    setSelectedTasks,
    toggleTaskSelection,
    clearError,
  } = useTaskStore();

  const { taskView, setTaskView, openModal } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [fetchTasks, fetchProjects]);

  // Clear error when component unmounts or error changes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Filter and sort tasks
  const filteredTasks = tasks.filter((task) => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
      return false;
    }
    if (filters.status && filters.status.length > 0 && !filters.status.includes(task.status)) {
      return false;
    }
    if (filters.showCompleted === false && task.completed) {
      return false;
    }
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const { sortBy, sortOrder } = viewSettings;
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        break;
      case 'dueDate':
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      default:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <motion.div variants={item}>
      <Card className={`transition-all hover:shadow-card ${task.completed ? 'opacity-75' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => handleCompleteTask(task.id)}
              className="mt-1"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </h3>
                {task.priority && (
                  <Badge
                    variant="secondary"
                    className={`${getPriorityColor(task.priority)} text-xs`}
                  >
                    {task.priority}
                  </Badge>
                )}
              </div>
              
              {task.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span className={new Date(task.dueDate) < new Date() && !task.completed ? 'text-destructive' : ''}>
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                )}
                
                {task.projectId && (
                  <Badge variant="outline" className="text-xs">
                    {projects.find(p => (p._id || p.id) === task.projectId)?.name || 'Unknown Project'}
                  </Badge>
                )}
                
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>
                      {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openModal('editTask', task.id)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="ghost" size="sm" onClick={clearError}>
                ✕
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and organize your tasks efficiently
          </p>
        </div>
        
        <Button
          onClick={() => openModal('createTask')}
          className="bg-gradient-primary hover:bg-gradient-accent text-white shadow-glow"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Priority Filter */}
            <Select
              value={filters.priority?.[0] || 'all'}
              onValueChange={(value) =>
                setFilters({ priority: value === 'all' ? undefined : [value as any] })
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={filters.status?.[0] || 'all'}
              onValueChange={(value) =>
                setFilters({ status: value === 'all' ? undefined : [value as any] })
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={viewSettings.sortBy || 'createdAt'}
              onValueChange={(value) => setViewSettings({ sortBy: value as any })}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="updatedAt">Updated Date</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex rounded-lg border p-1">
              <Button
                variant={taskView === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTaskView('list')}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={taskView === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTaskView('kanban')}
                className="h-8 px-3"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={taskView === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTaskView('calendar')}
                className="h-8 px-3"
              >
                <CalendarDays className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && tasks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tasks...</p>
          </CardContent>
        </Card>
      )}

      {/* Tasks Content */}
      {!isLoading || tasks.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <motion.div variants={item}>
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || Object.keys(filters).length > 0
                      ? 'Try adjusting your filters or search terms.'
                      : "You haven't created any tasks yet. Start by adding your first task!"}
                  </p>
                  <Button
                    onClick={() => openModal('createTask')}
                    className="bg-gradient-primary hover:bg-gradient-accent text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Task
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      ) : null}

      {/* Task Stats */}
      {sortedTasks.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Showing {sortedTasks.length} of {tasks.length} tasks
              </div>
              <div className="flex items-center gap-4">
                <span>
                  {tasks.filter(t => t.completed).length} completed
                </span>
                <span>
                  {tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length} overdue
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}