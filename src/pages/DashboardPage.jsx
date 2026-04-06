import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { getVelocityData, getBurndownData } from '../utils/mockData';
import { motion } from 'framer-motion';
import { cn } from '../utils/helpers';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorVariant = 'primary' }) => {
  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    danger: 'bg-danger/10 text-danger',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-surface p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-2xl", colorMap[colorVariant])}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-bold ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
            {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wider">{title}</div>
      <div className="text-3xl font-bold text-sidebar">{value}</div>
    </motion.div>
  );
};

const DashboardPage = () => {
  const velocityData = getVelocityData();
  const burndownData = getBurndownData();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-3xl font-bold text-sidebar tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time portfolio health & team performance</p>
        </div>
        <div className="flex items-center gap-3 bg-surface p-1.5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md cursor-pointer group">
          <div className="pl-4 pr-2 font-bold text-sm text-slate-600 transition-colors group-hover:text-primary">Q1 2025 Release</div>
          <Calendar className="text-slate-400 group-hover:text-primary transition-colors" size={18} />
          <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-xs font-bold ring-2 ring-primary/5">Active</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Team Velocity" value="42.5" icon={TrendingUp} trend="up" trendValue="+12%" colorVariant="primary" />
        <StatCard title="Stories Completed" value="18" icon={CheckCircle2} trend="up" trendValue="+5" colorVariant="success" />
        <StatCard title="Active Defects" value="4" icon={AlertCircle} trend="down" trendValue="-2" colorVariant="danger" />
        <StatCard title="Team Capacity" value="92%" icon={Activity} trend="up" trendValue="+3%" colorVariant="accent" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Velocity Chart */}
        <div className="bg-surface p-8 rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden relative">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-primary rounded-full"></div>
               <h3 className="text-xl font-bold text-sidebar">Team Velocity</h3>
             </div>
             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last 4 Sprints</div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} dx={-10} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748B' }} />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Legend verticalAlign="top" iconType="circle" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }} />
                <Bar dataKey="planned" name="Planned" fill="#CBD5E1" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="actual" name="Actual" fill="#1B6BF5" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Burndown Chart */}
        <div className="bg-surface p-8 rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden relative">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-accent rounded-full"></div>
               <h3 className="text-xl font-bold text-sidebar">Sprint Burndown</h3>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-success"></div>
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">On Track</span>
             </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={burndownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} dy={10} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} dx={-10} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }} />
                <Legend verticalAlign="top" iconType="circle" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }} />
                <Line type="monotone" dataKey="ideal" name="Ideal Trend" stroke="#CBD5E1" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="actual" name="Actual Remaining" stroke="#0ABFBC" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#FFFFFF' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-surface p-6 rounded-[24px] border border-slate-100 shadow-sm lg:col-span-1">
          <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Users className="text-primary" size={18} />
            Team Allocation
          </h4>
          <div className="space-y-5">
            {[
              { name: 'Team Alpha', progress: 85, color: '#1B6BF5' },
              { name: 'Team Beta', progress: 62, color: '#0ABFBC' },
              { name: 'Team Gamma', progress: 45, color: '#F39C12' }
            ].map(team => (
              <div key={team.name} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-600">{team.name}</span>
                  <span className="font-bold text-slate-900">{team.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${team.progress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full" 
                    style={{ backgroundColor: team.color }}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-primary p-8 rounded-[32px] lg:col-span-2 text-white relative overflow-hidden shadow-xl shadow-primary/20">
           {/* Abstract patterns */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
           <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
           
           <div className="relative z-10 flex flex-col h-full justify-between">
             <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Portfolio Milestone Reached!</h3>
                  <p className="text-white/80 font-medium">Cloud Migration Phase 1 is now 100% complete.</p>
                </div>
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                   <TrendingUp size={24} />
                </div>
             </div>
             <div className="mt-8 flex items-center gap-6">
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 flex-1">
                  <div className="text-white/60 text-xs mb-1 font-bold uppercase tracking-widest">Efficiency</div>
                  <div className="text-2xl font-bold">+18%</div>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 flex-1">
                  <div className="text-white/60 text-xs mb-1 font-bold uppercase tracking-widest">Quality</div>
                  <div className="text-2xl font-bold">99.2%</div>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 flex-1">
                  <div className="text-white/60 text-xs mb-1 font-bold uppercase tracking-widest">Uptime</div>
                  <div className="text-2xl font-bold">4 Nines</div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
