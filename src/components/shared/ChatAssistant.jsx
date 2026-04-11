import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, MessageCircle, AlertCircle, Users, CheckCircle, TrendingUp, Zap, RotateCcw, Trash2 } from 'lucide-react';
import { useChatAssistant } from '../../context/ChatAssistantContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/helpers';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { isDark } = useTheme();
  const { messages, sendMessage, getSuggestedQueries, clearMessages } = useChatAssistant();

  const suggestedQueries = getSuggestedQueries();

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (messageText = inputValue) => {
    if (!messageText.trim()) return;

    setIsLoading(true);
    setInputValue('');

    // Simulate slight delay for better UX
    setTimeout(() => {
      sendMessage(messageText);
      setIsLoading(false);
    }, 300);
  };

  const handleSuggestedQuery = (query) => {
    handleSendMessage(query);
  };

  const getQueryIcon = (messageContent) => {
    const content = messageContent.content || {};
    const title = content.title || '';

    if (title.includes('Blocker')) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (title.includes('Team')) return <Users className="w-4 h-4 text-blue-500" />;
    if (title.includes('Completed')) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (title.includes('Velocity') || title.includes('Performance')) return <TrendingUp className="w-4 h-4 text-purple-500" />;
    if (title.includes('Priority')) return <Zap className="w-4 h-4 text-yellow-500" />;
    return <Sparkles className="w-4 h-4 text-primary" />;
  };

  const renderMessageContent = (content) => {
    if (!content) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          {getQueryIcon({ content })}
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-900 dark:text-white">{content.title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{content.message}</p>
          </div>
        </div>

        {/* Render data based on content type */}
        {content.data && Array.isArray(content.data) && content.data.length > 0 && (
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {content.data.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-3 bg-linear-to-r from-gray-50 to-gray-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-lg text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{item.title || item.name || item.id}</p>
                    <div className="mt-2 space-y-1">
                      {item.assignee && <p className="text-gray-500 dark:text-gray-400">👤 <span className="font-medium">{item.assignee}</span></p>}
                      {item.priority && <p className="text-gray-500 dark:text-gray-400">🎯 <span className="font-medium">{item.priority}</span></p>}
                      {item.status && <p className="text-gray-500 dark:text-gray-400">📊 <span className="font-medium">{item.status}</span></p>}
                      {item.dueDate && <p className="text-gray-500 dark:text-gray-400">📅 <span className="font-medium">{new Date(item.dueDate).toLocaleDateString()}</span></p>}
                      {item.members && <p className="text-gray-500 dark:text-gray-400">👥 <span className="font-medium">{item.members} members</span></p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Render summary data */}
        {content.data && typeof content.data === 'object' && !Array.isArray(content.data) && (
          <div className="mt-3 space-y-2">
            {Object.entries(content.data).map(([key, value]) => {
              if (key === 'features' && Array.isArray(value)) {
                return (
                  <div key={key} className="col-span-2 space-y-2">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Available Queries</p>
                    {value.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-2 bg-linear-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded text-xs text-gray-700 dark:text-gray-300 flex items-center gap-2 border border-primary/20 dark:border-primary/30 hover:bg-linear-to-r hover:from-primary/10 hover:to-primary/15 transition-all"
                      >
                        <span className="text-primary font-bold">✓</span> {feature}
                      </motion.div>
                    ))}
                  </div>
                );
              }

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-linear-to-r from-gray-50 to-gray-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-lg text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  <p className="text-gray-500 dark:text-gray-400 capitalize text-[10px] font-bold tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="font-bold text-gray-900 dark:text-white text-base">{value}</p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Suggested actions */}
        {content.suggestedActions && content.suggestedActions.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-700">
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Next Steps</p>
            <div className="flex flex-wrap gap-2">
              {content.suggestedActions.map((action, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSuggestedQuery(action)}
                  className="px-3 py-1.5 text-xs bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 text-primary dark:text-blue-300 rounded-lg transition-all border border-primary/20 dark:border-primary/30 font-medium"
                >
                  → {action}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Chat Button - Fixed at bottom right */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
          "hover:shadow-xl cursor-pointer",
          isDark
            ? "bg-primary/90 hover:bg-primary text-white"
            : "bg-primary text-white hover:bg-primary/90"
        )}
        title="Open AI Chat Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification badge if there are unread messages */}
        {messages.length > 0 && !isOpen && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center"
          >
            {messages.length > 9 ? '9+' : messages.length}
          </motion.span>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "fixed bottom-24 right-6 z-50 rounded-2xl shadow-2xl overflow-hidden w-96 max-h-96 flex flex-col",
              "border",
              isDark
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-gray-200"
            )}
          >
            {/* Header */}
            <div className="p-4 bg-linear-to-r from-primary to-primary/80 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={20} />
                <span className="font-semibold">Project Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      clearMessages();
                      setInputValue('');
                    }}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors group relative"
                    title="Clear chat history"
                  >
                    <Trash2 size={16} />
                    <span className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Clear chat
                    </span>
                  </motion.button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className={cn(
              "flex-1 overflow-y-auto p-4 space-y-4",
              isDark ? "bg-slate-900/50" : "bg-gray-50"
            )}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <Sparkles size={32} className="text-primary/50" />
                  <p className={cn(
                    "text-center text-sm font-medium",
                    isDark ? "text-gray-300" : "text-gray-600"
                  )}>
                    Welcome! Ask me anything about your project.
                  </p>

                  {/* Suggested queries */}
                  <div className="w-full space-y-2 mt-4">
                    {suggestedQueries.map((query, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedQuery(query)}
                        className={cn(
                          "w-full px-3 py-2 text-sm rounded-lg transition-colors text-left hover:bg-primary/10",
                          isDark
                            ? "bg-slate-800 text-gray-300 hover:bg-primary/20"
                            : "bg-gray-200 text-gray-700 hover:bg-primary/10"
                        )}
                      >
                        💬 {query}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-3",
                        message.type === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.type === 'bot' && (
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          isDark ? "bg-primary/20" : "bg-primary/10"
                        )}>
                          <Sparkles size={16} className="text-primary" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "max-w-[70%] px-4 py-3 rounded-lg",
                          message.type === 'user'
                            ? "bg-primary text-white rounded-br-none"
                            : isDark
                              ? "bg-slate-800 text-gray-100"
                              : "bg-gray-100 text-gray-900"
                        )}
                      >
                        {message.type === 'user' ? (
                          <p className="text-sm">{message.content}</p>
                        ) : (
                          renderMessageContent(message.content)
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2 items-center"
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        isDark ? "bg-primary/20" : "bg-primary/10"
                      )}>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Sparkles size={16} className="text-primary" />
                        </motion.div>
                      </div>
                      <span className={cn(
                        "text-sm",
                        isDark ? "text-gray-400" : "text-gray-500"
                      )}>
                        Analyzing...
                      </span>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className={cn(
              "border-t p-3",
              isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white"
            )}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask about your project..."
                  disabled={isLoading}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all disabled:opacity-50",
                    isDark
                      ? "bg-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50"
                      : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary/30"
                  )}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    inputValue.trim() && !isLoading
                      ? "bg-primary text-white hover:bg-primary/90 cursor-pointer"
                      : "bg-gray-200 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;
