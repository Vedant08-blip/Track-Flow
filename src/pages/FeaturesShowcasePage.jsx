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

const FeaturesShowcasePage = () => {
  const [selectedTab, setSelectedTab] = useState('time-tracking');

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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-r from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 text-white"
      >
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-3">Advanced Features</h1>
          <p className="text-lg text-slate-300 mb-6">
            Discover TrackFlow's enterprise-grade features designed to streamline your agile workflow.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Zap size={16} />
            <span>All features are fully integrated and production-ready</span>
          </div>
        </div>
      </motion.div>

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
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-linear-to-br ${feature.color} text-white`}>
                  <Icon size={20} />
                </div>

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
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Smart Assignment Demo</h3>
                  <SkillBasedAssignmentPanel 
                    storyId="US-101" 
                    requiredSkills={['React', 'TypeScript', 'AWS']}
                  />
                </div>
              )}

              {selectedTab === 'github-integration' && (
                <div className="space-y-6">
                  {/* Pull Request Overview */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-linear-to-r from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 rounded-2xl p-6 border-2 border-gray-300 dark:border-gray-700 relative overflow-hidden"
                  >
                    {/* GitHub Logo Background */}
                    <div className="absolute top-4 right-4 opacity-10 dark:opacity-5">
                      <img src="/github.png" alt="GitHub" className="w-24 h-24 object-contain" />
                    </div>

                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">✓ OPEN</span>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">OAuth2 Authentication Flow</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">PR #2847 • Created 2 days ago</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Build Status</div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">✓ PASSING</div>
                      </div>
                    </div>

                    {/* PR Stats Grid - Enhanced with Progress Visualization */}
                    <div className="mb-6 space-y-4">
                      {/* Top Row: Main Stats */}
                      <div className="grid grid-cols-4 gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        {/* Additions - Highlighted */}
                        <motion.div 
                          className="text-center relative group cursor-pointer"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                          <motion.div
                            className="relative z-10 text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            +342
                          </motion.div>
                          <div className="relative z-10 text-xs font-semibold text-gray-700 dark:text-gray-300 mt-2 uppercase tracking-wide">Additions</div>
                          <div className="relative z-10 text-xs text-blue-600 dark:text-blue-400 font-bold mt-1">↑ New Code</div>
                        </motion.div>
                        
                        {/* Deletions */}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">-87</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Deletions</div>
                          <div className="text-xs text-red-500 dark:text-red-400 font-semibold mt-1">Cleanup</div>
                        </div>
                        
                        {/* Commits */}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">14</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Commits</div>
                          <div className="text-xs text-purple-500 dark:text-purple-400 font-semibold mt-1">Tracked</div>
                        </div>
                        
                        {/* Files Changed */}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">3</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Files</div>
                          <div className="text-xs text-cyan-500 dark:text-cyan-400 font-semibold mt-1">Modified</div>
                        </div>
                      </div>

                      {/* Code Change Composition Bar */}
                      <motion.div
                        className="p-4 bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Code Change Composition</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Total: 429 lines</span>
                        </div>
                        <div className="flex gap-2 h-8 rounded-lg overflow-hidden shadow-md">
                          {/* Additions Bar */}
                          <motion.div
                            className="bg-linear-to-r from-blue-500 to-blue-400 relative flex items-center justify-center group"
                            style={{ width: '79.7%' }}
                            initial={{ width: 0 }}
                            animate={{ width: '79.7%' }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            title="+342 additions (79.7%)"
                          >
                            <span className="text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">+342</span>
                          </motion.div>
                          
                          {/* Deletions Bar */}
                          <motion.div
                            className="bg-linear-to-r from-red-500 to-red-400 relative flex items-center justify-center group"
                            style={{ width: '20.3%' }}
                            initial={{ width: 0 }}
                            animate={{ width: '20.3%' }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            title="-87 deletions (20.3%)"
                          >
                            <span className="text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">-87</span>
                          </motion.div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Additions: 79.7%
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Deletions: 20.3%
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Clear Action Buttons */}
                    <div className="flex gap-3 mb-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <span>✓</span>
                        <span>APPROVE & MERGE</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <span>👁️</span>
                        <span>VIEW FULL PR</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <span>💬</span>
                        <span>LEAVE REVIEW</span>
                      </motion.button>
                    </div>

                    {/* Review Status */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-3">Review Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">✅</span>
                            <span className="text-sm text-slate-700 dark:text-slate-300"><strong>Alice</strong> approved</span>
                          </div>
                          <span className="text-xs text-gray-500">2 days ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">✅</span>
                            <span className="text-sm text-slate-700 dark:text-slate-300"><strong>Bob</strong> approved</span>
                          </div>
                          <span className="text-xs text-gray-500">1 day ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🔄</span>
                            <span className="text-sm text-slate-700 dark:text-slate-300"><strong>Charlie</strong> requested changes</span>
                          </div>
                          <span className="text-xs text-gray-500">pending</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Original Integration Component */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">GitHub Integration Features</h3>
                    <GitHubIntegration storyId="US-101" />
                  </div>

                  {/* Commit Count Visualization */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-linear-to-br from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4">📊 Commit Count & Contributors</h4>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">14</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Total Commits</div>
                      </div>
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">3</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Developers</div>
                      </div>
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">✓</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">All Approved</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-700 dark:text-slate-300">
                      <p className="mb-3"><strong>Story:</strong> Implement OAuth2 Authentication</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        This story has 14 commits from 3 developers. Alice contributed 6 commits (42%), Bob 5 commits (36%), Charlie 3 commits (22%).
                      </p>
                    </div>
                  </motion.div>

                  {/* Developer Performance Dashboard */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-linear-to-br from-slate-50 to-gray-50 dark:from-slate-900/30 dark:to-gray-900/30 rounded-xl p-6 border border-slate-200 dark:border-gray-700"
                  >
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4">🏆 Developer Performance Dashboard</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Alice', metric: 'Review Speed', value: '2.1 hrs', avg: '4.5 hrs', badge: '⭐ Fastest' },
                        { name: 'Bob', metric: 'Code Quality', value: '4.8/5 ★', avg: '4.2/5 ★', badge: '👍 Most Helpful' },
                        { name: 'Charlie', metric: 'PR Velocity', value: '2.3/week', avg: '1.8/week', badge: '🚀 Most Active' }
                      ].map((dev, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 rounded-lg p-4 flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white mb-1">{dev.name}</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                              <span>{dev.metric}:</span>
                              <span className="font-bold text-gray-700 dark:text-gray-300">{dev.value}</span>
                              <span className="text-gray-500">(avg: {dev.avg})</span>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full whitespace-nowrap">
                            {dev.badge}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Most Helpful Comments */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/50"
                  >
                    <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-4">💬 Review Comments & Ratings</h4>
                    <div className="space-y-3">
                      {[
                        { reviewer: 'Bob', rating: '4.8/5 ★', status: '👍 Most Helpful', comment: 'Excellent refactoring suggestions with clear examples' },
                        { reviewer: 'Alice', rating: '4.6/5 ★', status: '🔍 Thorough', comment: 'Caught 2 edge cases and suggested optimization' },
                        { reviewer: 'Charlie', rating: '4.3/5 ★', status: '✓ Constructive', comment: 'Good catch on the null reference issue' }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-white/70 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-100 dark:border-blue-700/50">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-semibold text-blue-900 dark:text-blue-300">{item.reviewer}</div>
                              <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">{item.status}</div>
                            </div>
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{item.rating}</div>
                          </div>
                          <p className="text-sm text-blue-800 dark:text-blue-200">{item.comment}</p>
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
                      <li><strong>Review Status:</strong> See code review status (Approved ✅ / Pending 🔄 / Changes Requested ❌)</li>
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
