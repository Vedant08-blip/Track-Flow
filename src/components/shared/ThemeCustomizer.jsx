import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Palette,
  Check,
  Copy,
  RotateCcw,
} from 'lucide-react';
import { useTheme, colorSchemes } from '../../context/ThemeContext';

const ThemeCustomizer = ({ isOpen, onClose }) => {
  const {
    isDark,
    toggleTheme,
    colorScheme,
    changeColorScheme,
    customColors,
    updateCustomColors,
    resetToDefault,
    availableSchemes,
  } = useTheme();

  const [activeTab, setActiveTab] = useState('schemes');
  const [copiedColor, setCopiedColor] = useState(null);
  const [editingColor, setEditingColor] = useState(null);

  const currentColors = customColors || colorSchemes[colorScheme][isDark ? 'dark' : 'light'];

  const handleColorChange = (colorKey, value) => {
    const newColors = customColors
      ? { ...customColors }
      : {
          light: { ...colorSchemes[colorScheme].light },
          dark: { ...colorSchemes[colorScheme].dark },
        };

    if (!newColors[isDark ? 'dark' : 'light']) {
      newColors[isDark ? 'dark' : 'light'] = currentColors;
    }

    newColors[isDark ? 'dark' : 'light'][colorKey] = value;
    updateCustomColors(newColors);
  };

  const handleCopyColor = (value) => {
    navigator.clipboard.writeText(value);
    setCopiedColor(value);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Palette size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Theme Customizer
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Personalize your experience
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Dark Mode Toggle */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/30 dark:to-slate-800/10 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                      Dark Mode
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {isDark ? 'Dark mode active' : 'Light mode active'}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      isDark 
                        ? 'bg-blue-600' 
                        : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <motion.div
                      initial={false}
                      animate={{ x: isDark ? 22 : 2 }}
                      transition={{ type: 'spring', damping: 25 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                    />
                  </motion.button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
                {['schemes', 'custom'].map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-3 py-2 rounded-md font-medium text-sm transition-all ${
                      activeTab === tab
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab === 'schemes' ? 'Schemes' : 'Custom'}
                  </motion.button>
                ))}
              </div>

              {/* Color Schemes Tab */}
              {activeTab === 'schemes' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {availableSchemes.map((scheme) => {
                    const schemeData = colorSchemes[scheme.id];
                    const colors = schemeData[isDark ? 'dark' : 'light'];
                    const isActive = colorScheme === scheme.id && !customColors;

                    return (
                      <motion.button
                        key={scheme.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => changeColorScheme(scheme.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          isActive
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                            : 'border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                            {scheme.name}
                          </h4>
                          {isActive && (
                            <Check size={18} className="text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div className="flex gap-2">
                          {[
                            colors.primary,
                            colors.secondary,
                            colors.accent,
                          ].map((color, idx) => (
                            <div
                              key={idx}
                              className="flex-1 h-6 rounded-md border border-slate-300/50 dark:border-slate-600/50 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}

              {/* Custom Colors Tab */}
              {activeTab === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(currentColors).map(([key, value]) => (
                      <div
                        key={key}
                        className="space-y-2"
                        onMouseEnter={() => setEditingColor(key)}
                        onMouseLeave={() => setEditingColor(null)}
                      >
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white capitalize">
                          {key}
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              type="color"
                              value={value}
                              onChange={(e) =>
                                handleColorChange(key, e.target.value)
                              }
                              className="w-full h-10 rounded-[12px] cursor-pointer border border-slate-200 dark:border-slate-700"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={value}
                              onChange={(e) =>
                                handleColorChange(key, e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-[12px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono"
                            />
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCopyColor(value)}
                            className={`p-2 rounded-[12px] transition-colors ${
                              copiedColor === value
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Copy size={18} />
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {customColors && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resetToDefault}
                      className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-[12px] font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <RotateCcw size={18} />
                      Reset to Default
                    </motion.button>
                  )}
                </motion.div>
              )}

              {/* Preview */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-[16px]">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                  Preview
                </h4>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-primary text-white rounded-[12px] font-semibold hover:opacity-90 transition-opacity">
                    Primary Button
                  </button>
                  <div className="flex gap-2">
                    {[
                      { label: 'Primary', color: currentColors.primary },
                      { label: 'Secondary', color: currentColors.secondary },
                      { label: 'Accent', color: currentColors.accent },
                    ].map((item) => (
                      <div key={item.label} className="flex-1">
                        <div
                          className="h-12 rounded-[12px] border border-slate-200 dark:border-slate-700 mb-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-6 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 rounded-[12px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThemeCustomizer;
