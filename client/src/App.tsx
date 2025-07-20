import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { TasksPage } from "@/pages/TasksPage";
import ProjectsPage from "@/pages/ProjectsPage";
import CalendarPage from "@/pages/CalendarPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SettingsPage from "@/pages/SettingsPage";
import { CreateTaskModal } from "@/components/modals/CreateTaskModal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CreateTaskModal />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Auth routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          
          {/* Protected app routes */}
          <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/tasks" element={<AppLayout><TasksPage /></AppLayout>} />
          <Route path="/projects" element={<AppLayout><ProjectsPage /></AppLayout>} />
          <Route path="/calendar" element={<AppLayout><CalendarPage /></AppLayout>} />
          <Route path="/analytics" element={<AppLayout><AnalyticsPage /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
