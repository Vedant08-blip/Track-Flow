import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Users, 
  GitBranch, 
  Calendar, 
  ArrowRight,
  Zap,
  Target
} from 'lucide-react';
import TimeTracker from '../components/shared/TimeTracker';
import SkillBasedAssignmentPanel from '../components/shared/SkillBasedAssignmentPanel';
import GitHubIntegration from '../components/shared/GitHubIntegration';
import GoogleCalendarIntegration from '../components/shared/GoogleCalendarIntegration';
import UserOnboardingWizard from '../components/shared/UserOnboardingWizard';

const FeaturesShowcasePage = () => {
  const [selectedTab, setSelectedTab] = useState('time-tracking');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const features = [
    {
      id: 'time-tracking',
      name: 'Time Tracking',
      icon: Clock,
      description: 'Log hours, track variance, measure velocity',
      color: 'from-blue-500 to-cyan-500',
      stats: { logged: '24.5h', estimate: '30h', variance: '-5.5h' }
    },
    {
      id: 'skill-assignment',
      name: 'Skill-Based Assignment',
      icon: Users,
      description: 'Smart team member recommendations',
      color: 'from-violet-500 to-purple-500',
      stats: { match: '95%', available: '85%', score: '92%' }
    },
    {
      id: 'github-integration',
      name: 'GitHub Integration',
      icon: GitBranch,
      description: 'Link PRs, commits, and CI/CD status',
      color: 'from-gray-700 to-gray-900',
      stats: { prs: '3', commits: '12', coverage: '88%' }
    },
    {
      id: 'calendar-integration',
      name: 'Google Calendar',
      icon: Calendar,
      description: 'Schedule work sessions and meetings',
      color: 'from-teal-500 to-emerald-600',
      stats: { scheduled: '8h', upcoming: '4', synced: '100%' }
    }
  ];

  const selectedFeature = features.find(f => f.id === selectedTab);

  return (
    <div className="space-y-8">
      {/* Feature Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isSelected = selectedTab === feature.id;
          
          return (
            <motion.button
              key={feature.id}
              onClick={() => setSelectedTab(feature.id)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-xl text-left transition-all duration-300 group overflow-hidden ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 ring-2 ring-primary shadow-lg'
                  : 'bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-800/70'
              }`}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-linear-to-br ${feature.color}`}
              />

              <div className="relative z-10">
                {feature.id === 'github-integration' ? (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-linear-to-br from-gray-700 to-gray-900 text-white">
                    <img src="/github.png" alt="GitHub" className="w-6 h-6 object-contain rounded-full" />
                  </div>
                ) : (
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-linear-to-br ${feature.color} text-white`}>
                    <Icon size={20} />
                  </div>
                )}

                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {feature.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                  {feature.description}
                </p>

                <div className="text-xs font-medium text-primary">
                  View Details <ArrowRight className="inline w-3 h-3 ml-1" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Feature Details */}
      <AnimatePresence mode="wait">
        {selectedFeature && (
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(selectedFeature.stats).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`bg-linear-to-br ${selectedFeature.color} rounded-xl p-4 text-white`}
                >
                  <div className="text-xs font-medium opacity-90 capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-2xl font-bold">{value}</div>
                </motion.div>
              ))}
            </div>

            {/* Feature Component Preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
            >
              {selectedTab === 'time-tracking' && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Time Tracking Demo</h3>
                  <TimeTracker storyId="US-101" storyTitle="Implement OAuth2 Authentication" />
                </div>
              )}

              {selectedTab === 'skill-assignment' && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Team Setup & Profile Management</h3>
                  <div className="space-y-4">
                    {userProfile ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800/50"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-green-900 dark:text-green-300 mb-1">Profile Setup Complete!</h4>
                            <p className="text-sm text-green-800 dark:text-green-400">All your information has been saved securely.</p>
                          </div>
                          <span className="text-3xl">✓</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-green-700 dark:text-green-400 font-semibold">Name</p>
                            <p className="text-sm font-semibold text-green-900 dark:text-green-300">{userProfile.fullName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-green-700 dark:text-green-400 font-semibold">Role</p>
                            <p className="text-sm font-semibold text-green-900 dark:text-green-300">{userProfile.role}</p>
                          </div>
                          <div>
                            <p className="text-xs text-green-700 dark:text-green-400 font-semibold">Skills Added</p>
                            <p className="text-sm font-semibold text-green-900 dark:text-green-300">{userProfile.skills?.length || 0} skills</p>
                          </div>
                          <div>
                            <p className="text-xs text-green-700 dark:text-green-400 font-semibold">GitHub</p>
                            <p className="text-sm font-semibold text-green-900 dark:text-green-300">{userProfile.github?.connected ? 'Connected' : 'Not connected'}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => setShowOnboarding(true)}
                          className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                        >
                          Edit Profile
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/50"
                      >
                        <h4 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">Get Started with TrackFlow</h4>
                        <p className="text-sm text-blue-800 dark:text-blue-400 mb-4">Complete your profile setup to unlock smart assignment recommendations, GitHub integration, and calendar sync.</p>
                        
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-bold">1.</span>
                            <span className="text-sm text-slate-700 dark:text-slate-300">Enter your profile information</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-bold">2.</span>
                            <span className="text-sm text-slate-700 dark:text-slate-300">Add your technical skills & expertise</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-bold">3.</span>
                            <span className="text-sm text-slate-700 dark:text-slate-300">Connect your GitHub account</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-bold">4.</span>
                            <span className="text-sm text-slate-700 dark:text-slate-300">Sync your Google Calendar</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setShowOnboarding(true)}
                          className="w-full px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors"
                        >
                          Start Setup Wizard
                        </button>
                      </motion.div>
                    )}
                  </div>
                  
                  <UserOnboardingWizard 
                    isOpen={showOnboarding}
                    onComplete={(profile) => {
                      setUserProfile(profile);
                      setShowOnboarding(false);
                    }}
                  />
                </div>
              )}

              {selectedTab === 'github-integration' && (
                <div className="space-y-6">
                  {/* Featured Pull Request Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-sm">✓</div>
                          <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold border border-green-200 dark:border-green-800/50 rounded-full">Open</span>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">OAuth2 Authentication Flow</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <span className="font-mono text-sm bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded">#2847</span>
                          <span>Created 2 days ago by Alice Chen</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Build Status</div>
                        <div className="flex items-center gap-2 justify-end">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">Passing</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 py-4 border-y border-gray-200 dark:border-gray-700">
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Commits</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">8</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Files Changed</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">12</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">+Additions</div>
                        <div className="text-xl font-bold text-green-600 dark:text-green-400">+245</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">-Deletions</div>
                        <div className="text-xl font-bold text-red-600 dark:text-red-400">-89</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Reviews:</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded">2 approved</span>
                        <span className="px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs font-semibold rounded">1 pending</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Comments:</span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded">15</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Original Integration Component */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <img src="/github.png" alt="GitHub" className="w-5 h-5" />
                      GitHub Repository Integration
                    </h3>
                    <GitHubIntegration storyId="US-101" />
                  </div>

                  {/* GitHub Branches with Real GitHub Styling */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mr-2"></span> Branch Activity
                    </h4>
                    <div className="space-y-3">
                      {[
                        { branch: 'main', commits: 142, lastUpdate: '2 hours ago', color: 'blue' },
                        { branch: 'develop', commits: 87, lastUpdate: '30 minutes ago', color: 'green' },
                        { branch: 'feature/oauth2', commits: 12, lastUpdate: 'just now', color: 'purple' }
                      ].map((branch, idx) => {
                        const colorClasses = {
                          blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50',
                          green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50',
                          purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50'
                        };
                        return (
                          <div key={idx} className={`${colorClasses[branch.color]} rounded-lg p-4 border flex items-center justify-between hover:shadow-md transition-shadow`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${branch.color === 'blue' ? 'bg-blue-500' : branch.color === 'green' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                              <div>
                                <div className="font-semibold text-slate-900 dark:text-white">{branch.branch}</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-mono">{branch.commits} commits</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{branch.lastUpdate}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">Last push</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Commit History Timeline - GitHub Style */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mr-2"></span> Recent Commits
                    </h4>
                    <div className="space-y-4">
                      {[
                        { hash: 'a3f2b1e', author: 'Alice Chen', message: 'feat: implement OAuth2 token refresh', time: '2 hours ago' },
                        { hash: 'c9d8e2f', author: 'Bob Smith', message: 'fix: resolve CORS issues in authentication', time: '4 hours ago' },
                        { hash: 'e7f4a2b', author: 'Charlie Brown', message: 'docs: update authentication flow diagram', time: '1 day ago' }
                      ].map((commit, idx) => (
                        <div key={idx} className="border-l-2 border-gray-300 dark:border-gray-600 pl-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded px-4 -mx-4 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-2 py-1 rounded font-semibold">{commit.hash}</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">{commit.message}</span>
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                <span>{commit.author}</span>
                              </div>
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 ml-2 whitespace-nowrap">{commit.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Pull Requests List - GitHub Style */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mr-2"></span> Related Pull Requests
                    </h4>
                    <div className="space-y-3">
                      {[
                        { number: '#2847', title: 'OAuth2 Authentication Flow', status: 'open', reviews: 2, comments: 5, color: 'green', commits: 8 },
                        { number: '#2834', title: 'Add JWT token validation', status: 'merged', reviews: 3, comments: 12, color: 'purple', commits: 5 },
                        { number: '#2821', title: 'Implement logout functionality', status: 'open', reviews: 1, comments: 3, color: 'green', commits: 3 }
                      ].map((pr, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`w-2 h-2 rounded-full ${pr.color === 'green' ? 'bg-green-500' : 'bg-purple-500'}`}></span>
                                <span className="font-mono text-sm font-semibold text-slate-600 dark:text-slate-300">{pr.number}</span>
                                <span className="font-semibold text-slate-900 dark:text-white truncate">{pr.title}</span>
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">
                                {pr.commits} commits
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                              pr.status === 'open' 
                                ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50' 
                                : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50'
                            }`}>
                              {pr.status === 'open' ? 'Open' : 'Merged'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-gray-200 dark:border-gray-600">
                            <span className="flex items-center gap-1"><strong>{pr.reviews}</strong> {pr.reviews === 1 ? 'review' : 'reviews'}</span>
                            <span className="flex items-center gap-1"><strong>{pr.comments}</strong> {pr.comments === 1 ? 'comment' : 'comments'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>


                </div>
              )}

              {selectedTab === 'calendar-integration' && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Calendar Integration Demo</h3>
                  <GoogleCalendarIntegration 
                    storyId="US-101" 
                    storyTitle="Implement OAuth2 Authentication"
                  />
                </div>
              )}
            </motion.div>

            {/* Key Benefits & Integration Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Key Benefits */}
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target size={20} /> Key Benefits
                </h4>
                <ul className="space-y-2">
                  {selectedTab === 'time-tracking' && [
                    'Track actual vs estimated hours per story',
                    'Measure team velocity and capacity',
                    'Identify bottlenecks early',
                    'Improve sprint forecasting',
                    'Generate time-based reports'
                  ].map((benefit, idx) => (
                    <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                  {selectedTab === 'skill-assignment' && [
                    'Find best-matched team members',
                    'Optimize skill utilization',
                    'Identify training needs',
                    'Balance team workload',
                    'Accelerate onboarding'
                  ].map((benefit, idx) => (
                    <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                  {selectedTab === 'github-integration' && [
                    'Link code changes to stories automatically',
                    'Track CI/CD pipeline status in real-time',
                    'Monitor code review progress with AI insights',
                    'View deployment status with rollback safety',
                    'Measure code quality metrics (coverage, complexity, security)',
                    'Get AI suggestions on code improvements & refactoring',
                    'Detect performance regressions automatically',
                    'Flag security vulnerabilities before merge',
                    'See contributor stats & expertise scoring',
                    'Automated code review checklist generation'
                  ].map((benefit, idx) => (
                    <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                  {selectedTab === 'calendar-integration' && [
                    'Schedule work blocks on calendar',
                    'Plan team meetings',
                    'Sync with Google Calendar',
                    'Check team availability',
                    'Reduce context switching'
                  ].map((benefit, idx) => (
                    <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* How It Works */}
              <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/50">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <Zap size={20} /> How It Works
                </h4>
                {selectedTab === 'time-tracking' && (
                  <div className="text-sm text-blue-800 dark:text-blue-400 space-y-3">
                    <ol className="space-y-2 list-decimal list-inside">
                      <li><strong>Set Estimate:</strong> When creating a story, add the estimated hours for completion</li>
                      <li><strong>Log Time:</strong> Team members log actual hours spent on work, meetings, and reviews</li>
                      <li><strong>Track Variance:</strong> System calculates difference between estimated vs actual hours</li>
                      <li><strong>Analyze Patterns:</strong> View weekly data to identify productivity trends and bottlenecks</li>
                      <li><strong>Improve Forecasts:</strong> Use historical velocity to improve future sprint estimations</li>
                    </ol>
                  </div>
                )}
                {selectedTab === 'skill-assignment' && (
                  <div className="text-sm text-blue-800 dark:text-blue-400 space-y-3">
                    <ol className="space-y-2 list-decimal list-inside">
                      <li><strong>Team Profile Setup:</strong> Add team members with their skills, certifications, and expertise levels</li>
                      <li><strong>Match Requirements:</strong> Specify required skills and seniority level for each story</li>
                      <li><strong>AI Recommendation:</strong> System analyzes 5 key factors and ranks best matches</li>
                      <li><strong>View Score Breakdown:</strong> See exactly why someone is recommended (95% match, 85% available, 92% score)</li>
                      <li><strong>Smart Assignment:</strong> Assign with confidence knowing it optimizes skills and workload balance</li>
                    </ol>
                  </div>
                )}
                {selectedTab === 'github-integration' && (
                  <div className="text-sm text-blue-800 dark:text-blue-400 space-y-3">
                    <ol className="space-y-2 list-decimal list-inside">
                      <li><strong>Connect GitHub:</strong> Authenticate with your GitHub account in settings</li>
                      <li><strong>Link Pull Requests:</strong> Associate GitHub PRs with TrackFlow stories by PR number</li>
                      <li><strong>Track CI/CD:</strong> Monitor build status, test coverage, and deployment progress automatically</li>
                      <li><strong>Review Status:</strong> See code review status (Approved / Pending / Changes Requested)</li>
                      <li><strong>View Commits:</strong> Browse commits linked to story, author info, and timestamps</li>
                    </ol>
                  </div>
                )}
                {selectedTab === 'calendar-integration' && (
                  <div className="text-sm text-blue-800 dark:text-blue-400 space-y-3">
                    <ol className="space-y-2 list-decimal list-inside">
                      <li><strong>Connect Calendar:</strong> Authorize Google Calendar access for seamless sync</li>
                      <li><strong>Schedule Work Sessions:</strong> Create focused work blocks on calendar for specific stories</li>
                      <li><strong>Plan Team Meetings:</strong> Schedule standup, planning, and review sessions with team</li>
                      <li><strong>Check Availability:</strong> System shows team member availability before scheduling</li>
                      <li><strong>Auto-Sync:</strong> Events sync automatically - changes in TrackFlow update calendar and vice versa</li>
                    </ol>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeaturesShowcasePage;
