// filepath: src/components/shared/AvatarSelector.jsx
import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/helpers';
import { avatarMetadata } from '../../data/avatarMetadata';
import { useTheme } from '../../context/ThemeContext';

const AvatarSelector = ({ isOpen, onClose, onSelect, selectedAvatarId = null }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(selectedAvatarId);
  const { isDark } = useTheme();

  const handleSelectAvatar = (avatar) => {
    setSelectedId(avatar.id);
  };

  const handleConfirm = () => {
    if (selectedId) {
      const selected = avatarMetadata.find(a => a.id === selectedId);
      onSelect(selected);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={cn(
              'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
              'w-full max-w-2xl mx-4 rounded-2xl shadow-2xl',
              isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-gray-200'
            )}
          >
            {/* Header */}
            <div className={cn(
              'flex items-center justify-between p-6 border-b',
              isDark ? 'border-slate-700' : 'border-gray-200'
            )}>
              <div>
                <h2 className={cn(
                  'text-2xl font-bold flex items-center gap-3',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  <span className="text-3xl">✨</span>
                  Choose Your Avatar
                </h2>
                <p className={cn(
                  'text-sm mt-1',
                  isDark ? 'text-slate-400' : 'text-gray-600'
                )}>
                  Pick a character that represents your personality
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-600'
                )}
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Avatar Grid */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {avatarMetadata.map((avatar) => (
                  <motion.div
                    key={avatar.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectAvatar(avatar)}
                    onMouseEnter={() => setHoveredId(avatar.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="cursor-pointer"
                  >
                    <div className={cn(
                      'relative p-4 rounded-xl transition-all duration-300',
                      'border-2 overflow-hidden group',
                      selectedId === avatar.id
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/30'
                        : isDark
                        ? 'border-slate-700 bg-slate-800/50 hover:border-primary hover:bg-slate-700'
                        : 'border-gray-200 bg-gray-50 hover:border-primary hover:bg-gray-100'
                    )}>
                      {/* Background Gradient */}
                      <div className={cn(
                        'absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-20 transition-opacity',
                        `${avatar.color}`
                      )} />

                      {/* Avatar Image Container */}
                      <div className="relative mb-3 flex justify-center h-32">
                        <motion.img
                          src={avatar.file}
                          alt={avatar.name}
                          className="w-full h-full object-cover rounded-lg shadow-md"
                          animate={hoveredId === avatar.id ? { scale: 1.1 } : { scale: 1 }}
                          transition={{ duration: 0.2 }}
                          onError={(e) => {
                            e.target.src = '/placeholder.jpg';
                          }}
                        />

                        {/* Selection Checkmark */}
                        <AnimatePresence>
                          {selectedId === avatar.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="absolute top-1 right-1 bg-primary rounded-full p-1 shadow-lg"
                            >
                              <CheckCircle2 size={24} className="text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Avatar Name */}
                      <h3 className={cn(
                        'font-semibold text-sm text-center mb-1',
                        isDark ? 'text-white' : 'text-gray-900'
                      )}>
                        {avatar.emoji} {avatar.name.split(' ').slice(1).join(' ')}
                      </h3>

                      {/* Avatar Description */}
                      <p className={cn(
                        'text-xs text-center',
                        isDark ? 'text-slate-400' : 'text-gray-600'
                      )}>
                        {avatar.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className={cn(
              'flex items-center justify-between gap-3 p-6 border-t',
              isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
            )}>
              <p className={cn(
                'text-sm',
                isDark ? 'text-slate-400' : 'text-gray-600'
              )}>
                {selectedId ? (
                  <span className="flex items-center gap-2">
                    ✅ <span className="font-medium">Selected: {avatarMetadata.find(a => a.id === selectedId)?.emoji}</span>
                  </span>
                ) : (
                  <span>Choose an avatar to continue</span>
                )}
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className={cn(
                    'px-6 py-2.5 rounded-lg font-medium transition-colors',
                    isDark
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  )}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={selectedId ? { scale: 1.05 } : {}}
                  whileTap={selectedId ? { scale: 0.95 } : {}}
                  onClick={handleConfirm}
                  disabled={!selectedId}
                  className={cn(
                    'px-6 py-2.5 rounded-lg font-medium transition-all',
                    selectedId
                      ? 'bg-primary hover:bg-primary/90 text-white cursor-pointer shadow-lg shadow-primary/30'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-50'
                  )}
                >
                  Confirm
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AvatarSelector;
