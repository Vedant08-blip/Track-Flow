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
    <div className="space-y-8 max-w-7xl mx-auto pb-20 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Enterprise Roadmap</h1>
          <p className="text-slate-500 dark:text-slate-500 dark:text-slate-400 font-medium mt-1">Cross-team feature timeline and dependencies</p>
        </div>
        <div className="flex items-center gap-2 bg-surface dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 transition-colors"><ChevronLeft size={18} /></button>
          <div className="px-4 font-bold text-sm text-slate-900 dark:text-white">H1 2025</div>
          <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 transition-colors"><ChevronRight size={18} /></button>
        </div>
      </div>

      {/* Gantt Chart Implementation */}
      <div className="bg-surface dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex-1 flex flex-col overflow-hidden min-h-[600px]">
        {/* Timeline Header */}
        <div className="flex border-b border-slate-100 dark:border-slate-800">
           <div className="w-64 p-6 border-r border-slate-100 dark:border-slate-800 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest bg-slate-50/50 dark:bg-slate-900/50">Features & Teams</div>
           <div className="flex-1 flex bg-slate-50/50 dark:bg-slate-900/50">
              {months.map(m => (
                <div key={m} className="flex-1 p-6 text-center font-bold text-slate-900 dark:text-white text-xs border-r border-slate-100 dark:border-slate-800 last:border-r-0">{m} 2025</div>
              ))}
           </div>
        </div>

        {/* Timeline Rows */}
        <div className="flex-1 overflow-y-auto">
          {releases.map((release, rIdx) => (
            <div key={release.id} className="flex flex-col">
               {/* Release Header Row */}
               <div className="flex bg-primary/5 border-b border-slate-100 dark:border-slate-800 group">
                  <div className="w-64 p-4 border-r border-slate-100 dark:border-slate-800 flex items-center gap-3">
                     <Target size={16} className="text-primary" />
                     <span className="text-sm font-bold text-slate-900 dark:text-white">{release.name} Release</span>
                  </div>
                  <div className="flex-1 relative">
                     <div className="absolute top-2 bottom-2 left-[10%] right-[40%] bg-primary rounded-xl flex items-center px-4 overflow-hidden shadow-lg shadow-primary/20">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest truncate">{release.name} Active Phase</span>
                     </div>
                  </div>
               </div>

               {/* Features Rows for this Release */}
               {filteredFeatures(release.id).map((feature, fIdx) => (
                 <div key={feature.id} className="flex border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all group">
                    <div className="w-64 p-6 border-r border-slate-100 dark:border-slate-800 flex items-center gap-3">
                       <Layers size={14} className="text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors" />
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{feature.name}</span>
                          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Team Alpha</span>
                       </div>
                    </div>
                    <div className="flex-1 relative flex items-center">
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
