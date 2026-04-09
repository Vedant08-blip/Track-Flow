import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Kanban,
  CalendarRange,
  History as GanttIcon,
  Briefcase,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  User as UserIcon,
  Menu,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useProject } from '../../context/ProjectContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/helpers';
import AmbientBackground from './AmbientBackground';
import { PageWrapper } from './UIComponents';
import { X as CloseIcon } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, collapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-slate-500 dark:text-slate-400 hover:bg-slate-800 hover:text-white",
      isActive && "bg-primary text-white shadow-lg shadow-primary/20",
      collapsed && "justify-center px-0"
    )}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
  </NavLink>
);
{/* Navbar Component */ }
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { searchTerm, setSearchTerm } = useProject();
  const navigate = useNavigate();
  const location = useLocation();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New story assigned', message: 'You were assigned to "Implement Login UI"', time: '2m ago', read: false },
    { id: 2, title: 'Sprint started', message: 'Sprint 14 has officially started', time: '1h ago', read: false },
    { id: 3, title: 'Mentioned you', message: 'Alex mentioned you in a comment', time: '2h ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/backlog', icon: Layers, label: 'Backlog' },
    { to: '/board', icon: Kanban, label: 'Board' },
    { to: '/planning', icon: CalendarRange, label: 'Planning', roles: ['Admin', 'Scrum Master'] },
    { to: '/timeline', icon: GanttIcon, label: 'Timeline' },
    { to: '/portfolio', icon: Briefcase, label: 'Portfolio' },
    { to: '/reports', icon: FileText, label: 'Reports' },
  ];

  const filteredNavItems = navItems.filter(item => !item.roles || item.roles.includes(user?.role));

  return (
    <div className="flex h-screen overflow-hidden bg-background dark:bg-slate-950 relative">
      <AmbientBackground />
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar dark:bg-slate-900/90 dark:border-r dark:border-slate-800 text-white p-4 transition-all duration-300 flex flex-col z-50 shadow-2xl relative backdrop-blur-xl",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex items-center justify-between mb-8 px-2 overflow-hidden">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-lg">T</div>
              <h1 className="text-xl font-bold tracking-tight">TrackFlow</h1>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-xl mx-auto">T</div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-500 dark:text-slate-400 absolute -right-3 top-10 bg-sidebar border border-slate-700 md:flex hidden"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {filteredNavItems.map(item => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-800 pt-4 px-2">
          {!collapsed && (
            <div className="mb-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <div className="text-xs text-slate-500 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Role</div>
              <div className="text-sm font-medium text-primary-flow">{user?.role}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800 flex items-center justify-between px-6 z-40 sticky top-0 shadow-sm shadow-slate-100 dark:shadow-none">
          <div className="flex items-center gap-4 flex-1">
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500">
              <Menu size={20} />
            </button>
            <div className="relative max-w-md w-full md:flex hidden group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search stories, tasks, defects..."
                className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary dark:focus:ring-primary/20 dark:text-white transition-all text-sm backdrop-blur-sm"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                >
                  <CloseIcon size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="moon" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="sun" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors focus:ring-2 focus:ring-primary/50 outline-none"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-4 w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden z-50 text-left"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between relative z-10">
                      <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto relative z-10">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            onClick={() => {
                              setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
                            }}
                            className={cn(
                              "px-4 py-3 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors",
                              !notification.read ? "bg-primary/5 border-l-2 border-l-primary" : "border-l-2 border-l-transparent"
                            )}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className={cn("text-sm font-semibold", !notification.read ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400")}>
                                {notification.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">{notification.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{notification.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-sm text-slate-500 font-medium">
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 text-center relative z-10">
                      <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-px bg-gray-200 mx-1"></div>

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right flex flex-col md:flex hidden">
                <span className="text-sm font-semibold text-gray-900 leading-tight">{user?.name}</span>
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-tighter">Premium Account</span>
              </div>
              <div className="relative group">
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all cursor-pointer bg-gray-100 p-0.5">
                  <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <PageWrapper key={location.pathname}>
              <Outlet />
            </PageWrapper>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
