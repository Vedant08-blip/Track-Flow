import React, { useState } from 'react';
import { Modal } from './UIComponents';
import { Layers, CalendarRange, Kanban, TrendingUp, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/helpers';

const guideSteps = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: TrendingUp,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    short: 'See your project\'s health at a glance.',
    details: 'The Dashboard shows you quick numbers about your project:\n\n • Work Done Per Sprint = How many tasks your team completes each 2 weeks\n • Tasks Completed = Total tasks finished\n • Bug Count = How many bugs are open\n • Team Workload = How busy your team is (100% = full)'
  },
  {
    id: 'backlog',
    title: 'Backlog',
    icon: Layers,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    short: 'Your to-do list for the whole project.',
    details: 'The Backlog is like a master to-do list for everything your project needs. Every new feature, bug fix, or idea goes here first. You can:\n\n • Rank items by importance\n • Estimate how hard each task is\n • See everything in one place\n\nThis helps you decide what to work on next.'
  },
  {
    id: 'planning',
    title: 'Planning',
    icon: CalendarRange,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    short: 'Pick work for the next 2 weeks.',
    details: 'Planning is where you pick which tasks your team will do in the next 2-week period (called a Sprint). You:\n\n • Pull items from Backlog\n • Add them to the Sprint\n • Stop when your team is full\n\nThis keeps work focused and manageable.'
  },
  {
    id: 'board',
    title: 'Board',
    icon: Kanban,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    short: 'Watch work move from start to finish.',
    details: 'The Board shows your tasks moving through stages:\n\n • Defined = Ready to work on\n • In Progress = Someone is working on it\n • Completed = Done!\n\nDrag cards across as they progress. Everyone can see exactly where each task is.'
  }
];

const AppGuideModal = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const ActiveStepIcon = guideSteps[activeStep].icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
      title={
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <CheckCircle2 className="text-primary w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold dark:text-white leading-tight">TrackFlow 101</h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Learn the basics in 2 minutes.</p>
          </div>
        </div>
      }
      footer={
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-1.5">
            {guideSteps.map((_, i) => (
              <div key={i} className={cn("h-1.5 rounded-full transition-all duration-300", i === activeStep ? "w-6 bg-primary" : "w-1.5 bg-slate-200 dark:bg-slate-700")} />
            ))}
          </div>
          <div className="flex gap-2">
            {activeStep > 0 && (
              <button
                onClick={() => setActiveStep(prev => prev - 1)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
              >
                Back
              </button>
            )}
            {activeStep < guideSteps.length - 1 ? (
              <button
                onClick={() => setActiveStep(prev => prev + 1)}
                className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm flex items-center gap-2"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 text-sm"
              >
                Got it, Let's go!
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col md:flex-row gap-6 min-h-[300px]">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-1/3 flex flex-col gap-2">
          {guideSteps.map((step, index) => {
            const isActive = index === activeStep;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={cn(
                  "text-left px-4 py-4 rounded-2xl border transition-all duration-300 group relative overflow-hidden focus:outline-none",
                  isActive
                    ? `bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-md ring-1 ring-primary/10`
                    : `bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:scale-[1.02] active:scale-[0.98]`
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                  />
                )}
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-xl transition-colors", isActive ? step.bg : "bg-slate-100 dark:bg-slate-900 group-hover:bg-slate-200 dark:group-hover:bg-slate-800")}>
                    <step.icon className={cn("w-5 h-5 transition-colors", isActive ? step.color : "text-slate-400 dark:text-slate-500")} />
                  </div>
                  <div>
                    <div className={cn("font-bold text-sm transition-colors", isActive ? "text-slate-900 dark:text-white cursor-default" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300")}>
                      {step.title}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="w-full md:w-2/3 p-4 md:p-8 flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-bold uppercase tracking-widest mb-6 shadow-sm", guideSteps[activeStep].bg, guideSteps[activeStep].color, guideSteps[activeStep].border)}>
                <ActiveStepIcon size={14} /> Concept
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                {guideSteps[activeStep].short}
              </h3>

              <div className="space-y-4 text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed font-medium">
                {guideSteps[activeStep].details.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
};

export default AppGuideModal;
