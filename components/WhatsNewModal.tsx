
import React, { useEffect } from 'react';
import { ChangeLogItem, ChangeLogType } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { GiftIcon } from './icons/GiftIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { WrenchIcon } from './icons/WrenchIcon';
import { BugAntIcon } from './icons/BugAntIcon';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  changelog: ChangeLogItem[];
}

const typeConfig: Record<ChangeLogType, { icon: React.ElementType, label: string, color: string }> = {
    new: {
        icon: SparklesIcon,
        label: 'New Feature',
        color: 'text-cyan-500 dark:text-cyan-400'
    },
    improvement: {
        icon: WrenchIcon,
        label: 'Improvement',
        color: 'text-green-500 dark:text-green-400'
    },
    fix: {
        icon: BugAntIcon,
        label: 'Bug Fix',
        color: 'text-orange-500 dark:text-orange-400'
    }
};

const ChangeItem: React.FC<{ item: ChangeLogItem }> = ({ item }) => {
    const config = typeConfig[item.type];
    const Icon = config.icon;

    return (
        <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div className="min-w-0">
                <p className={`text-sm font-bold ${config.color}`}>{config.label}</p>
                <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
            </div>
        </div>
    );
};

const WhatsNewModal: React.FC<WhatsNewModalProps> = ({ isOpen, onClose, changelog }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (event: KeyboardEvent) => {
          if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 no-print" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="whats-new-title">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform transition-all duration-300 flex flex-col" style={{maxHeight: '90vh'}} onClick={(e) => e.stopPropagation()}>
                <div className="flex-shrink-0 flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <GiftIcon className="w-6 h-6 text-cyan-500 dark:text-cyan-400 mr-3"/>
                        <h2 id="whats-new-title" className="text-xl font-bold text-gray-900 dark:text-white">What's New</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Close modal">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-grow p-6 overflow-y-auto space-y-6">
                    {changelog.map((item, index) => (
                        <ChangeItem key={index} item={item} />
                    ))}
                </div>
                
                <div className="flex-shrink-0 p-5 border-t border-gray-200 dark:border-gray-700 text-right no-print">
                    <button
                        onClick={onClose}
                        className="inline-flex items-center justify-center gap-2 bg-cyan-500 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-transform duration-200 hover:bg-cyan-400 hover:scale-105"
                    >
                        Explore Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WhatsNewModal;