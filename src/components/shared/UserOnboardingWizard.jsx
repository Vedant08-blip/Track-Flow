import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  X, 
  Check,
  GitBranch,
  User,
  Code,
  Calendar
} from 'lucide-react';
import { useSkillBasedAssignment } from '../../context/SkillBasedAssignmentContext';
import useUserProfile from '../../hooks/useUserProfile';

const UserOnboardingWizard = ({ isOpen, onComplete }) => {
  const { setTeamMembers } = useSkillBasedAssignment();
  const { userProfile: savedProfile } = useUserProfile();
  const [currentStep, setCurrentStep] = useState(0);
  
  // User Profile
  const [userProfile, setUserProfile] = useState({
    fullName: savedProfile?.name || '',
    email: savedProfile?.email || '',
    role: savedProfile?.role || '',
    seniority: savedProfile?.seniority || 'mid-level',
    department: savedProfile?.department || '',
    joinDate: savedProfile?.joinDate || new Date().toISOString().split('T')[0]
  });

  // Skills
  const [skills, setSkills] = useState(savedProfile?.skills || []);
  const [newSkill, setNewSkill] = useState({ name: '', level: 3, years: 0 });

  // GitHub Integration
  const [githubIntegration, setGithubIntegration] = useState(
    savedProfile?.github || { username: '', token: '', connected: false }
  );

  // Calendar Integration
  const [calendarIntegration, setCalendarIntegration] = useState(
    savedProfile?.calendar || { email: '', connected: false }
  );

  const steps = [
    { id: 'profile', title: 'Profile', icon: User },
    { id: 'skills', title: 'Skills', icon: Code },
    { id: 'github', title: 'GitHub', icon: GitBranch },
    { id: 'calendar', title: 'Calendar', icon: Calendar }
  ];

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    setSkills([...skills, { ...newSkill, level: parseInt(newSkill.level), years: parseInt(newSkill.years) }]);
    setNewSkill({ name: '', level: 3, years: 0 });
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleCompleteOnboarding = () => {
    // Create user profile with all information
    const userProfileComplete = {
      id: `user-${Date.now()}`,
      name: userProfile.fullName,
      email: userProfile.email,
      role: userProfile.role || 'Team Member',
      seniority: userProfile.seniority,
      department: userProfile.department,
      joinDate: userProfile.joinDate,
      skills: skills,
      github: githubIntegration,
      calendar: calendarIntegration,
      availability: 85,
      workloadScore: 65,
      totalScore: 75
    };

    // Save to context and local storage
    const existingMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
    const updatedMembers = [...existingMembers, userProfileComplete];
    localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
    setTeamMembers(updatedMembers);

    // Mark onboarding as complete
    localStorage.setItem('userOnboarded', 'true');
    localStorage.setItem('currentUser', JSON.stringify(userProfileComplete));

    onComplete?.(userProfileComplete);
  };

  if (!isOpen) return null;

  const getStepContent = () => {
    switch (currentStep) {
      case 0: // Profile
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Full Name</label>
              <input
                type="text"
                value={userProfile.fullName}
                onChange={(e) => setUserProfile({ ...userProfile, fullName: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Email</label>
              <input
                type="email"
                value={userProfile.email}
                onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Job Title / Role</label>
              <input
                type="text"
                value={userProfile.role}
                onChange={(e) => setUserProfile({ ...userProfile, role: e.target.value })}
                placeholder="e.g., Frontend Developer, Product Manager"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Seniority Level</label>
                <select
                  value={userProfile.seniority}
                  onChange={(e) => setUserProfile({ ...userProfile, seniority: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="junior">Junior</option>
                  <option value="mid-level">Mid-Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Department</label>
                <input
                  type="text"
                  value={userProfile.department}
                  onChange={(e) => setUserProfile({ ...userProfile, department: e.target.value })}
                  placeholder="e.g., Engineering"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>
        );

      case 1: // Skills
        return (
          <motion.div
            key="skills"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-300">Add your technical and professional skills to help with smart assignment recommendations.</p>
            </div>

            {/* Add Skill Form */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="e.g., React, TypeScript, AWS"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Proficiency Level</label>
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="1">Beginner</option>
                    <option value="2">Elementary</option>
                    <option value="3">Intermediate</option>
                    <option value="4">Advanced</option>
                    <option value="5">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={newSkill.years}
                    onChange={(e) => setNewSkill({ ...newSkill, years: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handleAddSkill}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add Skill
              </button>
            </div>

            {/* Skills List */}
            <div className="space-y-2">
              {skills.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No skills added yet</p>
              ) : (
                skills.map((skill, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 dark:text-white">{skill.name}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'][skill.level - 1]} • {skill.years} {skill.years === 1 ? 'year' : 'years'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveSkill(idx)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        );

      case 2: // GitHub
        return (
          <motion.div
            key="github"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-lg p-4">
              <p className="text-sm text-purple-900 dark:text-purple-300">Connect your GitHub account to link pull requests and track commits automatically.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">GitHub Username</label>
              <input
                type="text"
                value={githubIntegration.username}
                onChange={(e) => setGithubIntegration({ ...githubIntegration, username: e.target.value })}
                placeholder="your-github-username"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">GitHub Personal Access Token</label>
              <input
                type="password"
                value={githubIntegration.token}
                onChange={(e) => setGithubIntegration({ ...githubIntegration, token: e.target.value })}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Create a token at <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">github.com/settings/tokens</a>
              </p>
            </div>

            <button
              onClick={() => setGithubIntegration({ ...githubIntegration, connected: !githubIntegration.connected })}
              className={`w-full py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                githubIntegration.connected
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white'
              }`}
            >
              {githubIntegration.connected ? <Check size={18} /> : <GitBranch size={18} />}
              {githubIntegration.connected ? 'Connected' : 'Connect GitHub'}
            </button>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">What we'll access:</h4>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Pull request history and status</li>
                <li>• Commit information and activity</li>
                <li>• Repository access and collaboration</li>
                <li>• Code review participation</li>
              </ul>
            </div>
          </motion.div>
        );

      case 3: // Calendar
        return (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg p-4">
              <p className="text-sm text-green-900 dark:text-green-300">Connect your Google Calendar to sync work sessions and team meetings.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Google Calendar Email</label>
              <input
                type="email"
                value={calendarIntegration.email}
                onChange={(e) => setCalendarIntegration({ ...calendarIntegration, email: e.target.value })}
                placeholder="your-email@gmail.com"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setCalendarIntegration({ ...calendarIntegration, connected: !calendarIntegration.connected })}
              className={`w-full py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                calendarIntegration.connected
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white'
              }`}
            >
              {calendarIntegration.connected ? <Check size={18} /> : <Calendar size={18} />}
              {calendarIntegration.connected ? 'Connected' : 'Connect Calendar'}
            </button>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">Calendar features:</h4>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Auto-sync work sessions from TrackFlow</li>
                <li>• View team availability</li>
                <li>• Schedule meetings with conflict detection</li>
                <li>• Track focus time and breaks</li>
              </ul>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return userProfile.fullName.trim() && userProfile.email.trim() && userProfile.role.trim();
      case 1:
        return skills.length > 0;
      case 2:
        return githubIntegration.username.trim() && githubIntegration.token.trim();
      case 3:
        return calendarIntegration.email.trim();
      default:
        return false;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-linear-to-r from-primary to-primary-dark text-white p-6">
            <h1 className="text-2xl font-bold mb-2">Welcome to TrackFlow</h1>
            <p className="text-sm opacity-90">Complete your profile to get started</p>
          </div>

          {/* Progress Steps */}
          <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => {
                const StepIcon = step.icon;
                const isActive = idx === currentStep;
                const isCompleted = idx < currentStep;
                
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <motion.div
                      className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-primary text-white ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
                          : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isCompleted ? <Check size={18} /> : <StepIcon size={18} />}
                    </motion.div>
                    
                    <div className="ml-3 hidden sm:block">
                      <p className={`text-sm font-semibold ${
                        isActive ? 'text-primary' : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {step.title}
                      </p>
                    </div>

                    {idx < steps.length - 1 && (
                      <div className={`flex-1 h-1 mx-4 rounded transition-colors ${
                        isCompleted ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {getStepContent()}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <ChevronLeft size={18} /> Previous
            </button>

            <div className="text-sm text-slate-600 dark:text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </div>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleCompleteOnboarding}
                disabled={!isStepValid()}
                className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={18} /> Complete Setup
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isStepValid()}
                className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={18} />
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserOnboardingWizard;
