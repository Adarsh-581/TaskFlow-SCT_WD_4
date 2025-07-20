import { useState } from 'react';
import { TrendingUp, Target, Clock, Calendar, Award, BarChart3 } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns';

const AnalyticsPage = () => {
  const { tasks, projects } = useTaskStore();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  // Filter tasks based on selected project and time range
  const getFilteredTasks = () => {
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = subDays(now, daysBack);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      const isInRange = isWithinInterval(taskDate, { start: startDate, end: now });
      const isProjectMatch = selectedProject === 'all' || task.projectId === selectedProject;
      
      return isInRange && isProjectMatch;
    });
  };

  const filteredTasks = getFilteredTasks();
  const completedTasks = filteredTasks.filter(task => task.completed);
  const overdueTasks = filteredTasks.filter(task => 
    !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
  );

  // Completion rate over time
  const getCompletionData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === date.toDateString();
      });
      const dayCompleted = dayTasks.filter(task => task.completed);
      
      data.push({
        date: format(date, 'MMM dd'),
        completed: dayCompleted.length,
        total: dayTasks.length,
        completionRate: dayTasks.length > 0 ? (dayCompleted.length / dayTasks.length) * 100 : 0
      });
    }
    
    return data;
  };

  // Priority distribution
  const getPriorityData = () => {
    const priorityCounts = filteredTasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'High', value: priorityCounts.high || 0, color: '#EF4444' },
      { name: 'Medium', value: priorityCounts.medium || 0, color: '#F59E0B' },
      { name: 'Low', value: priorityCounts.low || 0, color: '#10B981' }
    ];
  };

  // Project statistics
  const getProjectStats = () => {
    return projects.map(project => {
      const projectTasks = filteredTasks.filter(task => task.projectId === project.id);
      const completed = projectTasks.filter(task => task.completed).length;
      
      return {
        name: project.name,
        total: projectTasks.length,
        completed,
        completionRate: projectTasks.length > 0 ? (completed / projectTasks.length) * 100 : 0,
        color: project.color
      };
    });
  };

  // Calculate streaks
  const calculateStreak = () => {
    const sortedCompletedTasks = completedTasks
      .filter(task => task.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

    let currentStreak = 0;
    let maxStreak = 0;
    let lastDate: Date | null = null;

    for (const task of sortedCompletedTasks) {
      const taskDate = new Date(task.completedAt!);
      
      if (!lastDate) {
        currentStreak = 1;
        lastDate = taskDate;
      } else {
        const daysDiff = Math.floor((lastDate.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 1) {
          currentStreak++;
        } else {
          maxStreak = Math.max(maxStreak, currentStreak);
          currentStreak = 1;
        }
        
        lastDate = taskDate;
      }
    }
    
    return Math.max(maxStreak, currentStreak);
  };

  const completionData = getCompletionData();
  const priorityData = getPriorityData();
  const projectStats = getProjectStats();
  const currentStreak = calculateStreak();

  // Calculate productivity score
  const productivityScore = (() => {
    if (filteredTasks.length === 0) return 0;
    
    const completionRate = (completedTasks.length / filteredTasks.length) * 100;
    const onTimeRate = completedTasks.filter(task => 
      !task.dueDate || new Date(task.completedAt!) <= new Date(task.dueDate)
    ).length / Math.max(completedTasks.length, 1) * 100;
    
    return Math.round((completionRate * 0.7) + (onTimeRate * 0.3));
  })();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track your productivity and gain insights into your work patterns
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    {project.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d') => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks.length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredTasks.length > 0 ? Math.round((completedTasks.length / filteredTasks.length) * 100) : 0}%
            </div>
            <Progress 
              value={filteredTasks.length > 0 ? (completedTasks.length / filteredTasks.length) * 100 : 0} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              consecutive days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productivityScore}</div>
            <div className="flex items-center mt-2">
              <Badge variant={productivityScore >= 80 ? "default" : productivityScore >= 60 ? "secondary" : "destructive"}>
                {productivityScore >= 80 ? 'Excellent' : productivityScore >= 60 ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Completion Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Trend</CardTitle>
            <CardDescription>Daily task completion over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {priorityData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Project Performance</CardTitle>
          <CardDescription>Task completion by project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectStats.map((project) => (
              <div key={project.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="font-medium">{project.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {project.completed}/{project.total} ({Math.round(project.completionRate)}%)
                  </div>
                </div>
                <Progress value={project.completionRate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;