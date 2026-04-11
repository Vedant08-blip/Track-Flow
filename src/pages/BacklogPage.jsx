import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  ChevronDown, 
  ArrowUpDown,
  Edit3,
  Trash2,
  ExternalLink,
  MessageSquare,
  Layers
} from 'lucide-react';
import { Badge, PriorityBadge, StatusBadge, Avatar } from '../components/shared/UIComponents';
import TaskFormDrawer from '../components/shared/TaskFormDrawer';
import FilterBar from '../components/shared/FilterBar';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const BacklogPage = () => {
  const { 
    stories, 
    addStory, 
    updateStory, 
    deleteStory, 
    teams, 
    iterations,
    searchTerm,
    activeFilters
  } = useProject();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);

  const handleOpenModal = (story = null) => {
    setEditingStory(story);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingStory(null), 300); // clear after animation
  };

  const filteredStories = stories.filter(s => {
    const matchSearch = !searchTerm || 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchPriorityFilter = activeFilters.priority.length === 0 || 
      activeFilters.priority.includes(s.priority);
      
    const matchGlobalTeam = !activeFilters.teamId || s.teamId === activeFilters.teamId;

    return matchSearch && matchPriorityFilter && matchGlobalTeam;
  });

  const getTeamName = (id) => teams.find(t => t.id === id)?.name || 'Unknown Team';

  return (
    <div className="space-y-4 lg:space-y-6 relative px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Active Backlog</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Manage user stories, tasks, and defects</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto bg-primary text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-sm sm:text-base"
        >
          <Plus size={18} className="sm:w-5 sm:h-5" />
          <span>Create New Item</span>
        </motion.button>
      </div>

      <FilterBar />

      {/* Backlog List */}
      <div className="bg-surface dark:bg-slate-900 rounded-2xl lg:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-96 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 sticky top-0">
                <th className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 w-16 sm:w-28">ID</th>
                <th className="hidden sm:table-cell px-4 lg:px-6 py-3 sm:py-4">Title & Description</th>
                <th className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 w-16 sm:w-24">Points</th>
                <th className="hidden md:table-cell px-4 lg:px-6 py-3 sm:py-4 w-32">Status</th>
                <th className="hidden lg:table-cell px-4 lg:px-6 py-3 sm:py-4 w-32">Priority</th>
                <th className="hidden lg:table-cell px-4 lg:px-6 py-3 sm:py-4 w-40">Team</th>
                <th className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 w-8 sm:w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              <AnimatePresence>
                {filteredStories.map((story, index) => (
                  <motion.tr 
                    key={story.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group text-xs sm:text-sm"
                  >
                    <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
                      <span className="text-xs sm:text-sm font-bold text-primary hover:underline cursor-pointer truncate block">{story.id}</span>
                    </td>
                    <td className="hidden sm:table-cell px-4 lg:px-6 py-3 sm:py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors cursor-pointer line-clamp-1">{story.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 group-hover:text-slate-600 dark:hover:text-slate-200">{story.description}</div>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
                      <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm">
                        {story.points}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 lg:px-6 py-3 sm:py-4">
                      <StatusBadge status={story.status} />
                    </td>
                    <td className="hidden lg:table-cell px-4 lg:px-6 py-3 sm:py-4">
                      <PriorityBadge priority={story.priority} />
                    </td>
                    <td className="hidden lg:table-cell px-4 lg:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: teams.find(t => t.id === story.teamId)?.color }}></div>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">{getTeamName(story.teamId)}</span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <button 
                          onClick={() => handleOpenModal(story)}
                          className="p-1.5 sm:p-2 hover:bg-white dark:hover:bg-slate-800 hover:text-primary rounded-lg text-slate-500 dark:text-slate-400 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 dark:border-slate-800 hover:shadow-sm transition-all flex-shrink-0"
                          title="Edit"
                        >
                          <Edit3 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            deleteStory(story.id);
                            addToast(`Story ${story.id} deleted.`, 'danger');
                          }}
                          className="p-1.5 sm:p-2 hover:bg-white dark:hover:bg-slate-800 hover:text-red-500 rounded-lg text-slate-500 dark:text-slate-400 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 dark:border-slate-800 hover:shadow-sm transition-all flex-shrink-0"
                          title="Delete"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filteredStories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800">
               <Layers className="text-slate-500 dark:text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No items found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mt-1">Try adjusting your filters or search terms to find what you're looking for.</p>
          </div>
        )}
      </div>

      {/* Story Drawer */}
      <TaskFormDrawer 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingStory={editingStory}
      />
    </div>
  );
};

export default BacklogPage;
