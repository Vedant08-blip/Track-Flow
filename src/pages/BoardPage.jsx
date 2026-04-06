import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useProject } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import { PriorityBadge, Avatar } from '../components/shared/UIComponents';
import { 
  Users, 
  MessageSquare, 
  Paperclip, 
  MoreHorizontal,
  ChevronDown,
  IterationCw,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const COLUMNS = [
  { id: 'Defined', title: 'Defined', color: 'bg-slate-400' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-primary' },
  { id: 'Completed', title: 'Completed', color: 'bg-accent' },
  { id: 'Accepted', title: 'Accepted', color: 'bg-success' }
];

const StoryCard = ({ story, index }) => (
  <Draggable draggableId={story.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`bg-surface dark:bg-slate-900 p-4 rounded-2xl border ${snapshot.isDragging ? 'border-primary ring-4 ring-primary/5 shadow-xl rotate-1 z-50' : 'border-slate-100 dark:border-slate-800 shadow-sm'} mb-3 transition-all duration-200 group relative overflow-hidden`}
      >
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-extrabold text-primary tracking-tighter uppercase">{story.id}</span>
          <button className="text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 dark:text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal size={14} />
          </button>
        </div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-primary transition-colors">{story.title}</h4>
        
        <div className="flex items-center gap-2 mb-4">
          <PriorityBadge priority={story.priority} />
          <div className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 dark:text-slate-400 rounded text-[10px] font-bold">
            {story.points} PTS
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
          <div className="flex -space-x-2">
            <Avatar name={story.assignee} size="sm" className="ring-2 ring-surface" />
          </div>
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <MessageSquare size={12} />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 dark:text-slate-400">2</span>
            </div>
            <div className="flex items-center gap-1">
              <Paperclip size={12} />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 dark:text-slate-400">0</span>
            </div>
          </div>
        </div>
      </div>
    )}
  </Draggable>
);

const BoardPage = () => {
  const { stories, updateStory, teams, iterations } = useProject();
  const { addToast } = useToast();
  const [selectedTeam, setSelectedTeam] = useState('team-1');
  const [selectedIteration, setSelectedIteration] = useState('it-1');

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    updateStory(draggableId, { status: destination.droppableId });
    addToast(`Moved ${draggableId} to ${destination.droppableId}`, 'success');
  };

  const getStoriesByStatus = (status) => {
    return stories.filter(s => 
      s.status === status && 
      (!selectedTeam || s.teamId === selectedTeam) &&
      (!selectedIteration || s.iterationId === selectedIteration)
    );
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Team Board</h1>
          <p className="text-slate-500 dark:text-slate-500 dark:text-slate-400 font-medium mt-1">Manage flow and velocity for {teams.find(t => t.id === selectedTeam)?.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {teams.map(t => (
              <button 
                key={t.id}
                onClick={() => setSelectedTeam(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedTeam === t.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 dark:text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-900'}`}
              >
                {t.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-surface dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:border-primary transition-all">
             <IterationCw size={16} className="text-primary" />
             <span className="text-sm font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400">{iterations.find(i => i.id === selectedIteration)?.name}</span>
             <ChevronDown size={14} className="text-slate-500 dark:text-slate-400" />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto pb-6">
          <div className="flex gap-6 min-w-[1000px] h-full">
            {COLUMNS.map(column => (
              <div key={column.id} className="flex-1 flex flex-col min-w-[280px]">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${column.color}`}></div>
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest text-[11px]">{column.title}</h3>
                  </div>
                  <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md">
                    {getStoriesByStatus(column.id).length}
                  </div>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 transition-all duration-300 rounded-[20px] p-2 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-primary/5' : 'bg-transparent'}`}
                    >
                      {getStoriesByStatus(column.id).map((story, index) => (
                        <StoryCard key={story.id} story={story} index={index} />
                      ))}
                      {provided.placeholder}
                      
                      <button className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all mt-2 group">
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
    </div>
  );
};

export default BoardPage;
