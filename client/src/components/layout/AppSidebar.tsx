import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  Target,
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const mainNavItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    color: 'text-primary',
  },
  {
    title: 'Tasks',
    url: '/tasks',
    icon: CheckSquare,
    color: 'text-accent',
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: FolderOpen,
    color: 'text-success',
  },
  {
    title: 'Calendar',
    url: '/calendar',
    icon: Calendar,
    color: 'text-warning',
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: BarChart3,
    color: 'text-purple-500',
  },
];

const secondaryNavItems = [
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
    color: 'text-muted-foreground',
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { openModal } = useUIStore();
  const collapsed = state === 'collapsed';

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-primary text-primary-foreground shadow-md'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
    }`;

  return (
    <Sidebar className="border-r border-border/40 bg-card/50 backdrop-blur-sm">
      <SidebarContent className="p-4">
        {/* Logo Section */}
        <div className="mb-8 px-3">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-xl font-bold text-foreground">TaskFlow</h1>
                <p className="text-xs text-muted-foreground">Pro Edition</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <Button
            onClick={() => openModal('createTask')}
            className="w-full bg-gradient-primary hover:bg-gradient-accent text-white shadow-glow"
            size={collapsed ? 'icon' : 'default'}
          >
            <Plus className="w-4 h-4" />
            {!collapsed && <span className="ml-2">New Task</span>}
          </Button>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground mb-3">
            {!collapsed ? 'Main' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={navLinkClass}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={navLinkClass}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}