import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

// --- Cleaning Sewa Color Palettes ---
export const lightColors = {
  background: '#F6F9F8',
  card: '#FFFFFF',
  text: '#111827',
  subText: '#4B5563',
  primary: '#064E3B',
  accent: '#0D9488',
  border: '#E5E7EB',
  inputBg: '#F3F4F6',
  headerBg: '#064E3B',
  drawerBg: 'rgba(255, 255, 255, 0.92)',
  drawerBorder: 'rgba(6, 78, 59, 0.15)',
  statusBarStyle: 'dark-content' as const,
};

export const darkColors = {
  background: '#0D1413',
  card: '#162321',
  text: '#F9FAFB',
  subText: '#9CA3AF',
  primary: '#34D399',
  accent: '#2DD4BF',
  border: '#243532',
  inputBg: '#1C2E2B',
  headerBg: '#05382B',
  drawerBg: 'rgba(22, 35, 33, 0.95)',
  drawerBorder: 'rgba(255, 255, 255, 0.12)',
  statusBarStyle: 'light-content' as const,
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: typeof lightColors;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  colors: lightColors,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);