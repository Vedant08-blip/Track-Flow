import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Color schemes with CSS variables
export const colorSchemes = {
  default: {
    name: 'Default',
    light: {
      primary: '#1B6BF5',
      secondary: '#0ABFBC',
      accent: '#F39C12',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#1E293B',
      border: '#E2E8F0',
    },
    dark: {
      primary: '#3B82F6',
      secondary: '#06D6D0',
      accent: '#F59E0B',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F1F5F9',
      border: '#334155',
    },
  },
  ocean: {
    name: 'Ocean',
    light: {
      primary: '#0369A1',
      secondary: '#0891B2',
      accent: '#06B6D4',
      background: '#F0F9FF',
      surface: '#E0F2FE',
      text: '#082F49',
      border: '#BAE6FD',
    },
    dark: {
      primary: '#38BDF8',
      secondary: '#06B6D4',
      accent: '#22D3EE',
      background: '#082F49',
      surface: '#0C4A6E',
      text: '#E0F2FE',
      border: '#0284C7',
    },
  },
  sunset: {
    name: 'Sunset',
    light: {
      primary: '#DC2626',
      secondary: '#F97316',
      accent: '#EAB308',
      background: '#FFF7ED',
      surface: '#FEE2E2',
      text: '#7C2D12',
      border: '#FDBA74',
    },
    dark: {
      primary: '#EF4444',
      secondary: '#FB923C',
      accent: '#FACC15',
      background: '#431407',
      surface: '#7C2D12',
      text: '#FED7AA',
      border: '#DC2626',
    },
  },
  forest: {
    name: 'Forest',
    light: {
      primary: '#15803D',
      secondary: '#059669',
      accent: '#0891B2',
      background: '#F0FDF4',
      surface: '#DCFCE7',
      text: '#166534',
      border: '#86EFAC',
    },
    dark: {
      primary: '#4ADE80',
      secondary: '#10B981',
      accent: '#34D399',
      background: '#064E3B',
      surface: '#065F46',
      text: '#D1FAE5',
      border: '#059669',
    },
  },
  purple: {
    name: 'Purple',
    light: {
      primary: '#7C3AED',
      secondary: '#A78BFA',
      accent: '#EC4899',
      background: '#FAF5FF',
      surface: '#F3E8FF',
      text: '#4C1D95',
      border: '#DDD6FE',
    },
    dark: {
      primary: '#A78BFA',
      secondary: '#C084FC',
      accent: '#F472B6',
      background: '#3F0F5C',
      surface: '#581C87',
      text: '#EDE9FE',
      border: '#7C3AED',
    },
  },
  midnight: {
    name: 'Midnight',
    light: {
      primary: '#1E1B4B',
      secondary: '#3B82F6',
      accent: '#8B5CF6',
      background: '#F8F7FF',
      surface: '#EEE5FF',
      text: '#1E1B4B',
      border: '#D8CCFF',
    },
    dark: {
      primary: '#818CF8',
      secondary: '#60A5FA',
      accent: '#A78BFA',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#E0E7FF',
      border: '#4C1D95',
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [colorScheme, setColorScheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('colorScheme');
      return stored || 'default';
    }
    return 'default';
  });

  const [customColors, setCustomColors] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('customColors');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  // Apply theme to DOM
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Toggle dark mode class
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Apply color scheme
    const scheme = customColors || colorSchemes[colorScheme];
    const colors = isDark ? scheme.dark : scheme.light;

    // Set CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    localStorage.setItem('colorScheme', colorScheme);
  }, [isDark, colorScheme, customColors]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const changeColorScheme = (schemeName) => {
    if (colorSchemes[schemeName]) {
      setColorScheme(schemeName);
      setCustomColors(null);
    }
  };

  const updateCustomColors = (colors) => {
    setCustomColors(colors);
    localStorage.setItem('customColors', JSON.stringify(colors));
  };

  const resetToDefault = () => {
    setColorScheme('default');
    setCustomColors(null);
    localStorage.removeItem('customColors');
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        setIsDark,
        toggleTheme,
        colorScheme,
        changeColorScheme,
        customColors,
        updateCustomColors,
        resetToDefault,
        availableSchemes: Object.entries(colorSchemes).map(([key, value]) => ({
          id: key,
          name: value.name,
        })),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
