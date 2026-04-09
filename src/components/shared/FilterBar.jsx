import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { Filter, X, Users, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/helpers';

const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];

const FilterBar = () => {
  const { activeFilters, updateFilters, clearAllFilters, teams } = useProject();

  const togglePriority = (p) => {
    const current = activeFilters.priority;
    if (current.includes(p)) {
      updateFilters('priority', current.filter(item => item !== p));
    } else {
      updateFilters('priority', [...current, p]);
    }
  };

  const hasActiveFilters = activeFilters.priority.length > 0 || activeFilters.teamId !== null;

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-3 px-5 rounded-2xl border border-white/50 dark:border-slate-800/50 shadow-sm mb-6">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mr-2">
        <Filter size={16} />
        <span className="text-xs font-bold uppercase tracking-widest">Filters</span>
      </div>

      <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block mx-1"></div>

      {/* Priority Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
        {PRIORITIES.map(p => {
          const isActive = activeFilters.priority.includes(p);
          const priorityColors = {
            Critical: isActive ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 border-rose-500/10',
            High: isActive ? 'bg-orange-500 text-white shadow-orange-500/20' : 'bg-orange-500/5 text-orange-500 hover:bg-orange-500/10 border-orange-500/10',
            Medium: isActive ? 'bg-amber-500 text-white shadow-amber-500/20' : 'bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 border-amber-500/10',
            Low: isActive ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-blue-500/5 text-blue-500 hover:bg-blue-500/10 border-blue-500/10',
          };

          return (
            <motion.button
              key={p}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => togglePriority(p)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all whitespace-nowrap shadow-sm",
                priorityColors[p]
              )}
            >
              {p}
            </motion.button>
          );
        })}
      </div>

      <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block mx-1"></div>

      {/* Team Filter */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <select 
          value={activeFilters.teamId || ''}
          onChange={(e) => updateFilters('teamId', e.target.value || null)}
          className="bg-transparent text-xs font-bold text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer hover:text-primary transition-colors appearance-none pr-4 relative"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}
        >
          <option value="">All Teams</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </div>

      <AnimatePresence>
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-800 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 transition-all shadow-md active:scale-95 md:ml-auto"
          >
            <X size={12} />
            Reset All
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;
