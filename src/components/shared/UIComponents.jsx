import React from 'react';
import { cn } from '../../utils/helpers';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-transparent",
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-sidebar/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-surface w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-slate-100">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-sidebar">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">&times;</button>
        </div>
        <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
