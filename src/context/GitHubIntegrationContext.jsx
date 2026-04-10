import React, { createContext, useContext, useState, useCallback } from 'react';

const GitHubIntegrationContext = createContext(null);

export const GitHubIntegrationProvider = ({ children }) => {
  const [gitHubConfig, setGitHubConfig] = useState({
    connected: true,
    token: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxx',
    username: 'vedanttrivedi',
    organization: 'trackflow-org',
    repositories: ['trackflow', 'trackflow-docs', 'trackflow-mobile'],
  });

  const [linkedPullRequests, setLinkedPullRequests] = useState([
    {
      id: 'pr-1',
      storyId: 'US-101',
      prNumber: 245,
      title: 'Implement OAuth2 provider integration',
      url: 'https://github.com/trackflow-org/trackflow/pull/245',
      repository: 'trackflow',
      status: 'open',
      author: 'Alice Smith',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      commits: 12,
      additions: 342,
      deletions: 89,
      reviewers: ['Bob Jones', 'Charlie Brown'],
      reviewStatus: 'approved', // pending, approved, changes_requested
    },
    {
      id: 'pr-2',
      storyId: 'US-102',
      prNumber: 248,
      title: 'Design system typography updates',
      url: 'https://github.com/trackflow-org/trackflow/pull/248',
      repository: 'trackflow',
      status: 'merged',
      author: 'Bob Jones',
      createdAt: new Date(Date.now() - 604800000).toISOString(),
      updatedAt: new Date(Date.now() - 432000000).toISOString(),
      mergedAt: new Date(Date.now() - 432000000).toISOString(),
      commits: 5,
      additions: 234,
      deletions: 156,
      reviewers: ['Alice Smith'],
      reviewStatus: 'approved',
    },
  ]);

  const [linkedCommits, setLinkedCommits] = useState([
    {
      id: 'commit-1',
      storyId: 'US-101',
      sha: 'a3f5b8e9c2d1f4e6',
      message: 'feat(auth): add OAuth2 provider support',
      author: 'Alice Smith',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      url: 'https://github.com/trackflow-org/trackflow/commit/a3f5b8e9c2d1f4e6',
      repository: 'trackflow',
    },
    {
      id: 'commit-2',
      storyId: 'US-101',
      sha: 'b4c6a9f0d3e2g5f7',
      message: 'test(auth): add OAuth2 integration tests',
      author: 'Alice Smith',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      url: 'https://github.com/trackflow-org/trackflow/commit/b4c6a9f0d3e2g5f7',
      repository: 'trackflow',
    },
  ]);

  const [codeMetrics, setCodeMetrics] = useState({
    'US-101': {
      linesChanged: 431,
      filesChanged: 8,
      ciStatus: 'success',
      codeReviewScore: 92,
      testCoverage: 88,
      buildTime: 145, // seconds
      deploymentStatus: 'deployed', // pending, building, deployed, failed
    },
    'US-102': {
      linesChanged: 390,
      filesChanged: 12,
      ciStatus: 'success',
      codeReviewScore: 96,
      testCoverage: 91,
      buildTime: 132,
      deploymentStatus: 'deployed',
    },
  });

  const connectGitHub = useCallback((token, organization) => {
    setGitHubConfig({
      connected: true,
      token,
      organization,
      username: 'vedanttrivedi',
      repositories: ['trackflow', 'trackflow-docs', 'trackflow-mobile'],
    });
  }, []);

  const disconnectGitHub = useCallback(() => {
    setGitHubConfig({
      connected: false,
      token: null,
      username: null,
      organization: null,
      repositories: [],
    });
  }, []);

  const linkPullRequest = useCallback((storyId, prNumber, prUrl) => {
    const newPR = {
      id: `pr-${Date.now()}`,
      storyId,
      prNumber,
      url: prUrl,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviewStatus: 'pending',
      commits: 0,
      additions: 0,
      deletions: 0,
      reviewers: [],
    };
    setLinkedPullRequests([...linkedPullRequests, newPR]);
    return newPR;
  }, [linkedPullRequests]);

  const unlinkPullRequest = useCallback((prId) => {
    setLinkedPullRequests(prev => prev.filter(pr => pr.id !== prId));
  }, []);

  const linkCommit = useCallback((storyId, sha, message, author) => {
    const newCommit = {
      id: `commit-${Date.now()}`,
      storyId,
      sha,
      message,
      author,
      timestamp: new Date().toISOString(),
      url: `https://github.com/${gitHubConfig.organization}/trackflow/commit/${sha}`,
      repository: 'trackflow',
    };
    setLinkedCommits([...linkedCommits, newCommit]);
    return newCommit;
  }, [linkedCommits, gitHubConfig]);

  const getStoryCIStatus = useCallback((storyId) => {
    const metrics = codeMetrics[storyId];
    if (!metrics) return null;
    
    return {
      status: metrics.ciStatus,
      testCoverage: metrics.testCoverage,
      codeReviewScore: metrics.codeReviewScore,
      buildTime: metrics.buildTime,
      deploymentStatus: metrics.deploymentStatus,
    };
  }, [codeMetrics]);

  const getPullRequestsForStory = useCallback((storyId) => {
    return linkedPullRequests.filter(pr => pr.storyId === storyId);
  }, [linkedPullRequests]);

  const getCommitsForStory = useCallback((storyId) => {
    return linkedCommits.filter(c => c.storyId === storyId);
  }, [linkedCommits]);

  const updatePullRequestStatus = useCallback((prId, status, reviewStatus) => {
    setLinkedPullRequests(prev => prev.map(pr => 
      pr.id === prId 
        ? { 
            ...pr, 
            status, 
            reviewStatus,
            updatedAt: new Date().toISOString(),
            ...(status === 'merged' && { mergedAt: new Date().toISOString() })
          }
        : pr
    ));
  }, []);

  const updateCodeMetrics = useCallback((storyId, metrics) => {
    setCodeMetrics(prev => ({
      ...prev,
      [storyId]: { ...prev[storyId], ...metrics }
    }));
  }, []);

  const getRepositories = useCallback(() => {
    return gitHubConfig.repositories || [];
  }, [gitHubConfig]);

  const value = {
    gitHubConfig,
    linkedPullRequests,
    linkedCommits,
    codeMetrics,
    connectGitHub,
    disconnectGitHub,
    linkPullRequest,
    unlinkPullRequest,
    linkCommit,
    getStoryCIStatus,
    getPullRequestsForStory,
    getCommitsForStory,
    updatePullRequestStatus,
    updateCodeMetrics,
    getRepositories,
  };

  return (
    <GitHubIntegrationContext.Provider value={value}>
      {children}
    </GitHubIntegrationContext.Provider>
  );
};

export const useGitHubIntegration = () => {
  const context = useContext(GitHubIntegrationContext);
  if (!context) {
    throw new Error('useGitHubIntegration must be used within GitHubIntegrationProvider');
  }
  return context;
};
