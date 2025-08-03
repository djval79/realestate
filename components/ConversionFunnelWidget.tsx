
import React from 'react';
import { FunnelIcon } from './icons/FunnelIcon';

interface ConversionFunnelWidgetProps {
    metrics: {
        totalClicks: number;
        totalLeads: number;
        totalConversions: number;
        clickToLeadRate: number;
        leadToConversionRate: number;
    };
}

const FunnelStage: React.FC<{ name: string, value: number, isLast?: boolean }> = ({ name, value, isLast = false }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg ${isLast ? 'bg-cyan-100 dark:bg-cyan-900/50' : 'bg-gray-100 dark:bg-gray-900/50'}`}>
        <span className="font-semibold text-gray-800 dark:text-gray-200">{name}</span>
        <span className="font-bold text-lg text-gray-900 dark:text-white">{value}</span>
    </div>
);

const FunnelRate: React.FC<{ rate: number }> = ({ rate }) => (
    <div className="flex justify-center items-center my-1">
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
        <div className="mx-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/50 px-2 py-0.5 rounded-full">
            {rate.toFixed(1)}%
        </div>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
    </div>
);

const ConversionFunnelWidget: React.FC<ConversionFunnelWidgetProps> = ({ metrics }) => {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 h-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FunnelIcon className="w-6 h-6 mr-3 text-cyan-500 dark:text-cyan-400" />
                Conversion Funnel
            </h3>
            <div className="space-y-1">
                <FunnelStage name="Clicks" value={metrics.totalClicks} />
                <FunnelRate rate={metrics.clickToLeadRate} />
                <FunnelStage name="Leads" value={metrics.totalLeads} />
                <FunnelRate rate={metrics.leadToConversionRate} />
                <FunnelStage name="Conversions" value={metrics.totalConversions} isLast />
            </div>
        </div>
    );
};

export default ConversionFunnelWidget;