import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AmbientBackground from '../components/shared/AmbientBackground';

const LoginPage = () => {
  const [email, setEmail] = useState('demo@trackflow.ai');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState('Developer');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, role);
    navigate('/dashboard');
  };

  return (
    <div className="h-screen bg-background dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <AmbientBackground />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-none p-10 border border-white/60 dark:border-slate-800/60 overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/20"></div>

          <div className="text-center mb-10 relative">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 rotate-12 group hover:rotate-0 transition-transform">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">TrackFlow</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Enterprise Agile Intelligence</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 pl-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:text-white transition-all text-sm font-medium shadow-inner"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 pl-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:text-white transition-all text-sm font-medium shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 pl-1">Select Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-inner"
              >
                <option value="Admin">Administrator</option>
                <option value="Scrum Master">Scrum Master</option>
                <option value="Developer">Developer</option>
              </select>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all group"
            >
              Sign In to TrackFlow 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
             <button className="text-primary text-sm font-bold hover:underline">Forgot password?</button>
             <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
               New to TrackFlow? <a href="/register" className="text-primary hover:underline">Contact Sales</a>
             </div>
          </div>
        </div>

        <p className="text-center text-slate-500 dark:text-slate-400 mt-8 text-sm font-medium">
          &copy; 2025 TrackFlow Inc. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
