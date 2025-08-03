
import React, { useEffect, useState } from 'react';
import { Lead, AIEmail } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { SendIcon } from './icons/SendIcon';
import { useToast } from '../hooks/useToast';

interface EmailComposerModalProps {
  lead: Lead;
  email: AIEmail | null;
  isLoading: boolean;
  onClose: () => void;
}

const SkeletonLoader: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        <div className="space-y-2">
            <div className="h-5 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="space-y-2">
            <div className="h-5 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
    </div>
);


const EmailComposerModal: React.FC<EmailComposerModalProps> = ({ lead, email, isLoading, onClose }) => {
    
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const { addToast } = useToast();

    useEffect(() => {
        if (email) {
            setSubject(email.subject);
            setBody(email.body);
        }
    }, [email]);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
          if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleCopy = (text: string, type: 'Subject' | 'Body') => {
        navigator.clipboard.writeText(text);
        addToast(`${type} copied to clipboard!`, 'success');
    };

    const handleSend = () => {
        const mailtoLink = `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 no-print" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="ai-email-title">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all duration-300 flex flex-col" style={{maxHeight: '90vh'}} onClick={(e) => e.stopPropagation()}>
                <div className="flex-shrink-0 flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <EnvelopeIcon className="w-6 h-6 text-cyan-500 dark:text-cyan-400 mr-3"/>
                        <h2 id="ai-email-title" className="text-xl font-bold text-gray-900 dark:text-white">AI Email for: <span className="text-cyan-500 dark:text-cyan-400">{lead.email}</span></h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Close modal">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-grow p-6 overflow-y-auto space-y-6">
                    {isLoading ? (
                        <SkeletonLoader />
                    ) : email ? (
                        <>
                            <div>
                                <label htmlFor="email-subject" className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Subject</label>
                                <input
                                    id="email-subject"
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                             <div>
                                <label htmlFor="email-body" className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Body</label>
                                <textarea
                                    id="email-body"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    rows={10}
                                    className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500 dark:text-gray-400">Something went wrong. Please try generating the email again.</p>
                        </div>
                    )}
                </div>
                
                <div className="flex-shrink-0 p-5 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-end gap-3">
                     <button
                        onClick={() => handleCopy(subject, 'Subject')}
                        disabled={isLoading || !email}
                        className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-200/50 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                    >
                        <ClipboardIcon className="w-5 h-5"/>
                        Copy Subject
                    </button>
                     <button
                        onClick={() => handleCopy(body, 'Body')}
                        disabled={isLoading || !email}
                        className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-200/50 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                    >
                        <ClipboardIcon className="w-5 h-5"/>
                        Copy Body
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !email}
                        className="inline-flex items-center justify-center gap-2 bg-cyan-500 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-transform duration-200 hover:bg-cyan-400 hover:scale-105 disabled:bg-cyan-500/50 disabled:cursor-not-allowed"
                    >
                        <SendIcon className="w-5 h-5"/>
                        Send with my Email Client
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailComposerModal;
