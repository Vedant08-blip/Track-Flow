import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, ExternalLink, Check, AlertCircle, Code2, Plus, X } from 'lucide-react';
import { useGitHubIntegration } from '../../context/GitHubIntegrationContext';
import { formatDistanceToNow } from 'date-fns';

const GitHubIntegration = ({ storyId }) => {
  const {
    gitHubConfig,
    linkedPullRequests,
    linkedCommits,
    codeMetrics,
    linkPullRequest,
    unlinkPullRequest,
    getPullRequestsForStory,
    getCommitsForStory,
    getStoryCIStatus,
    connectGitHub,
    disconnectGitHub,
  } = useGitHubIntegration();

  const [isOpen, setIsOpen] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [prUrl, setPrUrl] = useState('');
  const [prNumber, setPrNumber] = useState('');

  const storyPRs = getPullRequestsForStory(storyId);
  const storyCommits = getCommitsForStory(storyId);
  const ciStatus = getStoryCIStatus(storyId);

  const handleLinkPR = (e) => {
    e.preventDefault();
    if (!prNumber || !prUrl) return;

    linkPullRequest(storyId, parseInt(prNumber), prUrl);
    setPrNumber('');
    setPrUrl('');
  };

  const getStatusIcon = (status) => {
    if (status === 'success') return <Check className="w-4 h-4 text-emerald-500" />;
    if (status === 'merged') return <Check className="w-4 h-4 text-blue-500" />;
    if (status === 'pending') return <AlertCircle className="w-4 h-4 text-amber-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const getReviewStatusColor = (status) => {
    if (status === 'approved') return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
    if (status === 'changes_requested') return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400';
    return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
  };

  if (!gitHubConfig.connected) {
    return (
      <motion.div
        className="bg-linear-to-br from-gray-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 relative overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* GitHub Logo Background */}
        <div className="absolute top-2 right-2 opacity-5 dark:opacity-3">
          <img src="/github.png" alt="GitHub" className="w-24 h-24 object-contain" />
        </div>

        <div className="relative z-10 flex items-center gap-2 mb-3">
          <GitBranch className="w-5 h-5 text-slate-400" />
          <h4 className="font-semibold text-slate-900 dark:text-white">GitHub Integration</h4>
        </div>
        <div className="relative z-10 text-sm text-slate-600 dark:text-slate-400 mb-3">
          Connect your GitHub account to link pull requests and commits
        </div>
        <button
          onClick={() => setShowConnect(true)}
          className="relative z-10 w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Connect GitHub
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {/* GitHub Logo Background */}
      <div className="absolute top-0 right-0 opacity-5 dark:opacity-3 pointer-events-none">
        <img src="/github.png" alt="GitHub" className="w-32 h-32 object-contain" />
      </div>

      {/* CI Status Card */}
      {ciStatus && (
        <motion.div
          className="bg-linear-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border border-indigo-200/50 dark:border-slate-700/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h4 className="font-semibold text-slate-900 dark:text-white">CI/CD Status</h4>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/50 dark:bg-slate-800/50 rounded-lg">
              {getStatusIcon(ciStatus.status)}
              <span className="text-xs font-medium capitalize text-slate-900 dark:text-white">
                {ciStatus.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Test Coverage</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{ciStatus.testCoverage}%</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Code Review</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{ciStatus.codeReviewScore}%</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
            Build time: {ciStatus.buildTime}s • Deployment: <span className="font-medium capitalize">{ciStatus.deploymentStatus}</span>
          </div>
        </motion.div>
      )}

      {/* Pull Requests */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <GitBranch size={18} /> Pull Requests ({storyPRs.length})
          </h4>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              isOpen
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isOpen ? (
              <>
                <X size={16} /> Cancel
              </>
            ) : (
              <>
                <Plus size={16} /> Create Pull Request
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleLinkPR}
              className="space-y-3 mb-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-800/50"
            >
              <div className="mb-4">
                <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Link GitHub Pull Request</h5>
                <p className="text-xs text-slate-600 dark:text-slate-400">Link an existing GitHub PR to this story</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">PR Number</label>
                <input
                  type="number"
                  value={prNumber}
                  onChange={(e) => setPrNumber(e.target.value)}
                  placeholder="e.g., 2847"
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">GitHub PR URL</label>
                <input
                  type="url"
                  value={prUrl}
                  onChange={(e) => setPrUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo/pull/2847"
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                Link Pull Request
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {storyPRs.length > 0 ? (
            storyPRs.map((pr) => (
              <motion.a
                key={pr.id}
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="block p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      #{pr.prNumber} {pr.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {pr.author} • {formatDistanceToNow(new Date(pr.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 shrink-0 ml-2" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getReviewStatusColor(pr.reviewStatus)}`}>
                    {pr.reviewStatus}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {pr.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {pr.commits} commits • +{pr.additions} -{pr.deletions}
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    unlinkPullRequest(pr.id);
                  }}
                  className="mt-2 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  Unlink
                </button>
              </motion.a>
            ))
          ) : (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
              No linked pull requests
            </div>
          )}
        </div>
      </motion.div>

      {/* Recent Commits */}
      {storyCommits.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Recent Commits</h4>
          <div className="space-y-2">
            {storyCommits.slice(-3).map((commit) => (
              <a
                key={commit.id}
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
              >
                <div className="font-mono text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {commit.sha.slice(0, 7)}
                </div>
                <div className="text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                  {commit.message}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {commit.author} • {formatDistanceToNow(new Date(commit.timestamp), { addSuffix: true })}
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GitHubIntegration;
