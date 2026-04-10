import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit2, Trash2, Star } from 'lucide-react';
import { useSkillBasedAssignment } from '../../context/SkillBasedAssignmentContext';

const TeamMembersSkillManager = () => {
  const { teamMembers, setTeamMembers, addSkillToMember } = useSkillBasedAssignment();
  const [expandedMember, setExpandedMember] = useState(null);
  const [newSkill, setNewSkill] = useState({ name: '', level: 3 });
  const [editingSkill, setEditingSkill] = useState(null);
  const [showAddForm, setShowAddForm] = useState(null);

  const handleAddSkill = (memberId) => {
    if (!newSkill.name.trim()) return;

    setTeamMembers(prev => prev.map(m => 
      m.id === memberId 
        ? { 
            ...m, 
            skills: [...(m.skills || []), { name: newSkill.name, level: parseInt(newSkill.level), years: 0 }]
          }
        : m
    ));

    setNewSkill({ name: '', level: 3 });
    setShowAddForm(null);
  };

  const handleDeleteSkill = (memberId, skillIndex) => {
    setTeamMembers(prev => prev.map(m => 
      m.id === memberId 
        ? { 
            ...m, 
            skills: m.skills.filter((_, idx) => idx !== skillIndex)
          }
        : m
    ));
  };

  const handleUpdateSkillLevel = (memberId, skillIndex, newLevel) => {
    setTeamMembers(prev => prev.map(m => 
      m.id === memberId 
        ? { 
            ...m, 
            skills: m.skills.map((s, idx) => 
              idx === skillIndex ? { ...s, level: newLevel } : s
            )
          }
        : m
    ));
  };

  const getSkillColor = (level) => {
    const colors = {
      1: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      2: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      3: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      4: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      5: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    };
    return colors[level] || colors[3];
  };

  const getLevelLabel = (level) => {
    const labels = { 1: 'Beginner', 2: 'Intermediate', 3: 'Intermediate', 4: 'Advanced', 5: 'Expert' };
    return labels[level];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Manage Team Member Skills</h3>
        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
          {teamMembers.length} members
        </span>
      </div>

      <div className="space-y-3">
        {teamMembers.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            {/* Member Header */}
            <button
              onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                  {member.name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900 dark:text-white">{member.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{member.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full">
                  {member.skills.length} skills
                </span>
                <svg
                  className={`w-5 h-5 text-slate-500 transition-transform ${
                    expandedMember === member.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </button>

            {/* Member Skills - Expanded */}
            <AnimatePresence>
              {expandedMember === member.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4"
                >
                  {/* Current Skills */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Skills ({member.skills.length})</h4>
                    <div className="space-y-2 mb-3">
                      {member.skills.length > 0 ? (
                        member.skills.map((skill, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-slate-900 dark:text-white text-sm">{skill.name}</span>
                                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getSkillColor(skill.level)}`}>
                                  {skill.level}/5 - {getLevelLabel(skill.level)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <button
                                    key={level}
                                    onClick={() => handleUpdateSkillLevel(member.id, idx, level)}
                                    className={`p-0.5 transition-all ${
                                      level <= skill.level
                                        ? 'text-yellow-400'
                                        : 'text-slate-300 dark:text-slate-600'
                                    }`}
                                  >
                                    <Star size={14} fill={level <= skill.level ? 'currentColor' : 'none'} />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteSkill(member.id, idx)}
                              className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-3 text-slate-500 dark:text-slate-400 text-sm">
                          No skills added yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add Skill Form */}
                  <AnimatePresence>
                    {showAddForm === member.id ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4"
                      >
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Add New Skill</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-900 dark:text-white mb-1.5">
                              Skill Name
                            </label>
                            <input
                              type="text"
                              value={newSkill.name}
                              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                              placeholder="e.g., React, TypeScript, AWS"
                              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-900 dark:text-white mb-1.5">
                              Proficiency Level: {newSkill.level}/5
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={newSkill.level}
                              onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                              <span>Beginner</span>
                              <span>Expert</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddSkill(member.id)}
                              className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              Add Skill
                            </button>
                            <button
                              onClick={() => {
                                setShowAddForm(null);
                                setNewSkill({ name: '', level: 3 });
                              }}
                              className="flex-1 px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => setShowAddForm(member.id)}
                        className="w-full py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors flex items-center justify-center gap-2 border border-dashed border-purple-300 dark:border-purple-700/50"
                      >
                        <Plus size={16} /> Add Skill
                      </button>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 How Skills Work</h4>
        <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
          <li>• Skills are used to calculate Smart Assignment recommendations</li>
          <li>• Rate your proficiency level from 1 (Beginner) to 5 (Expert)</li>
          <li>• The system matches team members to stories based on required skills</li>
          <li>• Update skills regularly to keep your profile accurate</li>
        </ul>
      </div>
    </div>
  );
};

export default TeamMembersSkillManager;
