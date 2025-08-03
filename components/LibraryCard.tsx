
import React from 'react';
import { SavedContent } from '../types';

interface LibraryCardProps {
    item: SavedContent;
    onClick: () => void;
}

const LibraryCard: React.FC<LibraryCardProps> = ({ item, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/20 hover:border-cyan-400 dark:hover:border-cyan-500 hover:-translate-y-1 flex flex-col w-full text-left"
        >
            <div className="relative w-full aspect-video">
                <img src={item.imageUrl} alt={item.property.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                     <h3 className="text-lg font-bold text-white tracking-tight">{item.property.name}</h3>
                     <p className="text-sm text-gray-300">{item.property.location}</p>
                </div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-grow">
                    {item.text}
                </p>
                 <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Saved on: {new Date(item.savedAt).toLocaleDateString()}
                    </p>
                 </div>
            </div>
        </button>
    );
};

export default LibraryCard;