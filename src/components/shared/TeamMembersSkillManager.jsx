import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/helpers';

const TeamMembersSkillManager = () => {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Frontend Developer',
      avatar: '👨‍💻',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vue.js'],
      level: 'Senior'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Backend Developer',
      avatar: '👩‍💻',
      skills: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      level: 'Senior'
    },
    {
      id: 3,
      name: 'Mike Davis',
      role: 'Full Stack Developer',
      avatar: '👨‍💼',
      skills: ['JavaScript', 'Python', 'MongoDB', 'GraphQL'],
      level: 'Mid'
    }
  ]);

  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingMember, setIsEditingMember] = useState(false);

  const skillCategories = {
    'Frontend': ['React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Bootstrap', 'Next.js'],
    'Backend': ['Node.js', 'Python', 'Java', 'C#', 'PHP', 'Docker', 'Kubernetes', 'AWS'],
    'Database': ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase', 'GraphQL'],
    'DevOps': ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Jenkins', 'GitLab CI'],
    'Other': ['Git', 'Figma', 'Jira', 'Agile', 'REST APIs', 'Testing', 'CI/CD']
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && selectedMember) {
      const updatedMembers = teamMembers.map(member => {
        if (member.id === selectedMember.id && !member.skills.includes(newSkill)) {
          return { ...member, skills: [...member.skills, newSkill] };
        }
        return member;
      });
      setTeamMembers(updatedMembers);
      setSelectedMember({ ...selectedMember, skills: [...selectedMember.skills, newSkill] });
      setNewSkill('');
      setIsAddingSkill(false);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    if (selectedMember) {
      const updatedMembers = teamMembers.map(member => {
        if (member.id === selectedMember.id) {
          return { ...member, skills: member.skills.filter(s => s !== skillToRemove) };
        }
        return member;
      });
      setTeamMembers(updatedMembers);
      setSelectedMember({ ...selectedMember, skills: selectedMember.skills.filter(s => s !== skillToRemove) });
    }
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Team Members List */}
      <div className="lg:col-span-1 bg-white dark:bg-slate-900/50 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-800 flex flex-col">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Team Members</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredMembers.map(member => (
            <motion.button
              key={member.id}
              onClick={() => setSelectedMember(member)}
              whileHover={{ x: 4 }}
              className={cn(
                "w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3",
                selectedMember?.id === member.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-700"
              )}
            >
              <div className="text-2xl shrink-0">{member.avatar}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate text-sm">{member.name}</h3>
                <p className={cn(
                  "text-xs truncate",
                  selectedMember?.id === member.id
                    ? "text-white/80"
                    : "text-gray-500 dark:text-slate-400"
                )}>
                  {member.role}
                </p>
              </div>
              <span className={cn(
                "text-xs font-bold px-2 py-1 rounded-full shrink-0",
                selectedMember?.id === member.id
                  ? "bg-white/30"
                  : "bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary"
              )}>
                {member.skills.length}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Skills Management */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-800 flex flex-col">
        {selectedMember ? (
          <>
            {/* Member Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-slate-800">
              <div className="text-5xl">{selectedMember.avatar}</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedMember.name}</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">{selectedMember.role}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-primary/20 text-primary dark:bg-primary/30 rounded-full text-xs font-semibold">
                    {selectedMember.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills List */}
            <div className="flex-1 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills</h3>
              
              {selectedMember.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedMember.skills.map(skill => (
                    <motion.div
                      key={skill}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary rounded-full text-sm font-medium group"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 dark:text-slate-400 text-sm mb-6">
                  No skills added yet
                </div>
              )}

              {/* Add Skill Section */}
              {isAddingSkill ? (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter skill name or select from suggestions..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      autoFocus
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white text-sm"
                    />
                  </div>

                  {/* Skill Suggestions */}
                  <div className="space-y-2">
                    {Object.entries(skillCategories).map(([category, skills]) => (
                      <div key={category}>
                        <p className="text-xs font-semibold text-gray-700 dark:text-slate-400 mb-1">{category}</p>
                        <div className="flex flex-wrap gap-2">
                          {skills.map(skill => (
                            <button
                              key={skill}
                              onClick={() => {
                                setNewSkill(skill);
                              }}
                              className="px-2.5 py-1 text-xs bg-gray-100 dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary text-gray-700 dark:text-slate-300 rounded-lg transition-colors"
                            >
                              + {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleAddSkill}
                      disabled={!newSkill.trim()}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Save size={16} /> Add Skill
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingSkill(false);
                        setNewSkill('');
                      }}
                      className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingSkill(true)}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Skill
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-slate-400">
            <div className="text-center">
              <div className="text-4xl mb-3">👥</div>
              <p className="text-lg font-medium">Select a team member to manage their skills</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMembersSkillManager;
