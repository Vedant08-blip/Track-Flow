import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Heart,
  MessageCircle,
  Trash2,
  Edit2,
  MoreVertical,
  AtSign,
  X,
  Check,
} from 'lucide-react';
import { useCollaboration } from '../../context/CollaborationContext';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';

const TaskComments = ({ taskId, onClose }) => {
  const { user } = useAuth();
  const { teams } = useProject();
  const { getTaskComments, addComment, addReply, editComment, deleteComment, toggleCommentLike } = useCollaboration();
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [mentions, setMentions] = useState([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyMentions, setReplyMentions] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const commentInputRef = useRef(null);

  // Get all team members for mentions
  const getAllTeamMembers = () => {
    const allMembers = [];
    teams?.forEach(team => {
      team.members?.forEach(member => {
        if (!allMembers.find(m => m.id === member.id)) {
          allMembers.push(member);
        }
      });
    });
    return allMembers;
  };

  const teamMembers = getAllTeamMembers();

  // Load comments
  useEffect(() => {
    const taskComments = getTaskComments(taskId);
    setComments(taskComments);
  }, [taskId, getTaskComments]);

  // Handle mention detection
  const handleCommentChange = (e) => {
    const value = e.target.value;
    setNewComment(value);

    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const afterAt = value.substring(lastAtIndex + 1);
      if (!afterAt.includes(' ') && afterAt.length > 0) {
        setMentionQuery(afterAt);
        setShowMentionDropdown(true);
      } else {
        setShowMentionDropdown(false);
      }
    } else {
      setShowMentionDropdown(false);
    }
  };

  // Get filtered members based on mention query
  const getFilteredMembers = () => {
    if (!mentionQuery) return teamMembers;
    return teamMembers.filter(member =>
      member.name.toLowerCase().includes(mentionQuery.toLowerCase())
    );
  };

  // Handle mention selection
  const handleMentionSelect = (member) => {
    const lastAtIndex = newComment.lastIndexOf('@');
    const beforeAt = newComment.substring(0, lastAtIndex);
    const updatedComment = beforeAt + `@${member.name} `;
    setNewComment(updatedComment);
    setMentions([...mentions, member]);
    setShowMentionDropdown(false);
    setMentionQuery('');
    commentInputRef.current?.focus();
  };

  // Handle submit comment
  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const commentData = {
      content: newComment,
      mentions,
    };

    addComment(taskId, commentData);
    setNewComment('');
    setMentions([]);
    setComments(getTaskComments(taskId));
  };

  // Handle submit reply
  const handleSubmitReply = (parentCommentId) => {
    if (!replyContent.trim()) return;

    const replyData = {
      content: replyContent,
      mentions: replyMentions,
    };

    addReply(taskId, parentCommentId, replyData);
    setReplyContent('');
    setReplyMentions([]);
    setReplyingTo(null);
    setComments(getTaskComments(taskId));
  };

  // Handle edit comment
  const handleEditComment = (commentId) => {
    if (!editingContent.trim()) return;
    editComment(taskId, commentId, editingContent);
    setEditingCommentId(null);
    setEditingContent('');
    setComments(getTaskComments(taskId));
  };

  // Handle delete comment
  const handleDeleteComment = (commentId) => {
    deleteComment(taskId, commentId);
    setComments(getTaskComments(taskId));
    setActiveMenu(null);
  };

  // Handle like comment
  const handleLikeComment = (commentId) => {
    toggleCommentLike(taskId, commentId, user.id);
    setComments(getTaskComments(taskId));
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      transition={{ type: 'spring', damping: 25 }}
      className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-40 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageCircle size={20} />
          Comments
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {comments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-slate-500 dark:text-slate-400"
            >
              <MessageCircle size={40} className="mx-auto mb-3 opacity-50" />
              <p>No comments yet</p>
              <p className="text-sm">Start a discussion about this task</p>
            </motion.div>
          ) : (
            comments.map((comment, idx) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 space-y-2"
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {comment.author.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {formatTime(comment.createdAt)}
                        {comment.edited && ' • edited'}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === comment.id ? null : comment.id)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    >
                      <MoreVertical size={14} />
                    </button>
                    <AnimatePresence>
                      {activeMenu === comment.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50"
                        >
                          {comment.author.id === user.id && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingContent(comment.content);
                                  setActiveMenu(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 rounded-t"
                              >
                                <Edit2 size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 rounded-b"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Comment Content */}
                {editingCommentId === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      rows="3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 transition-colors"
                      >
                        <Check size={12} />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="flex-1 px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white text-xs font-medium rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-900 dark:text-slate-100 leading-relaxed">
                    {comment.content}
                  </p>
                )}

                {/* Comment Actions */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center gap-1 text-[10px] font-medium transition-colors ${
                      comment.likes?.includes(user.id)
                        ? 'text-red-500'
                        : 'text-slate-500 dark:text-slate-400 hover:text-red-500'
                    }`}
                  >
                    <Heart size={12} fill={comment.likes?.includes(user.id) ? 'currentColor' : 'none'} />
                    {comment.likes?.length > 0 && comment.likes.length}
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
                  >
                    <MessageCircle size={12} />
                    Reply
                  </button>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="space-y-2 pl-3 border-l-2 border-slate-200 dark:border-slate-700 mt-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <img
                            src={reply.author.avatar}
                            alt={reply.author.name}
                            className="w-4 h-4 rounded-full"
                          />
                          <span className="font-bold text-slate-900 dark:text-white">
                            {reply.author.name}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {formatTime(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                {replyingTo === comment.id && (
                  <div className="pt-2 space-y-2">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSubmitReply(comment.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
                        disabled={!replyContent.trim()}
                      >
                        <Send size={12} />
                        Reply
                      </button>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white text-xs font-medium rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Comment Input */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-3">
        <div className="relative">
          <div className="flex items-start gap-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full mt-2 flex-shrink-0"
            />
            <div className="flex-1 relative">
              <textarea
                ref={commentInputRef}
                value={newComment}
                onChange={handleCommentChange}
                placeholder="Add a comment... (Type @ to mention)"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                rows="3"
              />

              {/* Mention Dropdown */}
              <AnimatePresence>
                {showMentionDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-full left-12 mb-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50"
                  >
                    {getFilteredMembers().length === 0 ? (
                      <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                        No members found
                      </div>
                    ) : (
                      getFilteredMembers().map(member => (
                        <button
                          key={member.id}
                          onClick={() => handleMentionSelect(member)}
                          className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                        >
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-4 h-4 rounded-full"
                          />
                          {member.name}
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mentioned Members Badges */}
          {mentions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 pl-8">
              {mentions.map(member => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-medium rounded-full"
                >
                  <span>@{member.name}</span>
                  <button
                    onClick={() => setMentions(mentions.filter(m => m.id !== member.id))}
                    className="hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            Comment
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskComments;
