import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Paperclip,
  Link as LinkIcon,
  MoreVertical,
  X,
  Download,
  Trash2,
  Edit2,
  Check,
  Clock,
  User,
  MessageSquare,
  Search,
  ChevronDown
} from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';
import useUserProfile from '../../hooks/useUserProfile';
import { useSkillBasedAssignment } from '../../context/SkillBasedAssignmentContext';
import { cn } from '../../utils/helpers';

const TeamChat = () => {
  const { conversations, activeConversation, setActiveConversation, getOrCreateConversation, sendMessage, markConversationAsRead, editMessage, deleteMessage } = useChatContext();
  const { userProfile } = useUserProfile();
  const { teamMembers } = useSkillBasedAssignment();
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFileMenu, setShowFileMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages]);

  // Mark conversation as read when opened
  useEffect(() => {
    if (activeConversation) {
      markConversationAsRead(activeConversation.id);
    }
  }, [activeConversation, markConversationAsRead]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation) return;

    sendMessage(
      activeConversation.id,
      userProfile?.name || 'You',
      messageText.trim(),
      attachments,
      links
    );

    setMessageText('');
    setAttachments([]);
    setLinks([]);
  };

  const handleAddLink = () => {
    if (newLink.trim()) {
      // Basic URL validation
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (urlRegex.test(newLink)) {
        setLinks([...links, { id: Date.now(), url: newLink, title: new URL('http://' + newLink).hostname }]);
        setNewLink('');
        setShowLinkInput(false);
      } else {
        alert('Please enter a valid URL');
      }
    }
  };

  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachments([...attachments, {
          id: Date.now(),
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2),
          type: file.type,
          data: event.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleEditMessage = (messageId, currentText) => {
    setEditingMessageId(messageId);
    setEditingText(currentText);
  };

  const handleSaveEdit = (conversationId, messageId) => {
    if (editingText.trim()) {
      editMessage(conversationId, messageId, editingText);
      setEditingMessageId(null);
      setEditingText('');
    }
  };

  const handleStartConversation = (member) => {
    const conversation = getOrCreateConversation(userProfile?.id, member.id, member.name);
    setActiveConversation(conversation);
    setSearchQuery('');
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) && member.id !== userProfile?.id
  );

  const filteredConversations = conversations.filter(conv =>
    conv.teamMemberName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-lg">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-gray-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-slate-800/30">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Team Chat</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Active Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            filteredConversations.map(conv => (
              <motion.button
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
                whileHover={{ x: 4 }}
                className={cn(
                  "w-full text-left px-4 py-3 border-b border-gray-200 dark:border-slate-700 transition-colors",
                  activeConversation?.id === conv.id
                    ? "bg-white dark:bg-slate-700 border-l-4 border-l-primary"
                    : "hover:bg-white/50 dark:hover:bg-slate-700/50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                    {conv.teamMemberName}
                  </h3>
                  {conv.lastMessageTime && (
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-slate-400 truncate line-clamp-1">
                  {conv.lastMessage || 'No messages yet'}
                </p>
              </motion.button>
            ))
          )}
        </div>

        {/* Team Members to Start Conversation */}
        {searchQuery && filteredMembers.length > 0 && (
          <div className="border-t border-gray-200 dark:border-slate-800 p-3">
            <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Start Conversation
            </p>
            {filteredMembers.map(member => (
              <motion.button
                key={member.id}
                onClick={() => handleStartConversation(member)}
                whileHover={{ x: 4 }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors mb-1"
              >
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {member.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-slate-400 truncate">
                  {member.role || 'Team Member'}
                </p>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm">
                    {activeConversation.teamMemberName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {activeConversation.teamMemberName}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-slate-400">Active now</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveConversation(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-linear-to-b from-transparent to-slate-50/50 dark:to-slate-800/20">
              {activeConversation.messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <MessageSquare className="w-16 h-16 mx-auto mb-3 text-gray-300 dark:text-slate-600" />
                    <p className="text-gray-600 dark:text-slate-400 font-medium mb-1">
                      Start a conversation
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-500">
                      Send a message to begin chatting with {activeConversation.teamMemberName}
                    </p>
                  </div>
                </div>
              ) : (
                activeConversation.messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3 group",
                      message.sender === userProfile?.name ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.sender !== userProfile?.name && (
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {message.sender.charAt(0)}
                      </div>
                    )}

                    <div className={cn(
                      "flex flex-col gap-1 max-w-md",
                      message.sender === userProfile?.name && "items-end"
                    )}>
                      {/* Message Content */}
                      <div className={cn(
                        "px-4 py-2 rounded-xl",
                        message.sender === userProfile?.name
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-none border border-gray-200 dark:border-slate-600"
                      )}>
                        {editingMessageId === message.id && message.sender === userProfile?.name ? (
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="flex-1 bg-transparent text-white border-b border-white/30 focus:outline-none text-sm"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(activeConversation.id, message.id)}
                              className="p-1 hover:bg-white/20 rounded transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm wrap-break-word">{message.content}</p>
                            {message.edited && (
                              <p className="text-xs opacity-70 mt-1">(edited)</p>
                            )}
                          </>
                        )}
                      </div>

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="space-y-2">
                          {message.attachments.map(attachment => (
                            <div
                              key={attachment.id}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                                message.sender === userProfile?.name
                                  ? "bg-primary/20 text-white"
                                  : "bg-gray-100 dark:bg-slate-600 text-slate-900 dark:text-white"
                              )}
                            >
                              <Paperclip className="w-4 h-4 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="truncate font-medium text-xs">{attachment.name}</p>
                                <p className="text-xs opacity-70">{attachment.size} MB</p>
                              </div>
                              <button className="p-1 hover:opacity-70 transition-opacity">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Links */}
                      {message.links && message.links.length > 0 && (
                        <div className="space-y-2">
                          {message.links.map(link => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm group/link",
                                message.sender === userProfile?.name
                                  ? "bg-primary/20 text-white hover:bg-primary/30"
                                  : "bg-gray-100 dark:bg-slate-600 text-slate-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700"
                              )}
                            >
                              <LinkIcon className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate text-xs font-medium">{link.title}</span>
                              <ChevronDown className="w-3 h-3 ml-auto flex-shrink-0 group-hover/link:translate-y-0.5 transition-transform" />
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Timestamp & Actions */}
                      <div className="flex items-center gap-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-gray-500 dark:text-slate-500">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        {message.sender === userProfile?.name && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditMessage(message.id, message.content)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition-colors"
                              title="Edit message"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => deleteMessage(activeConversation.id, message.id)}
                              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors text-red-600"
                              title="Delete message"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="mb-3 space-y-2 max-h-32 overflow-y-auto">
                  {attachments.map(att => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between bg-gray-100 dark:bg-slate-700 rounded-lg p-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-gray-600 dark:text-slate-400" />
                        <span className="text-slate-900 dark:text-white truncate">{att.name}</span>
                      </div>
                      <button
                        onClick={() => setAttachments(attachments.filter(a => a.id !== att.id))}
                        className="text-gray-500 dark:text-slate-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Links Preview */}
              {links.length > 0 && (
                <div className="mb-3 space-y-2 max-h-32 overflow-y-auto">
                  {links.map(link => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between bg-gray-100 dark:bg-slate-700 rounded-lg p-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-gray-600 dark:text-slate-400" />
                        <span className="text-slate-900 dark:text-white truncate text-xs">{link.url}</span>
                      </div>
                      <button
                        onClick={() => setLinks(links.filter(l => l.id !== link.id))}
                        className="text-gray-500 dark:text-slate-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Bar */}
              <div className="flex gap-3">
                {/* File Button */}
                <div className="relative">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 transition-colors"
                    title="Attach files"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileAttach}
                    className="hidden"
                  />
                </div>

                {/* Link Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowLinkInput(!showLinkInput)}
                    className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 transition-colors"
                    title="Add link"
                  >
                    <LinkIcon className="w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {showLinkInput && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-12 left-0 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg shadow-lg p-3 w-64 z-10"
                      >
                        <input
                          type="text"
                          placeholder="Paste link..."
                          value={newLink}
                          onChange={(e) => setNewLink(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddLink()}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 mb-2"
                          autoFocus
                        />
                        <button
                          onClick={handleAddLink}
                          className="w-full px-3 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium text-sm transition-colors"
                        >
                          Add Link
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Message Input */}
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="p-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send message (Enter)"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-xs font-mono">Enter</kbd> to send
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-slate-600" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-2">
                No conversation selected
              </h3>
              <p className="text-gray-600 dark:text-slate-400 text-sm max-w-xs">
                Select a conversation from the list or search for a team member to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamChat;
