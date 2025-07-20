import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Plus,
  Calendar,
  Target,
  Zap,
  Award,
} from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function DashboardPage() {
  const { tasks, projects } = useTaskStore();
  const { openModal } = useUIStore();
  const { user } = useAuthStore();

  const completedTasks = tasks.filter(task => task.completed);
  const overdueTasks = tasks.filter(task => !task.completed && task.dueDate && new Date(task.dueDate) < new Date());
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const today = new Date();
    return due.toDateString() === today.toDateString();
  });
  const upcomingTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const now = new Date();
    const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return !task.completed && due >= now && due <= future;
  });

  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Completed',
      value: completedTasks.length,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Due Today',
      value: todayTasks.length,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Overdue',
      value: overdueTasks.length,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  const recentTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const upcomingDeadlines = tasks
    .filter(task => !task.completed && task.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

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
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

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

  return (
    <motion.div
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Welcome Section */}
      <motion.div variants={item} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your tasks today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={item}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <Card key={stat.title} className="hover:shadow-card transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Progress Section */}
      <motion.div variants={item}>
        <Card className="bg-gradient-primary text-white shadow-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Overall Progress</h3>
                <p className="text-white/80">
                  You've completed {completedTasks.length} out of {totalTasks} tasks
                </p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-2xl font-bold">{completionRate}%</span>
              </div>
            </div>
            <Progress value={completionRate} className="bg-white/20" />
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Tasks */}
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Recent Tasks
                </CardTitle>
                <CardDescription>Your latest task activity</CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => openModal('createTask')}
                className="bg-gradient-primary hover:bg-gradient-accent text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className={getPriorityColor(task.priority)}
                        >
                          {task.priority}
                        </Badge>
                        {task.projectId && (
                          <Badge variant="outline">
                            {projects.find(p => p.id === task.projectId)?.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {task.dueDate && (
                      <div className="text-sm text-muted-foreground">
                        {formatDate(task.dueDate)}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks yet. Create your first task to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-warning" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>Tasks due in the next 7 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className={getPriorityColor(task.priority)}
                        >
                          {task.priority}
                        </Badge>
                        {task.projectId && (
                          <Badge variant="outline">
                            {projects.find(p => p.id === task.projectId)?.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {formatDate(task.dueDate!)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming deadlines. You're all caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to boost your productivity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary"
                onClick={() => openModal('createTask')}
              >
                <Plus className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">Create Task</div>
                  <div className="text-xs text-muted-foreground">Add a new task</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/5 hover:border-accent"
                onClick={() => openModal('createProject')}
              >
                <Target className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">New Project</div>
                  <div className="text-xs text-muted-foreground">Start a project</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-success/5 hover:border-success"
              >
                <TrendingUp className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">View Analytics</div>
                  <div className="text-xs text-muted-foreground">Track progress</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}