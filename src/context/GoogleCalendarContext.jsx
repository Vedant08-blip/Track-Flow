import React, { createContext, useContext, useState, useCallback } from 'react';

const GoogleCalendarContext = createContext(null);

export const GoogleCalendarProvider = ({ children }) => {
  const [calendarConfig, setCalendarConfig] = useState({
    connected: true,
    userEmail: 'user@trackflow.com',
    calendarId: 'primary',
    syncEnabled: true,
    autoSync: true,
  });

  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: 'event-1',
      storyId: 'US-101',
      title: 'US-101: Implement OAuth2 Authentication Flow',
      description: 'Work on OAuth2 provider integration',
      startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      endTime: new Date(Date.now() + 86400000 + 14400000).toISOString(), // +4 hours
      eventType: 'work_session',
      location: null,
      attendees: ['Alice Smith'],
      reminders: [15, 60], // minutes before
      synced: true,
      googleEventId: 'goog-event-1',
    },
    {
      id: 'event-2',
      storyId: 'US-102',
      title: 'Design Review: Typography System',
      description: 'Review typography changes with team',
      startTime: new Date(Date.now() + 172800000).toISOString(), // 2 days
      endTime: new Date(Date.now() + 172800000 + 3600000).toISOString(), // +1 hour
      eventType: 'meeting',
      location: 'Conference Room B',
      attendees: ['Bob Jones', 'Alice Smith', 'Charlie Brown'],
      reminders: [30],
      synced: true,
      googleEventId: 'goog-event-2',
    },
    {
      id: 'event-3',
      storyId: 'US-103',
      title: 'Database Migration Planning Session',
      description: 'Plan database schema migration',
      startTime: new Date(Date.now() + 259200000).toISOString(), // 3 days
      endTime: new Date(Date.now() + 259200000 + 5400000).toISOString(), // +1.5 hours
      eventType: 'planning',
      location: null,
      attendees: ['Charlie Brown', 'Alice Smith'],
      reminders: [15, 60],
      synced: true,
      googleEventId: 'goog-event-3',
    },
  ]);

  const [sprintMilestones, setSprintMilestones] = useState([
    {
      id: 'milestone-1',
      iterationId: 'it-1',
      title: 'Sprint 1.1 Planning',
      date: new Date(Date.now() + 604800000).toISOString(), // 1 week
      eventType: 'sprint_planning',
    },
    {
      id: 'milestone-2',
      iterationId: 'it-1',
      title: 'Sprint 1.1 Review & Retrospective',
      date: new Date(Date.now() + 1209600000).toISOString(), // 2 weeks
      eventType: 'sprint_review',
    },
  ]);

  const connectGoogleCalendar = useCallback((userEmail, calendarId) => {
    setCalendarConfig({
      connected: true,
      userEmail,
      calendarId,
      syncEnabled: true,
      autoSync: true,
    });
  }, []);

  const disconnectGoogleCalendar = useCallback(() => {
    setCalendarConfig({
      connected: false,
      userEmail: null,
      calendarId: null,
      syncEnabled: false,
      autoSync: false,
    });
  }, []);

  const createWorkSession = useCallback((storyId, startTime, endTime, title) => {
    const newEvent = {
      id: `event-${Date.now()}`,
      storyId,
      title: title || `Work Session: ${storyId}`,
      description: `Work on story ${storyId}`,
      startTime,
      endTime,
      eventType: 'work_session',
      location: null,
      attendees: [calendarConfig.userEmail],
      reminders: [15, 60],
      synced: calendarConfig.syncEnabled,
      googleEventId: null,
    };
    
    setCalendarEvents([...calendarEvents, newEvent]);
    return newEvent;
  }, [calendarEvents, calendarConfig]);

  const createMeeting = useCallback((storyId, title, startTime, endTime, attendees, location) => {
    const newEvent = {
      id: `event-${Date.now()}`,
      storyId,
      title,
      description: `Meeting related to ${storyId}`,
      startTime,
      endTime,
      eventType: 'meeting',
      location,
      attendees,
      reminders: [30],
      synced: calendarConfig.syncEnabled,
      googleEventId: null,
    };
    
    setCalendarEvents([...calendarEvents, newEvent]);
    return newEvent;
  }, [calendarEvents, calendarConfig]);

  const deleteCalendarEvent = useCallback((eventId) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== eventId));
  }, []);

  const updateCalendarEvent = useCallback((eventId, updates) => {
    setCalendarEvents(prev => prev.map(e => 
      e.id === eventId ? { ...e, ...updates } : e
    ));
  }, []);

  const getEventsForStory = useCallback((storyId) => {
    return calendarEvents.filter(e => e.storyId === storyId);
  }, [calendarEvents]);

  const getUpcomingEvents = useCallback((days = 7) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 86400000);
    
    return calendarEvents.filter(e => {
      const eventTime = new Date(e.startTime);
      return eventTime >= now && eventTime <= futureDate;
    }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [calendarEvents]);

  const getEventsForDate = useCallback((date) => {
    const dateStr = date.toISOString().split('T')[0];
    return calendarEvents.filter(e => {
      const eventDate = new Date(e.startTime).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  }, [calendarEvents]);

  const createSprintMilestone = useCallback((iterationId, title, date, eventType) => {
    const newMilestone = {
      id: `milestone-${Date.now()}`,
      iterationId,
      title,
      date,
      eventType,
    };
    
    setSprintMilestones([...sprintMilestones, newMilestone]);
    return newMilestone;
  }, [sprintMilestones]);

  const getTotalScheduledHours = useCallback((storyId) => {
    const events = getEventsForStory(storyId);
    return events.reduce((total, event) => {
      const start = new Date(event.startTime);
      const end = new Date(event.endTime);
      const hours = (end - start) / 3600000;
      return total + hours;
    }, 0);
  }, [calendarEvents]);

  const getTeamCalendarAvailability = useCallback((teamMemberEmail, days = 7) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 86400000);
    
    const memberEvents = calendarEvents.filter(e => 
      e.attendees.includes(teamMemberEmail)
    );
    
    const busy = memberEvents.filter(e => {
      const eventTime = new Date(e.startTime);
      return eventTime >= now && eventTime <= futureDate;
    });
    
    const totalMinutes = days * 24 * 60;
    const busyMinutes = busy.reduce((total, event) => {
      const start = new Date(event.startTime);
      const end = new Date(event.endTime);
      return total + ((end - start) / 60000);
    }, 0);
    
    return {
      availability: Math.round((1 - (busyMinutes / totalMinutes)) * 100),
      busyHours: Math.round(busyMinutes / 60),
      totalHours: days * 24,
      events: busy.length,
    };
  }, [calendarEvents]);

  const enableAutoSync = useCallback((enable) => {
    setCalendarConfig(prev => ({
      ...prev,
      autoSync: enable,
    }));
  }, []);

  const value = {
    calendarConfig,
    calendarEvents,
    sprintMilestones,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    createWorkSession,
    createMeeting,
    deleteCalendarEvent,
    updateCalendarEvent,
    getEventsForStory,
    getUpcomingEvents,
    getEventsForDate,
    createSprintMilestone,
    getTotalScheduledHours,
    getTeamCalendarAvailability,
    enableAutoSync,
  };

  return (
    <GoogleCalendarContext.Provider value={value}>
      {children}
    </GoogleCalendarContext.Provider>
  );
};

export const useGoogleCalendar = () => {
  const context = useContext(GoogleCalendarContext);
  if (!context) {
    throw new Error('useGoogleCalendar must be used within GoogleCalendarProvider');
  }
  return context;
};
