
import React from 'react';
import { Lead, Conversion } from '../types';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { BadgeCheckIcon } from './icons/BadgeCheckIcon';

interface LeadsListProps {
    leads: Lead[];
    conversions: Conversion[];
    onComposeEmail: (lead: Lead) => void;
    onLogInvestment: (lead: Lead) => void;
}

const LeadsList: React.FC<LeadsListProps> = ({ leads, conversions, onComposeEmail, onLogInvestment }) => {
    
    const convertedEmails = new Set(conversions.map(c => c.leadEmail));

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <UserGroupIcon className="w-6 h-6 mr-3 text-cyan-500 dark:text-cyan-400" />
                Captured Leads
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {leads.length > 0 ? (
                    leads.map((lead) => {
                        const isConverted = convertedEmails.has(lead.email);
                        return (
                            <div key={lead.timestamp} className={`flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg ${isConverted ? 'opacity-60' : ''}`}>
                               <div className="min-w-0">
                                    <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{lead.email}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Captured: {new Date(lead.timestamp).toLocaleDateString()}
                                    </p>
                               </div>
                                <div className="ml-4 flex-shrink-0 flex items-center gap-2">
                                {isConverted ? (
                                    <span className="flex items-center gap-2 text-sm font-bold text-green-500 dark:text-green-400 px-3 py-1.5">
                                        <BadgeCheckIcon className="w-5 h-5" />
                                        Converted
                                    </span>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => onLogInvestment(lead)}
                                            className="flex items-center gap-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-green-500 hover:text-white dark:hover:bg-green-500 dark:hover:text-gray-900"
                                            title="Log investment for this lead"
                                        >
                                            <DollarSignIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onComposeEmail(lead)}
                                            className="flex items-center gap-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-gray-900"
                                            title="Compose follow-up email with AI"
                                        >
                                            <EnvelopeIcon className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No leads captured yet.</p>
                )}
            </div>
        </div>
    );
};

export default LeadsList;
