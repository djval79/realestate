
import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

const ThemeSwitcher: React.FC = () => {
  const { appliedTheme, themeSetting, setTheme } = useTheme();

  const toggleTheme = () => {
    // If user has a preference, toggle it. If they're on system, switch to the opposite of what's currently applied.
    if (themeSetting === 'light') {
      setTheme('dark');
    } else if (themeSetting === 'dark') {
      setTheme('light');
    } else { // 'system'
      setTheme(appliedTheme === 'light' ? 'dark' : 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors"
      aria-label={`Switch to ${appliedTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      {appliedTheme === 'light' ? (
        <MoonIcon className="w-6 h-6" />
      ) : (
        <SunIcon className="w-6 h-6" />
      )}
    </button>
  );
};

export default ThemeSwitcher;