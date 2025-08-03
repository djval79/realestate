
import { useState, useEffect, useCallback, useRef } from 'react';
import { ProactiveTip, Lead, Conversion, Property, SavedContent, ClickData, ProactiveTipActionType, AITipSuggestion, Language } from '../types';
import { generateProactiveTip } from '../services/geminiService';

const DISMISSED_TIPS_KEY = 'realisteProactiveDismissedTips_v2';
const CHECK_INTERVAL = 20000; // Check for new tips every 20 seconds

const getDismissedTips = (): Set<string> => {
    try {
        const stored = localStorage.getItem(DISMISSED_TIPS_KEY);
        return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (error) {
        console.error("Failed to parse dismissed tips", error);
        return new Set();
    }
};

const setDismissedTipsStore = (dismissed: Set<string>) => {
    try {
        localStorage.setItem(DISMISSED_TIPS_KEY, JSON.stringify(Array.from(dismissed)));
    } catch (error) {
        console.error("Failed to save dismissed tips", error);
    }
};

interface ProactiveAssistantProps {
    referralCode: string;
    leads: Lead[];
    conversions: Conversion[];
    clicks: ClickData[];
    properties: Property[];
    savedContent: SavedContent[];
    analytics: { totalClicks: number, topProperty: Property | null };
    totalEarnings: number;
}

export const useProactiveAssistant = (props: ProactiveAssistantProps, language: Language) => {
    const {
        referralCode,
        leads,
        conversions,
        clicks,
        properties,
        savedContent,
        analytics,
        totalEarnings,
    } = props;
    
    const [currentTip, setCurrentTip] = useState<ProactiveTip | null>(null);
    const [dismissedTips, setDismissedTips] = useState<Set<string>>(getDismissedTips());
    const isFetching = useRef(false);

    const checkForTips = useCallback(async () => {
        if (isFetching.current || currentTip) return; // Don't fetch if already fetching or a tip is shown

        isFetching.current = true;
        try {
            const unconvertedLeads = leads.filter(lead => !conversions.some(c => c.leadEmail === lead.email));
            
            const tipSuggestion = await generateProactiveTip(
                {
                    referralCodeSet: !!referralCode,
                    totalClicks: analytics.totalClicks,
                    totalLeads: leads.length,
                    totalConversions: conversions.length,
                    totalEarnings,
                    unconvertedLeads,
                    topPropertyByClicks: analytics.topProperty,
                    savedContentCount: savedContent.length
                },
                Array.from(dismissedTips),
                language
            );
            
            if (tipSuggestion && tipSuggestion.shouldShow && !dismissedTips.has(tipSuggestion.id)) {
                 let payload: any = tipSuggestion.actionPayloadId;
                 
                 if (tipSuggestion.actionType === 'compose_email') {
                    payload = leads.find(l => l.email === tipSuggestion.actionPayloadId);
                 } else if (tipSuggestion.actionType === 'generate_content') {
                    payload = properties.find(p => p.id === tipSuggestion.actionPayloadId);
                 }
                 
                 if (tipSuggestion.actionType !== 'navigate' && !payload) {
                    // If we can't find the payload for the action, don't show the tip
                 } else {
                     setCurrentTip({
                        id: tipSuggestion.id,
                        message: tipSuggestion.message,
                        action: {
                            type: tipSuggestion.actionType as ProactiveTipActionType,
                            label: tipSuggestion.actionLabel,
                            payload: payload,
                        }
                    });
                 }
            }

        } catch (error) {
            console.error("Error checking for proactive tips:", error);
        } finally {
            isFetching.current = false;
        }
    }, [
        referralCode, 
        leads, 
        conversions, 
        analytics.topProperty, 
        analytics.totalClicks,
        savedContent.length, 
        totalEarnings, 
        dismissedTips, 
        properties, 
        currentTip,
        language
    ]);

    useEffect(() => {
        const keyMetrics = JSON.stringify({
            leads: leads.length,
            conversions: conversions.length,
            clicks: clicks.length,
            code: referralCode
        });
        const timeoutId = setTimeout(() => {
            checkForTips();
        }, 1000); // Debounce check slightly
        return () => clearTimeout(timeoutId);
    }, [leads, conversions, clicks, referralCode, checkForTips]);


    useEffect(() => {
        const interval = setInterval(() => {
            checkForTips();
        }, CHECK_INTERVAL);
        return () => clearInterval(interval);
    }, [checkForTips]);

    const dismissTip = (tipId: string) => {
        const newDismissed = new Set(dismissedTips).add(tipId);
        setDismissedTips(newDismissed);
        setDismissedTipsStore(newDismissed);
        setCurrentTip(null);
    };

    return { currentTip, dismissTip };
};
