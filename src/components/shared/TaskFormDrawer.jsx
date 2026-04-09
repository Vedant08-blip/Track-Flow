import React, { useState, useEffect } from 'react';
import { Drawer } from './UIComponents';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';

const TaskFormDrawer = ({ isOpen, onClose, editingStory = null, defaultStatus = 'Defined', defaultTeamId = 'team-1', defaultIterationId = 'it-1' }) => {
  const { addStory, updateStory, teams } = useProject();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points: 3,
    status: defaultStatus,
    priority: 'Medium',
    assignee: 'Unassigned',
    teamId: defaultTeamId,
    iterationId: defaultIterationId
  });

  useEffect(() => {
    if (isOpen) {
      if (editingStory) {
        setFormData(editingStory);
      } else {
        setFormData({
          title: '',
          description: '',
          points: 3,
          status: defaultStatus,
          priority: 'Medium',
          assignee: 'Unassigned',
          teamId: defaultTeamId,
          iterationId: defaultIterationId
        });
      }
    }
  }, [isOpen, editingStory, defaultStatus, defaultTeamId, defaultIterationId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStory) {
      updateStory(editingStory.id, formData);
      addToast(`Story ${editingStory.id} updated successfully.`, 'success');
    } else {
      addStory(formData);
      addToast('New story created successfully.', 'success');
    }
    onClose();
  };

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingStory ? `Edit Story ${editingStory.id}` : 'Create New Story'}
      footer={
        <>
          <button 
            onClick={onClose}
            type="button"
            className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            type="button"
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm"
          >
            {editingStory ? 'Update Story' : 'Create Story'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Title</label>
          <input 
            type="text" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all font-medium text-slate-900 dark:text-white"
            placeholder="e.g. Implement OAuth2 login"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Description</label>
          <textarea 
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all font-medium text-slate-900 dark:text-white"
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
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all font-medium text-slate-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Priority</label>
            <select 
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
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
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
            >
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
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
  );
};

export default TaskFormDrawer;
