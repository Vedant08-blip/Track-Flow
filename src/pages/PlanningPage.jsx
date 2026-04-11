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
    <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto pb-20 relative px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Capacity Planning</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Allocate work across iterations and releases</p>
        </div>
        <button className="w-full sm:w-auto bg-primary text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-sm sm:text-base shrink-0">
          <Plus size={18} className="sm:w-5 sm:h-5" />
          <span>Create Release</span>
        </button>
      </div>

      {/* Planning Grid */}
      <div className="space-y-8 lg:space-y-10">
        {releases.map((release) => (
          <div key={release.id} className="space-y-4 lg:space-y-6">
            <div className="flex items-center gap-2 lg:gap-4 bg-surface dark:bg-slate-900 p-3 lg:p-4 rounded-2xl lg:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm w-fit group cursor-pointer hover:border-primary/30 transition-all flex-wrap lg:flex-nowrap">
                <div className="w-9 lg:w-10 h-9 lg:h-10 rounded-xl lg:rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                   <Target size={18} className="lg:w-5 lg:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                   <h2 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white leading-tight">{release.name} Release</h2>
                   <div className="text-xs lg:text-sm font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">{release.startDate} — {release.endDate}</div>
                </div>
                <div className="ml-2 lg:ml-8 pr-2 lg:pr-4">
                   <ChevronRight size={18} className="text-slate-500 dark:text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
               {iterations.filter(it => it.releaseId === release.id).map((it) => {
                 const points = getIterationPoints(it.id);
                 const capacityPct = Math.round((points / it.capacity) * 100);
                 const isOverCapacity = capacityPct > 100;

                 return (
                   <motion.div 
                     key={it.id}
                     whileHover={{ y: -4 }}
                     className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-5 lg:p-6 rounded-xl lg:rounded-[28px] border border-white/50 dark:border-slate-800/50 shadow-lg shadow-slate-200/20 dark:shadow-none hover:shadow-xl hover:border-primary/30 transition-all group relative overflow-hidden flex flex-col"
                   >
                     <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="flex justify-between items-start mb-4 lg:mb-6 relative z-10">
                        <div className="space-y-1 flex-1 min-w-0">
                           <h4 className="font-bold text-sm lg:text-base text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">{it.name}</h4>
                           <div className="text-[10px] lg:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">{it.startDate} — {it.endDate}</div>
                        </div>
                        <button className="p-1.5 lg:p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 flex-shrink-0 ml-2">
                           <MoreVertical size={14} className="lg:w-4 lg:h-4" />
                        </button>
                     </div>

                     <div className="space-y-4 lg:space-y-6 flex-1">
                        <div className="flex items-center justify-between">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Load</span>
                              <span className={`text-lg lg:text-xl font-black ${isOverCapacity ? 'text-red-600 dark:text-red-500' : 'text-slate-900 dark:text-white'}`}>{points} / {it.capacity}</span>
                           </div>
                           <div className={`p-2 lg:p-2.5 rounded-xl flex items-center justify-center ${isOverCapacity ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500'}`}>
                              {isOverCapacity ? <Activity size={16} className="lg:w-5 lg:h-5" /> : <TrendingUp size={16} className="lg:w-5 lg:h-5" />}
                           </div>
                        </div>

                        <div className="space-y-2 relative z-10">
                           <div className="h-2 bg-white/50 dark:bg-slate-800 rounded-full overflow-hidden backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-inner relative">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(capacityPct, 100)}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={`h-full rounded-full relative overflow-hidden ${isOverCapacity ? 'bg-red-600 dark:bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(27,107,245,0.5)]'}`}
                              >
                                 <div className="absolute inset-0 bg-white/20 w-full h-full"></div>
                              </motion.div>
                           </div>
                           <div className="flex justify-between text-[10px] lg:text-xs font-bold gap-2">
                              <span className="text-slate-500 dark:text-slate-400 truncate">Total Capacity</span>
                              <span className={`${isOverCapacity ? 'text-red-600 dark:text-red-500' : 'text-slate-600 dark:text-slate-400'} whitespace-nowrap`}>{capacityPct}% Committed</span>
                           </div>
                        </div>

                        <div className="pt-3 lg:pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 relative z-10">
                           <div className="flex -space-x-1.5">
                              {getIterationStories(it.id).slice(0, 3).map((s, i) => (
                                <div key={i} className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] lg:text-[10px] font-black text-slate-600 dark:text-slate-400 flex-shrink-0">
                                   {s.assignee.charAt(0)}
                                </div>
                              ))}
                           </div>
                           <button 
                             onClick={() => handleOpenPlanner(it.id)}
                             className="flex items-center gap-1 lg:gap-1.5 text-xs lg:text-sm font-bold text-primary group-hover:translate-x-1 transition-all whitespace-nowrap"
                           >
                              Plan Sprint
                              <ArrowRight size={12} className="lg:w-3.5 lg:h-3.5" />
                           </button>
                        </div>
                     </div>
                   </motion.div>
                 );
               })}

               {/* Add Iteration Placeholder */}
               <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl lg:rounded-[28px] p-5 lg:p-6 flex flex-col items-center justify-center text-center gap-2 lg:gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-primary group-hover:bg-white dark:hover:bg-slate-800 group-hover:shadow-lg transition-all flex-shrink-0">
                     <Plus size={20} className="lg:w-6 lg:h-6" />
                  </div>
                  <div className="text-xs lg:text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-primary">New Iteration</div>
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
