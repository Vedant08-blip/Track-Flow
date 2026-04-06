import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-background flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-surface rounded-3xl shadow-xl p-10 border border-slate-100 text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 rotate-6 hover:rotate-0 transition-transform">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-sidebar tracking-tight text-center">Contact TrackFlow</h1>
          <p className="text-slate-400 mt-4 font-medium leading-relaxed">
            Enterprise licensing for TrackFlow is currently managed through our specialized account teams.
          </p>
          
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-slate-100"><Mail size={20} /></div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Email Support</div>
                <div className="text-sm font-bold text-sidebar">sales@trackflow.ai</div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-slate-100"><ShieldCheck size={20} /></div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Security Verification</div>
                <div className="text-sm font-bold text-sidebar">trust.trackflow.ai</div>
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
