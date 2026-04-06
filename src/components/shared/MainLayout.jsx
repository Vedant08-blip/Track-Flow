import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  Kanban, 
  CalendarRange, 
  History as GanttIcon, 
  Briefcase,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  User as UserIcon,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/helpers';

const SidebarItem = ({ to, icon: Icon, label, collapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-slate-400 hover:bg-slate-800 hover:text-white",
      isActive && "bg-primary text-white shadow-lg shadow-primary/20",
      collapsed && "justify-center px-0"
    )}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
  </NavLink>
);

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
  ];

  const filteredNavItems = navItems.filter(item => !item.roles || item.roles.includes(user?.role));

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-sidebar text-white p-4 transition-all duration-300 flex flex-col z-50 shadow-2xl",
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
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 absolute -right-3 top-10 bg-sidebar border border-slate-700 md:flex hidden"
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
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Role</div>
              <div className="text-sm font-medium text-primary-flow">{user?.role}</div>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-surface border-b border-gray-200 flex items-center justify-between px-6 z-40 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500">
              <Menu size={20} />
            </button>
            <div className="relative max-w-md w-full md:flex hidden group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search stories, tasks, defects..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-surface animate-pulse"></span>
            </button>
            
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
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
