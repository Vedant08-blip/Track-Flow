import React, { useState, useEffect } from 'react';
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
  Moon,
  Palette,
  Zap,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useProject } from '../../context/ProjectContext';
import { useCollaboration } from '../../context/CollaborationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/helpers';
import AmbientBackground from './AmbientBackground';
import { PageWrapper } from './UIComponents';
import { X as CloseIcon } from 'lucide-react';
import ThemeCustomizer from './ThemeCustomizer';
import MentionsNotifications from './MentionsNotifications';
import UserOnboardingWizard from './UserOnboardingWizard';
import AvatarSelector from './AvatarSelector';
const SidebarItem = ({ to, icon: Icon, label, collapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-slate-500 dark:text-slate-400 hover:bg-slate-800 hover:text-white",
      isActive && "bg-primary text-white shadow-lg shadow-primary/20",
      collapsed && "justify-center px-0"
    )}
  >
    <Icon className="w-5 h-5 shrink-0" />
    {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
  </NavLink>
);
{/* Navbar Component */ }
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [showMentionsModal, setShowMentionsModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSkillsWizard, setShowSkillsWizard] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { searchTerm, setSearchTerm } = useProject();
  const { getUnreadMentions } = useCollaboration();
  const navigate = useNavigate();
  const location = useLocation();

  // Load saved avatar from localStorage on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('trackflow_selected_avatar');
    if (savedAvatar) {
      try {
        setSelectedAvatar(JSON.parse(savedAvatar));
      } catch (error) {
        console.error('Failed to parse saved avatar:', error);
      }
    }
  }, []);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New story assigned', message: 'You were assigned to "Implement Login UI"', time: '2m ago', read: false },
    { id: 2, title: 'Sprint started', message: 'Sprint 14 has officially started', time: '1h ago', read: false },
    { id: 3, title: 'Mentioned you', message: 'Alex mentioned you in a comment', time: '2h ago', read: true },
  ]);

  const unreadMentions = getUnreadMentions();
  const unreadCount = notifications.filter(n => !n.read).length + unreadMentions.length;

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
    { to: '/chat', icon: MessageSquare, label: 'Team Chat' },
    { to: '/features', icon: Zap, label: 'Features' },
  ];

  const filteredNavItems = navItems.filter(item => !item.roles || item.roles.includes(user?.role));

  return (
    <div className="flex h-screen overflow-hidden bg-background dark:bg-slate-950 relative flex-col lg:flex-row">
      <AmbientBackground />
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileMenu(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar dark:bg-slate-900/90 dark:border-r dark:border-slate-800 text-white p-4 transition-all duration-300 flex flex-col z-50 shadow-2xl relative backdrop-blur-xl",
          "fixed lg:relative left-0 top-0 h-screen lg:h-auto",
          showMobileMenu ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 w-64",
          collapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        <div className="flex items-center justify-between mb-8 px-2 overflow-hidden">
          {!collapsed && (
            <div className="flex items-center gap-3 text-white">
              <img src="/favicon.svg" alt="TrackFlow Logo" className="w-8 h-8 rounded-full object-cover" />
              <span className="font-bold text-lg">TrackFlow</span>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto">
              <img src="/favicon.svg" alt="TrackFlow Logo" className="w-8 h-8 rounded-full object-cover" />
            </div>
          )}
          <button
            onClick={() => {
              setCollapsed(!collapsed);
              setShowMobileMenu(false);
            }}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-500 dark:text-slate-400 absolute -right-3 top-10 bg-sidebar border border-slate-700 hidden lg:flex"
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
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Role</div>
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
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative lg:flex-1">
        {/* Top Navbar */}
        <header className="h-14 lg:h-16 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6 z-40 sticky top-0 shadow-sm shadow-slate-100 dark:shadow-none">
          <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 dark:text-slate-400 shrink-0"
            >
              <Menu size={20} />
            </button>
            <div className="relative max-w-sm lg:max-w-md w-full hidden sm:flex group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors shrink-0" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-8 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary dark:focus:ring-primary/20 dark:text-white transition-all text-sm backdrop-blur-sm"
              />
              {searchTerm && (                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors shrink-0"
                >
                  <CloseIcon size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors flex items-center justify-center shrink-0"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="moon" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={18} />
                  </motion.div>
                ) : (
                  <motion.div key="sun" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Theme Customizer Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowThemeCustomizer(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-full transition-colors hidden sm:flex items-center justify-center shrink-0"
              title="Customize theme"
            >
              <Palette size={18} />
            </motion.button>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

            <div className="relative shrink-0">
              <button
                onClick={() => setShowMentionsModal(true)}
                className="relative p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-full transition-colors focus:ring-2 focus:ring-primary/50 outline-none"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900 animate-pulse"></span>
                )}
              </button>
            </div>

            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

            {/* Enhanced Profile Section */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSkillsWizard(true)}
              className="relative hidden sm:flex items-center gap-2.5 px-5 py-2.5 ml-2 rounded-xl transition-all duration-300 overflow-hidden group"
              title="Complete your profile and add skills"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/80 to-primary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Shine effect on hover */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute inset-0 translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative flex items-center gap-2.5 z-10">
                <div className="relative">
                  <UserIcon size={18} className="text-white font-bold" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-white leading-tight">Complete Profile</span>
                  <span className="text-[10px] text-white/80 font-medium">Add skills & links</span>
                </div>
              </div>

              {/* Decorative background glow */}
              <div className="absolute inset-0 rounded-xl bg-primary/30 group-hover:bg-primary/50 blur-lg transition-all duration-300 -z-10 group-hover:scale-110"></div>

              {/* Static background */}
              <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/80 to-primary/90 rounded-xl -z-20"></div>
            </motion.button>

            {/* Profile Avatar with Enhanced Styling */}
            <div className="relative group shrink-0 ml-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowAvatarSelector(true)}
                className="w-10 h-10 rounded-xl overflow-hidden ring-3 ring-primary/40 group-hover:ring-primary/70 transition-all cursor-pointer bg-linear-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-800 p-0.5 shadow-lg hover:shadow-xl duration-300"
              >
                <img 
                  src={selectedAvatar?.file || user?.avatar} 
                  alt={selectedAvatar?.name || user?.name} 
                  className="w-full h-full object-cover rounded-lg" 
                />
              </motion.button>
              
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <PageWrapper key={location.pathname}>
              <Outlet />
            </PageWrapper>
          </AnimatePresence>
        </main>
      </div>

      {/* Theme Customizer Modal */}
      <ThemeCustomizer isOpen={showThemeCustomizer} onClose={() => setShowThemeCustomizer(false)} />

      {/* Mentions & Notifications Modal */}
      <MentionsNotifications isOpen={showMentionsModal} onClose={() => setShowMentionsModal(false)} />

      {/* Skills & Profile Wizard */}
      <UserOnboardingWizard isOpen={showSkillsWizard} onClose={() => setShowSkillsWizard(false)} selectedAvatar={selectedAvatar} />

      {/* Avatar Selector Modal */}
      <AvatarSelector
        isOpen={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        onSelect={(avatar) => {
          console.log('Avatar selected:', avatar);
          setSelectedAvatar(avatar);
          localStorage.setItem('trackflow_selected_avatar', JSON.stringify(avatar));
          setShowAvatarSelector(false);
        }}
      />
    </div>
  );
};

export default MainLayout;
