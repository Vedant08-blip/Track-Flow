import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORIES, TEAMS, RELEASES, ITERATIONS, FEATURES, INITIATIVES, PROJECTS } from '../utils/mockData';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [stories, setStories] = useState(STORIES);
  const [teams, setTeams] = useState(TEAMS);
  const [projects, setProjects] = useState(PROJECTS);
  const [releases, setReleases] = useState(RELEASES);
  const [iterations, setIterations] = useState(ITERATIONS);
  const [features, setFeatures] = useState(FEATURES);
  const [initiatives, setInitiatives] = useState(INITIATIVES);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    priority: [],
    teamId: null,
    status: []
  });

  // CRUD Operations
  const addStory = (story) => {
    const newStory = {
      ...story,
      id: `US-${Math.floor(Math.random() * 1000) + 100}`,
      status: story.status || 'Defined',
    };
    setStories([...stories, newStory]);
  };

  const updateStory = (id, updatedFields) => {
    setStories(stories.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const reorderGlobalStories = ({ draggableId, destList, destIndex, newStatus }) => {
    setStories(prev => {
      const newStories = [...prev];
      
      // Find the moving item globally
      const itemIndex = newStories.findIndex(s => s.id === draggableId);
      if (itemIndex === -1) return prev;
      
      const [movedItem] = newStories.splice(itemIndex, 1);
      movedItem.status = newStatus; 
      
      // Determine exactly where to splice this item back into the global array. 
      // We look at the actual elements in the destination column excluding the item itself (if it was already there).
      const relativeDestList = destList.filter(s => s.id !== draggableId);
      const targetItem = relativeDestList[destIndex];
      
      if (targetItem) {
         // Insert it globally right before the target item
         const targetGlobalIndex = newStories.findIndex(s => s.id === targetItem.id);
         newStories.splice(targetGlobalIndex !== -1 ? targetGlobalIndex : newStories.length, 0, movedItem);
      } else {
         // If dropped at the very end of the column list, just push it to the end of the global list.
         newStories.push(movedItem);
      }
      
      return newStories;
    });
  };

  const deleteStory = (id) => {
    setStories(stories.filter(s => s.id !== id));
  };

  const getStoryById = (id) => stories.find(s => s.id === id);

  const updateFilters = (key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveFilters({
      priority: [],
      teamId: null,
      status: []
    });
  };

  return (
    <ProjectContext.Provider value={{
      stories,
      teams,
      projects,
      releases,
      iterations,
      features,
      initiatives,
      addStory,
      updateStory,
      reorderGlobalStories,
      deleteStory,
      getStoryById,
      searchTerm,
      setSearchTerm,
      activeFilters,
      updateFilters,
      clearAllFilters
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
