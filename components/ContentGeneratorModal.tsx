import React, { useState, useEffect, useRef } from 'react';
import { Property, Message } from '../types';
import { useWebShare } from '../hooks/useWebShare';
import { useToast } from '../hooks/useToast';
import { CloseIcon } from './icons/CloseIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { RegenerateIcon } from './icons/RegenerateIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { SendIcon } from './icons/SendIcon';
import { StartOverIcon } from './icons/StartOverIcon';
import { ShareIcon } from './icons/ShareIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import HashtagDisplay from './HashtagDisplay';
import QuickReplies from './QuickReplies';
import { SaveIcon } from './icons/SaveIcon';

interface ContentGeneratorModalProps {
  property: Property;
  messages: Message[];
  isLoading: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onStartOver: () => void;
  imageUrl: string | null;
  isImageLoading: boolean;
  onRegenerateImage: () => void;
  hashtags: string[];
  isGeneratingHashtags: boolean;
  onSaveToLibrary: (property: Property, text: string, imageUrl: string) => void;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
    </div>
);


const ImageLoader: React.FC = () => (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
      <svg className="animate-spin h-10 w-10 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-gray-600 dark:text-gray-300">Generating AI image...</p>
    </div>
  );

const ContentGeneratorModal: React.FC<ContentGeneratorModalProps> = ({ 
    property, 
    messages, 
    isLoading, 
    onClose, 
    onSendMessage,
    onStartOver,
    imageUrl,
    isImageLoading,
    onRegenerateImage,
    hashtags,
    isGeneratingHashtags,
    onSaveToLibrary
}) => {
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const lastAiMessageText = messages.slice().reverse().find(m => m.author === 'ai')?.text || '';
  const { share: sharePost, isSupported: isWebShareSupported } = useWebShare(lastAiMessageText, imageUrl, `${property.name.replace(/\s/g, '_')}_AI.jpg`);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleCopy = () => {
    if(!lastAiMessageText) return;
    
    navigator.clipboard.writeText(lastAiMessageText);
    addToast('Post text copied to clipboard!', 'success');
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isLoading) {
        onSendMessage(newMessage.trim());
        setNewMessage('');
    }
  };

  const handleQuickReply = (message: string) => {
    if (!isLoading) {
      onSendMessage(message);
    }
  }

  const handleTwitterShare = () => {
    if (!lastAiMessageText) return;
    const tweetText = encodeURIComponent(lastAiMessageText);
    window.open(`https://x.com/intent/post?text=${tweetText}`, '_blank');
  };

  const handleSaveToLibrary = () => {
    if (property && lastAiMessageText && imageUrl) {
        onSaveToLibrary(property, lastAiMessageText, imageUrl);
    } else {
        addToast("Cannot save incomplete content.", "error");
    }
  };

  const hasContent = !!lastAiMessageText && !!imageUrl && !isImageLoading && !isLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="ai-content-title">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto transform transition-all duration-300 flex flex-col" style={{maxHeight: '90vh'}} onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
             <SparklesIcon className="w-6 h-6 text-cyan-500 dark:text-cyan-400 mr-3"/>
             <h2 id="ai-content-title" className="text-xl font-bold text-gray-900 dark:text-white">AI Content for: <span className="text-cyan-500 dark:text-cyan-400">{property.name}</span></h2>
          </div>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors" aria-label="Close modal">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-grow p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start overflow-y-auto">
            {/* Left Column: Image & Share Controls */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generated Image</h3>
                <div className="relative w-full aspect-video rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={`AI generated image for ${property.name}`} 
                            className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-50' : 'opacity-100'}`} 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            {isImageLoading ? <ImageLoader/> : <p className="text-gray-500 dark:text-gray-400">Image will appear here.</p>}
                        </div>
                    )}
                    
                    {isImageLoading && imageUrl && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <ImageLoader />
                        </div>
                    )}
                </div>
                 <div className="space-y-3 pt-2">
                    {isWebShareSupported && (
                      <button onClick={sharePost} disabled={!hasContent} className="w-full flex items-center justify-center bg-cyan-500 text-gray-900 font-bold py-2.5 px-4 rounded-lg transition-transform duration-200 hover:bg-cyan-400 hover:scale-105 disabled:bg-cyan-500/50 disabled:cursor-not-allowed disabled:hover:scale-100">
                        <ShareIcon className="w-5 h-5 mr-2"/>
                        Share Post & Image
                      </button>
                    )}
                    <div className="grid grid-cols-4 gap-3">
                        <button onClick={handleSaveToLibrary} disabled={!hasContent} className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-200/50 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed">
                            <SaveIcon className="w-5 h-5"/>
                         </button>
                         <button onClick={handleTwitterShare} disabled={!hasContent} className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-200/50 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed">
                            <TwitterIcon className="w-5 h-5"/>
                         </button>
                         <button onClick={handleCopy} disabled={!hasContent} className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-200/50 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed">
                            <ClipboardIcon className="w-5 h-5"/>
                         </button>
                         <a href={imageUrl || '#'} download={imageUrl ? `${property.name.replace(/\s/g, '_')}_AI.jpg` : undefined} className={`flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 ${!imageUrl ? 'opacity-50 cursor-not-allowed' : ''}`} aria-disabled={!imageUrl} onClick={(e) => !imageUrl && e.preventDefault()}>
                            <DownloadIcon className="w-5 h-5"/>
                         </a>
                    </div>
                    <button onClick={onRegenerateImage} disabled={isImageLoading || isLoading} className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-300 font-semibold hover:text-gray-800 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed pt-2">
                         <RegenerateIcon className="w-5 h-5"/>
                         Regenerate Image
                     </button>
                </div>
            </div>

            {/* Right Column: Text Content & Controls */}
            <div className="flex flex-col h-full space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Content Editor</h3>
                     <button onClick={onStartOver} disabled={isLoading} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300 font-semibold hover:text-gray-800 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <StartOverIcon className="w-5 h-5"/>
                        Start Over
                     </button>
                </div>

                <div className="flex-grow min-h-[250px] bg-gray-100 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md rounded-xl px-4 py-2 text-white whitespace-pre-wrap ${msg.author === 'user' ? 'bg-cyan-600' : 'bg-gray-600 dark:bg-gray-700'}`}>
                               {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && messages.length > 0 && messages[messages.length - 1].author === 'user' && (
                         <div className="flex justify-start">
                           <div className="bg-gray-600 dark:bg-gray-700 rounded-xl px-4 py-3">
                               <TypingIndicator/>
                           </div>
                         </div>
                    )}
                     {messages.length === 0 && isLoading && (
                        <div className="flex-grow flex items-center justify-center">
                           <TypingIndicator />
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                
                 <div className="flex-shrink-0">
                    <div className="space-y-4">
                        <QuickReplies onSelectReply={handleQuickReply} disabled={isLoading} />
                        <form onSubmit={handleFormSubmit} className="flex items-center gap-3">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Give feedback or instructions..."
                                disabled={isLoading}
                                className="flex-grow bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                            />
                            <button type="submit" disabled={isLoading || !newMessage.trim()} className="bg-cyan-500 text-gray-900 p-2.5 rounded-lg transition-colors hover:bg-cyan-400 disabled:bg-cyan-500/50 disabled:cursor-not-allowed">
                                <SendIcon className="w-6 h-6"/>
                            </button>
                        </form>
                    </div>
                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700/50">
                        <HashtagDisplay
                            hashtags={hashtags}
                            isLoading={isGeneratingHashtags}
                        />
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGeneratorModal;