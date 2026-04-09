import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  Briefcase, 
  ChevronRight, 
  ChevronDown, 
  Target, 
  Layers, 
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Avatar } from '../components/shared/UIComponents';
import { motion, AnimatePresence } from 'framer-motion';

const PortfolioPage = () => {
  const { 
    initiatives, 
    features, 
    stories,
    searchTerm,
    activeFilters
  } = useProject();
  const [expandedInitiatives, setExpandedInitiatives] = useState(['ini-1']);

  // Auto-expand when searching
  React.useEffect(() => {
    if (searchTerm) {
      const matchingInitiativeIds = initiatives
        .filter(ini => {
          const iniFeatures = features.filter(f => f.initiativeId === ini.id);
          return iniFeatures.some(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
        })
        .map(ini => ini.id);
      
      setExpandedInitiatives(prev => [...new Set([...prev, ...matchingInitiativeIds])]);
    }
  }, [searchTerm, initiatives, features]);

  const toggleInitiative = (id) => {
    setExpandedInitiatives(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getFeaturesByInitiative = (initiativeId) => {
    return features.filter(f => {
      if (f.initiativeId !== initiativeId) return false;
      
      const matchSearch = !searchTerm || 
        f.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchTeam = !activeFilters.teamId || f.id.includes('f-1'); // Mock logic

      return matchSearch && matchTeam;
    });
  };

  const filteredInitiatives = initiatives.filter(ini => {
    const iniFeatures = getFeaturesByInitiative(ini.id);
    return iniFeatures.length > 0;
  });

  const getStoryProgress = (featureId) => {
    const featureStories = stories.filter(s => s.featureId === featureId);
    if (featureStories.length === 0) return 0;
    const completed = featureStories.filter(s => s.status === 'Accepted' || s.status === 'Completed').length;
    return Math.round((completed / featureStories.length) * 100);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Portfolio Vision</h1>
          <p className="text-slate-500 dark:text-slate-500 dark:text-slate-400 font-medium mt-1">Strategic initiatives & roadmap execution</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">Global Health</span>
              <span className="text-xl font-black text-success leading-tight">Excellent</span>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success border border-success/20">
             <TrendingUp size={24} />
           </div>
        </div>
      </div>

      {/* Initiatives List */}
      <div className="space-y-6">
        {filteredInitiatives.map((initiative) => (
          <motion.div 
            key={initiative.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            <div 
              onClick={() => toggleInitiative(initiative.id)}
              className="p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-6 flex-1">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: initiative.color }}
                >
                  <Target size={24} />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{initiative.id}</div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{initiative.name}</h3>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <div className="md:flex hidden items-center gap-4">
                   <div className="flex flex-col items-end">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Execution</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">78%</span>
                   </div>
                   <div className="w-40 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '78%', backgroundColor: initiative.color }}></div>
                   </div>
                </div>
                <div className="p-2 text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                   {expandedInitiatives.includes(initiative.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedInitiatives.includes(initiative.id) && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {getFeaturesByInitiative(initiative.id).map(feature => (
                      <div key={feature.id} className="bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 group/feature hover:border-primary/30 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-primary/5">
                        <div className="flex items-center justify-between mb-4">
                          <Layers size={18} className="text-primary" />
                          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase">{feature.id}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-6 group-hover/feature:text-primary transition-colors">{feature.name}</h4>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-slate-500 dark:text-slate-400">Total Progress</span>
                            <span className="text-slate-900 dark:text-white">{getStoryProgress(feature.id)}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent rounded-full transition-all duration-1000" 
                              style={{ width: `${getStoryProgress(feature.id)}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2">
                             <div className="flex -space-x-1">
                                {stories.filter(s => s.featureId === feature.id).slice(0, 3).map((s, i) => (
                                  <Avatar key={i} name={s.assignee} size="sm" className="ring-2 ring-white" />
                                ))}
                             </div>
                             <button className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover/feature:translate-x-1 transition-transform">
                               View Detailed 
                               <ArrowRight size={12} />
                             </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPage;
