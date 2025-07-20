import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, FilterOptions, ViewSettings } from '@/types';
import { apiFetch } from '@/lib/api';

interface TaskStore {
  tasks: Task[];
  projects: any[];
  filters: FilterOptions;
  viewSettings: ViewSettings;
  selectedTasks: string[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  fetchProjects: () => Promise<void>;
  addProject: (project: { name: string; description?: string }) => Promise<void>;
  updateProject: (id: string, updates: Partial<any>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setFilters: (filters: Partial<FilterOptions>) => void;
  clearFilters: () => void;
  setViewSettings: (settings: Partial<ViewSettings>) => void;
  setSelectedTasks: (taskIds: string[]) => void;
  toggleTaskSelection: (taskId: string) => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      projects: [],
      filters: {},
      viewSettings: {
        sortBy: 'createdAt',
        sortOrder: 'desc',
        showSubtasks: true,
        showDescription: false,
      },
      selectedTasks: [],
      isLoading: false,
      error: null,

      fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
          const tasks = await apiFetch<Task[]>('/tasks');
          set({ tasks, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch tasks', isLoading: false });
        }
      },

      addTask: async (taskData) => {
        set({ isLoading: true, error: null });
        try {
          // Validate required fields
          if (!taskData.title || typeof taskData.title !== 'string' || !taskData.title.trim()) {
            throw new Error('Task title is required');
          }
          
          // Prepare payload
          const payload = { ...taskData };
          // Remove empty projectId
          if (!payload.projectId || payload.projectId === 'none') {
            delete payload.projectId;
          }
          
          const newTask = await apiFetch<any>('/tasks', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
          
          // Normalize backend response to match frontend Task type
          const normalizedTask = {
            ...newTask,
            id: newTask._id || newTask.id,
            projectId: newTask.project || newTask.projectId || undefined,
            subtasks: newTask.subtasks || [],
            completed: newTask.completed || false,
            createdAt: newTask.createdAt || new Date().toISOString(),
            updatedAt: newTask.updatedAt || new Date().toISOString(),
          };
          
          set(state => ({ 
            tasks: [normalizedTask, ...state.tasks], 
            isLoading: false 
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add task', isLoading: false });
          throw error;
        }
      },

      updateTask: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const updatedTask = await apiFetch<any>(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
          });
          
          // Normalize the response
          const normalizedTask = {
            ...updatedTask,
            id: updatedTask._id || updatedTask.id,
            projectId: updatedTask.project || updatedTask.projectId || undefined,
            subtasks: updatedTask.subtasks || [],
          };
          
          set(state => ({
            tasks: state.tasks.map(task => task.id === id ? normalizedTask : task),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update task', isLoading: false });
        }
      },

      deleteTask: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await apiFetch(`/tasks/${id}`, { method: 'DELETE' });
          set(state => ({
            tasks: state.tasks.filter(task => task.id !== id),
            selectedTasks: state.selectedTasks.filter(taskId => taskId !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete task', isLoading: false });
        }
      },

      completeTask: async (id) => {
        // Optimistically update the UI first
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        }));
        
        try {
          const currentTask = get().tasks.find(task => task.id === id);
          if (!currentTask) return;
          
          const completedTask = await apiFetch<any>(`/tasks/${id}/complete`, { 
            method: 'POST' 
          });
          
          // Normalize the response and update with server data
          const normalizedTask = {
            ...completedTask,
            id: completedTask._id || completedTask.id,
            projectId: completedTask.project || completedTask.projectId || undefined,
            subtasks: completedTask.subtasks || [],
          };
          
          set(state => ({
            tasks: state.tasks.map(task => task.id === id ? normalizedTask : task),
            isLoading: false,
          }));
        } catch (error) {
          // Revert the optimistic update on error
          set(state => ({
            tasks: state.tasks.map(task => 
              task.id === id ? { ...task, completed: !task.completed } : task
            ),
            error: error instanceof Error ? error.message : 'Failed to complete task',
            isLoading: false,
          }));
        }
      },

      fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const projects = await apiFetch<any[]>('/projects');
          set({ projects, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch projects', isLoading: false });
        }
      },

      addProject: async (projectData) => {
        set({ isLoading: true, error: null });
        try {
          const newProject = await apiFetch<any>('/projects', {
            method: 'POST',
            body: JSON.stringify(projectData),
          });
          set(state => ({ projects: [newProject, ...state.projects], isLoading: false }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add project', isLoading: false });
        }
      },

      updateProject: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const updatedProject = await apiFetch<any>(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
          });
          set(state => ({
            projects: state.projects.map(project => 
              (project._id || project.id) === id ? updatedProject : project
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update project', isLoading: false });
        }
      },

      deleteProject: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await apiFetch(`/projects/${id}`, { method: 'DELETE' });
          set(state => ({
            projects: state.projects.filter(project => 
              (project._id || project.id) !== id
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete project', isLoading: false });
        }
      },

      setFilters: (filters) => {
        set(state => ({ filters: { ...state.filters, ...filters } }));
      },

      clearFilters: () => {
        set({ filters: {} });
      },

      setViewSettings: (settings) => {
        set(state => ({ viewSettings: { ...state.viewSettings, ...settings } }));
      },

      setSelectedTasks: (taskIds) => {
        set({ selectedTasks: taskIds });
      },

      toggleTaskSelection: (taskId) => {
        set(state => ({
          selectedTasks: state.selectedTasks.includes(taskId)
            ? state.selectedTasks.filter(id => id !== taskId)
            : [...state.selectedTasks, taskId],
        }));
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'task-store',
      partialize: (state) => ({
        tasks: state.tasks,
        filters: state.filters,
        viewSettings: state.viewSettings,
        selectedTasks: state.selectedTasks,
        projects: state.projects,
      }),
    }
  )
);