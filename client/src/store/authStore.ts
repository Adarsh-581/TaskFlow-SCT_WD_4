import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, LoginCredentials, RegisterCredentials } from '@/types';
import { apiFetch } from '@/lib/api';

interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiFetch<{ user: User; token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
          });
          set({
            user: response.user,
            token: response.token,
            isLoading: false,
          });
          localStorage.setItem('token', response.token);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const { confirmPassword, ...registerData } = credentials;
          const response = await apiFetch<{ user: User; token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(registerData),
          });
          set({
            user: response.user,
            token: response.token,
            isLoading: false,
          });
          localStorage.setItem('token', response.token);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          error: null,
        });
        localStorage.removeItem('token');
      },

      refreshAuthToken: async () => {
        // Implement refresh logic if backend supports it
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              ...updates,
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);