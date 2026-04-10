import React, { createContext, useContext, useState, useCallback } from 'react';

const SkillBasedAssignmentContext = createContext(null);

export const SkillBasedAssignmentProvider = ({ children }) => {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 'user-1',
      name: 'Alice Smith',
      email: 'alice@trackflow.com',
      role: 'Senior Developer',
      teamId: 'team-1',
      skills: [
        { name: 'React', level: 5, years: 4 },
        { name: 'TypeScript', level: 4, years: 3 },
        { name: 'Node.js', level: 4, years: 3 },
        { name: 'AWS', level: 3, years: 2 },
      ],
      availability: 100, // percentage
      currentWorkload: 3, // stories assigned
      expertise: ['Authentication', 'Backend Architecture', 'DevOps'],
      certifications: ['AWS Solutions Architect', 'Kubernetes CKA'],
    },
    {
      id: 'user-2',
      name: 'Bob Jones',
      email: 'bob@trackflow.com',
      role: 'UI/UX Designer',
      teamId: 'team-2',
      skills: [
        { name: 'Figma', level: 5, years: 5 },
        { name: 'CSS', level: 5, years: 5 },
        { name: 'React', level: 3, years: 2 },
        { name: 'Design Systems', level: 4, years: 3 },
      ],
      availability: 80,
      currentWorkload: 2,
      expertise: ['Design Systems', 'UX Research', 'Accessibility'],
      certifications: ['Google UX Design', 'Nielsen Norman UX Certificate'],
    },
    {
      id: 'user-3',
      name: 'Charlie Brown',
      email: 'charlie@trackflow.com',
      role: 'Full Stack Developer',
      teamId: 'team-1',
      skills: [
        { name: 'React', level: 4, years: 3 },
        { name: 'Node.js', level: 4, years: 3 },
        { name: 'Database Design', level: 4, years: 3 },
        { name: 'Python', level: 3, years: 2 },
      ],
      availability: 90,
      currentWorkload: 4,
      expertise: ['Database Migration', 'API Development', 'Performance Optimization'],
      certifications: [],
    },
  ]);

  const [assignments, setAssignments] = useState([
    { id: 'assign-1', storyId: 'US-101', userId: 'user-1', reason: 'High React expertise, familiar with OAuth' },
    { id: 'assign-2', storyId: 'US-102', userId: 'user-2', reason: 'Design systems specialist' },
    { id: 'assign-3', storyId: 'US-103', userId: 'user-3', reason: 'Database migration expert' },
  ]);

  const calculateSkillMatch = useCallback((userId, requiredSkills) => {
    const member = teamMembers.find(m => m.id === userId);
    if (!member) return 0;

    if (!requiredSkills || requiredSkills.length === 0) return 50;

    const matchedSkills = requiredSkills.filter(reqSkill => 
      member.skills.some(s => 
        s.name.toLowerCase() === reqSkill.toLowerCase()
      )
    );

    return (matchedSkills.length / requiredSkills.length) * 100;
  }, [teamMembers]);

  const getRecommendedAssignees = useCallback((requiredSkills, storyPoints, excludeUserIds = []) => {
    return teamMembers
      .filter(m => !excludeUserIds.includes(m.id) && m.availability > 0)
      .map(member => {
        const skillMatch = calculateSkillMatch(member.id, requiredSkills);
        const availabilityScore = member.availability;
        const workloadScore = Math.max(0, 100 - (member.currentWorkload * 20));
        
        // Combined recommendation score (weighted)
        const recommendationScore = 
          (skillMatch * 0.5) + 
          (availabilityScore * 0.3) + 
          (workloadScore * 0.2);

        return {
          ...member,
          skillMatch,
          recommendationScore,
          totalScore: recommendationScore,
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [teamMembers, calculateSkillMatch]);

  const assignStory = useCallback((storyId, userId, reason = '') => {
    const assignment = {
      id: `assign-${Date.now()}`,
      storyId,
      userId,
      reason,
      assignedAt: new Date().toISOString(),
    };
    
    setAssignments([...assignments, assignment]);
    
    // Update user workload
    setTeamMembers(prev => prev.map(m => 
      m.id === userId 
        ? { ...m, currentWorkload: m.currentWorkload + 1 }
        : m
    ));
    
    return assignment;
  }, [assignments]);

  const unassignStory = useCallback((storyId, userId) => {
    setAssignments(prev => prev.filter(a => !(a.storyId === storyId && a.userId === userId)));
    
    // Update user workload
    setTeamMembers(prev => prev.map(m => 
      m.id === userId 
        ? { ...m, currentWorkload: Math.max(0, m.currentWorkload - 1) }
        : m
    ));
  }, []);

  const getAssigneeForStory = useCallback((storyId) => {
    const assignment = assignments.find(a => a.storyId === storyId);
    if (!assignment) return null;
    return teamMembers.find(m => m.id === assignment.userId);
  }, [assignments, teamMembers]);

  const updateMemberAvailability = useCallback((userId, availability) => {
    setTeamMembers(prev => prev.map(m => 
      m.id === userId ? { ...m, availability } : m
    ));
  }, []);

  const addSkillToMember = useCallback((userId, skill) => {
    setTeamMembers(prev => prev.map(m => 
      m.id === userId 
        ? { 
            ...m, 
            skills: [...(m.skills || []), skill]
          }
        : m
    ));
  }, []);

  const getTeamCapabilities = useCallback((teamId) => {
    const teamMembers_ = teamMembers.filter(m => m.teamId === teamId);
    const allSkills = {};
    
    teamMembers_.forEach(member => {
      member.skills.forEach(skill => {
        if (!allSkills[skill.name]) {
          allSkills[skill.name] = [];
        }
        allSkills[skill.name].push({
          member: member.name,
          level: skill.level,
          years: skill.years,
        });
      });
    });
    
    return allSkills;
  }, [teamMembers]);

  const getSkillGaps = useCallback((teamId, requiredSkills) => {
    const teamCapabilities = getTeamCapabilities(teamId);
    return requiredSkills.filter(skill => !teamCapabilities[skill]);
  }, [teamMembers, getTeamCapabilities]);

  const value = {
    teamMembers,
    assignments,
    calculateSkillMatch,
    getRecommendedAssignees,
    assignStory,
    unassignStory,
    getAssigneeForStory,
    updateMemberAvailability,
    addSkillToMember,
    getTeamCapabilities,
    getSkillGaps,
    setTeamMembers,
  };

  return (
    <SkillBasedAssignmentContext.Provider value={value}>
      {children}
    </SkillBasedAssignmentContext.Provider>
  );
};

export const useSkillBasedAssignment = () => {
  const context = useContext(SkillBasedAssignmentContext);
  if (!context) {
    throw new Error('useSkillBasedAssignment must be used within SkillBasedAssignmentProvider');
  }
  return context;
};
