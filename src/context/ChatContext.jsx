import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [unreadCount, setUnreadCount] = useState({});

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('teamConversations');
    if (savedConversations) {
      try {
        setConversations(JSON.parse(savedConversations));
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('teamConversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const getOrCreateConversation = (userId, teamMemberId, teamMemberName) => {
    const conversationId = [userId, teamMemberId].sort().join('-');
    const existingConversation = conversations.find(conv => conv.id === conversationId);

    if (existingConversation) {
      return existingConversation;
    }

    const newConversation = {
      id: conversationId,
      userId,
      teamMemberId,
      teamMemberName,
      messages: [],
      createdAt: new Date().toISOString(),
      lastMessage: null,
      lastMessageTime: null
    };

    setConversations([...conversations, newConversation]);
    return newConversation;
  };

  const sendMessage = (conversationId, sender, content, attachments = [], links = []) => {
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        const newMessage = {
          id: `msg-${Date.now()}`,
          sender,
          content,
          attachments,
          links,
          timestamp: new Date().toISOString(),
          read: false,
          edited: false
        };

        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: content,
          lastMessageTime: new Date().toISOString()
        };
      }
      return conv;
    }));
  };

  const markConversationAsRead = (conversationId) => {
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: conv.messages.map(msg => ({ ...msg, read: true }))
        };
      }
      return conv;
    }));

    setUnreadCount(prev => {
      const updated = { ...prev };
      delete updated[conversationId];
      return updated;
    });
  };

  const editMessage = (conversationId, messageId, newContent) => {
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: conv.messages.map(msg => {
            if (msg.id === messageId) {
              return { ...msg, content: newContent, edited: true, editedAt: new Date().toISOString() };
            }
            return msg;
          })
        };
      }
      return conv;
    }));
  };

  const deleteMessage = (conversationId, messageId) => {
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: conv.messages.filter(msg => msg.id !== messageId)
        };
      }
      return conv;
    }));
  };

  const deleteConversation = (conversationId) => {
    setConversations(conversations.filter(conv => conv.id !== conversationId));
    if (activeConversation?.id === conversationId) {
      setActiveConversation(null);
    }
  };

  const getConversationWithMember = (teamMemberId) => {
    return conversations.find(conv => conv.teamMemberId === teamMemberId);
  };

  const getTotalUnreadCount = () => {
    return Object.values(unreadCount).reduce((sum, count) => sum + count, 0);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        setActiveConversation,
        getOrCreateConversation,
        sendMessage,
        markConversationAsRead,
        editMessage,
        deleteMessage,
        deleteConversation,
        getConversationWithMember,
        unreadCount,
        getTotalUnreadCount
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
