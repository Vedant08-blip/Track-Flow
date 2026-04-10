import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, FileText } from 'lucide-react';
import TeamChat from '../components/shared/TeamChat';
import { PageWrapper } from '../components/shared/UIComponents';

const TeamChatPage = () => {
  const [view, setView] = useState('chat'); // 'chat' or 'info'

  const stats = [
    { label: 'Active Conversations', value: '12', icon: MessageSquare, color: 'from-blue-500 to-cyan-500' },
    { label: 'Team Members', value: '8', icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Files Shared', value: '34', icon: FileText, color: 'from-green-500 to-emerald-500' }
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Team Chat
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Professional team communication with file sharing and quick links
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className={`bg-linear-to-br ${stat.color} rounded-2xl p-6 text-white`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold opacity-90">{stat.label}</h3>
                  <Icon className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="h-[600px]"
        >
          <TeamChat />
        </motion.div>

        {/* Features Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              Professional Communication
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>✓ One-on-one team messaging</li>
              <li>✓ Message editing and deletion</li>
              <li>✓ Real-time notifications</li>
              <li>✓ Search and filter conversations</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-500" />
              File & Link Sharing
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>✓ Attach and share files</li>
              <li>✓ Quick link sharing with preview</li>
              <li>✓ File size tracking</li>
              <li>✓ Download shared documents</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default TeamChatPage;
