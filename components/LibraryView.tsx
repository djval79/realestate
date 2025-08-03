
import React from 'react';
import { SavedContent } from '../types';
import LibraryCard from './LibraryCard';
import { LibraryIcon } from './icons/LibraryIcon';

interface LibraryViewProps {
    savedContent: SavedContent[];
    onCardClick: (item: SavedContent) => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ savedContent, onCardClick }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Content Library</h2>
            {savedContent.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {savedContent.map(item => (
                        <LibraryCard key={item.id} item={item} onClick={() => onCardClick(item)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-100 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <LibraryIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Your Library is Empty</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">Generate content for a property and click "Save to Library" to start building your collection.</p>
                </div>
            )}
        </div>
    );
};

export default LibraryView;
