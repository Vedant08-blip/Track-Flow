import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useProject } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import { PriorityBadge, Avatar } from '../components/shared/UIComponents';
import TaskFormDrawer from '../components/shared/TaskFormDrawer';
import TaskComments from '../components/shared/TaskComments';
import FilterBar from '../components/shared/FilterBar';
import {
  Users, 
  MessageSquare, 
  Paperclip, 
  MoreHorizontal,
  ChevronDown,
  IterationCw,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLUMNS = [
  { id: 'Defined', title: 'Defined', color: 'bg-slate-400' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-primary' },
  { id: 'Completed', title: 'Completed', color: 'bg-accent' },
  { id: 'Accepted', title: 'Accepted', color: 'bg-success' }
];

const StoryCard = ({ story, index, onEdit, onComments }) => (
  <Draggable draggableId={story.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-3 lg:p-4 rounded-lg lg:rounded-[20px] border ${snapshot.isDragging ? 'border-primary ring-2 lg:ring-4 ring-primary/20 shadow-2xl scale-105 z-50 cursor-grabbing rotate-1 lg:rotate-2' : 'border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/40 cursor-grab'} mb-2 lg:mb-3 transition-all duration-200 group relative overflow-hidden`}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex justify-between items-start mb-2 lg:mb-3">
          <span className="text-[8px] lg:text-[10px] font-extrabold text-primary tracking-tighter uppercase shrink-0">{story.id}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(story);
            }}
            className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
        <h4 className="text-xs lg:text-sm font-bold text-slate-900 dark:text-white leading-snug mb-2 lg:mb-3 group-hover:text-primary transition-colors line-clamp-2">{story.title}</h4>
        
        <div className="flex items-center gap-1.5 lg:gap-2 mb-3 lg:mb-4">
          <PriorityBadge priority={story.priority} />
          <div className="px-1.5 lg:px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded text-[8px] lg:text-[10px] font-bold shrink-0">
            {story.points} PTS
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 lg:pt-3 border-t border-slate-50 dark:border-slate-800">
          <div className="flex -space-x-2">
            <Avatar name={story.assignee} size="sm" className="ring-2 ring-surface w-6 h-6 lg:w-7 lg:h-7" />
          </div>
          <div className="flex items-center gap-2 lg:gap-3 text-slate-500 dark:text-slate-400">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComments(story.id);
              }}
              className="flex items-center gap-0.5 lg:gap-1 hover:text-primary transition-colors shrink-0"
            >
              <MessageSquare size={12} />
              <span className="text-[8px] lg:text-[10px] font-bold text-slate-500 dark:text-slate-400">2</span>
            </button>
            <div className="flex items-center gap-0.5 lg:gap-1 shrink-0">
              <Paperclip size={12} />
              <span className="text-[8px] lg:text-[10px] font-bold text-slate-500 dark:text-slate-400">0</span>
            </div>
          </div>
        </div>
      </div>
    )}
  </Draggable>
);

const BoardPage = () => {
  const { 
    stories, 
    updateStory, 
    reorderGlobalStories, 
    teams, 
    iterations,
    searchTerm,
    activeFilters 
  } = useProject();
  const { addToast } = useToast();
  const [selectedTeam, setSelectedTeam] = useState('team-1');
  const [selectedIteration, setSelectedIteration] = useState('it-1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('Defined');
  const [showComments, setShowComments] = useState(null);

  const handleOpenCreate = (status) => {
    setDefaultStatus(status);
    setEditingStory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (story) => {
    setEditingStory(story);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingStory(null), 300);
  };

  const getStoriesByStatus = (status) => {
    return stories.filter(s => {
      const matchStatus = s.status === status;
      const matchTeam = !selectedTeam || s.teamId === selectedTeam;
      const matchIteration = !selectedIteration || s.iterationId === selectedIteration;
      
      // Global Filters
      const matchSearch = !searchTerm || 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchPriorityFilter = activeFilters.priority.length === 0 || 
        activeFilters.priority.includes(s.priority);
        
      const matchGlobalTeam = !activeFilters.teamId || s.teamId === activeFilters.teamId;

      return matchStatus && matchTeam && matchIteration && matchSearch && matchPriorityFilter && matchGlobalTeam;
    });
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const destList = getStoriesByStatus(destination.droppableId);

    reorderGlobalStories({
      draggableId,
      destList,
      destIndex: destination.index,
      newStatus: destination.droppableId
    });

    if (source.droppableId !== destination.droppableId) {
      addToast(`Moved task to ${destination.droppableId}`, 'success');
    }
  };


  return (
    <div className="h-full flex flex-col space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:gap-4 px-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight truncate">Team Board</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">Manage flow for {teams.find(t => t.id === selectedTeam)?.name}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-3">
          <div className="flex items-center gap-1 bg-surface dark:bg-slate-900 p-1 rounded-lg lg:rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
            {teams.map(t => (
              <button 
                key={t.id}
                onClick={() => setSelectedTeam(t.id)}
                className={`px-2 lg:px-3 py-1.5 rounded-lg text-[10px] lg:text-xs font-bold transition-all shrink-0 ${selectedTeam === t.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                {t.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-surface dark:bg-slate-900 px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:border-primary transition-all shrink-0">
             <IterationCw size={14} className="lg:w-4 lg:h-4 text-primary flex-shrink-0" />
             <span className="text-[10px] lg:text-sm font-bold text-slate-600 dark:text-slate-400 truncate">{iterations.find(i => i.id === selectedIteration)?.name}</span>
             <ChevronDown size={12} className="lg:w-3.5 lg:h-3.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
          </div>
        </div>
      </div>

      <FilterBar />

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto pb-4 lg:pb-6 -mx-4 lg:mx-0 px-4 lg:px-0">
          <div className="flex gap-4 lg:gap-6 min-w-[320px] lg:min-w-full h-full">
            {COLUMNS.map(column => (
              <div key={column.id} className="flex-1 flex flex-col min-w-[280px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-xl lg:rounded-[32px] p-3 lg:p-4 border border-white/50 dark:border-slate-800/50 shadow-lg shadow-slate-200/20 dark:shadow-none">
                <div className="flex items-center justify-between mb-3 lg:mb-4 px-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className={`w-2 lg:w-2.5 h-2 lg:h-2.5 rounded-full shrink-0 ${column.color}`}></div>
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest text-[9px] lg:text-[11px] truncate">{column.title}</h3>
                  </div>
                  <div className="text-[8px] lg:text-[10px] font-black text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-700/50 shrink-0">
                    {getStoriesByStatus(column.id).length}
                  </div>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 transition-all duration-300 rounded-[20px] p-1 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-primary/5 ring-2 ring-primary/20 shadow-inner' : 'bg-transparent'}`}
                    >
                      {getStoriesByStatus(column.id).map((story, index) => (
                        <StoryCard key={story.id} story={story} index={index} onEdit={handleOpenEdit} onComments={setShowComments} />
                      ))}
                      {provided.placeholder}
                      
                      <button 
                        onClick={() => handleOpenCreate(column.id)}
                        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all mt-2 group"
                      >
                        <Zap size={14} className="group-hover:animate-pulse" />
                        Quick Add Item
                      </button>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>

      <TaskFormDrawer 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingStory={editingStory}
        defaultStatus={defaultStatus}
        defaultTeamId={selectedTeam}
        defaultIterationId={selectedIteration}
      />

      {/* Task Comments Drawer */}
      <AnimatePresence>
        {showComments && (
          <TaskComments taskId={showComments} onClose={() => setShowComments(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BoardPage;
