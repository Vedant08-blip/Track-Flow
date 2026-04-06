import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORIES, TEAMS, RELEASES, ITERATIONS, FEATURES, INITIATIVES } from '../utils/mockData';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [stories, setStories] = useState(STORIES);
  const [teams, setTeams] = useState(TEAMS);
  const [releases, setReleases] = useState(RELEASES);
  const [iterations, setIterations] = useState(ITERATIONS);
  const [features, setFeatures] = useState(FEATURES);
  const [initiatives, setInitiatives] = useState(INITIATIVES);

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

  const deleteStory = (id) => {
    setStories(stories.filter(s => s.id !== id));
  };

  const getStoryById = (id) => stories.find(s => s.id === id);

  return (
    <ProjectContext.Provider value={{
      stories,
      teams,
      releases,
      iterations,
      features,
      initiatives,
      addStory,
      updateStory,
      deleteStory,
      getStoryById
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
