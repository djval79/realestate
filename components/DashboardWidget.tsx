
import React from 'react';
import { DashboardWidgetId } from '../types';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';

interface DashboardWidgetProps {
    id: DashboardWidgetId;
    title: string;
    children: React.ReactNode;
    isEditing: boolean;
    isVisible: boolean;
    onMove: (id: DashboardWidgetId, direction: 'up' | 'down') => void;
    onToggleVisibility: (id: DashboardWidgetId) => void;
    isFirst: boolean;
    isLast: boolean;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
    id,
    title,
    children,
    isEditing,
    isVisible,
    onMove,
    onToggleVisibility,
    isFirst,
    isLast,
}) => {
    const editModeStyles = 'ring-2 ring-cyan-500 ring-dashed';
    const hiddenStyles = 'opacity-40';

    return (
        <div className={`relative transition-all duration-300 ${isEditing ? editModeStyles : ''} ${!isVisible ? hiddenStyles : ''} rounded-2xl`}>
            {isEditing && (
                <div className="absolute -top-4 right-4 z-10 bg-gray-800 border border-gray-600 rounded-full flex items-center p-1 space-x-1 shadow-lg">
                    <button
                        onClick={() => onMove(id, 'up')}
                        disabled={isFirst}
                        title="Move up"
                        className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronUpIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onMove(id, 'down')}
                        disabled={isLast}
                        title="Move down"
                        className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronDownIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onToggleVisibility(id)}
                        title={isVisible ? 'Hide' : 'Show'}
                        className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                    >
                        {isVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                </div>
            )}
            {children}
        </div>
    );
};

export default DashboardWidget;