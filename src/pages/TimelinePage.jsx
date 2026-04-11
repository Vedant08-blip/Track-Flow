import React from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal,
  Plus,
  Target,
  Layers,
  History as TimelineIcon,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const TimelinePage = () => {
  const { 
    releases, 
    features, 
    teams,
    searchTerm,
    activeFilters 
  } = useProject();

  const filteredFeatures = (releaseId) => {
    return features.filter(f => {
      if (f.releaseId !== releaseId) return false;
      
      const matchSearch = !searchTerm || 
        f.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Feature doesn't have a team directly in mock, but we can assume one for filtering visualization
      const matchTeam = !activeFilters.teamId || f.id.includes('f-1'); // Mock logic for demo
      
      return matchSearch && matchTeam;
    });
  };

  // Mock timeline dates for visualization
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto pb-20 relative px-2 md:px-0 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Enterprise Roadmap</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Cross-team feature timeline and dependencies</p>
        </div>
        <div className="flex items-center gap-1.5 lg:gap-2 bg-surface dark:bg-slate-900 p-1 lg:p-1.5 rounded-xl lg:rounded-2xl border border-slate-200 dark:border-slate-700 flex-shrink-0">
          <button className="p-1.5 lg:p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors flex-shrink-0">
            <ChevronLeft size={16} className="lg:w-5 lg:h-5" />
          </button>
          <div className="px-2 lg:px-4 font-bold text-xs lg:text-sm text-slate-900 dark:text-white whitespace-nowrap">H1 2025</div>
          <button className="p-1.5 lg:p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors flex-shrink-0">
            <ChevronRight size={16} className="lg:w-5 lg:h-5" />
          </button>
        </div>
      </div>

      {/* Gantt Chart Implementation */}
      <div className="bg-surface dark:bg-slate-900 rounded-2xl lg:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex-1 flex flex-col overflow-hidden min-h-96">
        {/* Timeline Header */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
           <div className="w-40 sm:w-56 lg:w-64 p-3 sm:p-4 lg:p-6 border-r border-slate-100 dark:border-slate-800 font-bold text-slate-500 dark:text-slate-400 text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-widest bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0">Features & Teams</div>
           <div className="flex bg-slate-50/50 dark:bg-slate-900/50 flex-1 min-w-0">
              {months.map(m => (
                <div key={m} className="flex-1 p-2 sm:p-3 lg:p-6 text-center font-bold text-slate-900 dark:text-white text-[9px] sm:text-xs lg:text-sm border-r border-slate-100 dark:border-slate-800 last:border-r-0 whitespace-nowrap">{m} 2025</div>
              ))}
           </div>
        </div>

        {/* Timeline Rows */}
        <div className="flex-1 overflow-y-auto overflow-x-auto">
          {releases.map((release, rIdx) => (
            <div key={release.id} className="flex flex-col">
               {/* Release Header Row */}
               <div className="flex bg-primary/5 border-b border-slate-100 dark:border-slate-800 group min-w-max lg:min-w-fit">
                  <div className="w-40 sm:w-56 lg:w-64 p-2 sm:p-3 lg:p-4 border-r border-slate-100 dark:border-slate-800 flex items-center gap-2 lg:gap-3 flex-shrink-0">
                     <Target size={14} className="text-primary lg:w-4 lg:h-4 flex-shrink-0" />
                     <span className="text-xs sm:text-sm lg:text-sm font-bold text-slate-900 dark:text-white truncate">{release.name} Release</span>
                  </div>
                  <div className="flex-1 relative min-w-96">
                     <div className="absolute top-1.5 sm:top-2 lg:top-2 bottom-1.5 sm:bottom-2 lg:bottom-2 left-[10%] right-[40%] bg-primary rounded-lg lg:rounded-xl flex items-center px-2 sm:px-3 lg:px-4 overflow-hidden shadow-lg shadow-primary/20">
                        <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-black text-white uppercase tracking-widest truncate">{release.name} Active</span>
                     </div>
                  </div>
               </div>

               {/* Features Rows for this Release */}
               {filteredFeatures(release.id).map((feature, fIdx) => (
                 <div key={feature.id} className="flex border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all group min-w-max lg:min-w-fit">
                    <div className="w-40 sm:w-56 lg:w-64 p-3 sm:p-4 lg:p-6 border-r border-slate-100 dark:border-slate-800 flex items-center gap-2 lg:gap-3 flex-shrink-0">
                       <Layers size={12} className="text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors lg:w-3.5 lg:h-3.5 flex-shrink-0" />
                       <div className="flex flex-col min-w-0">
                          <span className="text-xs lg:text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">{feature.name}</span>
                          <span className="text-[8px] lg:text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter whitespace-nowrap">Team Alpha</span>
                       </div>
                    </div>
                    <div className="flex-1 relative flex items-center min-w-96">
                       {/* Mock Gantt Bar */}
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${60 - (fIdx * 10)}%` }}
                          transition={{ duration: 1.5, delay: 0.2 }}
                          className="absolute h-8 rounded-xl bg-accent shadow-sm shadow-accent/20 border border-accent/20 px-3 flex items-center gap-2 overflow-hidden"
                          style={{ left: `${15 + (fIdx * 12)}%` }}
                       >
                          <CheckCircle2 size={12} className="text-white shrink-0" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest truncate">In Progress</span>
                       </motion.div>
                       
                       {/* Dependencies */}
                       <div className="absolute w-px bg-slate-200 dark:bg-slate-700 top-0 bottom-0 left-[50%] dashed"></div>
                    </div>
                 </div>
               ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-primary rounded-full"></div>
                 <span className="text-xs font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">Release</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-accent rounded-full"></div>
                 <span className="text-xs font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">Feature</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-danger rounded-full"></div>
                 <span className="text-xs font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">Risk / Delay</span>
              </div>
           </div>
           <button className="flex items-center gap-2 text-xs font-bold text-primary group transition-all">
              Add Timeline Dependency
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-all" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
