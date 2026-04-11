import React, { createContext, useContext, useState, useCallback } from 'react';
import { useProject } from './ProjectContext';
import { useAuth } from './AuthContext';

const ChatAssistantContext = createContext();

export const useChatAssistant = () => {
  const context = useContext(ChatAssistantContext);
  if (!context) {
    throw new Error('useChatAssistant must be used within ChatAssistantProvider');
  }
  return context;
};

export const ChatAssistantProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const { stories, iterations, teams } = useProject();
  const { user } = useAuth();

  const detectQueryType = (query) => {
    const lower = query.toLowerCase();
    if (lower.match(/\b(blocker|blocked|issue|problem|stuck|help)\b/)) return 'blockers';
    if (lower.match(/\b(overdue|late|past due|missed deadline|behind)\b/)) return 'overdue';
    if (lower.match(/\b(sprint|status|progress|velocity|burndown)\b/)) return 'sprint_status';
    if (lower.match(/\b(team|members|people|who|developers?|engineers?)\b/)) return 'team_overview';
    if (lower.match(/\b(my tasks|my work|assigned to me|what.*assigned|what.*work)\b/)) return 'my_tasks';
    if (lower.match(/\b(priority|urgent|critical|high.*priority|important)\b/)) return 'high_priority';
    if (lower.match(/\b(complete|done|finished|closed|delivered|release)\b/)) return 'completed';
    if (lower.match(/\b(velocity|metrics|performance|capacity|throughput|charts?)\b/)) return 'velocity';
    if (lower.match(/\b(summary|total|count|how many|statistics?|overview)\b/)) return 'summary';
    return 'general';
  };

  const generateBlockersResponse = () => {
    const blockers = stories?.filter(s => s.status === 'In Progress' && s.priority === 'High') || [];
    return {
      title: blockers.length === 0 ? "No Current Blockers" : `Found ${blockers.length} Blocker(s)`,
      message: blockers.length === 0 ? "Great! No blocking issues right now." : `There ${blockers.length === 1 ? 'is' : 'are'} ${blockers.length} high-priority task(s) in progress.`,
      data: blockers.map(s => ({ id: s.id, title: s.title, assignee: s.assignee, priority: s.priority })),
      suggestedActions: ["Assign resources", "Re-prioritize", "Break into tasks"]
    };
  };

  const generateOverdueResponse = () => {
    const now = new Date();
    const overdue = stories?.filter(s => new Date(s.dueDate) < now && s.status !== 'Done') || [];
    return {
      title: overdue.length === 0 ? "All On Track" : `${overdue.length} Overdue Task(s)`,
      message: overdue.length === 0 ? "No overdue tasks! Team is on schedule." : `There ${overdue.length === 1 ? 'is' : 'are'} ${overdue.length} task(s) past due.`,
      data: overdue.map(s => ({ title: s.title, assignee: s.assignee, dueDate: s.dueDate })),
      suggestedActions: ["Update priorities", "Add resources", "Communicate"]
    };
  };

  const generateSprintStatusResponse = () => {
    const sprint = iterations?.find(i => i.status === 'Active') || iterations?.[0];
    if (!sprint) {
      return { title: "No Active Sprint", message: "No active sprint currently.", data: [], suggestedActions: [] };
    }
    const sprintStories = stories?.filter(s => s.iteration === sprint.id) || [];
    const completed = sprintStories.filter(s => s.status === 'Done').length;
    const progress = sprintStories.length > 0 ? Math.round((completed / sprintStories.length) * 100) : 0;
    return {
      title: `Sprint "${sprint.name}" Status`,
      message: `Progress: ${progress}%. ${completed} of ${sprintStories.length} tasks done.`,
      data: { progress, completed, total: sprintStories.length, velocity: sprint.velocity || 0 },
      suggestedActions: ["View burndown", "Update tasks", "Plan next"]
    };
  };

  const generateTeamResponse = () => {
    const total = teams?.reduce((sum, t) => sum + (t.members?.length || 0), 0) || 0;
    return {
      title: "Team Overview",
      message: `You have ${teams?.length || 0} team(s) with ${total} total members.`,
      data: teams?.map(t => ({ name: t.name, members: t.members?.length || 0 })) || [],
      suggestedActions: ["View details", "Manage skills", "Assign tasks"]
    };
  };

  const generateMyTasksResponse = () => {
    const myTasks = stories?.filter(s => s.assignee === user?.name && s.status !== 'Done') || [];
    const inProgress = myTasks.filter(s => s.status === 'In Progress').length;
    return {
      title: `Your Tasks (${myTasks.length})`,
      message: `You have ${myTasks.length} active task(s): ${inProgress} in progress, ${myTasks.length - inProgress} to do.`,
      data: myTasks.map(s => ({ title: s.title, status: s.status, priority: s.priority })),
      suggestedActions: ["Update status", "Request help", "View details"]
    };
  };

  const generateHighPriorityResponse = () => {
    const high = stories?.filter(s => s.priority === 'High' && s.status !== 'Done') || [];
    return {
      title: `High Priority Tasks (${high.length})`,
      message: `There ${high.length === 1 ? 'is' : 'are'} ${high.length} high-priority task(s).`,
      data: high.map(s => ({ title: s.title, assignee: s.assignee, status: s.status })),
      suggestedActions: ["Focus", "Allocate resources", "Update stakeholders"]
    };
  };

  const generateCompletedResponse = () => {
    const completed = stories?.filter(s => s.status === 'Done') || [];
    return {
      title: `Completed Tasks (${completed.length})`,
      message: `Great progress! ${completed.length} task(s) completed.`,
      data: completed.slice(-5).map(s => ({ title: s.title, assignee: s.assignee })),
      suggestedActions: ["View more", "Celebrate", "Plan next"]
    };
  };

  const generateVelocityResponse = () => {
    const done = stories?.filter(s => s.status === 'Done') || [];
    const points = done.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
    return {
      title: "Team Velocity",
      message: `Team completed ${done.length} tasks with ${points} story points.`,
      data: { completedTasks: done.length, completedPoints: points, sprints: iterations?.length || 0 },
      suggestedActions: ["View chart", "Plan sprint", "Adjust capacity"]
    };
  };

  const generateSummaryResponse = () => {
    const total = stories?.length || 0;
    const done = stories?.filter(s => s.status === 'Done').length || 0;
    return {
      title: "Project Summary",
      message: `Overview: ${done}/${total} complete, ${teams?.length || 0} teams, ${iterations?.length || 0} sprints.`,
      data: { totalTasks: total, completed: done, completionRate: total > 0 ? Math.round((done / total) * 100) : 0, teams: teams?.length || 0 },
      suggestedActions: ["View dashboard", "Review analytics", "Plan"]
    };
  };

  const generateGeneralResponse = () => {
    return {
      title: "Project Overview",
      message: "I can help with blockers, sprint status, your tasks, team info, and more! Try asking about your work.",
      data: { features: ["Sprint status", "Blockers", "Tasks", "Team", "Velocity", "Completed work", "Priority items"] },
      suggestedActions: ["View sprint", "Check blockers", "My tasks"]
    };
  };

  const generateResponse = (type) => {
    switch (type) {
      case 'blockers': return generateBlockersResponse();
      case 'overdue': return generateOverdueResponse();
      case 'sprint_status': return generateSprintStatusResponse();
      case 'team_overview': return generateTeamResponse();
      case 'my_tasks': return generateMyTasksResponse();
      case 'high_priority': return generateHighPriorityResponse();
      case 'completed': return generateCompletedResponse();
      case 'velocity': return generateVelocityResponse();
      case 'summary': return generateSummaryResponse();
      default: return generateGeneralResponse();
    }
  };

  const sendMessage = useCallback((userMessage) => {
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', content: userMessage, timestamp: new Date() }]);
    const queryType = detectQueryType(userMessage);
    const response = generateResponse(queryType);
    setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', content: response, timestamp: new Date() }]);
    return response;
  }, [stories, iterations, teams, user]);

  const getSuggestedQueries = () => [
    "What are the blockers?", "Show me my tasks", "Sprint status",
    "Team overview", "High priority tasks", "Completed work", "Project summary"
  ];

  return (
    <ChatAssistantContext.Provider value={{ messages, sendMessage, getSuggestedQueries, clearMessages: () => setMessages([]) }}>
      {children}
    </ChatAssistantContext.Provider>
  );
};
