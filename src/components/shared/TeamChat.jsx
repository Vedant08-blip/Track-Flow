import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Pin, Search, Phone, Video, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/helpers';

const TeamChat = () => {
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Frontend Team', lastMessage: 'Working on the UI components', time: '5m ago', unread: 3, avatar: '👨‍💻', isGroup: true },
    { id: 2, name: 'Alex Johnson', lastMessage: 'Sure, I\'ll review the PR tomorrow', time: '1h ago', unread: 0, avatar: '👤' },
    { id: 3, name: 'Backend Team', lastMessage: 'API endpoints are ready for testing', time: '2h ago', unread: 1, avatar: '⚙️', isGroup: true },
  ]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'You', text: 'Hey everyone, how\'s the progress?', time: '10:30 AM', avatar: '👤' },
    { id: 2, sender: 'Alex', text: 'Almost done with the login form', time: '10:32 AM', avatar: '👨‍💻' },
    { id: 3, sender: 'You', text: 'Great! Let me know when it\'s ready', time: '10:35 AM', avatar: '👤' },
  ]);

  const [messageInput, setMessageInput] = useState('');
  const [searchConversation, setSearchConversation] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        text: messageInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: '👤',
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchConversation.toLowerCase())
  );

  return (
    <div className="flex h-full gap-4 rounded-2xl overflow-hidden shadow-xl">
      {/* Conversations List */}
      <div className="w-full md:w-80 flex flex-col border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Team Chat</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchConversation}
              onChange={(e) => setSearchConversation(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white text-sm"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto space-y-1 p-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map(conversation => (
              <motion.button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                whileHover={{ x: 4 }}
                className={cn(
                  "w-full p-3 rounded-lg text-left transition-all duration-200 group flex items-start gap-3",
                  selectedConversation?.id === conversation.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-800"
                )}
              >
                <div className="text-2xl shrink-0">{conversation.avatar}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{conversation.name}</h3>
                  <p className={cn(
                    "text-xs truncate",
                    selectedConversation?.id === conversation.id
                      ? "text-white/80"
                      : "text-gray-500 dark:text-slate-400"
                  )}>
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread > 0 && (
                  <span className={cn(
                    "ml-2 text-xs font-bold px-2 py-1 rounded-full shrink-0",
                    selectedConversation?.id === conversation.id
                      ? "bg-white/30 text-white"
                      : "bg-primary/20 text-primary dark:bg-primary/30"
                  )}>
                    {conversation.unread}
                  </span>
                )}
              </motion.button>
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500 dark:text-slate-400">
              No conversations found
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 hidden md:flex flex-col bg-white dark:bg-slate-900/30">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{selectedConversation.avatar}</div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">{selectedConversation.name}</h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Active now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-600 dark:text-slate-400">
                  <Phone size={18} />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-600 dark:text-slate-400">
                  <Video size={18} />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-600 dark:text-slate-400">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex gap-3",
                    message.sender === 'You' ? "justify-end" : "justify-start"
                  )}
                  onHover={() => setSelectedMessage(message.id)}
                  onMouseEnter={() => setSelectedMessage(message.id)}
                  onMouseLeave={() => setSelectedMessage(null)}
                >
                  {message.sender !== 'You' && <div className="text-2xl">{message.avatar}</div>}
                  <div className={cn(
                    "flex flex-col gap-1",
                    message.sender === 'You' ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "px-4 py-2 rounded-lg max-w-xs text-sm",
                      message.sender === 'You'
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-bl-none"
                    )}>
                      {message.text}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-slate-400 px-2">{message.time}</span>
                  </div>
                  {selectedMessage === message.id && message.sender !== 'You' && (
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <Pin size={14} className="text-gray-500 dark:text-slate-400" />
                    </button>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="h-20 px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900/50">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-600 dark:text-slate-400">
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white text-sm"
              />
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-600 dark:text-slate-400">
                <Smile size={20} />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  messageInput.trim()
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "text-gray-400 cursor-not-allowed"
                )}
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-slate-400">
            <div className="text-center">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-lg font-medium">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamChat;
