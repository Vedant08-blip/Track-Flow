import React, { createContext, useContext, useState, useCallback } from 'react';

const TimeTrackingContext = createContext(null);

export const TimeTrackingProvider = ({ children }) => {
  const [timeEntries, setTimeEntries] = useState([
    {
      id: 'te-1',
      storyId: 'US-101',
      userId: 'user-1',
      userName: 'Alice Smith',
      hours: 4,
      date: new Date().toISOString().split('T')[0],
      description: 'Implemented OAuth2 provider integration',
      type: 'work' // work, meeting, review
    },
    {
      id: 'te-2',
      storyId: 'US-102',
      userId: 'user-2',
      userName: 'Bob Jones',
      hours: 2.5,
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      description: 'Design system review',
      type: 'meeting'
    },
  ]);

  const [storyEstimates, setStoryEstimates] = useState({
    'US-101': { estimated: 8, actual: 4 },
    'US-102': { estimated: 3, actual: 2.5 },
    'US-103': { estimated: 8, actual: 6 },
  });

  const addTimeEntry = useCallback((entry) => {
    const newEntry = {
      ...entry,
      id: `te-${Date.now()}`,
      date: entry.date || new Date().toISOString().split('T')[0],
    };
    setTimeEntries([...timeEntries, newEntry]);
    
    // Update story estimates
    setStoryEstimates(prev => ({
      ...prev,
      [entry.storyId]: {
        ...prev[entry.storyId],
        actual: (prev[entry.storyId]?.actual || 0) + entry.hours
      }
    }));
    
    return newEntry;
  }, [timeEntries]);

  const updateTimeEntry = useCallback((id, updates) => {
    setTimeEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteTimeEntry = useCallback((id) => {
    const entry = timeEntries.find(e => e.id === id);
    if (entry) {
      setTimeEntries(prev => prev.filter(e => e.id !== id));
      // Update estimates
      setStoryEstimates(prev => ({
        ...prev,
        [entry.storyId]: {
          ...prev[entry.storyId],
          actual: Math.max(0, (prev[entry.storyId]?.actual || 0) - entry.hours)
        }
      }));
    }
  }, [timeEntries]);

  const getStoryTimeEntries = useCallback((storyId) => {
    return timeEntries.filter(e => e.storyId === storyId);
  }, [timeEntries]);

  const getTotalTimeByStory = useCallback((storyId) => {
    return getStoryTimeEntries(storyId).reduce((sum, e) => sum + e.hours, 0);
  }, [timeEntries]);

  const getTotalTimeByUser = useCallback((userId) => {
    return timeEntries.filter(e => e.userId === userId).reduce((sum, e) => sum + e.hours, 0);
  }, [timeEntries]);

  const getTeamVelocityHours = useCallback((teamId, stories) => {
    const teamStories = stories.filter(s => s.teamId === teamId);
    return teamStories.reduce((sum, s) => {
      const estimate = storyEstimates[s.id];
      return sum + (estimate?.estimated || 0);
    }, 0);
  }, [storyEstimates]);

  const getTimeVariance = useCallback((storyId) => {
    const estimate = storyEstimates[storyId];
    if (!estimate) return 0;
    return estimate.actual - estimate.estimated;
  }, [storyEstimates]);

  const setStoryEstimate = useCallback((storyId, estimated) => {
    setStoryEstimates(prev => ({
      ...prev,
      [storyId]: {
        ...prev[storyId],
        estimated,
        actual: prev[storyId]?.actual || 0
      }
    }));
  }, []);

  const getWeeklyTimeData = useCallback((userId) => {
    const data = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      
      const dayEntries = timeEntries.filter(e => 
        e.date === dateStr && (!userId || e.userId === userId)
      );
      data[dayName] = dayEntries.reduce((sum, e) => sum + e.hours, 0);
    }
    return Object.entries(data).map(([day, hours]) => ({ day, hours }));
  }, [timeEntries]);

  const value = {
    timeEntries,
    storyEstimates,
    addTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    getStoryTimeEntries,
    getTotalTimeByStory,
    getTotalTimeByUser,
    getTeamVelocityHours,
    getTimeVariance,
    setStoryEstimate,
    getWeeklyTimeData,
  };

  return (
    <TimeTrackingContext.Provider value={value}>
      {children}
    </TimeTrackingContext.Provider>
  );
};

export const useTimeTracking = () => {
  const context = useContext(TimeTrackingContext);
  if (!context) {
    throw new Error('useTimeTracking must be used within TimeTrackingProvider');
  }
  return context;
};
