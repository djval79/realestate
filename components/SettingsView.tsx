
import React, { useState } from 'react';
import ReferralCodeManager from './ReferralCodeManager';
import { useTheme } from '../hooks/useTheme';
import { Theme, Language } from '../types';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { useTranslation } from '../hooks/useTranslation';

interface SettingsViewProps {
    referralCode: string;
    onSaveReferralCode: (code: string) => void;
    onClearReferralCode: () => void;
    onClearClicks: () => void;
    onClearLeads: () => void;
    onClearConversions: () => void;
    onClearFavorites: () => void;
    onClearLibrary: () => void;
    onClearSeenAchievements: () => void;
    onClearAllData: () => void;
    monthlyGoal: number;
    onSetGoal: (goal: number) => void;
    onGeneratePlan: () => void;
    isGeneratingPlan: boolean;
}

const SettingsView: React.FC<SettingsViewProps> = (props) => {
    const { themeSetting, setTheme } = useTheme();
    const { language, setLanguage, t } = useTranslation();
    const [goalInput, setGoalInput] = useState(props.monthlyGoal.toString());

    const handleClearData = (clearFn: () => void, nameKey: string) => {
        const dataType = t(`settings.data.buttons.${nameKey}`).toLowerCase();
        if (window.confirm(t('settings.data.clearConfirmation', { dataType }))) {
            clearFn();
        }
    };
    
    const handleGoalSave = (e: React.FormEvent) => {
        e.preventDefault();
        const newGoal = parseFloat(goalInput);
        if (!isNaN(newGoal)) {
            props.onSetGoal(newGoal);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
            {/* Profile Section */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">{t('settings.profile.title')}</h2>
                <ReferralCodeManager code={props.referralCode} onSave={props.onSaveReferralCode} />
            </section>
            
            {/* Goals Section */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-6 flex items-center gap-2">
                    <ClipboardListIcon className="w-6 h-6"/>
                    {t('settings.goals.title')}
                </h2>
                 <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('settings.goals.label')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('settings.goals.description')}</p>
                    <form onSubmit={handleGoalSave} className="flex flex-col sm:flex-row gap-3 items-start">
                        <div className="relative flex-grow">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">$</div>
                            <input
                                type="number"
                                value={goalInput}
                                onChange={(e) => setGoalInput(e.target.value)}
                                onBlur={() => props.onSetGoal(parseFloat(goalInput))}
                                placeholder={t('settings.goals.placeholder')}
                                min="0"
                                required
                                className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg pl-7 pr-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        <button
                          type="button"
                          onClick={props.onGeneratePlan}
                          disabled={props.monthlyGoal <= 0 || props.isGeneratingPlan}
                          className="w-full sm:w-auto flex items-center justify-center bg-cyan-500 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-transform duration-200 hover:bg-cyan-400 hover:scale-105 disabled:bg-cyan-500/50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            {props.isGeneratingPlan ? t('settings.goals.generating') : t('settings.goals.generatePlan')}
                        </button>
                    </form>
                 </div>
            </section>

            {/* Appearance Section */}
            <section>
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">{t('settings.appearance.title')}</h2>
                 <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('settings.appearance.theme')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('settings.appearance.description')}</p>
                     <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl max-w-xs">
                        {(['light', 'dark', 'system'] as Theme[]).map(th => (
                            <button
                                key={th}
                                onClick={() => setTheme(th)}
                                className={`flex-1 capitalize text-sm font-bold py-2 rounded-lg transition-colors ${themeSetting === th ? 'bg-white dark:bg-gray-700 shadow text-cyan-600 dark:text-cyan-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}
                            >
                                {t(`settings.appearance.themes.${th}`)}
                            </button>
                        ))}
                    </div>
                 </div>
                 <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('Language')}</h3>
                     <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl max-w-xs">
                        {(['en', 'es'] as Language[]).map(lang => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`flex-1 capitalize text-sm font-bold py-2 rounded-lg transition-colors ${language === lang ? 'bg-white dark:bg-gray-700 shadow text-cyan-600 dark:text-cyan-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}
                            >
                                {lang === 'en' ? 'English' : 'Español'}
                            </button>
                        ))}
                    </div>
                 </div>
            </section>

            {/* Data Management Section */}
            <section>
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-red-500/50 dark:border-red-500/50 pb-2 mb-6 flex items-center gap-2">
                     <ExclamationTriangleIcon className="w-6 h-6 text-red-500"/>
                     {t('settings.data.title')}
                 </h2>
                 <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('settings.data.description')}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                         <button onClick={() => handleClearData(props.onClearClicks, 'clicks')} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 font-semibold py-2 px-4 rounded-lg transition-colors">{t('settings.data.buttons.clicks')}</button>
                         <button onClick={() => handleClearData(props.onClearLeads, 'leads')} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 font-semibold py-2 px-4 rounded-lg transition-colors">{t('settings.data.buttons.leads')}</button>
                         <button onClick={() => handleClearData(props.onClearConversions, 'conversions')} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 font-semibold py-2 px-4 rounded-lg transition-colors">{t('settings.data.buttons.conversions')}</button>
                         <button onClick={() => handleClearData(props.onClearFavorites, 'favorites')} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 font-semibold py-2 px-4 rounded-lg transition-colors">{t('settings.data.buttons.favorites')}</button>
                         <button onClick={() => handleClearData(props.onClearLibrary, 'library')} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 font-semibold py-2 px-4 rounded-lg transition-colors">{t('settings.data.buttons.library')}</button>
                         <button onClick={() => handleClearData(props.onClearSeenAchievements, 'achievements')} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 font-semibold py-2 px-4 rounded-lg transition-colors">{t('settings.data.buttons.achievements')}</button>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                         <button onClick={() => props.onClearAllData()} className="w-full sm:w-auto bg-red-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors hover:bg-red-700">{t('settings.data.buttons.all')}</button>
                    </div>
                 </div>
            </section>
        </div>
    );
};

export default SettingsView;
