
import React, { useMemo } from 'react';
import { DailyClick } from '../types';
import { ChartBarIcon } from './icons/ChartBarIcon';

interface ClicksChartProps {
    data: DailyClick[];
}

const ClicksChart: React.FC<ClicksChartProps> = ({ data }) => {
    const maxCount = useMemo(() => Math.max(...data.map(d => d.count), 1), [data]);

    const getDayLabel = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    };

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Recent Activity</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Clicks over the last 7 days</p>

            <div className="w-full h-64 flex justify-between items-end gap-3">
                {data.map(({ date, count }) => {
                    const barHeight = `${(count / maxCount) * 100}%`;
                    return (
                        <div key={date} className="flex-1 flex flex-col items-center h-full group relative">
                            <div className="w-full h-full flex items-end">
                                <div 
                                    className="w-full bg-cyan-400 dark:bg-cyan-500 rounded-t-md transition-all duration-300 hover:bg-cyan-500 dark:hover:bg-cyan-400"
                                    style={{ height: barHeight, minHeight: '2px' }}
                                    title={`${count} clicks on ${date}`}
                                >
                                </div>
                            </div>
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-900 text-white text-xs font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {count}
                            </div>
                             <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-2">
                                {getDayLabel(date)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ClicksChart;