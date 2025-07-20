import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  // Layout state
  sidebarCollapsed: boolean;
  currentView: 'dashboard' | 'tasks' | 'projects' | 'calendar' | 'analytics' | 'settings';
  taskView: 'list' | 'kanban' | 'calendar';
  isDarkMode: boolean;
  
  // Modal and dialog state
  modals: {
    createTask: boolean;
    editTask: string | null;
    createProject: boolean;
    editProject: string | null;
    settings: boolean;
    confirmDelete: string | null;
  };
  
  // Loading states
  globalLoading: boolean;
  actionLoading: Record<string, boolean>;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    duration?: number;
  }>;
  
  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentView: (view: UIStore['currentView']) => void;
  setTaskView: (view: UIStore['taskView']) => void;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  
  // Modal actions
  openModal: (modal: keyof UIStore['modals'], payload?: string) => void;
  closeModal: (modal: keyof UIStore['modals']) => void;
  closeAllModals: () => void;
  
  // Loading actions
  setGlobalLoading: (loading: boolean) => void;
  setActionLoading: (action: string, loading: boolean) => void;
  
  // Notification actions
  addNotification: (notification: Omit<UIStore['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarCollapsed: false,
      currentView: 'dashboard',
      taskView: 'list',
      isDarkMode: false,
      
      modals: {
        createTask: false,
        editTask: null,
        createProject: false,
        editProject: null,
        settings: false,
        confirmDelete: null,
      },
      
      globalLoading: false,
      actionLoading: {},
      notifications: [],
      
      // Layout actions
      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },
      
      setCurrentView: (view) => {
        set({ currentView: view });
      },
      
      setTaskView: (view) => {
        set({ taskView: view });
      },
      
      toggleDarkMode: () => {
        const { isDarkMode } = get();
        const newMode = !isDarkMode;
        set({ isDarkMode: newMode });
        
        // Apply dark mode to document
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      setDarkMode: (isDark) => {
        set({ isDarkMode: isDark });
        
        // Apply dark mode to document
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      // Modal actions
      openModal: (modal, payload) => {
        set(state => ({
          modals: {
            ...state.modals,
            [modal]: payload || true,
          },
        }));
      },
      
      closeModal: (modal) => {
        set(state => ({
          modals: {
            ...state.modals,
            [modal]: modal === 'editTask' || modal === 'editProject' || modal === 'confirmDelete' ? null : false,
          },
        }));
      },
      
      closeAllModals: () => {
        set({
          modals: {
            createTask: false,
            editTask: null,
            createProject: false,
            editProject: null,
            settings: false,
            confirmDelete: null,
          },
        });
      },
      
      // Loading actions
      setGlobalLoading: (loading) => {
        set({ globalLoading: loading });
      },
      
      setActionLoading: (action, loading) => {
        set(state => ({
          actionLoading: {
            ...state.actionLoading,
            [action]: loading,
          },
        }));
      },
      
      // Notification actions
      addNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification = { ...notification, id };
        
        set(state => ({
          notifications: [...state.notifications, newNotification],
        }));
        
        // Auto-remove notification after duration
        const duration = notification.duration || 5000;
        setTimeout(() => {
          get().removeNotification(id);
        }, duration);
      },
      
      removeNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },
      
      clearNotifications: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        currentView: state.currentView,
        taskView: state.taskView,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);