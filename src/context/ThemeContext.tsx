@'
import React, { createContext, useContext, useState, useMemo } from 'react';

type Theme = 'light' | 'dark';

// ---------- Color palettes ----------
const lightColors = {
  primary: '#0A7CFF',
  subText: '#6B7280',
  text: '#111827',
  background: '#FFFFFF',
  card: '#F9FAFB',
  border: '#E5E7EB',
  drawerBg: '#FFFFFF',
  drawerBorder: 'rgba(0,0,0,0.08)',
  danger: '#EF4444',
  success: '#10B981',
};

const darkColors = {
  primary: '#3B82F6',
  subText: '#9CA3AF',
  text: '#F9FAFB',
  background: '#0F172A',
  card: '#1E293B',
  border: '#334155',
  drawerBg: '#1E293B',
  drawerBorder: 'rgba(255,255,255,0.12)',
  danger: '#F87171',
  success: '#34D399',
};

export type AppColors = typeof lightColors;

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  colors: AppColors;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');

  const isDarkMode = theme === 'dark';
  const colors = isDarkMode ? darkColors : lightColors;

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value = useMemo(
    () => ({
      theme,
      isDarkMode,
      colors,
      toggleTheme,
      setTheme,
    }),
    [theme, isDarkMode, colors]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Safe fallback so the app doesn't crash if used outside provider
    return {
      theme: 'light' as Theme,
      isDarkMode: false,
      colors: lightColors,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
};
'@ | Set-Content -Path "src/context/ThemeContext.tsx"