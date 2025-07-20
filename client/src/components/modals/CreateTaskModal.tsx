import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useTaskStore } from '@/store/taskStore';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';

export function CreateTaskModal() {
  const { addTask, projects } = useTaskStore();
  const { modals, closeModal } = useUIStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    projectId: '',
    dueDate: undefined as Date | undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !user) return;

    setIsSubmitting(true);
    
    try {
      await addTask({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority,
        status: 'todo',
        projectId: formData.projectId === 'none' ? undefined : formData.projectId || undefined,
        dueDate: formData.dueDate?.toISOString(),
        completed: false,
        tags: [],
        subtasks: [],
        createdBy: user.id,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        projectId: '',
        dueDate: undefined,
      });
      
      closeModal('createTask');
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProjectChange = (value: string) => {
    setFormData({ ...formData, projectId: value === 'none' ? '' : value });
  };

  const validProjects = (projects || []).filter(project => {
    const id = project._id || project.id;
    const strId = String(id);
    return id && strId.trim() !== '' && strId !== 'undefined' && strId !== 'null';
  });

  return (
    <Dialog open={modals.createTask} onOpenChange={() => closeModal('createTask')}>
      <DialogContent className="sm:max-w-md" aria-describedby="create-task-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Task
          </DialogTitle>
        </DialogHeader>

        <div id="create-task-description" className="sr-only">
          Create a new task with title, description, priority, project assignment, and due date
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add more details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Project</Label>
              <Select value={formData.projectId || 'none'} onValueChange={handleProjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Project</SelectItem>
                  {validProjects.map((project) => (
                    <SelectItem key={project._id || project.id} value={String(project._id || project.id)}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => closeModal('createTask')} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.title.trim() || isSubmitting}
              className="flex-1 bg-gradient-primary hover:bg-gradient-accent text-white"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}