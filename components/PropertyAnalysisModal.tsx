
import React, { useEffect } from 'react';
import { Property, PropertyAnalysisReport } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { MarketIcon } from './icons/MarketIcon';
import { RiskIcon } from './icons/RiskIcon';
import { GrowthIcon } from './icons/GrowthIcon';
import { PrintIcon } from './icons/PrintIcon';

interface PropertyAnalysisModalProps {
  property: Property;
  report: PropertyAnalysisReport | null;
  isLoading: boolean;
  onClose: () => void;
}

const SectionSkeleton: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
    </div>
)

const ReportSection: React.FC<{title: string, content: string, icon: React.ElementType}> = ({ title, content, icon: Icon }) => (
    <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center mb-2">
            <Icon className="w-6 h-6 mr-3 text-cyan-500 dark:text-cyan-400"/>
            {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 pl-9">{content}</p>
    </div>
);


const PropertyAnalysisModal: React.FC<PropertyAnalysisModalProps> = ({ property, report, isLoading, onClose }) => {
    
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            onClose();
          }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
      }, [onClose]);

    const handlePrint = () => {
        window.print();
    }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 no-print" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="ai-analysis-title">
        <div id="property-analysis-report-content" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all duration-300 flex flex-col" style={{maxHeight: '90vh'}} onClick={(e) => e.stopPropagation()}>
            <div className="flex-shrink-0 flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 no-print">
                <div className="flex items-center">
                    <SparklesIcon className="w-6 h-6 text-cyan-500 dark:text-cyan-400 mr-3"/>
                    <h2 id="ai-analysis-title" className="text-xl font-bold text-gray-900 dark:text-white">AI Analysis: <span className="text-cyan-500 dark:text-cyan-400">{property.name}</span></h2>
                </div>
                <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Close modal">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
            
            <div className="flex-grow p-8 overflow-y-auto space-y-8">
                {isLoading ? (
                    <>
                        <SectionSkeleton />
                        <SectionSkeleton />
                        <SectionSkeleton />
                        <SectionSkeleton />
                    </>
                ) : report ? (
                    <>
                        <ReportSection title="Investment Summary" content={report.summary} icon={SparklesIcon} />
                        <ReportSection title="Market Snapshot" content={report.marketSnapshot} icon={MarketIcon} />
                        <ReportSection title="Risk Breakdown" content={report.riskBreakdown} icon={RiskIcon} />
                        <ReportSection title="Growth Potential" content={report.growthPotential} icon={GrowthIcon} />
                    </>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">Something went wrong. Please try generating the report again.</p>
                    </div>
                )}
            </div>
            
            <div className="flex-shrink-0 p-5 border-t border-gray-200 dark:border-gray-700 text-right no-print">
                <button
                    onClick={handlePrint}
                    disabled={isLoading || !report}
                    className="inline-flex items-center justify-center gap-2 bg-cyan-500 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-transform duration-200 hover:bg-cyan-400 hover:scale-105 disabled:bg-cyan-500/50 disabled:cursor-not-allowed"
                >
                    <PrintIcon className="w-5 h-5"/>
                    Print / Save as PDF
                </button>
            </div>
        </div>
    </div>
  );
};

export default PropertyAnalysisModal;