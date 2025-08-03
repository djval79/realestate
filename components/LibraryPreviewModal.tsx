
import React, { useEffect } from 'react';
import { SavedContent } from '../types';
import { useWebShare } from '../hooks/useWebShare';
import { useToast } from '../hooks/useToast';
import { CloseIcon } from './icons/CloseIcon';
import { LibraryIcon } from './icons/LibraryIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ShareIcon } from './icons/ShareIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { TrashIcon } from './icons/TrashIcon';


interface LibraryPreviewModalProps {
  item: SavedContent;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const LibraryPreviewModal: React.FC<LibraryPreviewModalProps> = ({ item, onClose, onDelete }) => {
  const { addToast } = useToast();
  const { share: sharePost, isSupported: isWebShareSupported } = useWebShare(item.text, item.imageUrl, `${item.property.name.replace(/\s/g, '_')}_AI.jpg`);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.text);
    addToast('Post text copied to clipboard!', 'success');
  };

  const handleTwitterShare = () => {
    const tweetText = encodeURIComponent(item.text);
    window.open(`https://x.com/intent/post?text=${tweetText}`, '_blank');
  };

  const handleDelete = () => {
    if(window.confirm("Are you sure you want to delete this item from your library?")){
      onDelete(item.id);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="library-preview-title">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto transform transition-all duration-300 flex flex-col" style={{maxHeight: '90vh'}} onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
             <LibraryIcon className="w-6 h-6 text-cyan-500 dark:text-cyan-400 mr-3"/>
             <h2 id="library-preview-title" className="text-xl font-bold text-gray-900 dark:text-white">Library: <span className="text-cyan-500 dark:text-cyan-400">{item.property.name}</span></h2>
          </div>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors" aria-label="Close modal">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-grow p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start overflow-y-auto">
            {/* Left Column: Image & Share Controls */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Image</h3>
                <div className="relative w-full aspect-video rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                    <img 
                        src={item.imageUrl} 
                        alt={`AI generated image for ${item.property.name}`} 
                        className="w-full h-full object-cover" 
                    />
                </div>
                 <div className="space-y-3 pt-2">
                    {isWebShareSupported && (
                      <button onClick={sharePost} className="w-full flex items-center justify-center bg-cyan-500 text-gray-900 font-bold py-2.5 px-4 rounded-lg transition-transform duration-200 hover:bg-cyan-400 hover:scale-105">
                        <ShareIcon className="w-5 h-5 mr-2"/>
                        Share Post & Image
                      </button>
                    )}
                    <div className="grid grid-cols-3 gap-3">
                         <button onClick={handleTwitterShare} className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600">
                            <TwitterIcon className="w-5 h-5"/>
                            <span>X</span>
                         </button>
                         <button onClick={handleCopy} className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600">
                            <ClipboardIcon className="w-5 h-5"/>
                            <span>Copy</span>
                         </button>
                         <a href={item.imageUrl} download={`${item.property.name.replace(/\s/g, '_')}_AI.jpg`} className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600">
                            <DownloadIcon className="w-5 h-5"/>
                            <span>Download</span>
                         </a>
                    </div>
                </div>
            </div>

            {/* Right Column: Text Content & Controls */}
            <div className="flex flex-col h-full space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Text</h3>
                     <button onClick={handleDelete} className="flex items-center gap-2 text-sm text-red-600 dark:text-red-500 font-semibold hover:text-red-800 dark:hover:text-red-400 transition-colors">
                        <TrashIcon className="w-5 h-5"/>
                        Delete from Library
                     </button>
                </div>

                <div className="flex-grow bg-gray-100 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 overflow-y-auto">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{item.text}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPreviewModal;
