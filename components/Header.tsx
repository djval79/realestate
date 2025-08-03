
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import ThemeSwitcher from './ThemeSwitcher';
import { LibraryIcon } from './icons/LibraryIcon';
import { CogIcon } from './icons/CogIcon';
import { useTranslation } from '../hooks/useTranslation';

type View = 'properties' | 'dashboard' | 'library' | 'settings';

interface HeaderProps {
    activeView: View;
    onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onNavigate }) => {
  const { t } = useTranslation();
  return (
    <header className="relative text-center py-4">
      <div className="absolute top-2 right-2">
          <ThemeSwitcher />
      </div>
      <div className="inline-flex items-center bg-cyan-100 text-cyan-700 dark:bg-gray-800 dark:text-cyan-400 text-sm font-semibold px-4 py-1 rounded-full mb-4">
        <SparklesIcon className="w-5 h-5 mr-2" />
        {t('header.poweredBy')}
      </div>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        {t('header.title')} <span className="text-cyan-500 dark:text-cyan-400">{t('header.titleAccent')}</span>
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
        {t('header.subtitle')}
      </p>

      <div className="mt-8 flex justify-center">
        <div className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-1 rounded-xl flex items-center space-x-1">
            <button 
                onClick={() => onNavigate('properties')}
                className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${activeView === 'properties' ? 'bg-cyan-500 text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
            >
                {t('header.nav.properties')}
            </button>
            <button
                onClick={() => onNavigate('dashboard')}
                className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold transition-colors ${activeView === 'dashboard' ? 'bg-cyan-500 text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
            >
                {t('header.nav.dashboard')}
            </button>
            <button
                onClick={() => onNavigate('library')}
                className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${activeView === 'library' ? 'bg-cyan-500 text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
            >
                <LibraryIcon className="w-5 h-5"/>
                {t('header.nav.library')}
            </button>
             <button
                onClick={() => onNavigate('settings')}
                className={`p-2.5 rounded-lg transition-colors ${activeView === 'settings' ? 'bg-cyan-500 text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
                title={t('header.nav.settings')}
            >
                <CogIcon className="w-5 h-5"/>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
