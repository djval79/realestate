
import React, { useEffect } from 'react';
import { AIStrategicPlan } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';

interface AIPlanModalProps {
  plan: AIStrategicPlan | null;
  isLoading: boolean;
  onClose: () => void;
  goal: number;
}

const SectionSkeleton: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <ul className="space-y-2">
            <li className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></li>
            <li className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></li>
        </ul>
    </div>
);

const PlanSection: React.FC<{title: string, actions: string[], weekNumber: number}> = ({ title, actions, weekNumber }) => (
    <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center mb-3">
            <span className="w-6 h-6 mr-3 text-sm flex-shrink-0 font-bold bg-cyan-100 text-cyan-700 dark:bg-gray-700 dark:text-cyan-400 rounded-full flex items-center justify-center">
                {weekNumber}
            </span>
            {title}
        </h3>
        <ul className="space-y-2 pl-9">
            {actions.map((action, index) => (
                <li key={index} className="flex items-start">
                    <span className="mr-3 text-cyan-500 dark:text-cyan-400 font-bold flex-shrink-0">•</span>
                    <span className="text-gray-600 dark:text-gray-300">{action}</span>
                </li>
            ))}
        </ul>
    </div>
);

const AIPlanModal: React.FC<AIPlanModalProps> = ({ plan, isLoading, onClose, goal }) => {
    
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
          if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
      }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 no-print" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="ai-plan-title">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all duration-300 flex flex-col" style={{maxHeight: '90vh'}} onClick={(e) => e.stopPropagation()}>
                <div className="flex-shrink-0 flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <SparklesIcon className="w-6 h-6 text-cyan-500 dark:text-cyan-400 mr-3"/>
                        <h2 id="ai-plan-title" className="text-xl font-bold text-gray-900 dark:text-white">Your AI Strategic Plan</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Close modal">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-grow p-8 overflow-y-auto space-y-8">
                    <p className="text-center text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg">
                        Here's your personalized 4-week plan to help you reach your goal of <strong>${goal.toLocaleString()}</strong> in earnings!
                    </p>
                    {isLoading ? (
                        <>
                            <SectionSkeleton />
                            <SectionSkeleton />
                            <SectionSkeleton />
                            <SectionSkeleton />
                        </>
                    ) : plan ? (
                        <>
                            <PlanSection title={plan.week1.title} actions={plan.week1.actions} weekNumber={1} />
                            <PlanSection title={plan.week2.title} actions={plan.week2.actions} weekNumber={2} />
                            <PlanSection title={plan.week3.title} actions={plan.week3.actions} weekNumber={3} />
                            <PlanSection title={plan.week4.title} actions={plan.week4.actions} weekNumber={4} />
                        </>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500 dark:text-gray-400">Something went wrong. Please try generating the plan again.</p>
                        </div>
                    )}
                </div>
                
                <div className="flex-shrink-0 p-5 border-t border-gray-200 dark:border-gray-700 text-right no-print">
                    <button
                        onClick={onClose}
                        className="inline-flex items-center justify-center gap-2 bg-cyan-500 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-transform duration-200 hover:bg-cyan-400 hover:scale-105"
                    >
                        Let's Go!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIPlanModal;
