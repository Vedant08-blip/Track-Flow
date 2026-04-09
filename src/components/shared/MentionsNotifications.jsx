import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AtSign,
  Check,
  CheckAll,
  Trash2,
  MessageCircle,
  Clock,
  Bell,
  X,
} from 'lucide-react';
import { useCollaboration } from '../../context/CollaborationContext';
import { useAuth } from '../../context/AuthContext';

const MentionsNotifications = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const {
    mentions,
    notifications,
    markMentionAsRead,
    markNotificationAsRead,
    getUnreadMentions,
  } = useCollaboration();

  const [activeTab, setActiveTab] = useState('mentions');
  const [displayMentions, setDisplayMentions] = useState([]);
  const [displayNotifications, setDisplayNotifications] = useState([]);

  useEffect(() => {
    const unreadMentions = getUnreadMentions();
    setDisplayMentions(unreadMentions);
    setDisplayNotifications(
      notifications.filter(n => n.data?.mentionedUserId === user?.id)
    );
  }, [mentions, notifications, user, getUnreadMentions]);

  const handleMarkAsRead = (mentionId) => {
    markMentionAsRead(mentionId);
  };

  const handleMarkNotificationAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    displayMentions.forEach(mention => markMentionAsRead(mention.id));
  };

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

  const unreadCount = displayMentions.filter(m => !m.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
                  <Bell size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Mentions & Notifications
                  </h2>
                  {unreadCount > 0 && (
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      {unreadCount} unread mention{unreadCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 border-b border-slate-200 dark:border-slate-800 m-4 rounded-lg w-fit">
              {['mentions', 'notifications'].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    activeTab === tab
                      ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                  }`}
                >
                  {tab === 'mentions' ? (
                    <>
                      <AtSign className="inline mr-1" size={14} />
                      Mentions ({displayMentions.length})
                    </>
                  ) : (
                    <>
                      <Bell className="inline mr-1" size={14} />
                      Notifications
                    </>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'mentions' && (
                <div className="space-y-3">
                  {/* Mark all as read button */}
                  {unreadCount > 0 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={handleMarkAllAsRead}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg font-medium text-sm hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors"
                    >
                      <CheckAll size={16} />
                      Mark all as read
                    </motion.button>
                  )}

                  {/* Mentions List */}
                  <AnimatePresence mode="popLayout">
                    {displayMentions.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-slate-500 dark:text-slate-400"
                      >
                        <AtSign size={40} className="mx-auto mb-3 opacity-50" />
                        <p>No mentions</p>
                        <p className="text-sm">You're all caught up!</p>
                      </motion.div>
                    ) : (
                      displayMentions.map((mention, idx) => (
                        <motion.div
                          key={mention.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-orange-300 dark:hover:border-orange-600 ${
                            mention.read
                              ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800'
                              : 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                                {mention.mentionedBy?.[0]?.toUpperCase()}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {mention.mentionedBy} mentioned you
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                {mention.type === 'comment_mention'
                                  ? 'in a comment'
                                  : 'in a reply'}
                              </p>
                              {mention.content && (
                                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 line-clamp-2 bg-white/50 dark:bg-slate-900/50 p-2 rounded">
                                  "{mention.content}"
                                </p>
                              )}
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                                {formatTime(mention.createdAt)}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex-shrink-0 flex flex-col gap-1">
                              {!mention.read && (
                                <button
                                  onClick={() => handleMarkAsRead(mention.id)}
                                  className="p-1 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-500/20 rounded transition-colors"
                                  title="Mark as read"
                                >
                                  <Check size={16} />
                                </button>
                              )}
                              <button
                                className="p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                                title="View context"
                              >
                                <MessageCircle size={16} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {displayNotifications.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-slate-500 dark:text-slate-400"
                      >
                        <Bell size={40} className="mx-auto mb-3 opacity-50" />
                        <p>No notifications</p>
                        <p className="text-sm">You're all caught up!</p>
                      </motion.div>
                    ) : (
                      displayNotifications.map((notification, idx) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            notification.read
                              ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800'
                              : 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {notification.data?.mentionedBy} mentioned you
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                {notification.data?.content}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                                {formatTime(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkNotificationAsRead(notification.id)}
                                className="ml-2 p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded transition-colors flex-shrink-0"
                              >
                                <Check size={16} />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-4 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 rounded-lg font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MentionsNotifications;
