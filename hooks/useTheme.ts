
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  themeSetting: Theme;
  appliedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeSetting, setThemeSetting] = useState<Theme>('system');
  const [appliedTheme, setAppliedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setThemeSetting(storedTheme);
    } else {
      setThemeSetting('system');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      let currentTheme: 'light' | 'dark';
      if (themeSetting === 'system') {
        currentTheme = mediaQuery.matches ? 'dark' : 'light';
      } else {
        currentTheme = themeSetting;
      }
      setAppliedTheme(currentTheme);
      root.classList.toggle('dark', currentTheme === 'dark');
    };

    updateTheme();
    localStorage.setItem('theme', themeSetting);

    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);

  }, [themeSetting]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeSetting(newTheme);
  }, []);

  return React.createElement(
    ThemeContext.Provider,
    { value: { themeSetting, appliedTheme, setTheme } },
    children
  );
};