
import React from 'react';
import { Achievement } from '../types';
import { TrophyIcon } from './icons/TrophyIcon';

interface AchievementsPanelProps {
    achievements: Achievement[];
}

const AchievementItem: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const isUnlocked = achievement.unlocked;

    return (
        <div className={`flex items-center gap-4 transition-all duration-300 ${!isUnlocked ? 'grayscale opacity-50' : ''}`}>
            <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${isUnlocked ? 'bg-yellow-100 dark:bg-yellow-900/50' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <TrophyIcon className={`w-7 h-7 ${isUnlocked ? 'text-yellow-500' : 'text-gray-500'}`} />
            </div>
            <div className="min-w-0">
                <p className="font-bold text-gray-900 dark:text-white truncate">{achievement.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
            </div>
        </div>
    );
};

const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ achievements }) => {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrophyIcon className="w-6 h-6 mr-3 text-cyan-500 dark:text-cyan-400" />
                Achievements
            </h3>
            <div className="space-y-4">
                {achievements.map(ach => (
                    <AchievementItem key={ach.id} achievement={ach} />
                ))}
            </div>
        </div>
    );
};

export default AchievementsPanel;