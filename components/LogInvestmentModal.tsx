
import React, { useEffect, useState } from 'react';
import { Lead, Property, Conversion } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { BadgeCheckIcon } from './icons/BadgeCheckIcon';
import { useToast } from '../hooks/useToast';

interface LogInvestmentModalProps {
  lead: Lead;
  properties: Property[];
  onClose: () => void;
  onLogConversion: (conversion: Omit<Conversion, 'timestamp' | 'leadEmail'>) => void;
}

const LogInvestmentModal: React.FC<LogInvestmentModalProps> = ({ lead, properties, onClose, onLogConversion }) => {
    
    const [propertyId, setPropertyId] = useState<string>(properties[0]?.id || '');
    const [amount, setAmount] = useState<string>('');
    const { addToast } = useToast();

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
          if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const investmentAmount = parseFloat(amount);
        if (!propertyId || isNaN(investmentAmount) || investmentAmount <= 0) {
            addToast('Please select a property and enter a valid investment amount.', 'error');
            return;
        }
        onLogConversion({ propertyId, investmentAmount });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 no-print" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="log-investment-title">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex-shrink-0 flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <BadgeCheckIcon className="w-6 h-6 text-cyan-500 dark:text-cyan-400 mr-3"/>
                        <h2 id="log-investment-title" className="text-xl font-bold text-gray-900 dark:text-white">Log Investment for <span className="text-cyan-500 dark:text-cyan-400">{lead.email}</span></h2>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Close modal">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-grow p-6 space-y-6">
                    <div>
                        <label htmlFor="property-select" className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Invested Property</label>
                        <select
                            id="property-select"
                            value={propertyId}
                            onChange={(e) => setPropertyId(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            {properties.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="investment-amount" className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Investment Amount ($)</label>
                        <input
                            id="investment-amount"
                            type="number"
                            min="0"
                            step="1000"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g., 50000"
                            required
                            className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                </div>
                
                <div className="flex-shrink-0 p-5 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2.5 px-5 rounded-lg transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 bg-cyan-500 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-transform duration-200 hover:bg-cyan-400 hover:scale-105"
                    >
                        Save Conversion
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LogInvestmentModal;
