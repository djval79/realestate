
import { useState } from 'react';
import { Lead, Property, AIEmail, Language } from '../types';
import { generateFollowUpEmail } from '../services/geminiService';
import { useToast } from './useToast';

export const useEmailComposer = (referralCode: string, language: Language) => {
    const { addToast } = useToast();

    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [emailContent, setEmailContent] = useState<AIEmail | null>(null);

    const closeComposer = () => {
        setIsComposerOpen(false);
        setSelectedLead(null);
        setEmailContent(null);
    };

    const openComposer = async (lead: Lead, topProperty: Property | null) => {
        if (!topProperty) {
            addToast("No top property to recommend yet. Share some links first!", 'info');
            return;
        }
        if (!referralCode) {
            addToast("Please set your referral code first.", "error");
            return;
        }

        setSelectedLead(lead);
        setIsComposerOpen(true);
        setIsGeneratingEmail(true);
        setEmailContent(null);

        try {
            const email = await generateFollowUpEmail(lead, topProperty, referralCode, language);
            setEmailContent(email);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            addToast(errorMessage, 'error');
            closeComposer();
        } finally {
            setIsGeneratingEmail(false);
        }
    };
    
    return {
        composerState: {
            isOpen: isComposerOpen,
            isLoading: isGeneratingEmail,
            lead: selectedLead,
            email: emailContent,
        },
        composerHandlers: {
            openComposer,
            closeComposer
        }
    }
};
