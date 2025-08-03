
import React from 'react';

interface StatsCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    subValue?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, subValue }) => {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex items-start justify-between">
            <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
                <p className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mt-2 truncate">{value}</p>
                {subValue && <p className="text-sm text-cyan-600 dark:text-cyan-400 font-semibold mt-1">{subValue}</p>}
            </div>
            <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
                <Icon className="h-7 w-7 text-cyan-500 dark:text-cyan-400"/>
            </div>
        </div>
    );
};

export default StatsCard;