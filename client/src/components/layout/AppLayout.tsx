import { useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isDarkMode, setDarkMode } = useUIStore();
  const { user } = useAuthStore();

  // Apply dark mode on mount
  useEffect(() => {
    // Check system preference if not set
    if (!isDarkMode) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [isDarkMode, setDarkMode]);

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          
          <motion.main 
            className="flex-1 p-6 overflow-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  );
}