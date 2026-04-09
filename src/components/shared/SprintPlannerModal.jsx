import React from 'react';
import { Modal, PriorityBadge } from './UIComponents';
import { useProject } from '../../context/ProjectContext';
import { 
  ArrowRight, 
  ArrowLeft, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/helpers';

const SprintPlannerModal = ({ isOpen, onClose, iterationId }) => {
  const { stories, iterations, updateStory } = useProject();
  
  const currentIteration = iterations.find(it => it.id === iterationId);
  if (!currentIteration && isOpen) return null;

  const iterationStories = stories.filter(s => s.iterationId === iterationId);
  const availableStories = stories.filter(s => !s.iterationId && s.status !== 'Accepted');
  
  const currentPoints = iterationStories.reduce((acc, s) => acc + (s.points || 0), 0);
  const capacity = currentIteration?.capacity || 40;
  const capacityPct = Math.round((currentPoints / capacity) * 100);
  const isOverCapacity = currentPoints > capacity;

  const handleAssign = (storyId) => {
    updateStory(storyId, { iterationId });
  };

  const handleUnassign = (storyId) => {
    updateStory(storyId, { iterationId: null });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-6xl"
      title={
        <div className="flex flex-col gap-4 w-full pr-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <TrendingUp size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold dark:text-white leading-tight">Sprint Planner: {currentIteration?.name}</h2>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-widest">{currentIteration?.startDate} — {currentIteration?.endDate}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Commitment Load</span>
                <span className={cn("text-sm font-black px-2 py-0.5 rounded-md", isOverCapacity ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary")}>
                  {currentPoints} / {capacity} PTS
                </span>
              </div>
              <span className={cn("text-xs font-bold", isOverCapacity ? "text-danger" : "text-slate-500")}>
                {capacityPct}% Committed
              </span>
            </div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50 relative">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${Math.min(capacityPct, 100)}%` }}
                 className={cn(
                   "h-full rounded-full relative shadow-[0_0_10px_rgba(0,0,0,0.1)]",
                   isOverCapacity ? "bg-danger" : "bg-primary"
                 )}
               >
                 <div className="absolute inset-0 bg-white/20"></div>
               </motion.div>
            </div>
            {isOverCapacity && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-danger text-[10px] font-bold uppercase tracking-tight"
              >
                <AlertCircle size={12} />
                Warning: Sprint is over-committed. Consider moving items back to backlog.
              </motion.div>
            )}
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[500px] py-2">
        {/* Left Column: Backlog */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Package size={18} className="text-slate-400" />
              Available Backlog
            </h3>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {availableStories.length} Items
            </span>
          </div>
          
          <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/30 rounded-[24px] p-4 border border-slate-100 dark:border-slate-800/50 overflow-y-auto max-h-[450px] space-y-3">
            <AnimatePresence mode="popLayout">
              {availableStories.length > 0 ? (
                availableStories.map(story => (
                  <motion.div
                    key={story.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-all group flex items-center justify-between"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black text-primary uppercase tracking-tighter">{story.id}</span>
                        <PriorityBadge priority={story.priority} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{story.title}</h4>
                      <div className="text-[10px] font-bold text-slate-500 mt-1">{story.points} Points</div>
                    </div>
                    <button 
                      onClick={() => handleAssign(story.id)}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-50">
                  <Package size={32} className="mb-2" />
                  <p className="text-xs font-bold">Backlog is empty</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Sprint Plan */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              Committed Work
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              {iterationStories.length} Items
            </span>
          </div>

          <div className="flex-1 bg-emerald-500/5 dark:bg-emerald-500/[0.03] rounded-[24px] p-4 border border-emerald-500/10 overflow-y-auto max-h-[450px] space-y-3">
            <AnimatePresence mode="popLayout">
              {iterationStories.length > 0 ? (
                iterationStories.map(story => (
                  <motion.div
                    key={story.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-500/20 shadow-sm hover:border-emerald-500 transition-all group flex items-center justify-between"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">{story.id}</span>
                        <PriorityBadge priority={story.priority} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1">{story.title}</h4>
                      <div className="text-[10px] font-bold text-slate-500 mt-1">{story.points} Points</div>
                    </div>
                    <button 
                      onClick={() => handleUnassign(story.id)}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm"
                    >
                      <ArrowLeft size={18} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-50">
                  <Activity size={32} className="mb-2" />
                  <p className="text-xs font-bold text-slate-400">No items committed yet. Start planning!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SprintPlannerModal;
