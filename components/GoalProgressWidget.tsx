
import React from 'react';
import { FlagIcon } from './icons/FlagIcon';

interface GoalProgressWidgetProps {
    currentEarnings: number;
    goal: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
};

const GoalProgressWidget: React.FC<GoalProgressWidgetProps> = ({ currentEarnings, goal }) => {
    if (goal <= 0) {
        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center">
                    <FlagIcon className="w-6 h-6 mr-3 text-cyan-500 dark:text-cyan-400" />
                    Monthly Goal
                </h3>
                <p className="text-gray-500 dark:text-gray-400">Set an earnings goal in Settings to track your progress here.</p>
            </div>
        );
    }

    const progressPercent = Math.min((currentEarnings / goal) * 100, 100);

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <FlagIcon className="w-6 h-6 mr-3 text-cyan-500 dark:text-cyan-400" />
                    Monthly Goal Progress
                </h3>
                <span className="font-bold text-lg text-gray-900 dark:text-white">{progressPercent.toFixed(0)}%</span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div 
                    className="bg-cyan-500 h-4 rounded-full transition-all duration-500"
                    style={{width: `${progressPercent}%`}}
                ></div>
            </div>

            <div className="flex justify-between items-center mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                <span>{formatCurrency(currentEarnings)}</span>
                <span>{formatCurrency(goal)}</span>
            </div>
        </div>
    );
};

export default GoalProgressWidget;
