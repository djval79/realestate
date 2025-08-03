
import React, { useState, useRef, useEffect } from 'react';
import { ClickData, Lead, Conversion, Property } from '../types';
import { convertToCsv, downloadCsv } from '../utils/csv';
import { ArrowDownTrayIcon } from './icons/ArrowDownTrayIcon';

interface ExportControlProps {
    clicks: ClickData[];
    leads: Lead[];
    conversions: Conversion[];
    properties: Property[];
}

const ExportControl: React.FC<ExportControlProps> = ({ clicks, leads, conversions, properties }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);
    
    const handleExport = (type: 'clicks' | 'leads' | 'conversions') => {
        let dataToExport: any[] = [];
        let filename = '';

        switch(type) {
            case 'clicks':
                dataToExport = clicks.map(click => ({
                    property_name: properties.find(p => p.id === click.propertyId)?.name || 'Unknown',
                    timestamp: new Date(click.timestamp).toISOString(),
                }));
                filename = 'clicks_export.csv';
                break;
            case 'leads':
                 dataToExport = leads.map(lead => ({
                    email: lead.email,
                    captured_at: new Date(lead.timestamp).toISOString(),
                 }));
                 filename = 'leads_export.csv';
                break;
            case 'conversions':
                 dataToExport = conversions.map(conv => ({
                    lead_email: conv.leadEmail,
                    property_name: properties.find(p => p.id === conv.propertyId)?.name || 'Unknown',
                    investment_amount: conv.investmentAmount,
                    converted_at: new Date(conv.timestamp).toISOString(),
                 }));
                 filename = 'conversions_export.csv';
                break;
        }

        if (dataToExport.length > 0) {
            const csv = convertToCsv(dataToExport);
            downloadCsv(csv, filename);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left" ref={wrapperRef}>
            <div>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-cyan-500"
                >
                    <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Export Data
                </button>
            </div>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <button onClick={() => handleExport('clicks')} disabled={clicks.length === 0} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            Export Clicks
                        </button>
                        <button onClick={() => handleExport('leads')} disabled={leads.length === 0} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            Export Leads
                        </button>
                        <button onClick={() => handleExport('conversions')} disabled={conversions.length === 0} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            Export Conversions
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExportControl;
