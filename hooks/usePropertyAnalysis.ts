
import { useState } from 'react';
import { Property, PropertyAnalysisReport, Language } from '../types';
import { generatePropertyAnalysis } from '../services/geminiService';
import { useToast } from './useToast';

export const usePropertyAnalysis = (language: Language) => {
    const { addToast } = useToast();
    
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [analysisReport, setAnalysisReport] = useState<PropertyAnalysisReport | null>(null);

    const closeAnalysisModal = () => {
        setIsAnalysisModalOpen(false);
        setSelectedProperty(null);
        setAnalysisReport(null);
    };

    const fetchAndShowAnalysis = async (property: Property) => {
        setSelectedProperty(property);
        setIsAnalysisModalOpen(true);
        setIsGeneratingAnalysis(true);
        setAnalysisReport(null);

        try {
            const report = await generatePropertyAnalysis(property, language);
            setAnalysisReport(report);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            addToast(errorMessage, 'error');
            closeAnalysisModal();
        } finally {
            setIsGeneratingAnalysis(false);
        }
    };
    
    return {
        analysisModalState: {
            isOpen: isAnalysisModalOpen,
            isLoading: isGeneratingAnalysis,
            property: selectedProperty,
            report: analysisReport,
        },
        analysisModalHandlers: {
            fetchAndShowAnalysis,
            closeAnalysisModal
        }
    }
};
