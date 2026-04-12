import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AmbientBackground from '../components/shared/AmbientBackground';
import MagneticStatCard from '../components/shared/MagneticStatCard';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Developer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Set dark theme as default on mount
  useEffect(() => {
    if (!isDark) {
      toggleTheme();
    }
  }, [isDark, toggleTheme]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFullNameChange = (event) => {
    const value = event.target.value;
    setFullName(value);
    setErrors((prev) => {
      const next = { ...prev };
      if (!value.trim()) {
        next.fullName = 'Full name is required';
      } else {
        delete next.fullName;
      }
      return next;
    });
  };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    setErrors((prev) => {
      const next = { ...prev };
      if (!value.trim()) {
        next.email = 'Email is required';
      } else if (!validateEmail(value)) {
        next.email = 'Please enter a valid email address';
      } else {
        delete next.email;
      }
      return next;
    });
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    setErrors((prev) => {
      const next = { ...prev };
      if (!value.trim()) {
        next.password = 'Password is required';
      } else if (value.length < 6) {
        next.password = 'Password must be at least 6 characters';
      } else {
        delete next.password;
      }

      if (confirmPassword.trim() && value !== confirmPassword) {
        next.confirmPassword = 'Passwords do not match';
      } else if (confirmPassword.trim()) {
        delete next.confirmPassword;
      }

      return next;
    });
  };

  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;
    setConfirmPassword(value);
    setErrors((prev) => {
      const next = { ...prev };
      if (!value.trim()) {
        next.confirmPassword = 'Please confirm your password';
      } else if (value !== password) {
        next.confirmPassword = 'Passwords do not match';
      } else {
        delete next.confirmPassword;
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate account creation
    setTimeout(() => {
      setSuccessMessage('Account created successfully! Redirecting...');
      
      setTimeout(() => {
        // Auto-login the new user
        login(email, password, role);
        navigate('/dashboard');
        setIsLoading(false);
      }, 1200);
    }, 800);
  };

  const roleDescriptions = {
    Admin: 'Full platform access & team management',
    'Scrum Master': 'Sprint planning & team oversight',
    Developer: 'Task execution & collaboration',
  };

  const magneticStats = [
    { title: '7,000+', subtitle: 'Lines of Code' },
    { title: '< 2s', subtitle: 'Build Time' },
    { title: '100%', subtitle: 'User Data Privacy' },
  ];

  return (
    <div className="min-h-screen w-screen bg-linear-to-br from-slate-950 to-slate-900 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <AmbientBackground />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Two Column Grid Layout */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10 items-center">
        
        {/* Left Column - Features */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="hidden lg:block space-y-8"
        >
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <h1 className="text-6xl font-black text-white mb-3 tracking-tight">TrackFlow</h1>
            <p className="text-slate-300 text-lg font-medium">
              Modern agile project management built for high-performing teams.
            </p>
          </motion.div>

          <div className="space-y-5">
            {[
              { title: 'Real-time Collaboration', desc: 'Keep your team aligned with instant updates and shared boards.' },
              { title: 'AI Insights', desc: 'Get intelligent recommendations for better sprint planning.' },
              { title: 'Smart Analytics', desc: 'Track velocity, burndown, and team performance with detailed metrics.' },
              { title: 'Time Tracking', desc: 'Monitor focus time and productivity across your entire team.' },
              { title: 'Custom Workflows', desc: 'Tailor TrackFlow to match your team\'s unique process.' }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex gap-4 group cursor-pointer"
              >
                <div className="h-10 w-10 rounded-lg bg-linear-to-br from-primary/20 to-blue-500/20 text-primary flex items-center justify-center font-black text-lg shrink-0 group-hover:scale-110 transition-transform">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="pt-0.5">
                  <p className="text-white font-semibold group-hover:text-primary transition-colors">{feature.title}</p>
                  <p className="text-slate-400 text-sm mt-1">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {magneticStats.map((stat) => (
              <MagneticStatCard key={stat.title} title={stat.title} subtitle={stat.subtitle} />
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column - Register Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md justify-self-center lg:justify-self-end relative z-10"
        >
          <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-3xl rounded-2xl shadow-2xl shadow-slate-300/40 dark:shadow-black/60 p-8 border border-white/80 dark:border-slate-700/60 overflow-hidden relative group">
            
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-blue-600/5 dark:from-primary/10 dark:to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            
            {/* Shine effect */}
            <motion.div
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0"
              initial={{ x: '-120%' }}
              animate={{ x: '220%' }}
              transition={{ duration: 2, ease: 'easeInOut', delay: 0.5, repeat: Infinity, repeatDelay: 3 }}
            />
            
            {/* Glassmorphic top accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/60 to-transparent dark:via-white/20"></div>

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
                className="inline-block mb-4 p-3 bg-linear-to-br from-primary/20 to-blue-600/20 dark:from-primary/30 dark:to-blue-600/30 rounded-xl"
              >
                <User className="w-6 h-6 text-primary" />
              </motion.div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-sm">Join TrackFlow and start managing your agile projects</p>
            </motion.div>

            {/* Success Message */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-lg flex items-center gap-3 relative z-10"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{successMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              
              {/* Full Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <label className="flex text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 uppercase tracking-wider items-center gap-2">
                  <div className="p-1.5 bg-primary/15 dark:bg-primary/25 rounded-lg">
                    <User size={14} className="text-primary" />
                  </div>
                  Full Name
                </label>
                <motion.div 
                  className={`relative group rounded-xl transition-all duration-300 ${
                    focusedField === 'fullName' ? 'ring-2 ring-primary/60 shadow-lg shadow-primary/20' : 'shadow-md shadow-slate-200/30 dark:shadow-black/20'
                  } ${errors.fullName ? 'ring-2 ring-red-500/60' : ''}`}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-blue-600/5 dark:from-primary/0 dark:via-primary/10 dark:to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={handleFullNameChange}
                    onFocus={() => setFocusedField('fullName')}
                    onBlur={() => setFocusedField(null)}
                    className="relative w-full pl-4 pr-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-0 dark:text-white transition-all text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="John Doe"
                    required
                  />
                </motion.div>
                <AnimatePresence>
                  {errors.fullName && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-red-500 text-xs font-medium mt-1.5"
                    >
                      ⚠ {errors.fullName}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
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
                  } ${errors.email ? 'ring-2 ring-red-500/60' : ''}`}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-blue-600/5 dark:from-primary/0 dark:via-primary/10 dark:to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={handleEmailChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="relative w-full pl-4 pr-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-0 dark:text-white transition-all text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="you@example.com"
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
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-red-500 text-xs font-medium mt-1.5"
                    >
                      ⚠ {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
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
                  } ${errors.password ? 'ring-2 ring-red-500/60' : ''}`}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-blue-600/5 dark:from-primary/0 dark:via-primary/10 dark:to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="relative w-full pl-4 pr-12 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-0 dark:text-white transition-all text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="••••••••"
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
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-red-500 text-xs font-medium mt-1.5"
                    >
                      ⚠ {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label className="flex text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 uppercase tracking-wider items-center gap-2">
                  <div className="p-1.5 bg-primary/15 dark:bg-primary/25 rounded-lg">
                    <Lock size={14} className="text-primary" />
                  </div>
                  Confirm Password
                </label>
                <motion.div 
                  className={`relative group rounded-xl transition-all duration-300 ${
                    focusedField === 'confirmPassword' ? 'ring-2 ring-primary/60 shadow-lg shadow-primary/20' : 'shadow-md shadow-slate-200/30 dark:shadow-black/20'
                  } ${errors.confirmPassword ? 'ring-2 ring-red-500/60' : ''}`}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-blue-600/5 dark:from-primary/0 dark:via-primary/10 dark:to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    className="relative w-full pl-4 pr-12 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-0 dark:text-white transition-all text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="••••••••"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </motion.button>
                </motion.div>
                <AnimatePresence>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-red-500 text-xs font-medium mt-1.5"
                    >
                      ⚠ {errors.confirmPassword}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Role Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <label className="flex text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 uppercase tracking-wider items-center gap-2">
                  <div className="p-1.5 bg-primary/15 dark:bg-primary/25 rounded-lg">
                    <User size={14} className="text-primary" />
                  </div>
                  Select Your Role
                </label>
                <motion.div 
                  className="grid grid-cols-3 gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
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
                          ? 'bg-linear-to-br from-primary to-blue-600 text-white border-primary/60 shadow-lg shadow-primary/40 dark:shadow-primary/20'
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
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: isLoading ? 1 : 1.02, translateY: isLoading ? 0 : -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-primary via-primary to-blue-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/40 dark:shadow-primary/20 hover:shadow-xl hover:shadow-primary/50 dark:hover:shadow-primary/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden uppercase tracking-wide"
              >
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                  initial={false}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
                />
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    <User className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    <span>Create Account</span>
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

            {/* Footer Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/30 text-center relative z-10"
            >
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Already have an account?{' '}
                <motion.span
                  whileHover={{ textDecoration: 'underline' }}
                  className="text-primary dark:text-blue-400 font-bold hover:text-primary/80 transition-colors"
                >
                  <Link to="/login">Sign in</Link>
                </motion.span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
