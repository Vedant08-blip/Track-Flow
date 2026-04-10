import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, X, Clock, MapPin, Users } from 'lucide-react';
import { useGoogleCalendar } from '../../context/GoogleCalendarContext';
import { formatDistanceToNow, format } from 'date-fns';

const GoogleCalendarIntegration = ({ storyId, storyTitle }) => {
  const {
    calendarConfig,
    calendarEvents,
    createWorkSession,
    createMeeting,
    deleteCalendarEvent,
    getEventsForStory,
    getTotalScheduledHours,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
  } = useGoogleCalendar();

  const [isOpen, setIsOpen] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventType, setEventType] = useState('work_session');
  const [eventTitle, setEventTitle] = useState(storyTitle || '');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [attendees, setAttendees] = useState('');

  const storyEvents = getEventsForStory(storyId);
  const totalScheduledHours = getTotalScheduledHours(storyId);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    
    if (!startTime || !endTime) return;

    if (eventType === 'work_session') {
      createWorkSession(storyId, startTime, endTime, eventTitle);
    } else if (eventType === 'meeting') {
      const attendeeList = attendees
        ? attendees.split(',').map(a => a.trim()).filter(a => a)
        : [];
      createMeeting(storyId, eventTitle, startTime, endTime, attendeeList, location);
    }

    setEventTitle('');
    setStartTime('');
    setEndTime('');
    setLocation('');
    setAttendees('');
    setShowEventForm(false);
  };

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return storyEvents
      .filter(e => new Date(e.startTime) >= now)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 5);
  }, [storyEvents]);

  const getEventTypeColor = (type) => {
    const colors = {
      work_session: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      meeting: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      planning: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    };
    return colors[type] || colors.work_session;
  };

  if (!calendarConfig.connected) {
    return (
      <motion.div
        className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border border-orange-200/50 dark:border-slate-700/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <h4 className="font-semibold text-slate-900 dark:text-white">Google Calendar</h4>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Sync your calendar to schedule work sessions and meetings
        </div>
        <button
          onClick={() => connectGoogleCalendar('user@trackflow.com', 'primary')}
          className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Connect Google Calendar
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <motion.div
        className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border border-orange-200/50 dark:border-slate-700/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white">Scheduled Time</h4>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            {showEventForm ? 'Cancel' : 'Add Event'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Scheduled Hours</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalScheduledHours.toFixed(1)}h</div>
          </div>
          <div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Upcoming Events</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{storyEvents.length}</div>
          </div>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400">
          Synced with {calendarConfig.userEmail}
        </div>
      </motion.div>

      {/* Create Event Form */}
      <AnimatePresence>
        {showEventForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateEvent}
            className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="work_session">Work Session</option>
              <option value="meeting">Meeting</option>
              <option value="planning">Planning Session</option>
            </select>

            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Event title"
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {eventType === 'meeting' && (
              <>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (optional)"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  placeholder="Attendees (comma-separated)"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </>
            )}

            <button
              type="submit"
              className="w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Create Event
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Events List */}
      {upcomingEvents.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Upcoming Events</h4>
          <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:border-orange-300 dark:hover:border-orange-600/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 dark:text-white text-sm">
                      {event.title}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-600 dark:text-slate-400">
                      <Clock size={14} />
                      {format(new Date(event.startTime), 'MMM d, HH:mm')} - {format(new Date(event.endTime), 'HH:mm')}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-slate-400">
                        <MapPin size={14} />
                        {event.location}
                      </div>
                    )}
                    {event.attendees.length > 0 && (
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-slate-400">
                        <Users size={14} />
                        {event.attendees.join(', ')}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteCalendarEvent(event.id)}
                    className="p-1 ml-2 text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 rounded transition-colors flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
                <span className={`inline-block px-2 py-0.5 text-xs rounded font-medium ${getEventTypeColor(event.eventType)}`}>
                  {event.eventType.replace('_', ' ')}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {storyEvents.length === 0 && !showEventForm && (
        <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
          No scheduled events yet
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarIntegration;
