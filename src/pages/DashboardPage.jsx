import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  X,
  Info
} from 'lucide-react';
import { getVelocityData, getBurndownData } from '../utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { InfoTooltip } from '../components/shared/UIComponents';
import AppGuideModal from '../components/shared/AppGuideModal';
import { useProject } from '../context/ProjectContext';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorVariant = 'primary' }) => {
  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-emerald-500/10 text-emerald-500',
    danger: 'bg-rose-500/10 text-rose-500',
    accent: 'bg-teal-500/10 text-teal-500',
  };

  const trendColor = trend === 'up' && colorVariant !== 'danger' ? 'text-emerald-500' : 'text-rose-500';

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-[24px] border border-white/50 dark:border-slate-800/50 shadow-lg shadow-slate-200/20 dark:shadow-none flex flex-col relative overflow-hidden"
    >
      {/* Subtle top glare effect for glass */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/5"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`p-4 rounded-[18px] ${colorMap[colorVariant]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-bold ${trendColor} bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/50 px-2.5 py-1 rounded-full backdrop-blur-md`}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-1 uppercase tracking-widest relative z-10">{title}</div>
      <div className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight relative z-10">{value}</div>
    </motion.div>
  );
};

const DashboardPage = () => {
  const { 
    stories, 
    iterations, 
    teams, 
    searchTerm, 
    activeFilters 
  } = useProject();
  
  const [showBanner, setShowBanner] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // 1. Dynamic Filtering for all Dashboard Data
  const filteredStories = stories.filter(s => {
    const matchSearch = !searchTerm || 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchPriorityFilter = activeFilters.priority.length === 0 || 
      activeFilters.priority.includes(s.priority);
      
    const matchGlobalTeam = !activeFilters.teamId || s.teamId === activeFilters.teamId;

    return matchSearch && matchPriorityFilter && matchGlobalTeam;
  });

  // 2. Metrics Calculations
  const storiesCompleted = filteredStories.filter(s => ['Completed', 'Accepted'].includes(s.status)).length;
  const activeDefects = filteredStories.filter(s => s.id.startsWith('DE-') && s.status !== 'Accepted').length;
  
  // Velocity Calculation (Average points per iteration)
  const acceptedStories = filteredStories.filter(s => s.status === 'Accepted');
  const totalPoints = acceptedStories.reduce((acc, s) => acc + (s.points || 0), 0);
  const avgVelocity = iterations.length > 0 ? (totalPoints / iterations.length).toFixed(1) : 0;

  // Capacity / Allocation (Current iteration vs Team Capacity)
  // Let's take the first active iteration for the preview
  const currentIteration = iterations[0];
  const iterationStories = filteredStories.filter(s => s.iterationId === currentIteration?.id);
  const committedPoints = iterationStories.reduce((acc, s) => acc + (s.points || 0), 0);
  const capacityLoad = currentIteration ? Math.round((committedPoints / currentIteration.capacity) * 100) : 0;

  // 3. Chart Data Generation
  const dynamicVelocityData = iterations.slice(0, 4).map(it => {
    const itStories = filteredStories.filter(s => s.iterationId === it.id);
    const planned = it.capacity || 0;
    const actual = itStories
      .filter(s => ['Completed', 'Accepted'].includes(s.status))
      .reduce((acc, s) => acc + (s.points || 0), 0);
    
    return { name: it.name, planned, actual };
  });

  const dynamicBurndownData = Array.from({ length: 10 }).map((_, i) => {
    const day = `Day ${i + 1}`;
    const ideal = Math.max(0, 100 - (i * 10)); // Fixed 10 day ideal trend
    // Calculate actual remaining points based on stories current completion
    const totalSprintPoints = iterationStories.reduce((acc, s) => acc + (s.points || 0), 0);
    const finishedPoints = iterationStories
      .filter(s => ['Completed', 'Accepted'].includes(s.status))
      .reduce((acc, s) => acc + (s.points || 0), 0);
    
    // Simulate a decline for the chart beauty
    const progressFactor = finishedPoints / (totalSprintPoints || 1);
    const actual = Math.max(0, totalSprintPoints - (totalSprintPoints * progressFactor * (i / 10)));
    
    return { day, ideal, actual: Math.round(actual) };
  });

  return (
    <div className="relative min-h-screen">
      <div className="space-y-8 max-w-7xl mx-auto pb-10 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-2">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Executive Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Real-time portfolio health & team performance</p>
          </div>
          <div className="flex items-center gap-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm transition-all hover:shadow-md cursor-pointer group">
            <div className="pl-4 pr-2 font-bold text-sm text-slate-600 dark:text-slate-300 transition-colors group-hover:text-primary">Q1 2025 Release</div>
            <Calendar className="text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors" size={18} />
            <div className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 px-3 py-1.5 rounded-xl text-xs font-bold ring-2 ring-primary/10">ACTIVE</div>
          </div>
        </div>

        {/* Premium Welcome Banner */}
        <AnimatePresence>
          {showBanner && (
            <motion.div 
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-br from-primary/90 to-[#061229] dark:from-[#0F2557] dark:to-[#061229] p-8 rounded-[32px] relative overflow-hidden shadow-2xl shadow-primary/20 border border-white/10 dark:border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-6 mt-2">
                {/* Abstract glare elements */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-[20%] w-48 h-48 bg-accent/20 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="relative z-10 text-white max-w-3xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">
                      Welcome to the TrackFlow Executive Dashboard
                    </h3>
                  </div>
                  <p className="text-white/80 text-[15px] font-medium leading-relaxed">
                    TrackFlow provides a comprehensive overview of your agile portfolio's performance. The metrics below offer real-time insights into your team's progress and project health. For detailed explanations of the terminology and reporting metrics used throughout the application, please consult the <button onClick={() => setIsGuideOpen(true)} className="inline-flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors px-2 py-0.5 rounded-lg mx-1 font-bold text-white shadow-sm ring-1 ring-white/40 cursor-pointer hover:scale-105 active:scale-95"><Info size={14} className="mr-1" /> Guide</button>.
                  </p>
                </div>
                
                <div className="relative z-10 flex items-center gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => setIsGuideOpen(true)}
                    className="flex-1 md:flex-none px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg shadow-white/10 whitespace-nowrap"
                  >
                    Open Full Guide
                  </button>
                  <button 
                    onClick={() => setShowBanner(false)}
                    className="p-3 bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-xl transition-colors backdrop-blur-md"
                    title="Dismiss Banner"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Team Velocity" value={avgVelocity} icon={TrendingUp} trend="up" trendValue="+12%" colorVariant="primary" />
          <StatCard title="Stories Completed" value={storiesCompleted} icon={CheckCircle2} trend="up" trendValue="+5" colorVariant="success" />
          <StatCard title="Active Defects" value={activeDefects} icon={AlertCircle} trend={activeDefects > 5 ? "up" : "down"} trendValue={activeDefects} colorVariant="danger" />
          <StatCard title="Capacity Load" value={`${capacityLoad}%`} icon={Activity} trend={capacityLoad > 90 ? "up" : "down"} trendValue={capacityLoad > 100 ? "OVER" : "SAFE"} colorVariant="accent" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Velocity Chart */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-8 rounded-[32px] border border-white/50 dark:border-slate-800/50 shadow-lg shadow-slate-200/20 dark:shadow-none overflow-hidden relative flex flex-col text-slate-900 dark:text-slate-100">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/5"></div>
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                 <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                   Team Velocity
                   <InfoTooltip content="Velocity measures how much work your team typically completes in a single sprint. It helps accurately predict how much you can handle in the future." />
                 </h3>
               </div>
               <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-white/40 dark:border-slate-700/50">Last 4 Sprints</div>
            </div>
            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={dynamicVelocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} dx={-10} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748B' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                    contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px', backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', color: '#0f172a' }}
                  />
                  <Legend verticalAlign="top" iconType="circle" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }} />
                  <Bar dataKey="planned" name="Planned" fill="#cbd5e1" radius={[6, 6, 0, 0]} barSize={24} />
                  <Bar dataKey="actual" name="Actual" fill="#1B6BF5" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Burndown Chart */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-8 rounded-[32px] border border-white/50 dark:border-slate-800/50 shadow-lg shadow-slate-200/20 dark:shadow-none overflow-hidden relative flex flex-col text-slate-900 dark:text-slate-100">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/5"></div>
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-teal-500 rounded-full"></div>
                 <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                   Sprint Burndown
                   <InfoTooltip content="Shows work remaining over the sprint. The solid line is actual work left; the dashed line is the ideal pace. If actual is below ideal, you're ahead of schedule!" />
                 </h3>
               </div>
               <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-white/40 dark:border-slate-700/50">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                 <span className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest">On Track</span>
               </div>
            </div>
            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={dynamicBurndownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} dy={10} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} dx={-10} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px', backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', color: '#0f172a' }} />
                  <Legend verticalAlign="top" iconType="circle" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }} />
                  <Line type="monotone" dataKey="ideal" name="Ideal Trend" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="actual" name="Actual Remaining" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#FFFFFF' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

         {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-8 rounded-[32px] border border-white/50 dark:border-slate-800/50 shadow-lg shadow-slate-200/20 dark:shadow-none lg:col-span-1 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/5"></div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-[14px]">
                <Users className="text-primary" size={20} />
              </div>
              Team Allocation
              <InfoTooltip content="Shows how much of each team's maximum capacity is currently assigned to active items." position="left" />
            </h4>
            <div className="space-y-7">
              {teams.map(team => {
                const teamStories = filteredStories.filter(s => s.teamId === team.id);
                const teamPoints = teamStories.reduce((acc, s) => acc + (s.points || 0), 0);
                const teamCapacity = 40; // Default mock capacity since teams don't have individual limits yet
                const teamProgress = Math.min(Math.round((teamPoints / teamCapacity) * 100), 100);
                const bgClass = team.id === 'team-1' ? 'bg-blue-100 dark:bg-blue-900/30' : team.id === 'team-2' ? 'bg-teal-100 dark:bg-teal-900/30' : 'bg-amber-100 dark:bg-amber-900/30';
                
                return (
                  <div key={team.id} className="space-y-3">
                    <div className="flex justify-between items-end text-sm">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">{team.name}</span>
                      <span className="font-bold text-slate-900 dark:text-white text-base">{teamProgress}%</span>
                    </div>
                    <div className={`h-2 ${bgClass} rounded-full overflow-hidden`}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${teamProgress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full rounded-full relative" 
                        style={{ backgroundColor: team.color }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full"></div>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#0F2557] to-[#061229] p-10 rounded-[32px] lg:col-span-2 text-white relative overflow-hidden shadow-2xl shadow-primary/20 border border-white/10">
             {/* Abstract glassmorphic patterns */}
             <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
             <div className="absolute bottom-[-50px] left-[20%] w-48 h-48 bg-teal-400/10 rounded-full blur-2xl"></div>
             
             <div className="relative z-10 flex flex-col h-full justify-between">
               <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-3xl flex items-center gap-3 font-bold mb-2 tracking-tight text-white hover:text-white transition-colors">
                      Portfolio Milestone Reached! <span className="text-3xl">🎯</span>
                    </h3>
                    <p className="text-white/60 font-medium text-[15px]">Cloud Migration Phase 1 is now 100% complete.</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
                     <TrendingUp size={28} className="text-teal-400" />
                  </div>
               </div>
               <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
                  <div className="p-5 overflow-hidden relative bg-white/5 rounded-[20px] backdrop-blur-xl border border-white/10 flex-1 w-full text-center hover:bg-white/10 transition-colors group">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1.5">Efficiency</div>
                    <div className="text-3xl font-bold text-white">+18%</div>
                  </div>
                  <div className="p-5 overflow-hidden relative bg-white/5 rounded-[20px] backdrop-blur-xl border border-white/10 flex-1 w-full text-center hover:bg-white/10 transition-colors group">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1.5">Quality</div>
                    <div className="text-3xl font-bold text-white">99.2%</div>
                  </div>
                  <div className="p-5 overflow-hidden relative bg-white/5 rounded-[20px] backdrop-blur-xl border border-white/10 flex-1 w-full text-center hover:bg-white/10 transition-colors group">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1.5">Uptime</div>
                    <div className="text-3xl font-bold text-white">4 Nines</div>
                  </div>
               </div>
              </div>
           </div>
        </div>
      </div>
      
      {/* App Guide Modal */}
      <AppGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

export default DashboardPage;