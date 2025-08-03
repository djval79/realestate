
import React, { useMemo } from 'react';
import { DailyEarning } from '../types';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

interface EarningsChartProps {
    data: DailyEarning[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

const EarningsChart: React.FC<EarningsChartProps> = ({ data }) => {
    const maxAmount = useMemo(() => Math.max(...data.map(d => d.amount), 1), [data]);

    const getDayLabel = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    };

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center">
                 <TrendingUpIcon className="w-5 h-5 mr-3 text-green-500 dark:text-green-400" />
                Recent Earnings
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Earnings over the last 7 days</p>

            <div className="w-full h-64 flex justify-between items-end gap-3">
                {data.map(({ date, amount }) => {
                    const barHeight = `${(amount / maxAmount) * 100}%`;
                    return (
                        <div key={date} className="flex-1 flex flex-col items-center h-full group relative">
                            <div className="w-full h-full flex items-end">
                                <div 
                                    className="w-full bg-green-400 dark:bg-green-500 rounded-t-md transition-all duration-300 hover:bg-green-500 dark:hover:bg-green-400"
                                    style={{ height: barHeight, minHeight: '2px' }}
                                    title={`${formatCurrency(amount)} earned on ${date}`}
                                >
                                </div>
                            </div>
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-900 text-white text-xs font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {formatCurrency(amount)}
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

export default EarningsChart;
