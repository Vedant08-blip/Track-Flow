import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AmbientBackground from '../components/shared/AmbientBackground';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-background dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <AmbientBackground />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-none p-10 border border-white/60 dark:border-slate-800/60 overflow-hidden relative text-center">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/20"></div>
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 rotate-6 hover:rotate-0 transition-transform">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight text-center">Contact TrackFlow</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium leading-relaxed">
            Enterprise licensing for TrackFlow is currently managed through our specialized account teams.
          </p>
          
          <div className="mt-8 space-y-4 relative z-10">
            <div className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-inner flex items-center gap-4 text-left transition-all hover:shadow-md hover:border-primary/30">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm border border-slate-100 dark:border-slate-700"><Mail size={20} /></div>
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mb-1">Email Support</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">sales@trackflow.ai</div>
              </div>
            </div>
            
            <div className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-inner flex items-center gap-4 text-left transition-all hover:shadow-md hover:border-primary/30">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm border border-slate-100 dark:border-slate-700"><ShieldCheck size={20} /></div>
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mb-1">Security Verification</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">trust.trackflow.ai</div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/login')}
            className="w-full mt-10 text-primary font-bold flex items-center justify-center gap-2 group hover:underline"
          >
            Back to Sign In
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
