import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  CheckCircle2,
  User,
  FileText,
  AlertCircle,
  Zap,
  Clock,
  Filter,
  X,
} from 'lucide-react';
import { useCollaboration } from '../../context/CollaborationContext';

const ActivityFeed = ({ taskId, maxItems = 10 }) => {
  const { getTaskActivity } = useCollaboration();
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const taskActivities = getTaskActivity(taskId);
    setActivities(taskActivities);
  }, [taskId, getTaskActivity]);

  // Filter activities
  useEffect(() => {
    let filtered = activities;
    if (filterType !== 'all') {
      filtered = activities.filter(activity => activity.type.startsWith(filterType));
    }
    setFilteredActivities(filtered.slice(0, isExpanded ? activities.length : maxItems));
  }, [activities, filterType, isExpanded, maxItems]);

  // Get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case 'comment_added':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'reply_added':
        return <MessageSquare size={16} className="text-cyan-500" />;
      case 'comment_edited':
        return <Zap size={16} className="text-yellow-500" />;
      case 'comment_deleted':
        return <X size={16} className="text-red-500" />;
      case 'status_changed':
        return <CheckCircle2 size={16} className="text-green-500" />;
      case 'assigned':
        return <User size={16} className="text-purple-500" />;
      case 'mention':
        return <AlertCircle size={16} className="text-orange-500" />;
      default:
        return <FileText size={16} className="text-slate-500" />;
    }
  };

  // Get activity description
  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'comment_added':
        return `${activity.userName} commented`;
      case 'reply_added':
        return `${activity.userName} replied to a comment`;
      case 'comment_edited':
        return `${activity.userName} edited a comment`;
      case 'comment_deleted':
        return `${activity.userName} deleted a comment`;
      case 'status_changed':
        return `${activity.userName} changed status to ${activity.newStatus}`;
      case 'assigned':
        return `${activity.userName} assigned this to ${activity.assignedTo}`;
      case 'mention':
        return `${activity.userName} mentioned ${activity.mentionedName}`;
      default:
        return activity.description || 'Activity occurred';
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Activity type filters
  const filters = [
    { id: 'all', label: 'All Activity' },
    { id: 'comment', label: 'Comments' },
    { id: 'status', label: 'Status' },
    { id: 'assigned', label: 'Assignments' },
  ];

  if (activities.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center text-slate-500 dark:text-slate-400">
        <Clock size={24} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock size={18} />
          Activity
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setFilterType(filter.id)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
              filterType === filter.id
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredActivities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm"
            >
              No {filterType !== 'all' ? filterType : ''} activity
            </motion.div>
          ) : (
            filteredActivities.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 pt-1">
                    {getActivityIcon(activity.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 dark:text-white font-medium">
                      {getActivityDescription(activity)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {formatTime(activity.timestamp || activity.createdAt)}
                    </p>
                  </div>

                  {/* Extra info badge */}
                  {activity.type === 'status_changed' && (
                    <div className="flex-shrink-0 px-2 py-1 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-[10px] font-medium rounded">
                      {activity.newStatus}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Load More */}
      {!isExpanded && filteredActivities.length < activities.length && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsExpanded(true)}
          className="w-full py-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Load more activities
        </motion.button>
      )}
    </div>
  );
};

export default ActivityFeed;
