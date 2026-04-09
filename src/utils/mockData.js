import { addDays, format, subDays } from 'date-fns';

export const PROJECTS = [
  { id: 'proj-1', name: 'TrackFlow Core', description: 'Main project management platform', status: 'Active', createdDate: '2024-01-15' },
  { id: 'proj-2', name: 'Analytics Engine', description: 'Real-time analytics and reporting', status: 'Active', createdDate: '2024-03-20' },
  { id: 'proj-3', name: 'Mobile App', description: 'iOS and Android applications', status: 'Active', createdDate: '2024-06-10' },
];

export const TEAMS = [
  { id: 'team-1', name: 'Team Alpha', color: '#1B6BF5' },
  { id: 'team-2', name: 'Team Beta', color: '#0ABFBC' },
  { id: 'team-3', name: 'Team Gamma', color: '#F39C12' },
];

export const RELEASES = [
  { id: 'rel-1', name: 'Q1 2025', startDate: '2025-01-01', endDate: '2025-03-31' },
  { id: 'rel-2', name: 'Q2 2025', startDate: '2025-04-01', endDate: '2025-06-30' },
];

export const ITERATIONS = [
  { id: 'it-1', name: 'Sprint 1.1', releaseId: 'rel-1', startDate: '2025-01-01', endDate: '2025-01-14', capacity: 40 },
  { id: 'it-2', name: 'Sprint 1.2', releaseId: 'rel-1', startDate: '2025-01-15', endDate: '2025-01-28', capacity: 35 },
  { id: 'it-3', name: 'Sprint 1.3', releaseId: 'rel-1', startDate: '2025-01-29', endDate: '2025-02-11', capacity: 45 },
  { id: 'it-4', name: 'Sprint 1.4', releaseId: 'rel-1', startDate: '2025-02-12', endDate: '2025-02-25', capacity: 40 },
  { id: 'it-5', name: 'Sprint 2.1', releaseId: 'rel-2', startDate: '2025-04-01', endDate: '2025-04-14', capacity: 40 },
];

export const INITIATIVES = [
  { id: 'ini-1', name: 'Modernize Core Infrastructure', color: '#1B6BF5' },
  { id: 'ini-2', name: 'Enhance User Experience', color: '#0ABFBC' },
  { id: 'ini-3', name: 'Expansion to Enterprise Markets', color: '#F39C12' },
];

export const FEATURES = [
  { id: 'feat-1', name: 'Cloud Native Migration', initiativeId: 'ini-1', progress: 65 },
  { id: 'feat-2', name: 'Real-time Analytics Dashboard', initiativeId: 'ini-2', progress: 40 },
  { id: 'feat-3', name: 'SSO & Multi-tenancy Support', initiativeId: 'ini-3', progress: 85 },
];

export const STORIES = [
  {
    id: 'US-101',
    title: 'Implement OAuth2 Authentication Flow',
    description: 'Connect shared auth module to the new identity provider.',
    points: 5,
    status: 'Accepted',
    priority: 'Critical',
    assignee: 'Alice Smith',
    teamId: 'team-1',
    iterationId: 'it-1',
    releaseId: 'rel-1',
    featureId: 'feat-3'
  },
  {
    id: 'US-102',
    title: 'Design System Typography Overhaul',
    description: 'Standardize font scales across the application.',
    points: 3,
    status: 'Completed',
    priority: 'High',
    assignee: 'Bob Jones',
    teamId: 'team-2',
    iterationId: 'it-1',
    releaseId: 'rel-1',
    featureId: 'feat-2'
  },
  {
    id: 'US-103',
    title: 'Database Schema Migration for Teams',
    description: 'Add support for nested team hierarchies.',
    points: 8,
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Charlie Brown',
    teamId: 'team-1',
    iterationId: 'it-2',
    releaseId: 'rel-1',
    featureId: 'feat-1'
  },
  {
    id: 'DE-201',
    title: 'Fix Sidebar Hover Glitch',
    description: 'Sidebar sometimes stays expanded on mobile.',
    points: 2,
    status: 'Defined',
    priority: 'Low',
    assignee: 'Alice Smith',
    teamId: 'team-3',
    iterationId: 'it-2',
    releaseId: 'rel-1'
  },
  {
    id: 'US-104',
    title: 'Export Dashboard Data to CSV',
    description: 'Allow users to download analytics data for offline use.',
    points: 5,
    status: 'Defined',
    priority: 'Medium',
    assignee: 'Unassigned',
    teamId: 'team-2',
    iterationId: 'it-3',
    releaseId: 'rel-1',
    featureId: 'feat-2'
  }
];

// Recharts specific data helpers
export const getVelocityData = () => [
  { name: 'Sprint 1.1', planned: 40, actual: 38 },
  { name: 'Sprint 1.2', planned: 35, actual: 32 },
  { name: 'Sprint 1.3', planned: 45, actual: 44 },
  { name: 'Sprint 1.4', planned: 40, actual: 42 },
];

export const getBurndownData = () => [
  { day: 'Day 1', ideal: 45, actual: 45 },
  { day: 'Day 2', ideal: 40, actual: 42 },
  { day: 'Day 3', ideal: 35, actual: 36 },
  { day: 'Day 4', ideal: 30, actual: 33 },
  { day: 'Day 5', ideal: 25, actual: 24 },
  { day: 'Day 6', ideal: 20, actual: 18 },
  { day: 'Day 7', ideal: 15, actual: 12 },
  { day: 'Day 8', ideal: 10, actual: 8 },
  { day: 'Day 9', ideal: 5, actual: 3 },
  { day: 'Day 10', ideal: 0, actual: 0 },
];
