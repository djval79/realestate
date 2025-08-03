
import React, { useEffect } from 'react';
import { AIInsightsReport } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { BadgeCheckIcon } from './icons/BadgeCheckIcon';
import { GrowthIcon } from './icons/GrowthIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

interface AIInsightsModalProps {
  report: AIInsightsReport | null;
  isLoading: boolean;
  onClose: () => void;
}

const SectionSkeleton: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <ul className="space-y-2">
            <li className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></li>
            <li className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></li>
            <li className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></li>
        </ul>
    </div>
);

const ReportSection: React.FC<{title: string, items: string[], icon: React.ElementType, itemIcon?: React.ElementType}> = ({ title, items, icon: Icon, itemIcon: ItemIcon }) => (
    <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center mb-3">
            <Icon className="w-6 h-6 mr-3 text-cyan-500 dark:text-cyan-400"/>
            {title}
        </h3>
        <ul className="space-y-2 pl-9">
            {items.map((item, index) => (
                <li key={index} className="flex items-start">
                    {ItemIcon ? (
                        <ItemIcon className="w-5 h-5 mr-3 mt-0.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    ) : (
                        <span className="mr-3 text-cyan-500 dark:text-cyan-400 font-bold flex-shrink-0">•</span>
                    )}
                    <span className="text-gray-600 dark:text-gray-300">{item}</span>
                </li>
            ))}
        </ul>
    </div>
);


const AIInsightsModal: React.FC<AIInsightsModalProps> = ({ report, isLoading, onClose }) => {
    
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
          if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
      }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 no-print" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="ai-insights-title">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all duration-300 flex flex-col" style={{maxHeight: '90vh'}} onClick={(e) => e.stopPropagation()}>
                <div className="flex-shrink-0 flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <SparklesIcon className="w-6 h-6 text-cyan-500 dark:text-cyan-400 mr-3"/>
                        <h2 id="ai-insights-title" className="text-xl font-bold text-gray-900 dark:text-white">AI Performance Insights</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Close modal">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-grow p-8 overflow-y-auto space-y-8">
                    {isLoading ? (
                        <>
                            <div className="space-y-1 animate-pulse"><div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded"></div><div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div></div>
                            <SectionSkeleton />
                            <SectionSkeleton />
                            <SectionSkeleton />
                        </>
                    ) : report ? (
                        <>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center mb-2">
                                    Performance Summary
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">{report.performanceSummary}</p>
                            </div>
                            <ReportSection title="Key Strengths" items={report.keyStrengths} icon={BadgeCheckIcon} />
                            <ReportSection title="Opportunities for Growth" items={report.opportunitiesForGrowth} icon={GrowthIcon} />
                            <ReportSection title="Actionable Tips" items={report.actionableTips} icon={TrendingUpIcon} />
                        </>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500 dark:text-gray-400">Something went wrong. Please try generating the insights again.</p>
                        </div>
                    )}
                </div>
                
                <div className="flex-shrink-0 p-5 border-t border-gray-200 dark:border-gray-700 text-right no-print">
                    <button
                        onClick={onClose}
                        className="inline-flex items-center justify-center gap-2 bg-cyan-500 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-transform duration-200 hover:bg-cyan-400 hover:scale-105"
                    >
                        Got It, Thanks!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIInsightsModal;