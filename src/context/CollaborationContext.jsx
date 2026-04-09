import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CollaborationContext = createContext(null);

export const CollaborationProvider = ({ children }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState({});
  const [mentions, setMentions] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Add comment to a task/story
  const addComment = useCallback((taskId, commentData) => {
    const commentId = `comment-${Date.now()}`;
    const newComment = {
      id: commentId,
      taskId,
      author: user,
      content: commentData.content,
      mentions: commentData.mentions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [],
      likes: [],
      edited: false,
    };

    setComments(prev => ({
      ...prev,
      [taskId]: [...(prev[taskId] || []), newComment],
    }));

    // Add activity log
    logActivity({
      type: 'comment_added',
      userId: user.id,
      userName: user.name,
      taskId,
      description: `commented on a task`,
      targetId: taskId,
    });

    // Process mentions
    if (commentData.mentions && commentData.mentions.length > 0) {
      commentData.mentions.forEach(mentionedUser => {
        if (mentionedUser.id !== user.id) {
          addMention({
            type: 'comment_mention',
            mentionedUserId: mentionedUser.id,
            mentionedUserName: mentionedUser.name,
            mentionedBy: user.name,
            taskId,
            commentId,
            content: commentData.content,
            createdAt: new Date().toISOString(),
            read: false,
          });
        }
      });
    }

    return newComment;
  }, [user]);

  // Add reply to a comment
  const addReply = useCallback((taskId, commentId, replyData) => {
    const replyId = `reply-${Date.now()}`;
    const newReply = {
      id: replyId,
      author: user,
      content: replyData.content,
      mentions: replyData.mentions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: [],
      edited: false,
    };

    setComments(prev => ({
      ...prev,
      [taskId]: prev[taskId].map(comment =>
        comment.id === commentId
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment
      ),
    }));

    // Process mentions in reply
    if (replyData.mentions && replyData.mentions.length > 0) {
      replyData.mentions.forEach(mentionedUser => {
        if (mentionedUser.id !== user.id) {
          addMention({
            type: 'reply_mention',
            mentionedUserId: mentionedUser.id,
            mentionedUserName: mentionedUser.name,
            mentionedBy: user.name,
            taskId,
            commentId,
            replyId,
            content: replyData.content,
            createdAt: new Date().toISOString(),
            read: false,
          });
        }
      });
    }

    logActivity({
      type: 'reply_added',
      userId: user.id,
      userName: user.name,
      taskId,
      description: `replied to a comment`,
      targetId: commentId,
    });

    return newReply;
  }, [user]);

  // Edit comment
  const editComment = useCallback((taskId, commentId, newContent) => {
    setComments(prev => ({
      ...prev,
      [taskId]: prev[taskId].map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              content: newContent,
              updatedAt: new Date().toISOString(),
              edited: true,
            }
          : comment
      ),
    }));

    logActivity({
      type: 'comment_edited',
      userId: user.id,
      userName: user.name,
      taskId,
      description: `edited a comment`,
      targetId: commentId,
    });
  }, [user]);

  // Delete comment
  const deleteComment = useCallback((taskId, commentId) => {
    setComments(prev => ({
      ...prev,
      [taskId]: prev[taskId].filter(comment => comment.id !== commentId),
    }));

    logActivity({
      type: 'comment_deleted',
      userId: user.id,
      userName: user.name,
      taskId,
      description: `deleted a comment`,
      targetId: commentId,
    });
  }, [user]);

  // Like/unlike comment
  const toggleCommentLike = useCallback((taskId, commentId, userId) => {
    setComments(prev => ({
      ...prev,
      [taskId]: prev[taskId].map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.likes.includes(userId)
                ? comment.likes.filter(id => id !== userId)
                : [...comment.likes, userId],
            }
          : comment
      ),
    }));
  }, []);

  // Add mention notification
  const addMention = useCallback((mentionData) => {
    const mentionId = `mention-${Date.now()}`;
    const newMention = {
      id: mentionId,
      ...mentionData,
    };

    setMentions(prev => [newMention, ...prev]);

    // Add to notifications
    addNotification({
      type: 'mention',
      data: newMention,
    });
  }, []);

  // Mark mention as read
  const markMentionAsRead = useCallback((mentionId) => {
    setMentions(prev =>
      prev.map(mention =>
        mention.id === mentionId ? { ...mention, read: true } : mention
      )
    );
  }, []);

  // Log activity
  const logActivity = useCallback((activityData) => {
    const activityId = `activity-${Date.now()}`;
    const newActivity = {
      id: activityId,
      ...activityData,
      timestamp: new Date().toISOString(),
    };

    setActivityLog(prev => [newActivity, ...prev].slice(0, 500)); // Keep last 500 activities
  }, []);

  // Add notification
  const addNotification = useCallback((notificationData) => {
    const notificationId = `notification-${Date.now()}`;
    const newNotification = {
      id: notificationId,
      ...notificationData,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Get comments for a task
  const getTaskComments = useCallback((taskId) => {
    return comments[taskId] || [];
  }, [comments]);

  // Get unread mentions for current user
  const getUnreadMentions = useCallback(() => {
    return mentions.filter(
      mention => mention.mentionedUserId === user?.id && !mention.read
    );
  }, [mentions, user]);

  // Get activity for a task
  const getTaskActivity = useCallback((taskId) => {
    return activityLog.filter(activity => activity.taskId === taskId);
  }, [activityLog]);

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.read);
  }, [notifications]);

  // Activity log for story assignments, status changes, etc.
  const logTaskActivity = useCallback((taskId, type, data) => {
    logActivity({
      type,
      taskId,
      ...data,
      timestamp: new Date().toISOString(),
    });
  }, [logActivity]);

  // Bulk log activity (for system events)
  const bulkLogActivity = useCallback((activities) => {
    activities.forEach(activity => logActivity(activity));
  }, [logActivity]);

  const value = {
    // Comments
    comments,
    addComment,
    addReply,
    editComment,
    deleteComment,
    toggleCommentLike,
    getTaskComments,

    // Mentions
    mentions,
    addMention,
    markMentionAsRead,
    getUnreadMentions,

    // Activity
    activityLog,
    logActivity,
    logTaskActivity,
    bulkLogActivity,
    getTaskActivity,

    // Notifications
    notifications,
    addNotification,
    markNotificationAsRead,
    getUnreadNotifications,
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within CollaborationProvider');
  }
  return context;
};
