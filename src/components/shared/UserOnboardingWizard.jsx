import React, { useState } from 'react';
import { X, Code2, ArrowRight, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/helpers';
import { useTheme } from '../../context/ThemeContext';

const UserOnboardingWizard = ({ isOpen, onClose, selectedAvatar: propSelectedAvatar }) => {
  const { isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState(propSelectedAvatar || null);
  const [formData, setFormData] = useState({
    bio: '',
    experience: 'mid',
    skills: [],
    github: '',
    linkedin: '',
  });
  
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');

  const skillCategories = {
    'Frontend': ['React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Next.js'],
    'Backend': ['Node.js', 'Python', 'Java', 'C#', 'PHP', 'Docker', 'AWS'],
    'Database': ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase'],
    'DevOps': ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Jenkins'],
    'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin'],
  };

  const allSkills = Object.values(skillCategories).flat();

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill)) {
      setSelectedSkills([...selectedSkills, customSkill]);
      setCustomSkill('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const completeProfile = {
      ...formData,
      skills: selectedSkills,
      avatar: selectedAvatar,
    };
    console.log('Profile Submitted:', completeProfile);
    localStorage.setItem('trackflow_user_profile', JSON.stringify(completeProfile));
    onClose();
    setStep(1);
    setSelectedAvatar(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden my-auto">
              {/* Header with Enhanced Background */}
              <div className="relative h-32 bg-linear-to-r from-primary via-primary/80 to-primary/60 overflow-hidden flex items-end justify-between p-6 shrink-0">
                {/* Animated background elements */}
                <motion.div
                  animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute top-2 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                />
                <motion.div
                  animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-10 left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
                />

                {/* Content */}
                <div className="relative z-10">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-white mb-1 flex items-center gap-2"
                  >
                    <span className="text-4xl">🚀</span>
                    Complete Your Profile
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-white/80 text-sm font-medium"
                  >
                    Step <span className="font-bold text-white">{step} of 4</span> • {
                      step === 1 ? '🎨 Avatar & Bio' :
                      step === 2 ? '💻 Your Skills' :
                      step === 3 ? '🔗 Social Links' :
                      '✅ Review & Submit'
                    }
                  </motion.p>
                </div>

                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors text-white backdrop-blur-sm border border-white/20 z-20"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Progress Bar with Animation */}
              <div className="relative h-2 bg-gray-200 dark:bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 4) * 100}%` }}
                  transition={{ duration: 0.5, type: 'spring', damping: 20 }}
                  className="h-full bg-linear-to-r from-primary to-primary/70 shadow-lg shadow-primary/50"
                />
                {/* Shimmer effect */}
                <motion.div
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                />
              </div>

              {/* Content - Scrollable */}
              <div className="overflow-y-auto max-h-[calc(100vh-300px)] px-8 py-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Avatar & Basic Info */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Selected Avatar Display */}
                      {selectedAvatar && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-4 bg-linear-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-4 rounded-xl border-2 border-primary/30 shadow-md"
                        >
                          <motion.img
                            src={selectedAvatar.file}
                            alt={selectedAvatar.name}
                            className="w-16 h-16 rounded-lg object-cover shadow-md"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {selectedAvatar.emoji} {selectedAvatar.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                              {selectedAvatar.description}
                            </p>
                            <p className="text-xs text-primary font-semibold mt-2">✓ Avatar Selected</p>
                          </div>
                        </motion.div>
                      )}

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="flex text-sm font-semibold text-gray-900 dark:text-white mb-3 items-center gap-2">
                          <UserIcon className="inline w-4 h-4" />
                          Professional Bio
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded font-bold">optional</span>
                        </label>
                        <motion.textarea
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 }}
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:text-white resize-none transition-all"
                          rows="5"
                        />
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                          💡 Tip: Write 2-3 sentences about your professional background
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="flex text-sm font-semibold text-gray-900 dark:text-white mb-4 items-center gap-2">
                          <Code2 className="inline w-4 h-4" />
                          Experience Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'junior', label: 'Junior', desc: '0-2 years', emoji: '🌱' },
                            { value: 'mid', label: 'Mid-Level', desc: '2-5 years', emoji: '🚀' },
                            { value: 'senior', label: 'Senior', desc: '5+ years', emoji: '⭐' },
                          ].map(level => (
                            <motion.button
                              key={level.value}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setFormData(prev => ({ ...prev, experience: level.value }))}
                              className={cn(
                                "p-4 rounded-lg border-2 transition-all text-center relative overflow-hidden group",
                                formData.experience === level.value
                                  ? "border-primary bg-linear-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/15 shadow-lg shadow-primary/30"
                                  : "border-gray-200 dark:border-slate-700 hover:border-primary/50 bg-white dark:bg-slate-800/50"
                              )}
                            >
                              {/* Animated background for selected */}
                              {formData.experience === level.value && (
                                <motion.div
                                  layoutId="experience-bg"
                                  className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent"
                                />
                              )}
                              <div className="relative z-10">
                                <span className="text-2xl mb-2 block">{level.emoji}</span>
                                <p className="font-semibold text-gray-900 dark:text-white">{level.label}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{level.desc}</p>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Step 2: Skills */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="flex text-sm font-semibold text-gray-900 dark:text-white mb-4 items-center gap-2">
                          <Code2 className="inline w-4 h-4" />
                          Select Your Skills
                          <span className="text-xs bg-primary/20 text-primary dark:bg-primary/30 px-2 py-1 rounded-full">Step 2/4</span>
                        </label>
                        <p className="text-xs text-gray-600 dark:text-slate-400 mb-4">💡 Select skills that match your expertise</p>

                        {Object.entries(skillCategories).map(([category, skills], categoryIndex) => (
                          <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: categoryIndex * 0.05 }}
                            className="mb-6"
                          >
                            <h3 className="text-xs font-bold text-primary dark:text-primary/80 uppercase mb-3 flex items-center gap-2">
                              {category}
                              <span className="text-[10px] bg-primary/10 px-2 py-0.5 rounded text-primary font-semibold">
                                {skills.filter(s => selectedSkills.includes(s)).length}/{skills.length}
                              </span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {skills.map((skill, skillIndex) => {
                                const isSelected = selectedSkills.includes(skill);
                                return (
                                  <motion.button
                                    key={skill}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: categoryIndex * 0.05 + skillIndex * 0.02 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSkillToggle(skill)}
                                    className={cn(
                                      "px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium relative overflow-hidden group",
                                      isSelected
                                        ? "border-primary bg-linear-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30"
                                        : "border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                                    )}
                                  >
                                    {/* Shimmer effect on select */}
                                    {isSelected && (
                                      <motion.div
                                        animate={{ x: ['100%', '-100%'] }}
                                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                        className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                                      />
                                    )}
                                    <span className="relative z-10 flex items-center gap-1">
                                      {isSelected && <span>✓</span>}
                                      {skill}
                                    </span>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </motion.div>
                        ))}

                        {/* Custom Skill Input */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Add Custom Skill
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={customSkill}
                              onChange={(e) => setCustomSkill(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
                              placeholder="Enter a skill not listed above..."
                              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white text-sm"
                            />
                            <button
                              onClick={handleAddCustomSkill}
                              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {/* Selected Skills Display */}
                        {selectedSkills.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                              Selected Skills ({selectedSkills.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {selectedSkills.map(skill => (
                                <span
                                  key={skill}
                                  className="px-3 py-1.5 bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary rounded-full text-sm font-medium flex items-center gap-2"
                                >
                                  {skill}
                                  <button
                                    onClick={() => handleSkillToggle(skill)}
                                    className="hover:opacity-70 transition-opacity"
                                  >
                                    <X size={14} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Social Links */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <span>🔗</span>
                          Connect Your Profiles
                          <span className="text-xs bg-primary/20 text-primary dark:bg-primary/30 px-2 py-1 rounded-full font-bold">Step 3/4</span>
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-6">
                          Link your professional profiles to showcase your work and accomplishments
                        </p>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="flex text-sm font-semibold text-gray-900 dark:text-white mb-2 items-center gap-2">
                          <span>💻</span>
                          GitHub Profile URL
                          <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded font-bold">required</span>
                        </label>
                        <input
                          type="url"
                          name="github"
                          value={formData.github}
                          onChange={handleInputChange}
                          placeholder="https://github.com/username"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:text-white transition-all"
                        />
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                          🎯 Your GitHub profile helps showcase your code and contributions
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="flex text-sm font-semibold text-gray-900 dark:text-white mb-2 items-center gap-2">
                          <span>💼</span>
                          LinkedIn Profile URL
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded font-bold">optional</span>
                        </label>
                        <input
                          type="url"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:text-white transition-all"
                        />
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                          🔄 Connect your LinkedIn for professional networking opportunities
                        </p>
                      </motion.div>

                      {/* Preview Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg"
                      >
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                          ℹ️ Profile Preview
                        </p>
                        <p className="text-xs text-blue-800 dark:text-blue-300 mt-2">
                          These links will be visible on your team profile and help teammates discover your expertise
                        </p>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Step 4: Review */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Success Message */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, type: 'spring' }}
                        className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-900/30 rounded-lg p-6 flex items-center gap-4"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                          className="text-3xl"
                        >
                          ✨
                        </motion.div>
                        <div>
                          <p className="text-green-800 dark:text-green-400 font-bold text-sm">
                            Profile Complete!
                          </p>
                          <p className="text-green-700 dark:text-green-300 text-xs mt-1">
                            Your profile is ready to be submitted
                          </p>
                        </div>
                      </motion.div>

                      {/* Review Items */}
                      <div className="space-y-4">
                        {/* Avatar Review */}
                        {selectedAvatar && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
                          >
                            <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800 p-4">
                              <motion.img
                                whileHover={{ scale: 1.1 }}
                                src={selectedAvatar.file}
                                alt={selectedAvatar.name}
                                className="w-20 h-20 rounded-lg object-cover shadow-md"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {selectedAvatar.emoji} {selectedAvatar.name}
                                  </h3>
                                  <motion.span
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                                    className="text-xs bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-bold"
                                  >
                                    ✓
                                  </motion.span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                                  {selectedAvatar.description}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Bio Review */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-50 dark:bg-slate-800 px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              <span>👤</span> Bio
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-slate-400 p-4">
                            {formData.bio || <span className="italic text-gray-500">Not provided</span>}
                          </p>
                        </motion.div>

                        {/* Experience Review */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                          className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-50 dark:bg-slate-800 px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              <span>🚀</span> Experience Level
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-slate-400 p-4 capitalize font-medium">
                            {formData.experience}
                          </p>
                        </motion.div>

                        {/* Skills Review */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-50 dark:bg-slate-800 px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              <span>💻</span> Skills ({selectedSkills.length})
                            </h3>
                          </div>
                          <div className="p-4 flex flex-wrap gap-2">
                            {selectedSkills.length > 0 ? (
                              selectedSkills.map((skill, idx) => (
                                <motion.span
                                  key={skill}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.35 + idx * 0.05 }}
                                  className="px-3 py-1.5 bg-primary text-white rounded-full text-xs font-semibold shadow-md"
                                >
                                  {skill}
                                </motion.span>
                              ))
                            ) : (
                              <p className="text-xs text-gray-500 italic">No skills selected</p>
                            )}
                          </div>
                        </motion.div>

                        {/* Links Review */}
                        {(formData.github || formData.linkedin) && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
                          >
                            <div className="bg-gray-50 dark:bg-slate-800 px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <span>🔗</span> Professional Links
                              </h3>
                            </div>
                            <div className="p-4 space-y-2">
                              {formData.github && (
                                <a href={formData.github} target="_blank" rel="noopener noreferrer" className="block text-xs text-primary hover:underline truncate">
                                  💻 GitHub: {formData.github}
                                </a>
                              )}
                              {formData.linkedin && (
                                <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="block text-xs text-primary hover:underline truncate">
                                  💼 LinkedIn: {formData.linkedin}
                                </a>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
                <motion.button
                  whileHover={step > 1 ? { scale: 1.05 } : {}}
                  whileTap={step > 1 ? { scale: 0.95 } : {}}
                  onClick={() => step > 1 && setStep(step - 1)}
                  disabled={step === 1}
                  className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium disabled:hover:bg-transparent"
                >
                  ← Back
                </motion.button>

                {/* Step Indicators */}
                <div className="flex items-center gap-2.5">
                  {[1, 2, 3, 4].map(i => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: step === i ? 1.3 : 1,
                        background: step >= i ? 'var(--color-primary, #3b82f6)' : 'var(--color-gray, #d1d5db)',
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-2.5 w-2.5 rounded-full cursor-pointer"
                      onClick={() => i < step && setStep(i)}
                      title={`Step ${i}`}
                    />
                  ))}
                </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className={cn(
                      "flex items-center gap-2 px-7 py-2.5 rounded-lg transition-all font-bold",
                      step === 4
                        ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30"
                        : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30"
                    )}
                  >
                  {step === 4 ? (
                    <>
                      🎉 Complete
                    </>
                  ) : (
                    <>
                      Next
                      <motion.div
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight size={16} />
                      </motion.div>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserOnboardingWizard;
