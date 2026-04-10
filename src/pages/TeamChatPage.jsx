import React from 'react';
import TeamChat from '../components/shared/TeamChat';

const TeamChatPage = () => {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Team Chat</h1>
        <p className="text-gray-600 dark:text-slate-400">Professional team communication with file sharing and quick links</p>
      </div>
      
      <TeamChat />
    </div>
  );
};

export default TeamChatPage;
