import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Filter } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';

const CalendarPage = () => {
  const { tasks, projects, updateTask } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'week'>('month');
  const [filterProject, setFilterProject] = useState<string>('all');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date) && (filterProject === 'all' || task.projectId === filterProject);
    });
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getProjectColor = (projectId?: string) => {
    if (!projectId) return '#6B7280';
    const project = projects.find(p => p.id === projectId);
    return project?.color || '#6B7280';
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your tasks in calendar format
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by project" />
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
          
          <Select value={view} onValueChange={(value: 'month' | 'week') => setView(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {format(currentDate, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={prevMonth}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  const dayTasks = getTasksForDate(date);
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  const isCurrentDay = isToday(date);
                  
                  return (
                    <div
                      key={index}
                      className={`
                        min-h-24 p-2 border rounded-lg cursor-pointer transition-colors
                        ${isSelected ? 'bg-primary/10 border-primary' : 'border-border hover:bg-muted/50'}
                        ${isCurrentDay ? 'bg-blue-50 border-blue-200' : ''}
                        ${!isSameMonth(date, currentDate) ? 'opacity-50' : ''}
                      `}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className={`
                        text-sm font-medium mb-1
                        ${isCurrentDay ? 'text-blue-600' : 'text-foreground'}
                      `}>
                        {format(date, 'd')}
                      </div>
                      
                      <div className="space-y-1">
                        {dayTasks.slice(0, 3).map(task => (
                          <div
                            key={task.id}
                            className={`
                              text-xs p-1 rounded truncate
                              ${task.completed ? 'bg-green-100 text-green-700 line-through' : 'bg-primary/10 text-primary'}
                            `}
                            style={{
                              backgroundColor: task.completed ? undefined : `${getProjectColor(task.projectId)}20`,
                              color: task.completed ? undefined : getProjectColor(task.projectId)
                            }}
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayTasks.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Details Sidebar */}
        <div className="space-y-6">
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(selectedDate, 'EEEE, MMM d')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateTasks.length === 0 ? (
                  <div className="text-center py-6">
                    <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      No tasks scheduled for this day
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateTasks.map(task => (
                      <div
                        key={task.id}
                        className={`
                          p-3 border rounded-lg space-y-2
                          ${task.completed ? 'bg-muted/50' : 'bg-background'}
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`
                              font-medium text-sm
                              ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}
                            `}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateTask(task.id, { completed: !task.completed })}
                            className="ml-2"
                          >
                            <div className={`
                              w-4 h-4 rounded border-2
                              ${task.completed ? 'bg-green-500 border-green-500' : 'border-muted-foreground'}
                            `}>
                              {task.completed && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <div className={`w-2 h-2 rounded-full mr-1 ${getPriorityColor(task.priority)}`} />
                            {task.priority}
                          </Badge>
                          
                          {task.projectId && (
                            <Badge variant="outline" className="text-xs">
                              <div 
                                className="w-2 h-2 rounded-full mr-1"
                                style={{ backgroundColor: getProjectColor(task.projectId) }}
                              />
                              {projects.find(p => p.id === task.projectId)?.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Today's Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const todayTasks = getTasksForDate(new Date());
                const completed = todayTasks.filter(t => t.completed).length;
                const total = todayTasks.length;
                
                return (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {completed}/{total}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Tasks completed
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {total > 0 ? Math.round((completed / total) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;