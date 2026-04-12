import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogIn, Mail, Lock, ArrowRight, Eye, EyeOff, Users, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import AmbientBackground from '../components/shared/AmbientBackground';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Developer');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [emailError, setEmailError] = useState('');
  const { login } = useAuth();
  const { isDark, setIsDark } = useTheme();
  const navigate = useNavigate();

  // Set dark theme as default on mount
  useEffect(() => {
    setIsDark(true);
  }, [setIsDark]);

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

  const handleDemoLogin = () => {
    const demoEmail = 'demo@trackflow.ai';
    const demoPassword = 'password';
    const demoRole = 'Developer';

    setEmail(demoEmail);
    setPassword(demoPassword);
    setRole(demoRole);
    setEmailError('');
    setIsLoading(true);

    login(demoEmail, demoPassword, demoRole);
    navigate('/dashboard');
    setIsLoading(false);
  };

  const roleDescriptions = {
    Admin: 'Full platform access & team management',
    'Scrum Master': 'Sprint planning & team oversight',
    Developer: 'Task execution & collaboration',
  };

  const MagneticStat = ({ label, value }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.3 });
    const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.3 });

    const onMove = (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;
      x.set(offsetX * 0.1);
      y.set(offsetY * 0.1);
    };

    const onLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ x: springX, y: springY }}
        className="bg-white/5 rounded-xl py-3 transition-colors duration-300 hover:bg-white/10"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <p className="text-slate-300 text-xs uppercase tracking-wider">{label}</p>
        <p className="text-white font-black text-lg">{value}</p>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-950 to-slate-900 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <AmbientBackground />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">

          {/* Features Panel - Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="w-full order-2 lg:order-1"
          >
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-300/80 font-semibold">Features</p>
                <h3 className="text-3xl font-black text-white mt-2">Features of Track Flow</h3>
                <p className="text-slate-300 text-sm mt-2 max-w-lg">
                  Built for modern teams who ship fast, stay aligned, and love clarity.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-9 w-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <p className="text-white font-semibold">Team & Collaboration</p>
                    <p className="text-slate-300 text-sm">Keep squads aligned with shared boards, updates, and goals.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-9 w-9 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <p className="text-white font-semibold">AI & Intelligence</p>
                    <p className="text-slate-300 text-sm">Chat Assistant and Intelligent Analysis for faster decisions.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <p className="text-white font-semibold">Custom Design & Theme</p>
                    <p className="text-slate-300 text-sm">Personalize the workspace to match your team’s style.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-9 w-9 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <p className="text-white font-semibold">Time Tracking & Analytics</p>
                    <p className="text-slate-300 text-sm">Measure focus time and performance with clear insights.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-9 w-9 rounded-full bg-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <p className="text-white font-semibold">GitHub Integration</p>
                    <p className="text-slate-300 text-sm">Repository & issue linking for seamless development flow.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-9 w-9 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                    6
                  </div>
                  <div>
                    <p className="text-white font-semibold">Professional Reports</p>
                    <p className="text-slate-300 text-sm">Generate PDF and CSV reports ready for stakeholders.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 dark:border-slate-700/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <MagneticStat label="Lines of Code" value="7,000+" />
                <MagneticStat label="Data Privacy" value="100% client-side" />
                <MagneticStat label="Load Time" value="< 2 seconds" />
              </div>
            </div>
          </motion.div>

          {/* Login Form - Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md justify-self-center lg:justify-self-end order-1 lg:order-2"
          >
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-3xl rounded-2xl shadow-2xl shadow-slate-300/40 dark:shadow-black/60 p-8 border border-white/80 dark:border-slate-700/60 overflow-hidden relative group">
          {/* Micro shine sweep */}
          <motion.div
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-40"
            initial={{ x: '-120%' }}
            animate={{ x: '220%' }}
            transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.2, repeat: Infinity, repeatDelay: 3.4 }}
          />
          
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-600/5 dark:from-primary/10 dark:to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
          
          {/* Glassmorphic top accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/20"></div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8 relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15, type: 'spring', stiffness: 200 }}
              className="inline-block mb-4 p-3 bg-gradient-to-br from-primary/20 to-blue-600/20 dark:from-primary/30 dark:to-blue-600/30 rounded-xl"
            >
              <LogIn className="w-6 h-6 text-primary" />
            </motion.div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-sm">Sign in to manage your agile projects</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <label className="flex text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 uppercase tracking-wider items-center gap-2">
                <div className="p-1.5 bg-primary/15 dark:bg-primary/25 rounded-lg">
                  <Mail size={14} className="text-primary" />
                </div>
                Email Address
              </label>
              <motion.div 
                className={`relative group rounded-xl transition-all duration-300 ${
                  focusedField === 'email' ? 'ring-2 ring-primary/60 shadow-lg shadow-primary/20' : 'shadow-md shadow-slate-200/30 dark:shadow-black/20'
                } ${emailError ? 'ring-2 ring-red-500/60' : ''}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-blue-600/5 dark:from-primary/0 dark:via-primary/10 dark:to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <input 
                  type="email" 
                  value={email}
                  onChange={handleEmailChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="relative w-full pl-4 pr-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-0 dark:text-white transition-all text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="Enter your email"
                  required
                />
                <AnimatePresence>
                  {email && validateEmail(email) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <CheckCircle2 className="text-emerald-500 w-5 h-5" />
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
                    className="text-red-500 text-xs font-medium mt-1.5"
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
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <label className="flex text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 uppercase tracking-wider items-center gap-2">
                <div className="p-1.5 bg-primary/15 dark:bg-primary/25 rounded-lg">
                  <Lock size={14} className="text-primary" />
                </div>
                Password
              </label>
              <motion.div 
                className={`relative group rounded-xl transition-all duration-300 ${
                  focusedField === 'password' ? 'ring-2 ring-primary/60 shadow-lg shadow-primary/20' : 'shadow-md shadow-slate-200/30 dark:shadow-black/20'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-blue-600/5 dark:from-primary/0 dark:via-primary/10 dark:to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="relative w-full pl-4 pr-12 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-0 dark:text-white transition-all text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="Enter your password"
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <label className="flex text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 uppercase tracking-wider items-center gap-2">
                <div className="p-1.5 bg-primary/15 dark:bg-primary/25 rounded-lg">
                  <Users size={14} className="text-primary" />
                </div>
                Select Your Role
              </label>
              <motion.div 
                className="grid grid-cols-3 gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                {['Admin', 'Scrum Master', 'Developer'].map((r) => (
                  <motion.button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    whileHover={{ scale: 1.05, translateY: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-2.5 px-3 rounded-lg font-semibold text-xs transition-all duration-300 border ${
                      role === r
                        ? 'bg-gradient-to-br from-primary to-blue-600 text-white border-primary/60 shadow-lg shadow-primary/40 dark:shadow-primary/20'
                        : 'bg-white/40 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border-slate-200/50 dark:border-slate-700/40 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:border-primary/40'
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
                  className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 italic font-medium"
                >
                  {roleDescriptions[role]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: isLoading ? 1 : 1.02, translateY: isLoading ? 0 : -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || emailError !== ''}
              className="w-full bg-gradient-to-r from-primary via-primary to-blue-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/40 dark:shadow-primary/20 hover:shadow-xl hover:shadow-primary/50 dark:hover:shadow-primary/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden uppercase tracking-wide"
            >
              {isLoading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                  <LogIn className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  <span>Sign In</span>
                  <motion.div
                    className="group-hover:translate-x-1 transition-transform"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </>
              )}
            </motion.button>
          </form>

          {/* Demo Login Button - Small and Subtle */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex justify-center mt-4 relative z-10"
          >
            <motion.button
              type="button"
              onClick={handleDemoLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/50 rounded-lg transition-all duration-300 flex items-center gap-1.5"
            >
              Quick Demo
            </motion.button>
          </motion.div>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/30 text-center relative z-10"
          >
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              New to TrackFlow?{' '}
              <motion.a 
                href="/register" 
                whileHover={{ textDecoration: 'underline' }}
                className="text-primary dark:text-blue-400 font-bold hover:text-primary/80 transition-colors"
              >
                Create account
              </motion.a>
            </p>
          </motion.div>
        </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
