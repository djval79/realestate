
import { useState } from 'react';
import { Property, AIInsightsReport, Language } from '../types';
import { generateDashboardInsights } from '../services/geminiService';
import { useToast } from './useToast';

interface DashboardAnalyticsData {
    totalClicks: number;
    totalLeads: number;
    totalConversions: number;
    totalEarnings: number;
    topPropertyByClicks: Property | null;
    topPropertyByEarnings: Property | null;
}

export const useAIInsights = (language: Language) => {
    const { addToast } = useToast();
    
    const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
    const [insightsReport, setInsightsReport] = useState<AIInsightsReport | null>(null);

    const closeInsightsModal = () => {
        setIsInsightsModalOpen(false);
        setInsightsReport(null);
    };

    const fetchAndShowInsights = async (analyticsData: DashboardAnalyticsData) => {
        setIsInsightsModalOpen(true);
        setIsGeneratingInsights(true);
        setInsightsReport(null);

        try {
            const report = await generateDashboardInsights(analyticsData, language);
            setInsightsReport(report);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            addToast(errorMessage, 'error');
            closeInsightsModal();
        } finally {
            setIsGeneratingInsights(false);
        }
    };
    
    return {
        insightsState: {
            isOpen: isInsightsModalOpen,
            isLoading: isGeneratingInsights,
            report: insightsReport,
        },
        insightsHandlers: {
            fetchAndShowInsights,
            closeInsightsModal
        }
    }
};
