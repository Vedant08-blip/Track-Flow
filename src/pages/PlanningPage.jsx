import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  CalendarRange, 
  Plus, 
  ChevronRight, 
  Target, 
  Users, 
  TrendingUp,
  MoreVertical,
  Activity,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const PlanningPage = () => {
  const { releases, iterations, teams, stories } = useProject();

  const getIterationStories = (itId) => stories.filter(s => s.iterationId === itId);
  
  const getIterationPoints = (itId) => {
    return getIterationStories(itId).reduce((acc, story) => acc + (story.points || 0), 0);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-3xl font-bold text-sidebar tracking-tight">Capacity Planning</h1>
          <p className="text-slate-500 font-medium mt-1">Allocate work across iterations and releases</p>
        </div>
        <button className="bg-primary text-white px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
          <Plus size={20} />
          Create New Release
        </button>
      </div>

      {/* Planning Grid */}
      <div className="space-y-10">
        {releases.map((release) => (
          <div key={release.id} className="space-y-6">
            <div className="flex items-center gap-4 bg-surface p-4 rounded-3xl border border-slate-100 shadow-sm w-fit group cursor-pointer hover:border-primary/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                   <Target size={20} />
                </div>
                <div>
                   <h2 className="text-lg font-bold text-sidebar leading-tight">{release.name} Release</h2>
                   <div className="text-xs font-bold text-slate-400">{release.startDate} — {release.endDate}</div>
                </div>
                <div className="ml-8 pr-4">
                   <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {iterations.filter(it => it.releaseId === release.id).map((it) => {
                 const points = getIterationPoints(it.id);
                 const capacityPct = Math.round((points / it.capacity) * 100);
                 const isOverCapacity = capacityPct > 100;

                 return (
                   <motion.div 
                     key={it.id}
                     whileHover={{ y: -4 }}
                     className="bg-surface p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                   >
                     <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                           <h4 className="font-bold text-sidebar group-hover:text-primary transition-colors">{it.name}</h4>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{it.startDate} — {it.endDate}</div>
                        </div>
                        <button className="p-1 hover:bg-slate-50 rounded-lg text-slate-300">
                           <MoreVertical size={16} />
                        </button>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Load</span>
                              <span className={`text-xl font-black ${isOverCapacity ? 'text-danger' : 'text-sidebar'}`}>{points} / {it.capacity}</span>
                           </div>
                           <div className={`p-2 rounded-xl flex items-center justify-center ${isOverCapacity ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                              {isOverCapacity ? <Activity size={18} /> : <TrendingUp size={18} />}
                           </div>
                        </div>

                        <div className="space-y-2">
                           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${isOverCapacity ? 'bg-danger' : 'bg-primary'}`}
                                style={{ width: `${Math.min(capacityPct, 100)}%` }}
                              ></div>
                           </div>
                           <div className="flex justify-between text-[11px] font-bold">
                              <span className="text-slate-400">Total Capacity</span>
                              <span className={isOverCapacity ? 'text-danger' : 'text-slate-600'}>{capacityPct}% Committed</span>
                           </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                           <div className="flex -space-x-1.5">
                              {getIterationStories(it.id).slice(0, 3).map((s, i) => (
                                <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-500">
                                   {s.assignee.charAt(0)}
                                </div>
                              ))}
                           </div>
                           <button className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-all">
                              Plan Sprint
                              <ArrowRight size={14} />
                           </button>
                        </div>
                     </div>
                   </motion.div>
                 );
               })}

               {/* Add Iteration Placeholder */}
               <div className="border-2 border-dashed border-slate-200 rounded-[28px] p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:bg-white group-hover:shadow-lg transition-all">
                     <Plus size={24} />
                  </div>
                  <div className="text-sm font-bold text-slate-400 group-hover:text-primary">New Iteration</div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanningPage;
