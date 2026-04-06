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
  MessageSquare
} from 'lucide-react';
import { Badge, PriorityBadge, StatusBadge, Avatar, Drawer } from '../components/shared/UIComponents';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const BacklogPage = () => {
  const { stories, addStory, updateStory, deleteStory, teams, iterations } = useProject();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points: 3,
    status: 'Defined',
    priority: 'Medium',
    assignee: 'Unassigned',
    teamId: 'team-1',
    iterationId: 'it-1'
  });

  const handleOpenModal = (story = null) => {
    if (story) {
      setEditingStory(story);
      setFormData(story);
    } else {
      setEditingStory(null);
      setFormData({
        title: '',
        description: '',
        points: 3,
        status: 'Defined',
        priority: 'Medium',
        assignee: 'Unassigned',
        teamId: 'team-1',
        iterationId: 'it-1'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStory(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStory) {
      updateStory(editingStory.id, formData);
      addToast(`Story ${editingStory.id} updated successfully.`, 'success');
    } else {
      addStory(formData);
      addToast('New story created successfully.', 'success');
    }
    handleCloseModal();
  };

  const filteredStories = stories.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTeamName = (id) => teams.find(t => t.id === id)?.name || 'Unknown Team';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Active Backlog</h1>
          <p className="text-slate-500 dark:text-slate-500 dark:text-slate-400 font-medium mt-1">Manage user stories, tasks, and defects</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          <Plus size={20} />
          Create New Item
        </motion.button>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID or title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-500 dark:text-slate-400 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 transition-colors">
            <Filter size={18} />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-500 dark:text-slate-400 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 transition-colors">
            <ArrowUpDown size={18} />
            Sort
          </button>
        </div>
      </div>

      {/* Backlog List */}
      <div className="bg-surface dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 w-28">ID</th>
                <th className="px-6 py-4">Title & Description</th>
                <th className="px-6 py-4 w-24">Points</th>
                <th className="px-6 py-4 w-32">Status</th>
                <th className="px-6 py-4 w-32">Priority</th>
                <th className="px-6 py-4 w-40">Team</th>
                <th className="px-6 py-4 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {filteredStories.map((story, index) => (
                  <motion.tr 
                    key={story.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-primary hover:underline cursor-pointer">{story.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors cursor-pointer">{story.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 group-hover:text-slate-600 dark:hover:text-slate-200 dark:text-slate-500 dark:text-slate-400 truncate max-w-sm">{story.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm">
                        {story.points}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={story.status} />
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={story.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: teams.find(t => t.id === story.teamId)?.color }}></div>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-500 dark:text-slate-400 whitespace-nowrap">{getTeamName(story.teamId)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(story)}
                          className="p-2 hover:bg-white dark:hover:bg-slate-800 hover:text-primary rounded-lg text-slate-500 dark:text-slate-400 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 dark:border-slate-800 hover:shadow-sm transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            deleteStory(story.id);
                            addToast(`Story ${story.id} deleted.`, 'danger');
                          }}
                          className="p-2 hover:bg-white dark:hover:bg-slate-800 hover:text-red-500 rounded-lg text-slate-500 dark:text-slate-400 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 dark:border-slate-800 hover:shadow-sm transition-all"
                        >
                          <Trash2 size={16} />
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
      <Drawer 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingStory ? `Edit Story ${editingStory.id}` : 'Create New Story'}
        footer={
          <>
            <button 
              onClick={handleCloseModal}
              className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 transition-all text-sm"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm"
            >
              {editingStory ? 'Update Story' : 'Create Story'}
            </button>
          </>
        }
      >
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all font-medium"
              placeholder="e.g. Implement OAuth2 login"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Description</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all font-medium"
              placeholder="Detailed acceptance criteria..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Points</label>
              <input 
                type="number" 
                value={formData.points}
                onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Priority</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Team</label>
              <select 
                value={formData.teamId}
                onChange={(e) => setFormData({...formData, teamId: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
              >
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
              >
                <option value="Defined">Defined</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Accepted">Accepted</option>
              </select>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default BacklogPage;
