import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, Zap, Users, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AmbientBackground from '../components/shared/AmbientBackground';

const LoginPage = () => {
  const [email, setEmail] = useState('demo@trackflow.ai');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState('Developer');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [showFeatures, setShowFeatures] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      login(email, password, role);
      navigate('/dashboard');
      setIsLoading(false);
    }, 800);
  };

  const features = [
    { icon: Zap, title: 'Real-time Analytics', desc: 'Live velocity & burndown charts' },
    { icon: Users, title: 'Team Collaboration', desc: 'Chat, comments & @mentions' },
    { icon: CheckCircle2, title: 'Smart AI Assistant', desc: 'Natural language queries' },
  ];

  const roleDescriptions = {
    Admin: 'Full platform access & team management',
    'Scrum Master': 'Sprint planning & team oversight',
    Developer: 'Task execution & collaboration',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <AmbientBackground />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl w-full items-center relative z-10">
        
        {/* Left Side - Features & Branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="space-y-8">
            {/* Branding */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <motion.div 
                className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 10, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <ShieldCheck className="text-white w-7 h-7" />
              </motion.div>
              <div>
                <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">TrackFlow</h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 font-semibold mt-2">Enterprise Agile Management</p>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm"
            >
              Manage your agile workflow with real-time collaboration, intelligent analytics, and AI-powered insights.
            </motion.p>

            {/* Features Grid */}
            <motion.div 
              className="space-y-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                  whileHover={{ x: 8 }}
                  className="flex gap-4 p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border border-white/60 dark:border-slate-700/40 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all cursor-pointer group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-lg flex items-center justify-center group-hover:from-primary/30 group-hover:to-blue-500/30 transition-all">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{feature.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex gap-6 pt-4"
            >
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">75+</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Features</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Pages</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">0ms</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Database</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none p-8 border border-white/70 dark:border-slate-800/50 overflow-hidden relative">
            
            {/* Glassmorphic top accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/80 to-transparent dark:via-white/10"></div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">Sign in to manage your projects</p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2.5 flex items-center gap-2">
                  <Mail size={16} className="text-primary" />
                  Email Address
                </label>
                <motion.div 
                  className={`relative group rounded-2xl transition-all ${
                    focusedField === 'email' ? 'ring-2 ring-primary/50' : ''
                  } ${emailError ? 'ring-2 ring-red-500/50' : ''}`}
                  animate={{
                    boxShadow: focusedField === 'email' 
                      ? '0 0 0 1px rgb(var(--color-primary) / 0.3)' 
                      : '0 0 0 1px transparent'
                  }}
                >
                  <input 
                    type="email" 
                    value={email}
                    onChange={handleEmailChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-4 pr-4 py-3.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary dark:text-white transition-all text-sm font-medium"
                    placeholder="demo@trackflow.ai"
                    required
                  />
                  <AnimatePresence>
                    {email && validateEmail(email) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <CheckCircle2 className="text-green-500 w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <AnimatePresence>
                  {emailError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1"
                    >
                      ⚠ {emailError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2.5 flex items-center gap-2">
                  <Lock size={16} className="text-primary" />
                  Password
                </label>
                <motion.div 
                  className={`relative group rounded-2xl transition-all ${
                    focusedField === 'password' ? 'ring-2 ring-primary/50' : ''
                  }`}
                >
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-4 pr-12 py-3.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary dark:text-white transition-all text-sm font-medium"
                    placeholder="••••••••"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Role Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2.5 flex items-center gap-2">
                  <Users size={16} className="text-primary" />
                  Select Your Role
                </label>
                <motion.div 
                  className="grid grid-cols-3 gap-2.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  {['Admin', 'Scrum Master', 'Developer'].map((r) => (
                    <motion.button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`py-3 px-3 rounded-xl font-semibold text-sm transition-all border ${
                        role === r
                          ? 'bg-gradient-to-br from-primary to-blue-600 text-white border-primary/50 shadow-lg shadow-primary/30'
                          : 'bg-white/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 border-slate-200/50 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {r}
                    </motion.button>
                  ))}
                </motion.div>
                <AnimatePresence>
                  <motion.p
                    key={role}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 italic"
                  >
                    {roleDescriptions[role]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || emailError !== ''}
                className="w-full bg-gradient-to-r from-primary to-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 transition-all group disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <motion.div
                  animate={{ scale: isLoading ? 1 : 0 }}
                  className="absolute inset-0 bg-white/20"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-full h-full"
                  />
                </motion.div>
                
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    <LogIn className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    Sign In to TrackFlow
                    <motion.div
                      className="group-hover:translate-x-1 transition-transform"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between text-sm">
                <motion.button
                  whileHover={{ x: -2 }}
                  className="text-primary font-semibold hover:opacity-80 transition-opacity flex items-center gap-1"
                >
                  ← Back to Home
                </motion.button>
                <motion.button
                  whileHover={{ x: 2 }}
                  className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-medium"
                >
                  Forgot password?
                </motion.button>
              </div>
              <div className="text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
                New to TrackFlow?{' '}
                <a href="/register" className="text-primary font-bold hover:underline">
                  Create an account
                </a>
              </div>
            </motion.div>
          </div>

          {/* Demo Credentials Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl"
          >
            <p className="text-xs text-blue-900 dark:text-blue-100 font-medium">
              <span className="font-bold">Demo Account:</span> demo@trackflow.ai / password
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
