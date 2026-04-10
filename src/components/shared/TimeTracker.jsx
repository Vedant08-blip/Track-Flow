import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { useTimeTracking } from '../../context/TimeTrackingContext';
import { formatDistanceToNow } from 'date-fns';

const TimeTracker = ({ storyId, storyTitle }) => {
  const { 
    timeEntries, 
    storyEstimates, 
    addTimeEntry, 
    deleteTimeEntry, 
    setStoryEstimate,
    getStoryTimeEntries 
  } = useTimeTracking();

  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('work');
  const [estimatedHours, setEstimatedHours] = useState(
    storyEstimates[storyId]?.estimated || ''
  );

  const storyEntries = getStoryTimeEntries(storyId);
  const totalLogged = storyEntries.reduce((sum, e) => sum + e.hours, 0);
  const estimate = storyEstimates[storyId]?.estimated || 0;
  const variance = totalLogged - estimate;
  const percentComplete = estimate > 0 ? Math.round((totalLogged / estimate) * 100) : 0;

  const handleAddTime = (e) => {
    e.preventDefault();
    if (!hours || parseFloat(hours) <= 0) return;

    addTimeEntry({
      storyId,
      userId: 'user-1',
      userName: 'Current User',
      hours: parseFloat(hours),
      description,
      type,
    });

    setHours('');
    setDescription('');
    setType('work');
  };

  const handleSetEstimate = () => {
    if (estimatedHours && parseFloat(estimatedHours) > 0) {
      setStoryEstimate(storyId, parseFloat(estimatedHours));
    }
  };

  const getVarianceColor = () => {
    if (variance < 0) return 'text-emerald-500';
    if (variance > 0) return 'text-rose-500';
    return 'text-slate-500';
  };

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <motion.div
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border border-blue-200/50 dark:border-slate-700/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white">Time Tracking</h4>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-blue-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {isOpen ? <X size={18} /> : <Plus size={18} />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Logged</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalLogged.toFixed(1)}h</div>
          </div>
          <div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Estimated</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{estimate.toFixed(1)}h</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(percentComplete, 100)}%` }}
            />
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{percentComplete}% of estimate</div>
        </div>

        {/* Variance Alert */}
        {variance !== 0 && (
          <div className={`flex items-center gap-2 text-sm font-medium ${getVarianceColor()}`}>
            <AlertCircle size={16} />
            <span>{variance > 0 ? 'Over' : 'Under'} estimate by {Math.abs(variance).toFixed(1)}h</span>
          </div>
        )}
      </motion.div>

      {/* Add Time Form */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 border-t border-slate-200 dark:border-slate-700 pt-4"
          >
            {/* Set Estimate */}
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="Est. hours"
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSetEstimate}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Set Estimate
              </button>
            </div>

            {/* Log Time Form */}
            <form onSubmit={handleAddTime} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  max="24"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Hours"
                  className="w-20 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="work">Work</option>
                  <option value="meeting">Meeting</option>
                  <option value="review">Review</option>
                </select>
              </div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you work on?"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Log Time
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Entries List */}
      {storyEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Logs</h4>
          {storyEntries.slice(-5).reverse().map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-slate-900 dark:text-white">{entry.hours}h - {entry.description}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDistanceToNow(new Date(entry.date), { addSuffix: true })}
                </div>
              </div>
              <button
                onClick={() => deleteTimeEntry(entry.id)}
                className="p-1.5 ml-2 text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 rounded transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TimeTracker;
