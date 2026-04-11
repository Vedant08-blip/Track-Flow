import React, { useState } from 'react';
import { X, Code2, ArrowRight, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/helpers';

const UserOnboardingWizard = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
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
    };
    console.log('Profile Submitted:', completeProfile);
    localStorage.setItem('trackflow_user_profile', JSON.stringify(completeProfile));
    onClose();
    setStep(1);
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative h-32 bg-linear-to-r from-primary to-primary/60 flex items-end justify-between p-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Complete Your Profile</h1>
                  <p className="text-white/80 text-sm">Step {step} of 4</p>
                </div>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-gray-200 dark:bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 4) * 100}%` }}
                  className="h-full bg-primary transition-all duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-8 min-h-96">
                <AnimatePresence mode="wait">
                  {/* Step 1: Basic Info */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          <UserIcon className="inline mr-2 w-4 h-4" />
                          Professional Bio
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white resize-none"
                          rows="5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          <Code2 className="inline mr-2 w-4 h-4" />
                          Experience Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'junior', label: 'Junior', desc: '0-2 years' },
                            { value: 'mid', label: 'Mid-Level', desc: '2-5 years' },
                            { value: 'senior', label: 'Senior', desc: '5+ years' },
                          ].map(level => (
                            <button
                              key={level.value}
                              onClick={() => setFormData(prev => ({ ...prev, experience: level.value }))}
                              className={cn(
                                "p-4 rounded-lg border-2 transition-all text-center",
                                formData.experience === level.value
                                  ? "border-primary bg-primary/10 dark:bg-primary/20"
                                  : "border-gray-200 dark:border-slate-700 hover:border-primary/50"
                              )}
                            >
                              <p className="font-semibold text-gray-900 dark:text-white">{level.label}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">{level.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>
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
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">
                          <Code2 className="inline mr-2 w-4 h-4" />
                          Select Your Skills
                        </label>

                        {Object.entries(skillCategories).map(([category, skills]) => (
                          <div key={category} className="mb-5">
                            <h3 className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase mb-3">{category}</h3>
                            <div className="flex flex-wrap gap-2">
                              {skills.map(skill => (
                                <button
                                  key={skill}
                                  onClick={() => handleSkillToggle(skill)}
                                  className={cn(
                                    "px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium",
                                    selectedSkills.includes(skill)
                                      ? "border-primary bg-primary text-white shadow-lg shadow-primary/30"
                                      : "border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-primary/50"
                                  )}
                                >
                                  {skill}
                                </button>
                              ))}
                            </div>
                          </div>
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
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          💻 GitHub Profile URL
                        </label>
                        <input
                          type="url"
                          name="github"
                          value={formData.github}
                          onChange={handleInputChange}
                          placeholder="https://github.com/username"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                          Your GitHub profile helps us showcase your work and contributions
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          LinkedIn Profile URL (Optional)
                        </label>
                        <input
                          type="url"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                          Connect your LinkedIn for professional networking
                        </p>
                      </div>
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
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg p-4">
                        <p className="text-green-800 dark:text-green-400 text-sm font-medium">
                          ✓ Your profile is ready to be submitted!
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Bio</h3>
                          <p className="text-sm text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">
                            {formData.bio || 'Not provided'}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Experience</h3>
                          <p className="text-sm text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 p-3 rounded-lg capitalize">
                            {formData.experience}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Skills ({selectedSkills.length})
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedSkills.map(skill => (
                              <span key={skill} className="px-3 py-1 bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary rounded-full text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">GitHub</h3>
                          <p className="text-sm text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">
                            {formData.github || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
                <button
                  onClick={() => step > 1 && setStep(step - 1)}
                  disabled={step === 1}
                  className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Back
                </button>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={cn(
                        "h-2 w-2 rounded-full transition-all",
                        step >= i ? "bg-primary" : "bg-gray-300 dark:bg-slate-600"
                      )}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors font-medium"
                >
                  {step === 4 ? 'Complete' : 'Next'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserOnboardingWizard;
