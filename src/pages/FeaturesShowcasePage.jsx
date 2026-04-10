import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Users, 
  GitBranch, 
  Calendar, 
  ArrowRight,
  Zap,
  Target,
  TrendingUp
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
      color: 'from-purple-400 to-rose-400',
      stats: { match: '95%', available: '85%', score: '92%' }
    },
    {
      id: 'github-integration',
      name: 'GitHub Integration',
      icon: GitBranch,
      description: 'Link PRs, commits, and CI/CD status',
      color: 'from-slate-600 to-slate-800',
      stats: { prs: '3', commits: '12', coverage: '88%' }
    },
    {
      id: 'calendar-integration',
      name: 'Google Calendar',
      icon: Calendar,
      description: 'Schedule work sessions and meetings',
      color: 'from-amber-500 to-orange-500',
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
        className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 text-white"
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
                className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${feature.color}`}
              />

              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br ${feature.color} text-white`}>
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
                  className={`bg-gradient-to-br ${selectedFeature.color} rounded-xl p-4 text-white`}
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
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">GitHub Integration Demo</h3>
                  <GitHubIntegration storyId="US-101" />
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

            {/* Feature Details */}
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
                    'Link code changes to stories',
                    'Track CI/CD pipeline status',
                    'Monitor code review progress',
                    'View deployment status',
                    'Measure code quality metrics'
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

              {/* Integration Details & How It Works */}
              <div className="space-y-4">
                {/* Integration Details Card */}
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={20} /> Integration Details
                  </h4>
                  {selectedTab === 'time-tracking' && (
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white mb-1">✓ Context Provider</div>
                        <p className="text-xs">TimeTrackingContext wraps your app with state management</p>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white mb-1">✓ Core Functions</div>
                        <p className="text-xs">addTimeEntry() • deleteTimeEntry() • getTotalTimeByStory() • getTimeVariance() • getWeeklyTimeData()</p>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white mb-1">✓ Tracked Metrics</div>
                        <p className="text-xs">Logged hours, estimated hours, variance (over/under), team velocity, burndown</p>
                      </div>
                    </div>
                  )}
                  {selectedTab === 'skill-assignment' && (
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white mb-1">✓ AI Algorithm</div>
                        <p className="text-xs">Weighted scoring system analyzing team capabilities</p>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white mb-1">✓ Core Functions</div>
                        <p className="text-xs">getRecommendedAssignees() • calculateSkillMatch() • assignStory() • getSkillGaps() • getTeamCapabilities()</p>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white mb-1">✓ Recommendation Score</div>
                        <p className="text-xs">Skills (50% weight) + Availability (30%) + Workload Balance (20%)</p>
                      </div>
                    </div>
                  )}
                  {selectedTab === 'github-integration' && (
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white mb-1">✓ GitHub API v3</div>
                        <p className="text-xs">Real-time sync with your GitHub repository</p>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white mb-1">✓ Core Functions</div>
                        <p className="text-xs">linkPullRequest() • getPullRequestsForStory() • getStoryCIStatus() • updatePullRequestStatus()</p>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white mb-1">✓ CI/CD Pipeline</div>
                        <p className="text-xs">Build status, test coverage (88%), code review scores, deployment status</p>
                      </div>
                    </div>
                  )}
                  {selectedTab === 'calendar-integration' && (
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white mb-1">✓ Google Calendar API</div>
                        <p className="text-xs">Two-way sync with Google Calendar ecosystem</p>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white mb-1">✓ Core Functions</div>
                        <p className="text-xs">createWorkSession() • createMeeting() • getUpcomingEvents() • getTotalScheduledHours() • getTeamCalendarAvailability()</p>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white mb-1">✓ Event Types</div>
                        <p className="text-xs">Work sessions, team meetings, planning sessions, sprint reviews</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* How It Works Card */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/50">
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
                      <div className="bg-white/60 dark:bg-blue-900/30 p-3 rounded-lg mt-3 border border-blue-200 dark:border-blue-700/50">
                        <p className="text-xs font-medium">💡 <strong>Pro Tip:</strong> Review variance reports weekly to understand team capacity and identify over/under-estimation patterns.</p>
                      </div>
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
                      <div className="bg-white/60 dark:bg-blue-900/30 p-3 rounded-lg mt-3 border border-blue-200 dark:border-blue-700/50">
                        <p className="text-xs font-medium">💡 <strong>Pro Tip:</strong> Use skill gaps to plan training and onboarding. The system identifies missing expertise across your team.</p>
                      </div>
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
                      <div className="bg-white/60 dark:bg-blue-900/30 p-3 rounded-lg mt-3 border border-blue-200 dark:border-blue-700/50">
                        <p className="text-xs font-medium">💡 <strong>Pro Tip:</strong> Link PRs early to get real-time CI/CD status. This helps identify blocked work immediately.</p>
                      </div>
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
                      <div className="bg-white/60 dark:bg-blue-900/30 p-3 rounded-lg mt-3 border border-blue-200 dark:border-blue-700/50">
                        <p className="text-xs font-medium">💡 <strong>Pro Tip:</strong> Use work sessions to protect team focus time. Schedule blocking sessions to reduce context switching.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
};

export default FeaturesShowcasePage;
