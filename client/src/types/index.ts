// Core types for the task management application

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  defaultView: 'list' | 'kanban' | 'calendar';
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  reminders: boolean;
  deadlines: boolean;
  teamUpdates: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done' | 'cancelled';
  dueDate?: string;
  reminderDate?: string;
  tags: string[];
  projectId?: string;
  assignedTo?: string[];
  createdBy: string;
  subtasks: SubTask[];
  recurring?: RecurringConfig;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface RecurringConfig {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[]; // for weekly
  dayOfMonth?: number; // for monthly
  endDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  ownerId: string;
  members: ProjectMember[];
  settings: ProjectSettings;
  stats: ProjectStats;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

export interface ProjectSettings {
  isPublic: boolean;
  allowGuests: boolean;
  defaultTaskPriority: 'low' | 'medium' | 'high';
  autoArchiveCompleted: boolean;
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
  averageCompletionTime: number; // in hours
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  projectId?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  type: 'task_created' | 'task_updated' | 'task_completed' | 'project_created' | 'member_added';
  description: string;
  userId: string;
  taskId?: string;
  projectId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'deadline' | 'assignment' | 'completion' | 'system';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  userId: string;
  createdAt: string;
}

export interface Analytics {
  userId: string;
  period: 'day' | 'week' | 'month' | 'year';
  tasksCompleted: number;
  tasksCreated: number;
  productivityScore: number;
  streakDays: number;
  totalTimeLogged: number; // in minutes
  averageTaskCompletionTime: number; // in minutes
  completionRate: number;
  topTags: { tag: string; count: number }[];
  topProjects: { project: string; count: number }[];
  dailyStats: DailyStats[];
}

export interface DailyStats {
  date: string;
  tasksCompleted: number;
  timeLogged: number; // in minutes
  productivityScore: number;
}

export interface FilterOptions {
  search?: string;
  priority?: ('low' | 'medium' | 'high')[];
  status?: ('todo' | 'in-progress' | 'done' | 'cancelled')[];
  tags?: string[];
  projects?: string[];
  assignedTo?: string[];
  dueDateRange?: {
    start?: string;
    end?: string;
  };
  createdDateRange?: {
    start?: string;
    end?: string;
  };
  showCompleted?: boolean;
  showOverdue?: boolean;
}

export interface ViewSettings {
  groupBy?: 'none' | 'priority' | 'status' | 'project' | 'assignee' | 'dueDate';
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
  showSubtasks?: boolean;
  showDescription?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

// UI State types
export interface UIState {
  sidebarCollapsed: boolean;
  currentView: 'list' | 'kanban' | 'calendar';
  activeProject: string | null;
  selectedTasks: string[];
  isDarkMode: boolean;
  showCompletedTasks: boolean;
  filters: FilterOptions;
  viewSettings: ViewSettings;
}