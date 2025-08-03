
import React from 'react';
import { ProactiveTip } from '../types';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { CloseIcon } from './icons/CloseIcon';

interface AIProactiveAssistantProps {
    tip: ProactiveTip | null;
    onDismiss: (tipId: string) => void;
    onAction: (tip: ProactiveTip) => void;
}

const AIProactiveAssistant: React.FC<AIProactiveAssistantProps> = ({ tip, onDismiss, onAction }) => {
    if (!tip) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm" role="status" aria-live="polite">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-5 animate-fade-in-up">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                        <LightBulbIcon className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Proactive Tip</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{tip.message}</p>
                        <button
                            onClick={() => onAction(tip)}
                            className="mt-3 text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                        >
                            {tip.action.label}
                        </button>
                    </div>
                    <div className="flex-shrink-0">
                         <button
                            onClick={() => onDismiss(tip.id)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                            aria-label="Dismiss tip"
                        >
                            <CloseIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIProactiveAssistant;
