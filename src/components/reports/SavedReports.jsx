import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Download,
  Trash2,
  Share2,
  Eye,
  MoreVertical,
  Calendar,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const SavedReports = () => {
  const [reports, setReports] = useState([
    {
      id: 'report-1',
      name: 'Sprint 15 Velocity Report',
      type: 'Sprint Report',
      createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      owner: 'Alice Smith',
      format: 'PDF',
      size: '2.4 MB',
    },
    {
      id: 'report-2',
      name: 'Q1 Project Health Dashboard',
      type: 'Project Report',
      createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      owner: 'Bob Johnson',
      format: 'PDF',
      size: '3.1 MB',
    },
    {
      id: 'report-3',
      name: 'Team Capacity Analysis',
      type: 'Team Report',
      createdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      owner: 'Charlie Brown',
      format: 'CSV',
      size: '512 KB',
    },
    {
      id: 'report-4',
      name: 'Release 2.0 Summary',
      type: 'Release Report',
      createdDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      owner: 'Alice Smith',
      format: 'PDF',
      size: '1.8 MB',
    },
  ]);

  const [openMenuId, setOpenMenuId] = useState(null);

  const handleDelete = (reportId) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    setOpenMenuId(null);
  };

  const getTypeColor = (type) => {
    const colors = {
      'Sprint Report': 'bg-blue-500/10 text-blue-600',
      'Project Report': 'bg-purple-500/10 text-purple-600',
      'Team Report': 'bg-emerald-500/10 text-emerald-600',
      'Release Report': 'bg-orange-500/10 text-orange-600',
    };
    return colors[type] || 'bg-slate-500/10 text-slate-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {reports.length === 0 ? (
        <div className="text-center py-12 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[24px] border border-white/50 dark:border-slate-800/50">
          <div className="text-slate-400 mb-4">
            <Clock size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No Saved Reports
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Your generated reports will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-4 rounded-[16px] border border-white/50 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {report.name}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${getTypeColor(
                        report.type
                      )}`}
                    >
                      {report.type}
                    </span>
                    <span className="text-xs bg-slate-500/10 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full">
                      {report.format}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>
                        Created{' '}
                        {formatDistanceToNow(report.createdDate, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>
                        Modified{' '}
                        {formatDistanceToNow(report.lastModified, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <span>{report.size}</span>
                    <span>by {report.owner}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-[12px] transition-colors"
                    title="Preview report"
                  >
                    <Eye size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-[12px] transition-colors"
                    title="Download report"
                  >
                    <Download size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-[12px] transition-colors"
                    title="Share report"
                  >
                    <Share2 size={18} />
                  </motion.button>

                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setOpenMenuId(openMenuId === report.id ? null : report.id)
                      }
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-[12px] transition-colors"
                    >
                      <MoreVertical size={18} />
                    </motion.button>

                    <AnimatePresence>
                      {openMenuId === report.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-[12px] shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                        >
                        <button className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
                          <Download size={16} />
                          Download
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
                          <Share2 size={16} />
                          Share
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2 transition-colors border-t border-slate-200 dark:border-slate-700"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SavedReports;
