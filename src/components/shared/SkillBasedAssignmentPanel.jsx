import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Star, Target, AlertCircle, Check } from 'lucide-react';
import { useSkillBasedAssignment } from '../../context/SkillBasedAssignmentContext';

const SkillBasedAssignmentPanel = ({ storyId, requiredSkills = [] }) => {
  const {
    teamMembers,
    getRecommendedAssignees,
    assignStory,
    unassignStory,
    getAssigneeForStory,
    getTeamCapabilities,
    getSkillGaps,
  } = useSkillBasedAssignment();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('team-1');

  const assignee = getAssigneeForStory(storyId);
  const recommendations = useMemo(() => {
    const excludeIds = assignee ? [assignee.id] : [];
    return getRecommendedAssignees(requiredSkills, 0, excludeIds).slice(0, 5);
  }, [requiredSkills, assignee]);

  const skillGaps = getSkillGaps(selectedTeam, requiredSkills);
  const teamCapabilities = getTeamCapabilities(selectedTeam);

  const handleAssign = (userId) => {
    if (assignee) {
      unassignStory(storyId, assignee.id);
    }
    assignStory(storyId, userId, `Assigned based on skill match`);
    setIsOpen(false);
  };

  const handleUnassign = () => {
    if (assignee) {
      unassignStory(storyId, assignee.id);
    }
  };

  const getSkillLevel = (level) => {
    return ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'][level] || '';
  };

  const getSkillColor = (level) => {
    const colors = ['', 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', 
                    'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
                    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
                    'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'];
    return colors[level] || colors[0];
  };

  return (
    <div className="space-y-4">
      {/* Current Assignment */}
      <motion.div
        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border border-purple-200/50 dark:border-slate-700/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white">Smart Assignment</h4>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            {assignee ? 'Change' : 'Assign'}
          </button>
        </div>

        {assignee ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-purple-200/50 dark:border-slate-700/50">
              <div>
                <div className="font-medium text-slate-900 dark:text-white">{assignee.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{assignee.role}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-emerald-500">Assigned</div>
                <div className="text-xs text-slate-500">{assignee.availability}% available</div>
              </div>
            </div>

            {/* Assignee Skills */}
            <div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Key Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {assignee.skills.slice(0, 4).map((skill, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 text-xs rounded-full font-medium ${getSkillColor(skill.level)}`}
                  >
                    {skill.name} {skill.level}/5
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleUnassign}
              className="w-full py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors font-medium"
            >
              Unassign
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-slate-500 dark:text-slate-400 mb-2">No one assigned yet</div>
            <div className="text-xs text-slate-400">Use AI recommendations to find the best match</div>
          </div>
        )}
      </motion.div>

      {/* Recommendations Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-4"
          >
            {/* Skill Gaps Alert */}
            {skillGaps.length > 0 && (
              <div className="flex gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-amber-900 dark:text-amber-200">Skill Gaps Detected</div>
                  <div className="text-xs text-amber-800 dark:text-amber-300">{skillGaps.join(', ')}</div>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Target size={16} /> Recommended Assignees
              </h4>

              <div className="space-y-2">
                {recommendations.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:border-purple-300 dark:hover:border-purple-600/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{member.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{member.role}</div>
                      </div>
                      <button
                        onClick={() => handleAssign(member.id)}
                        className="px-2 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
                      >
                        Assign
                      </button>
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                      <div>
                        <div className="text-slate-500 dark:text-slate-400">Skills</div>
                        <div className="font-semibold text-slate-900 dark:text-white">{Math.round(member.skillMatch)}%</div>
                      </div>
                      <div>
                        <div className="text-slate-500 dark:text-slate-400">Available</div>
                        <div className="font-semibold text-slate-900 dark:text-white">{member.availability}%</div>
                      </div>
                      <div>
                        <div className="text-slate-500 dark:text-slate-400">Score</div>
                        <div className="font-semibold text-emerald-500">{Math.round(member.totalScore)}%</div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className={`px-1.5 py-0.5 text-[10px] rounded font-medium ${getSkillColor(skill.level)}`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Team Capabilities */}
            {Object.keys(teamCapabilities).length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Team Capabilities</h4>
                <div className="space-y-2">
                  {Object.entries(teamCapabilities).slice(0, 5).map(([skill, members]) => (
                    <div key={skill} className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <div className="font-medium text-xs text-slate-900 dark:text-white mb-1">{skill}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {members.map((m, idx) => (
                          <span key={idx}>
                            {m.member} ({m.level}/5)
                            {idx < members.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillBasedAssignmentPanel;
