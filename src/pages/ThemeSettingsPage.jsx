import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
  Copy,
  RotateCcw,
  Zap,
  Eye,
} from 'lucide-react';
import { useTheme, colorSchemes } from '../context/ThemeContext';
import { PageWrapper } from '../components/shared/UIComponents';

const ThemeSettingsPage = () => {
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

  const [copiedColor, setCopiedColor] = useState(null);
  const [expandedScheme, setExpandedScheme] = useState(null);
  const [exportFormat, setExportFormat] = useState('json');

  const currentColors = customColors || colorSchemes[colorScheme][isDark ? 'dark' : 'light'];

  const handleCopyColor = (value) => {
    navigator.clipboard.writeText(value);
    setCopiedColor(value);
    setTimeout(() => setCopiedColor(null), 2000);
  };

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

  const exportColors = () => {
    const dataToExport = customColors || {
      light: colorSchemes[colorScheme].light,
      dark: colorSchemes[colorScheme].dark,
    };

    let content;
    if (exportFormat === 'json') {
      content = JSON.stringify(dataToExport, null, 2);
    } else if (exportFormat === 'css') {
      content = generateCSSVariables(dataToExport);
    } else if (exportFormat === 'tailwind') {
      content = generateTailwindConfig(dataToExport);
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `theme-colors.${exportFormat === 'json' ? 'json' : 'txt'}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateCSSVariables = (colors) => {
    let css = ':root {\n';
    Object.entries(colors.light).forEach(([key, value]) => {
      css += `  --color-${key}: ${value};\n`;
    });
    css += '}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n';
    Object.entries(colors.dark).forEach(([key, value]) => {
      css += `    --color-${key}: ${value};\n`;
    });
    css += '  }\n}';
    return css;
  };

  const generateTailwindConfig = (colors) => {
    const config = {
      theme: {
        extend: {
          colors: {
            primary: colors.light.primary,
            secondary: colors.light.secondary,
            accent: colors.light.accent,
          },
        },
      },
    };
    return `module.exports = ${JSON.stringify(config, null, 2)}`;
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-[14px]">
              <Palette size={32} />
            </div>
            Theme Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Customize your application theme, colors, and appearance
          </p>
        </div>

        {/* Theme Mode Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-[24px] border border-white/50 dark:border-slate-800/50 shadow-lg"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Theme Mode
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                id: 'light',
                label: 'Light',
                icon: Sun,
                description: 'Bright and clean interface',
              },
              {
                id: 'dark',
                label: 'Dark',
                icon: Moon,
                description: 'Easy on the eyes',
              },
              {
                id: 'system',
                label: 'System',
                icon: Monitor,
                description: 'Follow system preference',
              },
            ].map((mode) => (
              <motion.button
                key={mode.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (mode.id !== 'system') {
                    if ((mode.id === 'dark') !== isDark) {
                      toggleTheme();
                    }
                  }
                }}
                className={`p-4 rounded-[16px] border-2 transition-all text-center ${
                  (mode.id === 'dark' && isDark) ||
                  (mode.id === 'light' && !isDark)
                    ? 'border-primary bg-primary/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                }`}
              >
                <mode.icon className="mx-auto mb-2 text-primary" size={24} />
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {mode.label}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {mode.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Color Schemes Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-[24px] border border-white/50 dark:border-slate-800/50 shadow-lg"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Color Schemes
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {availableSchemes.map((scheme) => {
              const schemeData = colorSchemes[scheme.id];
              const colors = schemeData[isDark ? 'dark' : 'light'];
              const isActive = colorScheme === scheme.id && !customColors;

              return (
                <motion.button
                  key={scheme.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (expandedScheme === scheme.id) {
                      setExpandedScheme(null);
                    } else {
                      setExpandedScheme(scheme.id);
                    }
                  }}
                  className={`p-4 rounded-[16px] border-2 transition-all text-left ${
                    isActive
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {scheme.name}
                    </h4>
                    {isActive && (
                      <Check size={20} className="text-primary" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    {[
                      colors.primary,
                      colors.secondary,
                      colors.accent,
                      colors.background,
                    ].map((color, idx) => (
                      <div
                        key={idx}
                        className="flex-1 h-8 rounded-[8px] border border-slate-300 dark:border-slate-600"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      changeColorScheme(scheme.id);
                    }}
                    className={`w-full mt-3 px-3 py-2 rounded-[10px] text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary/20 text-primary'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isActive ? 'Active' : 'Apply'}
                  </button>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Custom Colors Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-[24px] border border-white/50 dark:border-slate-800/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Custom Colors
            </h2>
            {customColors && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetToDefault}
                className="flex items-center gap-2 text-sm px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-[10px] font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <RotateCcw size={16} />
                Reset
              </motion.button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(currentColors).map(([key, value]) => (
              <div
                key={key}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-slate-900 dark:text-white capitalize">
                  {key}
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-12 h-10 rounded-[12px] cursor-pointer border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-[12px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopyColor(value)}
                    className={`p-2 rounded-[12px] transition-colors ${
                      copiedColor === value
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title="Copy color"
                  >
                    <Copy size={18} />
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-[24px] border border-white/50 dark:border-slate-800/50 shadow-lg"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Preview
          </h2>
          <div className="space-y-4">
            {/* Button Preview */}
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Buttons
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  className="px-6 py-2 bg-primary text-white rounded-[12px] font-semibold hover:opacity-90 transition-opacity"
                >
                  Primary Button
                </button>
                <button
                  className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-[12px] font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Secondary Button
                </button>
                <button
                  className="px-6 py-2 border-2 border-primary text-primary rounded-[12px] font-semibold hover:bg-primary/10 transition-colors"
                >
                  Outline Button
                </button>
              </div>
            </div>

            {/* Color Swatches */}
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Color Swatches
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(currentColors).map(([key, color]) => (
                  <div key={key} className="text-center">
                    <div
                      className="h-16 rounded-[12px] border border-slate-200 dark:border-slate-700 mb-2"
                      style={{ backgroundColor: color }}
                    />
                    <p className="text-xs font-semibold text-slate-900 dark:text-white capitalize">
                      {key}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                      {color}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient Preview */}
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Gradients
              </p>
              <div className="flex gap-3">
                <div
                  className="h-20 flex-1 rounded-[12px] border border-slate-200 dark:border-slate-700"
                  style={{
                    background: `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.secondary})`,
                  }}
                />
                <div
                  className="h-20 flex-1 rounded-[12px] border border-slate-200 dark:border-slate-700"
                  style={{
                    background: `linear-gradient(135deg, ${currentColors.secondary}, ${currentColors.accent})`,
                  }}
                />
                <div
                  className="h-20 flex-1 rounded-[12px] border border-slate-200 dark:border-slate-700"
                  style={{
                    background: `linear-gradient(135deg, ${currentColors.accent}, ${currentColors.primary})`,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-[24px] border border-white/50 dark:border-slate-800/50 shadow-lg"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Export Theme
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Export Format
              </label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full px-4 py-2 rounded-[12px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="json">JSON (For development)</option>
                <option value="css">CSS Variables</option>
                <option value="tailwind">Tailwind Config</option>
              </select>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportColors}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-[12px] font-semibold hover:bg-primary/90 transition-colors"
            >
              <Zap size={20} />
              Export Theme Colors
            </motion.button>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-[16px]"
        >
          <div className="flex gap-3">
            <Eye className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                Theme Information
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Your theme preferences are automatically saved locally. Changes apply instantly across the entire application. Export your custom theme to share with your team or reuse in other projects.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default ThemeSettingsPage;
