import React, { useState } from 'react';
import { cn } from '../../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-500 dark:text-slate-400',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-transparent whitespace-nowrap",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const map = {
    'Critical': 'danger',
    'High': 'warning',
    'Medium': 'primary',
    'Low': 'default',
  };
  return <Badge variant={map[priority] || 'default'}>{priority}</Badge>;
};

export const StatusBadge = ({ status }) => {
  const map = {
    'Defined': 'default',
    'In Progress': 'primary',
    'Completed': 'accent',
    'Accepted': 'success',
  };
  return <Badge variant={map[status] || 'default'}>{status}</Badge>;
};

export const Avatar = ({ name, src, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-12 h-12 text-base',
  };

  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className={cn(
      "rounded-full flex items-center justify-center font-bold text-white overflow-hidden bg-primary shadow-sm",
      sizes[size],
      className
    )}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-sidebar/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } }}
            exit={{ opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15, ease: 'easeIn' } }}
            className="bg-surface dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-slate-100 dark:border-slate-800"
          >
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 transition-colors">&times;</button>
            </div>
            <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
              {children}
            </div>
            {footer && (
              <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const Drawer = ({ isOpen, onClose, title, children, footer }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-sidebar/40 backdrop-blur-sm" 
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } }}
            exit={{ x: '100%', transition: { type: 'spring', damping: 30, stiffness: 300 } }}
            className="w-full max-w-md bg-surface dark:bg-slate-900 h-full shadow-2xl relative z-10 flex flex-col border-l border-slate-100 dark:border-slate-800"
          >
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
              <button 
                onClick={onClose} 
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="px-6 py-6 flex-1 overflow-y-auto">
              {children}
            </div>
            
            {footer && (
              <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const InfoTooltip = ({ content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const posClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="p-1 rounded-full text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors cursor-help">
        <Info size={16} />
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 300 } }}
            exit={{ opacity: 0, scale: 0.95, y: 2, transition: { duration: 0.1 } }}
            className={cn(
              "absolute w-64 z-[999] bg-slate-900/95 dark:bg-white/95 backdrop-blur-xl text-white dark:text-slate-900 text-xs font-medium p-3 rounded-xl shadow-2xl border border-white/10 dark:border-slate-800/10 pointer-events-none text-center leading-relaxed",
              posClasses[position]
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const PageWrapper = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className={cn("w-full h-full", className)}
  >
    {children}
  </motion.div>
);

