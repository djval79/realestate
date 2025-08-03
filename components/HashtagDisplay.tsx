
import React from 'react';
import { useToast } from '../hooks/useToast';
import { HashtagIcon } from './icons/HashtagIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface HashtagDisplayProps {
    hashtags: string[];
    isLoading: boolean;
}

const HashtagSkeleton: React.FC = () => (
    <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        ))}
    </div>
);

const HashtagDisplay: React.FC<HashtagDisplayProps> = ({ hashtags, isLoading }) => {
    const { addToast } = useToast();

    const handleCopyAll = () => {
        if (hashtags.length === 0) return;
        const allTags = hashtags.join(' ');
        navigator.clipboard.writeText(allTags);
        addToast('All hashtags copied!', 'success');
    };

    const handleCopyTag = (tag: string) => {
        navigator.clipboard.writeText(tag);
        addToast(`Copied: ${tag}`, 'success');
    };

    if (isLoading) {
        return (
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <HashtagIcon className="w-5 h-5 mr-2 text-cyan-500 dark:text-cyan-400" />
                    Generating Hashtags...
                </h3>
                <HashtagSkeleton />
            </div>
        );
    }
    
    if (hashtags.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
             <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <HashtagIcon className="w-5 h-5 mr-2 text-cyan-500 dark:text-cyan-400" />
                    Suggested Hashtags
                </h3>
                <button 
                    onClick={handleCopyAll}
                    className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300 font-semibold hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                    <ClipboardIcon className="w-4 h-4" />
                    Copy All
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleCopyTag(tag)}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium px-3 py-1 rounded-full transition-colors hover:bg-cyan-500 hover:text-white dark:hover:text-gray-900"
                        title={`Copy ${tag}`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HashtagDisplay;