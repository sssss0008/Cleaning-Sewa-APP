import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  text: string;
  card: string;
  border: string;
  drawerBg: string;
  drawerText: string;
  primary: string;
}

const lightColors: ThemeColors = {
  background: '#FFFFFF',
  text: '#111827',
  card: '#F8FAFC',
  border: '#E2E8F0',
  drawerBg: '#FFFFFF',
  drawerText: '#1E293B',
  primary: '#2563EB',
};

const darkColors: ThemeColors = {
  background: '#0F172A',
  text: '#F8FAFC',
  card: '#1E293B',
  border: '#334155',
  drawerBg: '#1E293B',
  drawerText: '#F8FAFC',
  primary: '#3B82F6',
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light' as Theme,
      isDark: false,
      colors: lightColors,
      toggleTheme: () => {},
    };
  }
  return context;
};
