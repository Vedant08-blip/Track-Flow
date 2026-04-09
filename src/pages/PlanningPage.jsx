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
import SprintPlannerModal from '../components/shared/SprintPlannerModal';

const PlanningPage = () => {
  const { releases, iterations, teams, stories } = useProject();
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [selectedIterationId, setSelectedIterationId] = useState(null);

  const handleOpenPlanner = (itId) => {
    setSelectedIterationId(itId);
    setIsPlannerOpen(true);
  };

  const getIterationStories = (itId) => stories.filter(s => s.iterationId === itId);
  
  const getIterationPoints = (itId) => {
    return getIterationStories(itId).reduce((acc, story) => acc + (story.points || 0), 0);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Capacity Planning</h1>
          <p className="text-slate-500 dark:text-slate-500 dark:text-slate-400 font-medium mt-1">Allocate work across iterations and releases</p>
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
            <div className="flex items-center gap-4 bg-surface dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm w-fit group cursor-pointer hover:border-primary/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                   <Target size={20} />
                </div>
                <div>
                   <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{release.name} Release</h2>
                   <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{release.startDate} — {release.endDate}</div>
                </div>
                <div className="ml-8 pr-4">
                   <ChevronRight size={18} className="text-slate-500 dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
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
                     className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-[28px] border border-white/50 dark:border-slate-800/50 shadow-lg shadow-slate-200/20 dark:shadow-none hover:shadow-xl hover:border-primary/30 transition-all group relative overflow-hidden"
                   >
                     <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="space-y-1">
                           <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{it.name}</h4>
                           <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{it.startDate} — {it.endDate}</div>
                        </div>
                        <button className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                           <MoreVertical size={16} />
                        </button>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Load</span>
                              <span className={`text-xl font-black ${isOverCapacity ? 'text-danger' : 'text-slate-900 dark:text-white'}`}>{points} / {it.capacity}</span>
                           </div>
                           <div className={`p-2 rounded-xl flex items-center justify-center ${isOverCapacity ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                              {isOverCapacity ? <Activity size={18} /> : <TrendingUp size={18} />}
                           </div>
                        </div>

                        <div className="space-y-2 relative z-10">
                           <div className="h-2 bg-white/50 dark:bg-slate-800 rounded-full overflow-hidden backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-inner relative">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(capacityPct, 100)}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={`h-full rounded-full relative overflow-hidden ${isOverCapacity ? 'bg-danger shadow-[0_0_10px_rgba(231,76,60,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(27,107,245,0.5)]'}`}
                              >
                                 <div className="absolute inset-0 bg-white/20 w-full h-full"></div>
                              </motion.div>
                           </div>
                           <div className="flex justify-between text-[11px] font-bold">
                              <span className="text-slate-500 dark:text-slate-400">Total Capacity</span>
                              <span className={isOverCapacity ? 'text-danger' : 'text-slate-600 dark:text-slate-500 dark:text-slate-400'}>{capacityPct}% Committed</span>
                           </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between relative z-10">
                           <div className="flex -space-x-1.5">
                              {getIterationStories(it.id).slice(0, 3).map((s, i) => (
                                <div key={i} className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-500 dark:text-slate-400">
                                   {s.assignee.charAt(0)}
                                </div>
                              ))}
                           </div>
                           <button 
                             onClick={() => handleOpenPlanner(it.id)}
                             className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-all"
                           >
                              Plan Sprint
                              <ArrowRight size={14} />
                           </button>
                        </div>
                     </div>
                   </motion.div>
                 );
               })}

               {/* Add Iteration Placeholder */}
               <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[28px] p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-primary group-hover:bg-white dark:hover:bg-slate-800 group-hover:shadow-lg transition-all">
                     <Plus size={24} />
                  </div>
                  <div className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-primary">New Iteration</div>
               </div>
            </div>
          </div>
        ))}
      </div>

      <SprintPlannerModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        iterationId={selectedIterationId}
      />
    </div>
  );
};

export default PlanningPage;
