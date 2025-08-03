
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { CashIcon } from './icons/CashIcon';
import { CursorArrowRaysIcon } from './icons/CursorArrowRaysIcon';

interface PropertyStatsTooltipProps {
    clicks: number;
    earnings: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
};

const PropertyStatsTooltip: React.FC<PropertyStatsTooltipProps> = ({ clicks, earnings }) => {
    const { t } = useTranslation();
    return (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-gray-900 dark:bg-black border border-gray-700 dark:border-gray-800 text-white rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
            <h4 className="text-sm font-bold border-b border-gray-700 pb-1 mb-2">{t('propertyCard.statsTooltip.title')}</h4>
            <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-gray-400"><CursorArrowRaysIcon className="w-4 h-4" /> {t('propertyCard.statsTooltip.clicks')}</span>
                    <span className="font-semibold">{clicks}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-gray-400"><CashIcon className="w-4 h-4" /> {t('propertyCard.statsTooltip.earnings')}</span>
                    <span className="font-semibold">{formatCurrency(earnings)}</span>
                </div>
            </div>
             <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-black transform rotate-45"></div>
        </div>
    );
};

export default PropertyStatsTooltip;
